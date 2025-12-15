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

// Временный код для проверки
// document.addEventListener('DOMContentLoaded', () => {
//     console.log('🚀 DOM loaded - Todo App is ready!');
    
//     // Проверим, что #app существует
//     const app = document.getElementById('app');
//     if (app) {
//         app.innerHTML = `
//             <div class="todo-app">
//                 <h1>Todo List</h1>
//                 <p>✅ Сборка работает! Теперь можно начать разработку.</p>
//                 <div data-component="todo-app"></div>
//             </div>
//         `;
//         console.log('✅ App container found and initialized');
//     } else {
//         console.error('❌ App container (#app) not found');
//     }
// });
