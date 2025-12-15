// Улучшенный загрузчик компонентов
class SimpleComponentLoader {
  async init() {
    console.log('🔄 Loading components...');
    
    const components = document.querySelectorAll('[data-component]');
    console.log(`Found ${components.length} components to load`);
    
    for (const component of components) {
      const name = component.getAttribute('data-component');
      await this.loadComponent(component, name);
    }
    
    console.log('✅ All components loaded');
  }
  
  async loadComponent(placeholder, name) {
    try {
      console.log(`📥 Loading: ${name}`);
      
      // Добавляем timestamp чтобы избежать кэширования
      const url = `/src/components/${name}/${name}.html?t=${Date.now()}`;
      console.log(`🔗 Fetching: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const html = await response.text();
      
      if (!html || html.trim().length === 0) {
        throw new Error('Empty HTML content');
      }
      
      console.log(`✅ ${name} loaded, length: ${html.length} chars`);
      
      placeholder.innerHTML = html;
      
    } catch (error) {
      console.error(`❌ Failed to load ${name}:`, error);
      placeholder.innerHTML = `
        <div style="
          padding: 2rem; 
          background: #fee; 
          border: 2px dashed #e74c3c;
          color: #c0392b;
          font-family: Arial;
        ">
          <strong>Component Error:</strong> ${name}<br>
          Error: ${error.message}<br>
          Check: /src/components/${name}/${name}.html
        </div>
      `;
    }
  }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new SimpleComponentLoader().init();
});