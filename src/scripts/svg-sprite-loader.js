// Простой загрузчик SVG спрайта
class SVGSprites {
  constructor() {
    this.spriteUrl = '/sprite.svg';
    this.init();
  }

  async init() {
    try {
      console.log('🔄 Loading SVG sprite...');
      
      const response = await fetch(this.spriteUrl);
      if (!response.ok) throw new Error('Sprite not found');
      
      const spriteContent = await response.text();
      this.injectSprite(spriteContent);
      this.replaceIcons();
      
      console.log('✅ SVG sprite loaded successfully');
      
    } catch (error) {
      console.warn('⚠️ SVG sprite not found:', error.message);
      console.log('💡 Run: npm run build-sprite');
    }
  }

  injectSprite(spriteContent) {
    // Создаем контейнер для спрайта
    const container = document.createElement('div');
    container.innerHTML = spriteContent;
    container.style.display = 'none';
    container.setAttribute('aria-hidden', 'true');
    container.id = 'svg-sprite-container';
    
    document.body.appendChild(container);
  }

  replaceIcons() {
    // Заменяем элементы с data-icon на настоящие SVG
    const iconElements = document.querySelectorAll('[data-icon]');
    
    console.log(`🔍 Found ${iconElements.length} icon placeholders`);
    
    iconElements.forEach(element => {
      const iconName = element.getAttribute('data-icon');
      const size = element.getAttribute('data-size') || '24';
      const color = element.getAttribute('data-color') || 'currentColor';
      const className = element.getAttribute('class') || '';
      
      // Создаем SVG элемент
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', `icon icon-${iconName} ${className}`);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('fill', color);
      
      // Создаем use элемент
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#icon-${iconName}`);
      
      svg.appendChild(use);
      
      // Заменяем оригинальный элемент
      element.parentNode.replaceChild(svg, element);
      
      console.log(`✅ Replaced: ${iconName}`);
    });
  }
}

// Автоматически инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new SVGSprites();
});