# To-Do-List 🚀

## 🛠️ Технологии

- Vite 4.5.3
- SCSS
- React 18
- GitHub Pages

## 📁 Структура проекта

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск сервера разработки
npm run dev

# Сборка для продакшена
npm run build

# Деплой на GitHub Pages
npm run deploy

https://komlevaalena.github.io/To-Do-Vite/

# Убедимся что у нас есть тестовое изображение в src/assets/images/
ls -la src/assets/images/

# Запускаем конвертацию
npm run convert-images

# Должен быть вывод:
# 🚀 Starting image conversion...
# 📁 Found 1 images in src/assets/images/
# 🔄 Processing: photo.jpg
# ✅ Converted: photo.jpg → photo.webp + photo.jpg (optimized)

# Проверяем что файлы создались в public
ls -la public/assets/images/
# Должны быть: photo.jpg и photo.webp
# Собираем проект
npm run build

# Запускаем превью
npm run preview