// Главный файл - импортируем все стили и скрипты
console.log('🎯 Starting Todo App...');

// Импортируем стили
import './styles/main.scss';
console.log('✅ SCSS styles imported');

// Импортируем загрузчик компонентов
import './scripts/simple-components-loader.js';
console.log('✅ Components loader imported');

// Импортируем SVG loader
// import './scripts/svg-sprite-loader.js';
// console.log('✅ SVG loader imported');

console.log('🚀 All modules loaded - waiting for components...');

// Импортируем компоненты для проверки
import { components } from './components/components.js';
console.log('📦 Доступные компоненты:', Object.keys(components));

// Импортируем контроллер Todo
import { todoController } from './scripts/todo/todoController.js';
console.log('✅ Todo Controller импортирован');

// Запускаем контроллер ОДИН раз
todoController.init();
console.log('🚀 Todo Controller started');

// Проверка что контроллер загрузился
setTimeout(() => {
  console.log('=== ОТЛАДКА ЧЕРЕЗ 2 СЕКУНДЫ ===');
  console.log('todoController:', todoController);
  console.log('Есть ли метод init?', todoController?.init);

  if (todoController && todoController.init) {
    console.log('Пробую запустить вручную...');
    todoController.init();
  }
}, 2000);
