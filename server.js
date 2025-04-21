const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // For unique names

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
};

// Helper function for colored console output
const log = {
    info: (message) => console.log(`${colors.cyan}[INFO]${colors.reset} ${message}`),
    success: (message) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`),
    warning: (message) => console.warn(`${colors.yellow}[WARNING]${colors.reset} ${message}`),
    error: (message) => console.error(`${colors.red}[ERROR]${colors.reset} ${message}`),
    api: (message) => console.log(`${colors.magenta}[API]${colors.reset} ${message}`),
    ytdlp: (message) => console.log(`${colors.blue}[yt-dlp]${colors.reset} ${message}`),
    debug: (message) => console.log(`${colors.dim}[DEBUG]${colors.reset} ${message}`)
};

const app = express();
const port = 3000; // Port on which the server will run

// --- Configuration ---
const ytDlpPath = path.resolve(__dirname, 'yt-dlp.exe'); // Path to yt-dlp.exe
const tempDownloadsDir = path.resolve(__dirname, 'temp_downloads');
const cookiesFilePath = path.resolve(__dirname, 'cookies.txt');
// --- End Configuration ---

// Check for cookies file (optional but useful)
if (!fs.existsSync(cookiesFilePath)) {
    log.warning(`Cookies file not found at path: ${cookiesFilePath}`);
    log.warning('Some videos may not download without cookies. See https://github.com/yt-dlp/yt-dlp/wiki/Authentication');
    // Don't exit, just warn
} else {
    log.info(`Using cookies file: ${cookiesFilePath}`);
}

// Check for yt-dlp.exe
if (!fs.existsSync(ytDlpPath)) {
    log.error(`yt-dlp.exe not found at path: ${ytDlpPath}`);
    log.error('Please download yt-dlp.exe and place it in the same folder as server.js or ensure the path is correct.');
    process.exit(1); // Exit if yt-dlp is not found
}

// Create temp downloads directory if it doesn't exist
if (!fs.existsSync(tempDownloadsDir)) {
    fs.mkdirSync(tempDownloadsDir);
    log.info(`Created temporary downloads directory: ${tempDownloadsDir}`);
}

// Middleware for handling JSON request bodies
app.use(express.json());
// Middleware for handling URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory (where index.html will be)
app.use(express.static(path.join(__dirname, 'public')));

// --- API Endpoints ---

// Endpoint for getting video information
app.post('/api/fetch-info', (req, res) => {
    const url = req.body.url;
    log.api(`Requesting information for URL: ${url}`);

    if (!url || (!url.includes('youtube.com/') && !url.includes('youtu.be/'))) {
        log.error(`Invalid URL: ${url}`);
        return res.status(400).json({ success: false, error: 'Invalid or missing YouTube URL' });
    }

    const args = ['--dump-json', '--no-playlist']; // Base arguments

    if (fs.existsSync(cookiesFilePath)) {
        args.push('--cookies', cookiesFilePath);
        log.ytdlp('Cookies added for fetch-info');
    }

    args.push(url);

    log.ytdlp(`Starting Fetch Info: ${ytDlpPath} ${args.join(' ')}`);
    const ytDlpProcess = spawn(ytDlpPath, args);

    let jsonData = '';
    let errorData = '';

    ytDlpProcess.stdout.on('data', (data) => {
        jsonData += data.toString();
    });

    ytDlpProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        log.error(`[yt-dlp stderr / fetch]: ${data.toString().trim()}`);
    });

    ytDlpProcess.on('close', (code) => {
        if (code === 0 && jsonData) {
            try {
                const info = JSON.parse(jsonData);
                log.success(`Information successfully retrieved for: ${info.title}`);
                res.json({ success: true, data: info });
            } catch (parseError) {
                log.error(`JSON parsing error from yt-dlp: ${parseError}`);
                log.error(`Retrieved data: ${jsonData}`);
                res.status(500).json({ success: false, error: 'Failed to process video information', details: errorData || parseError.message });
            }
        } else {
            log.error(`yt-dlp (fetch) exited with code ${code}. Stderr: ${errorData}`);
            res.status(500).json({ success: false, error: `Failed to retrieve video information (code ${code})`, details: errorData });
        }
    });

    ytDlpProcess.on('error', (err) => {
        log.error(`Error starting yt-dlp (fetch): ${err}`);
        res.status(500).json({ success: false, error: 'Failed to start yt-dlp process', details: err.message });
    });
});

// Endpoint for downloading video/audio
app.get('/api/download', (req, res) => {
    const { url, quality, format, playlist, subtitles } = req.query;
    log.api(`Requesting download: URL=${url}, Quality=${quality}, Format=${format}, Playlist=${playlist}, Subtitles=${subtitles}`);

    if (!url || (!url.includes('youtube.com/') && !url.includes('youtu.be/'))) {
        log.error(`Invalid URL for download: ${url}`);
        return res.status(400).send('Invalid or missing YouTube URL');
    }

    const downloadId = uuidv4();
    const tempOutputPath = path.join(tempDownloadsDir, `download_${downloadId}.%(ext)s`);
    let finalFilePath = null;

    const args = []; // Start with an empty array

    if (fs.existsSync(cookiesFilePath)) {
        args.push('--cookies', cookiesFilePath);
        log.ytdlp('Cookies added for download');
    }

    args.push('-o', tempOutputPath);

    if (format === 'mp3') {
        args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
        log.ytdlp('Format: MP3 (Best Audio)');
    } else {
        // Video format with audio
        let formatString = 'bestvideo';
        if (quality && quality.includes('720p')) formatString += '[height<=720]';
        else if (quality && quality.includes('1080p')) formatString += '[height<=1080]';
        else if (quality && quality.includes('1440p')) formatString += '[height<=1440]';
        else if (quality && quality.includes('2160p')) formatString += '[height<=2160]';
        formatString += `[ext=${format}]`;
        formatString += '+bestaudio/best'; // Add best audio stream
        args.push('-f', formatString);
        args.push('--merge-output-format', format);
        args.push('--audio-quality', '0'); // Best audio quality
        args.push('--embed-subs'); // Embed subtitles if available
        args.push('--embed-thumbnail'); // Embed thumbnail
        args.push('--audio-format', 'aac'); // Convert audio to AAC format
        args.push('--postprocessor-args', '-c:a aac -b:a 192k'); // Set AAC bitrate
        log.ytdlp(`Format: ${format.toUpperCase()}, Quality: ${quality}, String: ${formatString}`);
    }

    if (playlist === 'true') {
        args.push('--yes-playlist');
        log.ytdlp('Downloading playlist: Yes');
    } else {
        args.push('--no-playlist');
        log.ytdlp('Downloading playlist: No');
    }

    if (subtitles === 'true') {
        args.push('--write-subs', '--sub-lang', 'en,ru');
        log.ytdlp('Subtitles: Yes (en, ru)');
    }

    // Add URL as the last argument
    args.push(url);

    log.ytdlp(`Starting Download: ${ytDlpPath} ${args.join(' ')}`);
    const ytDlpProcess = spawn(ytDlpPath, args);

    let stdoutData = '';
    ytDlpProcess.stdout.on('data', (data) => {
        const output = data.toString();
        stdoutData += output;
        log.debug(`[yt-dlp stdout]: ${output.trim()}`);
        const mergeMatch = output.match(/Merging formats into "(.+?)"/);
        const destMatch = output.match(/\[download\] Destination: (.+)/);
        const alreadyMatch = output.match(/\[download\] (.+) has already been downloaded/);

        if (mergeMatch && mergeMatch[1]) {
            finalFilePath = path.resolve(tempDownloadsDir, path.basename(mergeMatch[1]));
        } else if (destMatch && destMatch[1]) {
            finalFilePath = path.resolve(tempDownloadsDir, path.basename(destMatch[1]));
        } else if (alreadyMatch && alreadyMatch[1]) {
            finalFilePath = path.resolve(tempDownloadsDir, path.basename(alreadyMatch[1]));
        }
    });

    ytDlpProcess.stderr.on('data', (data) => {
        log.error(`[yt-dlp stderr]: ${data.toString().trim()}`);
    });

    ytDlpProcess.on('close', (code) => {
        if (code === 0) {
            log.success('Download completed successfully.');

            if (!finalFilePath || !fs.existsSync(finalFilePath)) {
                log.warning('Unable to determine exact filename from yt-dlp output. Searching for file...');
                try {
                    const files = fs.readdirSync(tempDownloadsDir);
                    const downloadedFile = files.find(f => f.startsWith(`download_${downloadId}.`));
                    if (downloadedFile) {
                        finalFilePath = path.join(tempDownloadsDir, downloadedFile);
                        log.info(`Found file: ${finalFilePath}`);
                    } else {
                        log.error('Unable to find downloaded file in temp_downloads folder!');
                        return res.status(500).send('Server error: Unable to find downloaded file.');
                    }
                } catch (findError) {
                    log.error(`Error finding file: ${findError}`);
                    return res.status(500).send('Server error: Error finding downloaded file.');
                }
            }

            if (finalFilePath && fs.existsSync(finalFilePath)) {
                log.info(`Sending file to client: ${finalFilePath}`);
                res.download(finalFilePath, path.basename(finalFilePath), (err) => {
                    if (err) {
                        log.error(`Error sending file to client: ${err}`);
                        if (!res.headersSent) {
                            res.status(500).send('Error sending file');
                        }
                    } else {
                        log.success(`File ${path.basename(finalFilePath)} successfully sent.`);
                    }
                    log.info(`Deleting temporary file: ${finalFilePath}`);
                    fs.unlink(finalFilePath, (unlinkErr) => {
                        if (unlinkErr) {
                            log.error(`Error deleting temporary file ${finalFilePath}: ${unlinkErr}`);
                        } else {
                            log.success(`Temporary file ${path.basename(finalFilePath)} deleted.`);
                        }
                    });
                });
            } else {
                log.error(`Downloaded file not found at path: ${finalFilePath}`);
                res.status(500).send('Server error: Downloaded file not found after process completion.');
            }
        } else {
            log.error(`yt-dlp (download) exited with code ${code}.`);
            try {
                const files = fs.readdirSync(tempDownloadsDir);
                files.forEach(f => {
                    if (f.startsWith(`download_${downloadId}.`)) {
                        const partFilePath = path.join(tempDownloadsDir, f);
                        log.warning(`Deleting partial file due to error: ${partFilePath}`);
                        fs.unlinkSync(partFilePath);
                    }
                });
            } catch(cleanupError) {
                log.error(`Error cleaning up temporary files after failed download: ${cleanupError}`);
            }
            res.status(500).send(`Download error (code ${code}). Check server logs.`);
        }
    });

    ytDlpProcess.on('error', (err) => {
        log.error(`Error starting yt-dlp (download): ${err}`);
        res.status(500).send('Server error: Failed to start download process.');
    });
});

// --- Start server ---
app.listen(port, () => {
    console.log(`${colors.green}${colors.bright}CyberTube Web Server started on http://localhost:${port}${colors.reset}`);
    console.log(`${colors.cyan}Serving static files from directory: ${path.join(__dirname, 'public')}${colors.reset}`);
    console.log(`${colors.cyan}Temporary files will be saved in: ${tempDownloadsDir}${colors.reset}`);
    console.log(`${colors.cyan}Using yt-dlp: ${ytDlpPath}${colors.reset}`);
});