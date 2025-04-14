# CyberTube DL Web
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![yt-dlp](https://img.shields.io/badge/yt--dlp-8A2BE2?style=for-the-badge&logo=youtube&logoColor=white)](https://github.com/yt-dlp/yt-dlp) [![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)](https://ffmpeg.org/) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)]() [![License: ISC](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

CyberTube DL Web - это веб-интерфейс для популярной утилиты `yt-dlp`, позволяющий скачивать видео и аудио с YouTube через браузер. Приложение работает локально на вашем компьютере и доступно через веб-браузер вам и другим устройствам в вашей локальной сети.

![image](https://github.com/user-attachments/assets/01a204ed-67f7-4c6f-8b3f-b20b5c1f7f15)

## ✨ Возможности

*   **Скачивание Видео и Аудио:** Поддержка популярных форматов (MP4, MKV, MP3).
*   **Выбор Качества:** Возможность выбора разрешения видео (до 4K) и качества аудио (для MP3).
*   **Отображение Информации:** Показывает превью, название, канал, длительность, дату и максимальное доступное качество видео перед скачиванием.
*   **Поддержка Плейлистов:** Скачивание целых плейлистов (опционально).
*   **Субтитры:** Возможность скачивания субтитров (английский, русский по умолчанию).
*   **Веб-интерфейс:** Удобный интерфейс в стиле "киберпанк" с выводом логов в терминал.
*   **Локальный Доступ:** Работает на вашем ПК, доступен в локальной сети.
*   **Статус Соединения:** Отображает реальный статус подключения к бэкенду.

## 🚀 Технологии

*   **Бэкенд:** Node.js, Express.js
*   **Фронтенд:** HTML, Tailwind CSS, Vanilla JavaScript
*   **Ядро Скачивания:** [yt-dlp](https://github.com/yt-dlp/yt-dlp)
*   **Форматирование/Слияние:** (Опционально, но рекомендуется) [FFmpeg](https://ffmpeg.org/)

## 🛠️ Установка и Запуск

1.  **Клонируйте репозиторий или просто скачайте ZIP-архив и распакуйте его.**

3.  **Установите Node.js:** Если у вас его нет, скачайте и установите LTS-версию с [nodejs.org](https://nodejs.org/).

4.  **Скачайте yt-dlp:**
 *   Перейдите на страницу [релизов yt-dlp](https://github.com/yt-dlp/yt-dlp/releases/latest).
 *   Скачайте `yt-dlp.exe` для Windows.
 *   Поместите файл `yt-dlp.exe` в корневую папку проекта (`cybertube-dl-web`).

4.  **(Рекомендуется) Скачайте FFmpeg:**
 *   `yt-dlp` использует FFmpeg для слияния видео и аудио дорожек (для качеств выше 720p) и для конвертации в MP3.
 *   Скачайте FFmpeg с [официального сайта](https://ffmpeg.org/download.html) или [отсюда (для Windows)](https://github.com/BtbN/FFmpeg-Builds/releases).
 *   Распакуйте архив и поместите `ffmpeg.exe` (и `ffprobe.exe`) в корневую папку проекта (`cybertube-dl-web`) рядом с `yt-dlp.exe`.

5.  **Установите зависимости проекта:**
 Откройте терминал (командную строку, PowerShell) в папке проекта и выполните:
 ```bash
 npm install
 ```

6.  **Запустите сервер:**
 ```bash
 npm start
 ```
 Или:
 ```bash
 node server.js
 ```
 Вы должны увидеть сообщение о запуске сервера на порту 3000.

## 💻 Использование

1.  **Откройте браузер:** На том же компьютере, где запущен сервер, перейдите по адресу `http://localhost:3000`.
2.  **Вставьте URL:** Введите ссылку на видео или плейлист YouTube.
3.  **Нажмите "Fetch":** Приложение получит информацию о видео и отобразит превью, название, максимальное качество и т.д. Статусы Connection и API в футере должны стать зелеными.
4.  **Выберите Опции:** Укажите желаемое качество (для видео), формат (MP4, MKV, MP3), отметьте опции плейлиста или субтитров при необходимости.
5.  **Нажмите "Download":** Браузер начнет скачивание файла. Прогресс будет отображаться в менеджере загрузок браузера. Файл сохранится в стандартную папку загрузок.
6.  **Доступ с других устройств:** Узнайте локальный IP-адрес компьютера с сервером (команда `ipconfig` в Windows) и введите `http://<IP-адрес>:3000` в браузере на другом устройстве в той же сети.

## ⚙️ Конфигурация

Основные параметры можно изменить в начале файла `server.js`:

*   `port`: Порт, на котором будет работать сервер (по умолчанию `3000`).
*   `ytDlpPath`: Путь к `yt-dlp.exe` (по умолчанию ищет в папке с `server.js`).
*   `tempDownloadsDir`: Папка для временного хранения скачиваемых файлов.

## ⚠️ Важные Замечания

*   **Ресурсы:** Каждое скачивание запускает процесс `yt-dlp` на вашем компьютере, потребляя ресурсы CPU, памяти и сети.
*   **Безопасность:** Данный сервер предназначен для использования **только в доверенной локальной сети**. **Не выставляйте его напрямую в Интернет без серьезных мер безопасности!** Это может привести к несанкционированному использованию вашего компьютера и интернет-канала.
*   **Очистка:** Временные файлы должны удаляться автоматически, но в случае сбоев могут оставаться в папке `temp_downloads`. Проверяйте ее периодически.
*   **FFmpeg:** Для скачивания видео в высоком качестве (1080p и выше) и конвертации в MP3 настоятельно рекомендуется наличие `ffmpeg.exe` рядом с `yt-dlp.exe`.

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE`.

　　　 　　／＞　　フ

　　　 　　| 　_　 _ l

　 　　 　／` ミ＿xノ

　　 　 /　　　 　 |

　　　 /　 ヽ　　 ﾉ

　 　 │　　|　|　|

　／￣|　　 |　|　|

　| (￣ヽ＿ヽ)__)

　＼二つ

---

English

---

# CyberTube DL Web
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![yt-dlp](https://img.shields.io/badge/yt--dlp-8A2BE2?style=for-the-badge&logo=youtube&logoColor=white)](https://github.com/yt-dlp/yt-dlp) [![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)](https://ffmpeg.org/) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)]() [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

CyberTube DL Web is a web interface for the popular `yt-dlp` utility, allowing you to download video and audio from YouTube via your browser. The application runs locally on your computer and is accessible via a web browser to you and other devices on your local network.

![image](https://github.com/user-attachments/assets/01a204ed-67f7-4c6f-8b3f-b20b5c1f7f15)

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
