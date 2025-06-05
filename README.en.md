<h1 align="center">💕 Youtube DL Web / Open Source 💫</h1>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![yt-dlp](https://img.shields.io/badge/yt--dlp-8A2BE2?style=for-the-badge&logo=youtube&logoColor=white)](https://github.com/yt-dlp/yt-dlp) [![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)](https://ffmpeg.org/) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)]() [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> I have been feeling unwell and depressed for the past 2-3 years, so updates and changes in my projects may be delayed. I am truly sorry.

CyberTube DL Web is a web interface for the popular `yt-dlp` utility, allowing you to download video and audio from YouTube via your browser. The application runs locally on your computer and is accessible via a web browser to you and other devices on your local network.

![image](https://github.com/user-attachments/assets/a4d9dbc2-5d2e-41b4-a5ef-08b901eed7f9)

## ✨ Features

*   **Video and Audio Downloading:** Support for popular formats (MP4, MKV, MP3).
*   **Quality Selection:** Option to choose video resolution (up to 4K) and audio quality (for MP3).
*   **Information Display:** Shows preview, title, channel, duration, date, and maximum available video quality before downloading.
*   **Playlist Support:** Download entire playlists (optional).
*   **Subtitles:** Option to download subtitles (English, Russian by default).
*   **Web Interface:** User-friendly cyberpunk-style interface with log output to a terminal view.
*   **Local Access:** Runs on your PC, accessible on your local network.
*   **Connection Status:** Displays the real-time connection status to the backend.

## 🚀 Technology Stack

*   **Backend:** Node.js, Express.js
*   **Frontend:** HTML, Tailwind CSS, Vanilla JavaScript
*   **Download Core:** [yt-dlp](https://github.com/yt-dlp/yt-dlp)
*   **Formatting/Merging:** (Optional, but recommended) [FFmpeg](https://ffmpeg.org/)

## 🛠️ Installation and Setup

1.  **Clone the repository or simply download the ZIP archive and extract it.**

2.  **Install Node.js:** If you don't have it, download and install the LTS version from [nodejs.org](https://nodejs.org/).

3.  **Download yt-dlp:**
    *   Go to the [yt-dlp releases page](https://github.com/yt-dlp/yt-dlp/releases/latest).
    *   Download `yt-dlp.exe` for Windows.
    *   Place the `yt-dlp.exe` file in the project's root folder (`cybertube-dl-web`).

4.  **(Recommended) Download FFmpeg:**
    *   `yt-dlp` uses FFmpeg for merging video and audio tracks (for qualities above 720p) and for converting to MP3.
    *   Download FFmpeg from the [official website](https://ffmpeg.org/download.html) or [from here (for Windows)](https://github.com/BtbN/FFmpeg-Builds/releases).
    *   Extract the archive and place `ffmpeg.exe` (and `ffprobe.exe`) in the project's root folder (`cybertube-dl-web`) next to `yt-dlp.exe`.

5.  **Install project dependencies:**
    Open a terminal (Command Prompt, PowerShell) in the project folder and run:
    ```bash
    npm install
    ```

6.  **Start the server:**
    ```bash
    npm start
    ```
    Or:
    ```bash
    node server.js
    ```
    You should see a message indicating the server has started on port 3000.

## 💻 Usage

1.  **Open your browser:** On the same computer where the server is running, navigate to `http://localhost:3000`.
2.  **Paste URL:** Enter the link to a YouTube video or playlist.
3.  **Click "Fetch":** The application will retrieve video information and display the preview, title, maximum quality, etc. The Connection and API statuses in the footer should turn green.
4.  **Select Options:** Specify the desired quality (for video), format (MP4, MKV, MP3), and check the playlist or subtitle options if needed.
5.  **Click "Download":** Your browser will start downloading the file. Progress will be shown in the browser's download manager. The file will be saved to your default downloads folder.
6.  **Access from other devices:** Find the local IP address of the computer running the server (`ipconfig` command in Windows) and enter `http://<IP-address>:3000` in the browser of another device on the same network.

## ⚙️ Configuration

Main parameters can be changed at the beginning of the `server.js` file:

*   `port`: The port the server will run on (default `3000`).
*   `ytDlpPath`: Path to `yt-dlp.exe` (defaults to looking in the same folder as `server.js`).
*   `tempDownloadsDir`: Folder for temporarily storing downloaded files.

## ⚠️ Important Notes

*   **Resources:** Each download starts a `yt-dlp` process on your computer, consuming CPU, memory, and network resources.
*   **Security:** This server is intended for use **only on a trusted local network**. **Do not expose it directly to the Internet without proper security measures!** Doing so could lead to unauthorized use of your computer and internet bandwidth.
*   **Cleanup:** Temporary files should be deleted automatically, but may remain in the `temp_downloads` folder in case of errors. Check it periodically.
*   **FFmpeg:** Having `ffmpeg.exe` next to `yt-dlp.exe` is highly recommended for downloading high-quality video (1080p and above) and for MP3 conversion.

## 📄 License

This project is distributed under the MIT License. See the `LICENSE` file.

　　　 　　／＞　　フ

　　　 　　| 　_　 _ l

　 　　 　／` ミ＿xノ

　　 　 /　　　 　 |

　　　 /　 ヽ　　 ﾉ

　 　 │　　|　|　|

　／￣|　　 |　|　|

　| (￣ヽ＿ヽ)__)

　＼二つ
