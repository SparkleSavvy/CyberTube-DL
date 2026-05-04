<h1 align="center">💕 Youtube DL Web / Open Source 💫</h1>

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![yt-dlp](https://img.shields.io/badge/yt--dlp-8A2BE2?style=for-the-badge&logo=youtube&logoColor=white)](https://github.com/yt-dlp/yt-dlp) [![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)](https://ffmpeg.org/) [![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)]() [![License: ISC](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> [!IMPORTANT]
> ENG: This project will soon cease to be supported and developed; it will be archived. Development will continue here: [SparkleSavvy/Flow](https://github.com/SparkleSavvy/Flow)!

> [!IMPORTANT]
> RUS: В скором времени поддержка и разработка этого проекта будут прекращены; он будет перенесен в архив. Разработка будет продолжена тут: [SparkleSavvy/Flow](https://github.com/SparkleSavvy/Flow)!

CyberTube DL Web - это веб-интерфейс для популярной утилиты `yt-dlp`, позволяющий скачивать видео и аудио с YouTube через браузер. Приложение работает локально на вашем компьютере и доступно через веб-браузер вам и другим устройствам в вашей локальной сети.

![image](https://github.com/user-attachments/assets/a4d9dbc2-5d2e-41b4-a5ef-08b901eed7f9)

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
