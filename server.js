const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Для уникальных имен

const app = express();
const port = 3000; // Порт, на котором будет работать сервер

// --- Конфигурация ---
const ytDlpPath = path.resolve(__dirname, 'yt-dlp.exe'); // Путь к yt-dlp.exe
const tempDownloadsDir = path.resolve(__dirname, 'temp_downloads');
const cookiesFilePath = path.resolve(__dirname, 'cookies.txt');
// --- Конец Конфигурации ---

// Проверка наличия файла cookies (опционально, но полезно)
if (!fs.existsSync(cookiesFilePath)) {
    console.warn(`[ПРЕДУПРЕЖДЕНИЕ] Файл cookies не найден по пути: ${cookiesFilePath}`);
    console.warn('Некоторые видео могут не скачиваться без cookies. См. https://github.com/yt-dlp/yt-dlp/wiki/Authentication');
    // Не выходим, просто предупреждаем
} else {
    console.log(`[INFO] Используется файл cookies: ${cookiesFilePath}`);
}

// Проверка наличия yt-dlp.exe
if (!fs.existsSync(ytDlpPath)) {
    console.error(`ОШИБКА: yt-dlp.exe не найден по пути: ${ytDlpPath}`);
    console.error('Пожалуйста, скачайте yt-dlp.exe и поместите его в папку с server.js или убедитесь, что путь указан верно.');
    process.exit(1); // Выход, если yt-dlp не найден
}

// Создание папки для временных файлов, если её нет
if (!fs.existsSync(tempDownloadsDir)) {
    fs.mkdirSync(tempDownloadsDir);
    console.log(`Создана папка для временных загрузок: ${tempDownloadsDir}`);
}

// Middleware для обработки JSON тел запросов
app.use(express.json());
// Middleware для обработки URL-encoded тел запросов
app.use(express.urlencoded({ extended: true }));

// Раздача статических файлов из папки 'public' (где будет index.html)
app.use(express.static(path.join(__dirname, 'public')));

// --- API Эндпоинты ---

// Эндпоинт для получения информации о видео
app.post('/api/fetch-info', (req, res) => {
    const url = req.body.url;
    console.log(`[API] Запрос информации для URL: ${url}`);

    if (!url || (!url.includes('youtube.com/') && !url.includes('youtu.be/'))) {
        console.error('[API] Неверный URL:', url);
        return res.status(400).json({ success: false, error: 'Неверный или отсутствующий URL YouTube' });
    }

    // --- ИСПРАВЛЕНИЕ: Объявляем args ЗДЕСЬ ---
    const args = ['--dump-json', '--no-playlist']; // Базовые аргументы

    // --- Теперь добавляем cookies, если файл есть ---
    if (fs.existsSync(cookiesFilePath)) {
        // Используем push, чтобы добавить в конец (или unshift в начало, не принципиально до URL)
        args.push('--cookies', cookiesFilePath);
        console.log('[yt-dlp args] Добавлены cookies для fetch-info');
    }

    // --- Добавляем URL последним аргументом ---
    args.push(url);

    console.log(`[yt-dlp] Запуск Fetch Info: ${ytDlpPath} ${args.join(' ')}`); // Логируем аргументы для отладки
    const ytDlpProcess = spawn(ytDlpPath, args);

    let jsonData = '';
    let errorData = '';

    ytDlpProcess.stdout.on('data', (data) => {
        jsonData += data.toString();
    });

    ytDlpProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        console.error(`[yt-dlp stderr / fetch]: ${data.toString().trim()}`);
    });

    ytDlpProcess.on('close', (code) => {
        if (code === 0 && jsonData) {
            try {
                const info = JSON.parse(jsonData);
                console.log(`[API] Информация успешно получена для: ${info.title}`);
                res.json({ success: true, data: info });
            } catch (parseError) {
                console.error('[API] Ошибка парсинга JSON от yt-dlp:', parseError);
                console.error('[API] Полученные данные:', jsonData);
                res.status(500).json({ success: false, error: 'Не удалось обработать информацию о видео', details: errorData || parseError.message });
            }
        } else {
            console.error(`[API] yt-dlp (fetch) завершился с кодом ${code}. Stderr: ${errorData}`);
            res.status(500).json({ success: false, error: `Не удалось получить информацию о видео (код ${code})`, details: errorData });
        }
    });

    ytDlpProcess.on('error', (err) => {
        console.error('[API] Ошибка запуска yt-dlp (fetch):', err);
        res.status(500).json({ success: false, error: 'Не удалось запустить процесс yt-dlp', details: err.message });
    });
});

// Эндпоинт для скачивания видео/аудио
app.get('/api/download', (req, res) => {
    const { url, quality, format, playlist, subtitles } = req.query;
    console.log(`[API] Запрос на скачивание: URL=${url}, Quality=${quality}, Format=${format}, Playlist=${playlist}, Subtitles=${subtitles}`);

    if (!url || (!url.includes('youtube.com/') && !url.includes('youtu.be/'))) {
        console.error('[API] Неверный URL для скачивания:', url);
        return res.status(400).send('Неверный или отсутствующий URL YouTube');
    }

    const downloadId = uuidv4();
    const tempOutputPath = path.join(tempDownloadsDir, `download_${downloadId}.%(ext)s`);
    let finalFilePath = null;

    // --- ИСПРАВЛЕНИЕ: Объявляем args ЗДЕСЬ ---
    const args = []; // Начинаем с пустого массива

    // --- Теперь добавляем cookies, если файл есть ---
    if (fs.existsSync(cookiesFilePath)) {
        args.push('--cookies', cookiesFilePath);
        console.log('[yt-dlp args] Добавлены cookies для download');
    }

    // --- Далее добавляем остальные аргументы как раньше ---
    // Путь вывода
    args.push('-o', tempOutputPath);

    // Формат
    if (format === 'mp3') {
        // ... аргументы для mp3 ...
         args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
         console.log('[yt-dlp args] Формат: MP3 (Best Audio)');
    } else {
        // ... аргументы для видео ...
        let formatString = 'bestvideo';
        // ... (логика выбора качества) ...
         if (quality && quality.includes('720p')) formatString += '[height<=720]';
         else if (quality && quality.includes('1080p')) formatString += '[height<=1080]';
         else if (quality && quality.includes('1440p')) formatString += '[height<=1440]';
         else if (quality && quality.includes('2160p')) formatString += '[height<=2160]';
         formatString += `[ext=${format}]`;
         formatString += '+bestaudio/best';
         args.push('-f', formatString);
         args.push('--merge-output-format', format);
         console.log(`[yt-dlp args] Формат: ${format.toUpperCase()}, Качество: ${quality}, Строка: ${formatString}`);
    }

    // Плейлист
    if (playlist === 'true') {
        args.push('--yes-playlist');
        console.log('[yt-dlp args] Скачивание плейлиста: Да');
    } else {
        args.push('--no-playlist');
        console.log('[yt-dlp args] Скачивание плейлиста: Нет');
    }

    // Субтитры
    if (subtitles === 'true') {
        args.push('--write-subs', '--sub-lang', 'en,ru');
        console.log('[yt-dlp args] Субтитры: Да (en, ru)');
    }

    // --- Добавляем URL последним аргументом ---
    args.push(url);

    console.log(`[yt-dlp] Запуск Download: ${ytDlpPath} ${args.join(' ')}`); // Логируем аргументы
    const ytDlpProcess = spawn(ytDlpPath, args);

    // Важно: Перехватываем stdout, чтобы найти имя файла, если оно отличается от шаблона
    let stdoutData = '';
    ytDlpProcess.stdout.on('data', (data) => {
        const output = data.toString();
        stdoutData += output;
        console.log(`[yt-dlp stdout]: ${output.trim()}`);
        // Попытка найти имя файла назначения (может быть не надежно)
        const mergeMatch = output.match(/Merging formats into "(.+?)"/);
        const destMatch = output.match(/\[download\] Destination: (.+)/);
        const alreadyMatch = output.match(/\[download\] (.+) has already been downloaded/);

        if (mergeMatch && mergeMatch[1]) {
            finalFilePath = path.resolve(tempDownloadsDir, path.basename(mergeMatch[1])); // Используем basename на всякий случай
        } else if (destMatch && destMatch[1]) {
            finalFilePath = path.resolve(tempDownloadsDir, path.basename(destMatch[1]));
        } else if (alreadyMatch && alreadyMatch[1]) {
             finalFilePath = path.resolve(tempDownloadsDir, path.basename(alreadyMatch[1]));
        }
    });

    ytDlpProcess.stderr.on('data', (data) => {
        console.error(`[yt-dlp stderr]: ${data.toString().trim()}`);
    });

    ytDlpProcess.on('close', (code) => {
        if (code === 0) {
            console.log('[yt-dlp] Скачивание успешно завершено.');

            // Если не удалось определить имя файла из вывода, ищем его
            if (!finalFilePath || !fs.existsSync(finalFilePath)) {
                 console.warn('[API] Не удалось определить точное имя файла из вывода yt-dlp. Попытка найти файл...');
                 try {
                     const files = fs.readdirSync(tempDownloadsDir);
                     const downloadedFile = files.find(f => f.startsWith(`download_${downloadId}.`));
                     if (downloadedFile) {
                         finalFilePath = path.join(tempDownloadsDir, downloadedFile);
                         console.log(`[API] Найден файл: ${finalFilePath}`);
                     } else {
                         console.error('[API] Не удалось найти скачанный файл в папке temp_downloads!');
                         return res.status(500).send('Ошибка сервера: Не удалось найти скачанный файл.');
                     }
                 } catch (findError) {
                      console.error('[API] Ошибка при поиске файла:', findError);
                      return res.status(500).send('Ошибка сервера: Ошибка при поиске скачанного файла.');
                 }
            }

            if (finalFilePath && fs.existsSync(finalFilePath)) {
                console.log(`[API] Отправка файла клиенту: ${finalFilePath}`);
                // Отправляем файл на скачивание клиенту
                // Имя файла для пользователя берем из пути (можно улучшить, извлекая из метаданных)
                res.download(finalFilePath, path.basename(finalFilePath), (err) => {
                    if (err) {
                        console.error('[API] Ошибка при отправке файла клиенту:', err);
                        // Не отправляем статус, если заголовки уже отправлены
                        if (!res.headersSent) {
                             res.status(500).send('Ошибка при отправке файла');
                        }
                    } else {
                        console.log(`[API] Файл ${path.basename(finalFilePath)} успешно отправлен.`);
                    }
                    // Удаляем временный файл ПОСЛЕ отправки (или ошибки отправки)
                    console.log(`[API] Удаление временного файла: ${finalFilePath}`);
                    fs.unlink(finalFilePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error(`[API] Ошибка при удалении временного файла ${finalFilePath}:`, unlinkErr);
                        } else {
                            console.log(`[API] Временный файл ${path.basename(finalFilePath)} удален.`);
                        }
                    });
                });
            } else {
                 console.error(`[API] Скачанный файл не найден по пути: ${finalFilePath}`);
                 res.status(500).send('Ошибка сервера: Скачанный файл не найден после завершения процесса.');
            }

        } else {
            console.error(`[API] yt-dlp (download) завершился с кодом ${code}.`);
            // Попытка удалить частично скачанные файлы (если они есть)
             try {
                 const files = fs.readdirSync(tempDownloadsDir);
                 files.forEach(f => {
                     if (f.startsWith(`download_${downloadId}.`)) {
                         const partFilePath = path.join(tempDownloadsDir, f);
                         console.log(`[API] Удаление частичного файла из-за ошибки: ${partFilePath}`);
                         fs.unlinkSync(partFilePath);
                     }
                 });
             } catch(cleanupError) {
                 console.error('[API] Ошибка при очистке временных файлов после неудачной загрузки:', cleanupError);
             }
            res.status(500).send(`Ошибка скачивания видео (код ${code}). Проверьте логи сервера.`);
        }
    });

    ytDlpProcess.on('error', (err) => {
        console.error('[API] Ошибка запуска yt-dlp (download):', err);
        res.status(500).send('Ошибка сервера: Не удалось запустить процесс скачивания.');
    });
});

// --- Запуск сервера ---
app.listen(port, () => {
    console.log(`CyberTube Web Server запущен на http://localhost:${port}`);
    console.log(`Раздача статики из папки: ${path.join(__dirname, 'public')}`);
    console.log(`Временные файлы будут сохраняться в: ${tempDownloadsDir}`);
    console.log(`Используется yt-dlp: ${ytDlpPath}`);
});