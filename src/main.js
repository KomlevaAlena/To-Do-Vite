// Главный файл - импортируем все стили и скрипты
console.log('🎯 Starting Components Collection...');

// Импортируем стили
import './styles/main.scss';
console.log('✅ SCSS styles imported');

// Импортируем загрузчик компонентов
import './scripts/simple-components-loader.js';
console.log('✅ Components loader imported');

// Импортируем SVG loader
import './scripts/svg-sprite-loader.js';
console.log('✅ SVG loader imported');

console.log('🚀 All modules loaded - waiting for components...');

import { todoController } from './scripts/todo/todoController.js';
console.log('✅ Todo Controller импортирован');

todoController.init();

// Временная проверка - импортируем компоненты напрямую
import { components } from './components/components.js';
console.log('📦 Доступные компоненты:', Object.keys(components));

