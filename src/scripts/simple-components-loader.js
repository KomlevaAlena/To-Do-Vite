// Импортируем все компоненты из одного файла
import { components } from '../components/components.js';

// Упрощённый загрузчик компонентов из JS
class SimpleComponentLoader {
  constructor() {
    console.log('🔄 SimpleComponentLoader создан');
    this.loadedComponents = new Set();
  }
  
  init() {
    console.log('🚀 Начинаю загрузку компонентов...');
    
    // Загружаем все компоненты сразу
    this.loadAllComponents();
    
    // Наблюдаем за изменениями для динамически добавленных компонентов
    this.setupObserver();
    
    console.log('✅ Все компоненты загружены');
  }
  
  // Загрузить все компоненты на странице
  loadAllComponents() {
    // Находим все элементы с data-component
    const componentElements = document.querySelectorAll('[data-component]:not([data-loaded])');
    console.log(`📊 Найдено компонентов для загрузки: ${componentElements.length}`);
    
    componentElements.forEach(element => {
      const name = element.getAttribute('data-component');
      this.loadComponent(element, name);
    });
  }
  
  // Загрузить один компонент
  loadComponent(placeholder, name) {
    console.log(`📥 Загружаю компонент: ${name}`);
    
    // Проверяем, есть ли такой компонент
    if (components[name]) {
      // Вставляем HTML из components.js
      placeholder.innerHTML = components[name];
      
      // Помечаем как загруженный
      placeholder.setAttribute('data-loaded', 'true');
      this.loadedComponents.add(name);
      
      console.log(`✅ ${name} загружен`);
      
      // Проверяем, не появились ли внутри новые компоненты
      this.loadAllComponents();
      
    } else {
      // Если компонент не найден
      console.error(`❌ Компонент "${name}" не найден в components.js`);
      placeholder.innerHTML = `
        <div style="padding: 1rem; background: #fee; border: 2px dashed #e74c3c;">
          <strong>Ошибка компонента:</strong> ${name}<br>
          Компонент не найден в components.js
        </div>
      `;
    }
  }
  
  // Наблюдатель за изменениями DOM (для динамически добавленных компонентов)
  setupObserver() {
    const observer = new MutationObserver((mutations) => {
      let hasNewComponents = false;
      
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.querySelectorAll) {
              // Проверяем, есть ли в добавленных узлах компоненты
              const componentsInNode = node.querySelectorAll('[data-component]');
              if (componentsInNode.length > 0) {
                hasNewComponents = true;
              }
            }
          });
        }
      });
      
      if (hasNewComponents) {
        console.log('🔍 Обнаружены новые компоненты, загружаю...');
        this.loadAllComponents();
      }
    });
    
    // Наблюдаем за всем документом
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const loader = new SimpleComponentLoader();
  loader.init();
});