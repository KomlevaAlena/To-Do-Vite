// Улучшенный загрузчик компонентов с поддержкой вложенных компонентов
class SimpleComponentLoader {
  constructor() {
    this.loadedComponents = new Set();
  }
  
  async init() {
    console.log('🔄 Loading components...');
    
    // Начальная загрузка
    await this.loadAllComponents();
    
    // Наблюдаем за изменениями DOM для вложенных компонентов
    this.setupObserver();
    
    console.log('✅ All components loaded');
  }
  
  async loadAllComponents() {
    const components = document.querySelectorAll('[data-component]:not([data-loaded])');
    console.log(`Found ${components.length} new components to load`);
    
    for (const component of components) {
      const name = component.getAttribute('data-component');
      if (!this.loadedComponents.has(`${name}-${this.getComponentId(component)}`)) {
        await this.loadComponent(component, name);
      }
    }
  }
  
  getComponentId(element) {
    // Создаем уникальный ID на основе позиции в DOM
    return Array.from(element.parentNode.children).indexOf(element);
  }
  
  async loadComponent(placeholder, name) {
    try {
      console.log(`📥 Loading: ${name}`);
      
      const url = `/src/components/${name}/${name}.html?t=${Date.now()}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const html = await response.text();
      
      if (!html || html.trim().length === 0) {
        throw new Error('Empty HTML content');
      }
      
      console.log(`✅ ${name} loaded, length: ${html.length} chars`);
      
      // Помечаем как загруженный
      placeholder.setAttribute('data-loaded', 'true');
      this.loadedComponents.add(`${name}-${this.getComponentId(placeholder)}`);
      
      // Вставляем HTML
      placeholder.innerHTML = html;
      
      // После вставки проверяем новые компоненты внутри
      await this.loadAllComponents();
      
    } catch (error) {
      console.error(`❌ Failed to load ${name}:`, error);
      placeholder.innerHTML = `
        <div class="component-error">
          <strong>Component Error:</strong> ${name}<br>
          Error: ${error.message}<br>
          Check: /src/components/${name}/${name}.html
        </div>
      `;
    }
  }
  
  setupObserver() {
    // MutationObserver для отслеживания новых компонентов
    const observer = new MutationObserver((mutations) => {
      let shouldReload = false;
      
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.hasAttribute?.('data-component')) {
              shouldReload = true;
            }
          });
        }
      });
      
      if (shouldReload) {
        this.loadAllComponents();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new SimpleComponentLoader().init();
});
