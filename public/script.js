// Starfield Animation
document.addEventListener('DOMContentLoaded', function() {
    const starfield = document.getElementById('starfield');
    const starsCount = 200;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random size between 1-3px
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration (3-10s)
        const duration = Math.random() * 7 + 3;
        star.style.setProperty('--duration', `${duration}s`);
        
        // Random delay for animation
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        // Some stars will be colored (blue/purple)
        if (Math.random() > 0.8) {
            const colors = ['#58a6ff', '#8a2be2', '#00ffff', '#ff00ff'];
            star.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }
        
        starfield.appendChild(star);
    }
    
    // Add some shooting stars occasionally
    setInterval(() => {
        if (Math.random() > 0.9) {
            createShootingStar();
        }
    }, 3000);
    
    function createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('star');
        shootingStar.style.width = '2px';
        shootingStar.style.height = '2px';
        shootingStar.style.backgroundColor = '#fff';
        
        // Start position (random edge)
        const edge = Math.floor(Math.random() * 4);
        let startX, startY, endX, endY;
        
        switch(edge) {
            case 0: // top
                startX = Math.random() * 100;
                startY = 0;
                endX = startX - 30;
                endY = startY + 30;
                break;
            case 1: // right
                startX = 100;
                startY = Math.random() * 100;
                endX = startX - 30;
                endY = startY + 30;
                break;
            case 2: // bottom
                startX = Math.random() * 100;
                startY = 100;
                endX = startX + 30;
                endY = startY - 30;
                break;
            case 3: // left
                startX = 0;
                startY = Math.random() * 100;
                endX = startX + 30;
                endY = startY + 30;
                break;
        }
        
        shootingStar.style.left = `${startX}%`;
        shootingStar.style.top = `${startY}%`;
        
        // Trail effect
        shootingStar.style.boxShadow = '0 0 5px 1px rgba(255,255,255,0.8)';
        
        starfield.appendChild(shootingStar);
        
        // Animation
        const animation = shootingStar.animate([
            { 
                transform: 'translate(0, 0)',
                opacity: 0
            },
            { 
                transform: `translate(${endX - startX}%, ${endY - startY}%)`,
                opacity: 1
            },
            { 
                transform: `translate(${(endX - startX) * 1.5}%, ${(endY - startY) * 1.5}%)`,
                opacity: 0
            }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => {
            shootingStar.remove();
        };
    }
});

// Frontend script
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const urlInput = document.getElementById('url');
    const fetchBtn = document.getElementById('fetchBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearTerminal = document.getElementById('clearTerminal');
    const terminal = document.getElementById('terminal');
    const previewContainer = document.getElementById('previewContainer');
    const noPreview = document.getElementById('noPreview');
    const thumbnailPreview = document.getElementById('thumbnailPreview');
    const videoInfo = document.getElementById('videoInfo');
    const videoTitle = document.getElementById('videoTitle');
    const videoChannel = document.getElementById('videoChannel');
    const maxVideoQuality = document.getElementById('maxVideoQuality');
    const videoViews = document.getElementById('videoViews');
    const videoDuration = document.getElementById('videoDuration');
    const videoDate = document.getElementById('videoDate');
    const status = document.getElementById('status');
    const progress = document.getElementById('progress');
    const progressValue = document.getElementById('progressValue');
    const qualitySelect = document.getElementById('quality');
    const formatSelect = document.getElementById('format');
    const playlistCheckbox = document.getElementById('playlist');
    const subtitlesCheckbox = document.getElementById('subtitles');
    const connectionStatusText = document.getElementById('connectionStatusText');
    const apiStatusText = document.getElementById('apiStatusText');
    
    let currentVideoInfo = null;
    let isApiActive = false;
    
    // Status update functions
    function updateStatusIndicator(element, text, colorClass) {
        element.textContent = text;
        element.className = `font-semibold ${colorClass}`;
    }
    
    function updateApiStatus(isActive, message = '') {
        if (isActive) {
            updateStatusIndicator(apiStatusText, 'Active', 'text-green-400');
            isApiActive = true;
        } else {
            updateStatusIndicator(apiStatusText, message || 'Error', 'text-red-400');
            isApiActive = false;
        }
    }
    
    function updateConnectionStatus(isConnected, message = '') {
        if (isConnected === null) {
            updateStatusIndicator(connectionStatusText, 'Connecting...', 'text-yellow-400');
            updateStatusIndicator(apiStatusText, 'Connecting...', 'text-yellow-400');
        } else if (isConnected) {
            updateStatusIndicator(connectionStatusText, 'Secure', 'text-green-400');
            if (!isApiActive && apiStatusText.textContent !== 'Active') {
                updateApiStatus(false, 'Error');
            }
        } else {
            updateStatusIndicator(connectionStatusText, message || 'Offline', 'text-red-400');
            updateApiStatus(false, 'Offline');
            isApiActive = false;
        }
    }
    
    // Terminal functions
    function addTerminalLine(text, isError = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line whitespace-pre-wrap';
        line.textContent = '> ' + text;
        if (isError) {
            line.classList.add('text-red-400');
        } else {
            line.classList.add('text-green-400');
        }
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
    }
    
    // Clear terminal
    clearTerminal.addEventListener('click', function() {
        terminal.innerHTML = '';
        addTerminalLine('Terminal cleared');
    });
    
    // Helper functions
    function getHeightLabel(height) {
        if (!height || height < 240) return 'N/A';
        if (height >= 4320) return '8K';
        if (height >= 2160) return '4K';
        if (height >= 1440) return '1440p';
        if (height >= 1080) return '1080p';
        if (height >= 720) return '720p';
        if (height >= 480) return '480p';
        if (height >= 360) return '360p';
        if (height >= 240) return '240p';
        return `${height}p`;
    }
    
    function findMaxQuality(formats) {
        let maxHeight = 0;
        if (!formats || !Array.isArray(formats)) {
            return 'N/A';
        }
        formats.forEach(format => {
            if (format.vcodec && format.vcodec !== 'none' && format.height) {
                if (format.height > maxHeight) {
                    maxHeight = format.height;
                }
            }
            else if (format.height && !format.acodec) {
                if (format.height > maxHeight) {
                    maxHeight = format.height;
                }
            }
        });
        return getHeightLabel(maxHeight);
    }
    
    // API interaction
    fetchBtn.addEventListener('click', async function() {
        const url = urlInput.value.trim();
        currentVideoInfo = null;
        
        if (!url) {
            addTerminalLine('Error: Please enter a YouTube URL', true);
            status.textContent = 'Status: Error - No URL provided';
            return;
        }
        if (!url.includes('youtube.com/') && !url.includes('youtu.be/')) {
            addTerminalLine('Error: Invalid YouTube URL', true);
            status.textContent = 'Status: Error - Invalid URL';
            return;
        }
        
        addTerminalLine(`Fetching video info for: ${url}`);
        status.textContent = 'Status: Fetching video info...';
        fetchBtn.disabled = true;
        fetchBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Fetching...';
        resetPreview();
        progress.classList.add('hidden');
        updateConnectionStatus(null);
        
        try {
            const response = await fetch('/api/fetch-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url })
            });
            
            updateConnectionStatus(true);
            
            const result = await response.json();
            
            if (response.ok && result.success && result.data) {
                updateApiStatus(true);
                currentVideoInfo = result.data;
                console.log("Fetched Info:", currentVideoInfo);
                
                noPreview.classList.add('hidden');
                thumbnailPreview.classList.remove('hidden');
                thumbnailPreview.style.backgroundImage = `url(${currentVideoInfo.thumbnail || ''})`;
                videoInfo.classList.remove('hidden');
                
                videoTitle.textContent = currentVideoInfo.title || 'N/A';
                videoChannel.textContent = currentVideoInfo.uploader || currentVideoInfo.channel || 'N/A';
                maxVideoQuality.textContent = findMaxQuality(currentVideoInfo.formats);
                videoViews.textContent = currentVideoInfo.view_count ? `${currentVideoInfo.view_count.toLocaleString()} views` : 'N/A';
                videoDuration.textContent = formatDuration(currentVideoInfo.duration);
                videoDate.textContent = formatDate(currentVideoInfo.upload_date);
                
                addTerminalLine('Video info fetched successfully');
                addTerminalLine(`Title: ${currentVideoInfo.title}`);
                addTerminalLine(`Max Available Quality: ${maxVideoQuality.textContent}`);
                status.textContent = 'Status: Ready - Video info loaded';
            } else {
                const errorMsg = result.error || `Server error ${response.status}`;
                const errorDetails = result.details || 'No details from server';
                updateApiStatus(false, `Error ${response.status}`);
                addTerminalLine(`Error fetching info: ${errorMsg}`, true);
                if (result.details) addTerminalLine(`Details: ${errorDetails}`, true);
                status.textContent = `Status: Error - ${errorMsg}`;
                resetPreview();
            }
        } catch (error) {
            console.error("Fetch Network/JS Error:", error);
            updateConnectionStatus(false);
            addTerminalLine(`Network or script error during fetch: ${error.message}`, true);
            status.textContent = `Status: Error - Network or script error`;
            resetPreview();
        } finally {
            fetchBtn.disabled = false;
            fetchBtn.innerHTML = '<i class="fas fa-search mr-2"></i> Fetch';
        }
    });
    
    // Download button click
    downloadBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();
        
        if (!url) {
            addTerminalLine('Error: Please enter a YouTube URL first', true);
            status.textContent = 'Status: Error - No URL provided';
            return;
        }
        if (!currentVideoInfo) {
            addTerminalLine('Error: Please fetch video info before downloading', true);
            status.textContent = 'Status: Error - Fetch info first';
            return;
        }
        
        if (!isApiActive) {
            addTerminalLine('Error: API is not active. Cannot start download.', true);
            status.textContent = 'Status: Error - API inactive';
            return;
        }
        
        const quality = qualitySelect.value;
        const format = formatSelect.value;
        const isPlaylist = playlistCheckbox.checked;
        const includeSubtitles = subtitlesCheckbox.checked;
        
        const params = new URLSearchParams({
            url: url,
            quality: quality,
            format: format,
            playlist: isPlaylist,
            subtitles: includeSubtitles
        });
        const downloadUrl = `/api/download?${params.toString()}`;
        
        addTerminalLine(`Requesting download from server for: ${currentVideoInfo?.title || url}`);
        addTerminalLine(`URL: ${downloadUrl}`);
        status.textContent = 'Status: Initiating download...';
        progress.classList.add('hidden');
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Preparing...';
        
        try {
            const link = document.createElement('a');
            link.href = downloadUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            addTerminalLine(`Download initiated by browser. Check your browser's download manager.`);
            status.textContent = 'Status: Download initiated';
            
            setTimeout(() => {
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = '<i class="fas fa-download mr-2"></i> Download';
            }, 1500);
            
        } catch (linkError) {
            console.error("Error creating/clicking download link:", linkError);
            addTerminalLine(`Error initiating download in browser: ${linkError.message}`, true);
            status.textContent = 'Status: Error initiating download';
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="fas fa-download mr-2"></i> Download';
        }
    });
    
    // Format change handler
    formatSelect.addEventListener('change', function(e) {
        const format = e.target.value;
        addTerminalLine(`Format changed to: ${format.toUpperCase()}`);
        if (format === 'mp3') {
            qualitySelect.disabled = true;
            qualitySelect.classList.add('opacity-50');
        } else {
            qualitySelect.disabled = false;
            qualitySelect.classList.remove('opacity-50');
        }
    });
    
    // Helper function to reset preview area
    function resetPreview() {
        noPreview.classList.remove('hidden');
        thumbnailPreview.classList.add('hidden');
        thumbnailPreview.style.backgroundImage = '';
        videoInfo.classList.add('hidden');
        videoTitle.textContent = '';
        videoChannel.textContent = '';
        maxVideoQuality.textContent = 'N/A';
        videoViews.textContent = '';
        videoDuration.textContent = '';
        videoDate.textContent = '';
    }
    
    // Helper function to format duration (seconds to HH:MM:SS)
    function formatDuration(seconds) {
        if (seconds === null || seconds === undefined) return 'N/A';
        try {
            const numSeconds = Number(seconds);
            if (isNaN(numSeconds)) return 'N/A';
            return new Date(numSeconds * 1000).toISOString().substr(11, 8);
        } catch (e) {
            return 'N/A';
        }
    }
    
    // Helper function to format date (YYYYMMDD to YYYY-MM-DD)
    function formatDate(dateString) {
        if (!dateString || dateString.length !== 8) return 'N/A';
        try {
            return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
        } catch (e) {
            return 'N/A';
        }
    }
    
    // Initial connection check
    function checkInitialConnection() {
        addTerminalLine('Checking server connection...');
        updateConnectionStatus(null);
        fetch('/api/fetch-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: '' })
        }).then(response => {
            updateConnectionStatus(true);
            updateApiStatus(true);
            addTerminalLine('Server connection established.');
            status.textContent = 'Status: Ready';
        }).catch(error => {
            console.error("Initial Connection Error:", error);
            updateConnectionStatus(false);
            addTerminalLine('Server connection failed.', true);
            status.textContent = 'Status: Error - Cannot connect to server';
        });
    }
    
    // Run initial connection check
    checkInitialConnection();
}); 