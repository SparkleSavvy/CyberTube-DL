// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process'); // Use spawn for better stream handling
const fs = require('fs');

// --- Configuration ---
// Adjust this path if you place yt-dlp.exe elsewhere
const ytDlpPath = path.join(app.getAppPath(), 'yt-dlp.exe'); // Assumes yt-dlp.exe is in the root
const downloadsPath = path.join(app.getPath('downloads'), 'CyberTubeDL'); // Default download location
// --- End Configuration ---

let mainWindow;

function createWindow() {
    // Ensure download directory exists
    if (!fs.existsSync(downloadsPath)) {
        fs.mkdirSync(downloadsPath, { recursive: true });
    }

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // Recommended for security
            nodeIntegration: false, // Recommended for security
        },
    });

    mainWindow.loadFile('index.html');

    // Optional: Open DevTools
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    // Check if yt-dlp.exe exists
    if (!fs.existsSync(ytDlpPath)) {
        dialog.showErrorBox(
            'Error: yt-dlp not found',
            `yt-dlp.exe was not found at the expected location: ${ytDlpPath}\nPlease download it from the official yt-dlp repository and place it in the application's root directory.`
        );
        app.quit();
        return;
    }
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// --- IPC Handlers (Communication between Frontend and Backend) ---

// Handle Fetch Video Info Request
ipcMain.handle('fetch-info', async (event, url) => {
    console.log(`Fetching info for: ${url}`);
    return new Promise((resolve, reject) => {
        const args = ['--dump-json', '--no-playlist', url]; // Get info for single video first
        const ytDlpProcess = spawn(ytDlpPath, args);

        let jsonData = '';
        let errorData = '';

        ytDlpProcess.stdout.on('data', (data) => {
            jsonData += data.toString();
        });

        ytDlpProcess.stderr.on('data', (data) => {
            errorData += data.toString();
            // Send stderr output to terminal in frontend
            mainWindow.webContents.send('terminal-output', `stderr: ${data.toString().trim()}`);
        });

        ytDlpProcess.on('close', (code) => {
            if (code === 0 && jsonData) {
                try {
                    const info = JSON.parse(jsonData);
                    console.log('Info fetched successfully');
                    resolve({ success: true, data: info });
                } catch (parseError) {
                    console.error('Error parsing yt-dlp JSON output:', parseError);
                    console.error('Received data:', jsonData); // Log what was received
                    mainWindow.webContents.send('terminal-output', `Error parsing JSON: ${parseError.message}`);
                    reject({ success: false, error: 'Failed to parse video information.', details: errorData || parseError.message });
                }
            } else {
                console.error(`yt-dlp process exited with code ${code}`);
                console.error('stderr:', errorData);
                mainWindow.webContents.send('terminal-output', `yt-dlp error (code ${code}): ${errorData.trim()}`);
                reject({ success: false, error: `Failed to fetch video info (code ${code}).`, details: errorData });
            }
        });

        ytDlpProcess.on('error', (err) => {
            console.error('Failed to start yt-dlp process:', err);
            mainWindow.webContents.send('terminal-output', `Failed to start yt-dlp: ${err.message}`);
            reject({ success: false, error: 'Failed to start yt-dlp process.', details: err.message });
        });
    });
});

// Handle Download Request
ipcMain.on('download-video', (event, options) => {
    console.log('Download requested with options:', options);
    mainWindow.webContents.send('terminal-output', 'Preparing download...');

    const args = [];

    // --- Build yt-dlp Arguments ---
    const outputPath = path.join(downloadsPath, '%(title)s [%(id)s].%(ext)s');
    args.push('-o', outputPath);

    // Format Selection (Needs more sophisticated mapping)
    // This is a simplified example. Real mapping is complex.
    // See yt-dlp documentation for `-f` format codes.
    if (options.format === 'mp3') {
        args.push('-x'); // Extract audio
        args.push('--audio-format', 'mp3');
        args.push('--audio-quality', '0'); // 0 = best VBR
        mainWindow.webContents.send('terminal-output', 'Format: MP3 (Best Quality Audio)');
    } else {
        // Example video format selection (adjust as needed)
        let formatString = 'bestvideo';
        if (options.quality.includes('720p')) formatString += '[height<=720]';
        else if (options.quality.includes('1080p')) formatString += '[height<=1080]';
        else if (options.quality.includes('1440p')) formatString += '[height<=1440]';
        else if (options.quality.includes('2160p')) formatString += '[height<=2160]';
        // Add best audio, or specific audio if needed
        formatString += '+bestaudio/best'; // Fallback to best overall if combined fails
        args.push('-f', formatString);
        args.push('--merge-output-format', options.format); // mp4, mkv etc.
        mainWindow.webContents.send('terminal-output', `Format: ${options.format.toUpperCase()} (Quality: ${options.quality}, yt-dlp format: ${formatString})`);
    }

    // Playlist
    if (options.isPlaylist) {
        args.push('--yes-playlist');
        mainWindow.webContents.send('terminal-output', 'Playlist download enabled.');
    } else {
        args.push('--no-playlist');
    }

    // Subtitles
    if (options.includeSubtitles) {
        args.push('--write-subs');
        args.push('--sub-lang', 'en,ru'); // Example: English and Russian subs
        // args.push('--embed-subs'); // Optionally embed subs into video file
        mainWindow.webContents.send('terminal-output', 'Subtitles requested (en, ru).');
    }

    // Add the URL last
    args.push(options.url);

    mainWindow.webContents.send('terminal-output', `Executing: yt-dlp ${args.join(' ')}`);
    console.log(`Executing: ${ytDlpPath} ${args.join(' ')}`);

    const ytDlpProcess = spawn(ytDlpPath, args);

    // --- Process Output Handling ---
    const progressRegex = /\[download\]\s+(\d+(\.\d+)?%)/; // Regex to find progress percentage

    ytDlpProcess.stdout.on('data', (data) => {
        const output = data.toString();
        // Send raw output to terminal
        mainWindow.webContents.send('terminal-output', output.trim());

        // Extract progress
        const match = output.match(progressRegex);
        if (match && match[1]) {
            mainWindow.webContents.send('download-progress', parseFloat(match[1]));
        }
    });

    ytDlpProcess.stderr.on('data', (data) => {
        // Often ffmpeg/post-processing messages appear on stderr
        const output = data.toString();
        mainWindow.webContents.send('terminal-output', `stderr: ${output.trim()}`);
    });

    ytDlpProcess.on('close', (code) => {
        if (code === 0) {
            console.log('Download finished successfully.');
            mainWindow.webContents.send('terminal-output', '--- Download Complete ---');
            mainWindow.webContents.send('download-complete', { success: true, downloadPath: downloadsPath });
        } else {
            console.error(`yt-dlp download process exited with code ${code}`);
            mainWindow.webContents.send('terminal-output', `--- Download Error (code ${code}) ---`);
            mainWindow.webContents.send('download-complete', { success: false, error: `Download failed with code ${code}` });
        }
    });

    ytDlpProcess.on('error', (err) => {
        console.error('Failed to start yt-dlp download process:', err);
        mainWindow.webContents.send('terminal-output', `--- Failed to start download process: ${err.message} ---`);
        mainWindow.webContents.send('download-complete', { success: false, error: 'Failed to start download process' });
    });
});