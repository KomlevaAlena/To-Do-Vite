(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))e(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&e(i)}).observe(document,{childList:!0,subtree:!0});function t(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function e(s){if(s.ep)return;s.ep=!0;const l=t(s);fetch(s.href,l)}})();const a={"todo-app":`
  <div class="todo-app">
    <h1 class="todo-app__title">To-Do List</h1>
    
    <!-- Счётчики задач -->
    <div class="todo-counters">
      <div class="todo-counter" data-counter="total">
        Всего: <span class="todo-counter__value">0</span>
      </div>
      <div class="todo-counter" data-counter="completed">
        Выполнено: <span class="todo-counter__value">0</span>
      </div>
      <div class="todo-counter" data-counter="active">
        Активных: <span class="todo-counter__value">0</span>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="todo-filters">
      <button class="todo-filter todo-filter--active" data-filter="all">
        📋 Все
      </button>
      <button class="todo-filter" data-filter="active">
        ⏳ Активные
      </button>
      <button class="todo-filter" data-filter="completed">
        ✅ Выполненные
      </button>
    </div>
    
    <!-- Форма добавления -->
    <div data-component="todo-input"></div>
    
    <!-- Список задач -->
    <div data-component="todo-list"></div>
  </div>
`,"todo-input":`
    <div class="todo-input">
      <form class="todo-input__form">
        <input type="text" class="todo-input__field" placeholder="Что нужно сделать?" required>
        <button type="submit" class="todo-input__button">
          Add
        </button>
      </form>
    </div>
  `,"todo-list":`
    <div class="todo-list">
      <div class="todo-list__container">
        <div class="todo-list__empty">
          📝 Список задач пуст. Добавьте первую задачу!
        </div>
      </div>
    </div>
  `};class g{constructor(){console.log("🔄 SimpleComponentLoader создан"),this.loadedComponents=new Set}init(){console.log("🚀 Начинаю загрузку компонентов..."),this.loadAllComponents(),this.setupObserver(),console.log("✅ Все компоненты загружены")}loadAllComponents(){const o=document.querySelectorAll("[data-component]:not([data-loaded])");console.log(`📊 Найдено компонентов для загрузки: ${o.length}`),o.forEach(t=>{const e=t.getAttribute("data-component");this.loadComponent(t,e)})}loadComponent(o,t){console.log(`📥 Загружаю компонент: ${t}`),a[t]?(o.innerHTML=a[t],o.setAttribute("data-loaded","true"),this.loadedComponents.add(t),console.log(`✅ ${t} загружен`),this.loadAllComponents()):(console.error(`❌ Компонент "${t}" не найден в components.js`),o.innerHTML=`
        <div style="padding: 1rem; background: #fee; border: 2px dashed #e74c3c;">
          <strong>Ошибка компонента:</strong> ${t}<br>
          Компонент не найден в components.js
        </div>
      `)}setupObserver(){new MutationObserver(t=>{let e=!1;t.forEach(s=>{s.addedNodes.length&&s.addedNodes.forEach(l=>{l.nodeType===1&&l.querySelectorAll&&l.querySelectorAll("[data-component]").length>0&&(e=!0)})}),e&&(console.log("🔍 Обнаружены новые компоненты, загружаю..."),this.loadAllComponents())}).observe(document.body,{childList:!0,subtree:!0})}}document.addEventListener("DOMContentLoaded",()=>{new g().init()});class p{constructor(){this.spriteUrl="/sprite.svg",this.init()}async init(){try{console.log("🔄 Loading SVG sprite...");const o=await fetch(this.spriteUrl);if(!o.ok)throw new Error("Sprite not found");const t=await o.text();this.injectSprite(t),this.replaceIcons(),console.log("✅ SVG sprite loaded successfully")}catch(o){console.warn("⚠️ SVG sprite not found:",o.message),console.log("💡 Run: npm run build-sprite")}}injectSprite(o){const t=document.createElement("div");t.innerHTML=o,t.style.display="none",t.setAttribute("aria-hidden","true"),t.id="svg-sprite-container",document.body.appendChild(t)}replaceIcons(){const o=document.querySelectorAll("[data-icon]");console.log(`🔍 Found ${o.length} icon placeholders`),o.forEach(t=>{const e=t.getAttribute("data-icon"),s=t.getAttribute("data-size")||"24",l=t.getAttribute("data-color")||"currentColor",i=t.getAttribute("class")||"",c=document.createElementNS("http://www.w3.org/2000/svg","svg");c.setAttribute("class",`icon icon-${e} ${i}`),c.setAttribute("width",s),c.setAttribute("height",s),c.setAttribute("fill",l);const u=document.createElementNS("http://www.w3.org/2000/svg","use");u.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",`#icon-${e}`),c.appendChild(u),t.parentNode.replaceChild(c,t),console.log(`✅ Replaced: ${e}`)})}}document.addEventListener("DOMContentLoaded",()=>{new p});class h{constructor(){this.todos=[],this.nextId=1,this.currentFilter="all"}addTodo(o){if(!o||o.trim()==="")return null;const t={id:this.nextId++,text:o.trim(),completed:!1};return this.todos.push(t),this.saveToLocalStorage(),t}removeTodo(o){const t=this.todos.findIndex(e=>e.id===o);return t!==-1?(this.todos.splice(t,1),this.saveToLocalStorage(),!0):!1}getAllTodos(){return[...this.todos]}hasTodos(){return this.todos.length>0}getTotalCount(){return this.todos.length}getCompletedCount(){return this.todos.filter(o=>o.completed).length}getActiveCount(){return this.todos.filter(o=>!o.completed).length}getCounters(){return{total:this.getTotalCount(),completed:this.getCompletedCount(),active:this.getActiveCount()}}getFilteredTodos(){switch(this.currentFilter){case"active":return this.todos.filter(o=>!o.completed);case"completed":return this.todos.filter(o=>o.completed);case"all":default:return[...this.todos]}}toggleTodo(o){console.log("🔄 Переключаю статус задачи с id:",o);const t=this.todos.find(e=>e.id===o);return t?(t.completed=!t.completed,this.saveToLocalStorage(),console.log("✅ Статус изменён:",t.completed),!0):(console.log("❌ Задача не найдена"),!1)}saveToLocalStorage(){try{const o=JSON.stringify(this.todos);localStorage.setItem("todoApp_todos",o),localStorage.setItem("todoApp_filter",this.currentFilter),console.log("💾 Сохранены задачи и фильтр:",this.currentFilter)}catch(o){console.error("❌ Ошибка сохранения в localStorage:",o)}}loadFromLocalStorage(){try{const o=localStorage.getItem("todoApp_todos");if(constructor,o){this.todos=JSON.parse(o),this.todos.length>0&&(this.nextId=Math.max(...this.todos.map(e=>e.id))+1);const t=localStorage.getItem("todoApp_filter");return t&&(this.currentFilter=t),console.log("📂 Загружены задачи и фильтр:",this.currentFilter),!0}}catch(o){console.error("❌ Ошибка загрузки из localStorage:",o)}return!1}getFilteredTodos(){switch(this.currentFilter){case"active":return this.todos.filter(o=>!o.completed);case"complited":return this.todos.filter(o=>o.completed);case"all":default:return[...this.todos]}}setFilter(o){return["all","active","completed"].includes(o)?(this.currentFilter=o,this.saveToLocalStorage(),!0):!1}getCurrentFilter(){return this.currentFilter}}const n=new h;class m{constructor(){console.log("👁️ Представление создано"),this.todoListContainer=null,this.onDeleteCallback=null,this.onToggleCallback=null}setOnDeleteCallback(o){this.onDeleteCallback=o,console.log("✅ Колбэк для удаления установлен")}setOnToggleCallback(o){this.onToggleCallback=o,console.log("✅ Колбэк для переключения статуса установлен")}findContainer(){return this.todoListContainer||(console.log("🔍 Ищу контейнер для списка задач..."),this.todoListContainer=document.querySelector(".todo-list__container"),this.todoListContainer?console.log("✅ Контейнер найден:",this.todoListContainer):console.error("❌ Контейнер .todo-list__container не найден!")),this.todoListContainer}createTodoItem(o){const t=document.createElement("div");t.className="todo-item",t.dataset.id=o.id;const e=o.completed?"todo-item--completed":"";return t.innerHTML=`
    <div class="todo-item__checkbox">
      <input 
        type="checkbox" 
        class="todo-item__checkbox-input" 
        ${o.completed?"checked":""}
        data-action="toggle"
      >
    </div>
    <div class="todo-item__content ${e}">
      <span class="todo-item__text">${this.escapeHtml(o.text)}</span>
    </div>
    <button class="todo-item__delete" data-action="delete">🗑️</button>
  `,t}escapeHtml(o){const t=document.createElement("div");return t.textContent=o,t.innerHTML}renderTodos(o){console.log("🎨 Отрисовываю задачи:",o);const t=this.findContainer();if(!t){console.error("❌ Не могу отрисовать задачи: контейнер не найден");return}if(t.innerHTML="",o.length===0){const e=document.createElement("div");e.className="todo-list__empty",e.textContent="📝 Список задач пуст. Добавьте первую задачу!",t.appendChild(e);return}o.forEach(e=>{const s=this.createTodoItem(e);t.appendChild(s)}),console.log("✅ Задачи отрисованы"),this.addEventHandlers()}addDeleteHandlers(){document.querySelectorAll(".todo-item__delete").forEach(t=>{t.addEventListener("click",e=>{e.stopPropagation();const s=t.closest(".todo-item"),l=parseInt(s.dataset.id);console.log("🗑️ Пытаюсь удалить задачу с id:",l),this.onDeleteCallback?this.onDeleteCallback(l):(console.warn("⚠️ Нет колбэка для удаления"),s.remove()),console.log("✅ Задача удалена со страницы (временно)")})})}updateCounters(o){console.log("📊 Обновляю счётчики:",o);const t=document.querySelector('[data-counter="total"] .todo-counter__value'),e=document.querySelector('[data-counter="completed"] .todo-counter__value'),s=document.querySelector('[data-counter="active"] .todo-counter__value');t&&e&&s?(t.textContent=o.total,e.textContent=o.completed,s.textContent=o.active,console.log("✅ Счётчики обновлены")):console.warn("⚠️ Элементы счётчиков не найдены")}addEventHandlers(){this.addDeleteHandlers(),this.addToggleHandlers()}addToggleHandlers(){document.querySelectorAll(".todo-item__checkbox-input").forEach(t=>{t.addEventListener("change",e=>{e.stopPropagation();const s=t.closest(".todo-item"),l=parseInt(s.dataset.id);console.log("☑️ Изменён чекбокс у задачи с id:",l),console.log("📊 Новое значение:",t.checked),this.onToggleCallback?this.onToggleCallback(l):console.warn("⚠️ Нет колбэка для переключения статуса")})})}}const d=new m;class f{constructor(){console.log("✅ Контроллер создан"),this.todoForm=null,this.todoInput=null,this.addButton=null,console.log("📊 Модель и представление подключены")}init(){console.log("✅ Контроллер запускается"),console.log("📂 Пытаюсь загрузить задачи из localStorage...");const o=n.loadFromLocalStorage();this.hasLoadedTasks=o,console.log(o?"✅ Задачи загружены из localStorage":"📝 localStorage пуст, начинаем с чистого листа"),this.findElements(),this.todoForm?this.setupEventListeners():(console.log("⏳ Подождите, ищем элементы..."),this.waitForComponents())}waitForComponents(){const o=setInterval(()=>{console.log("🔍 Проверяю наличие элементов..."),this.findElements(),this.todoForm&&(console.log("🎉 Элементы найдены!"),clearInterval(o),this.setupEventListeners())},100)}findElements(){console.log("🔍 Ищу элементы на странице..."),this.todoForm=document.querySelector(".todo-input__form"),this.todoInput=document.querySelector(".todo-input__field"),this.addButton=document.querySelector(".todo-input__button"),this.todoForm&&console.log("✅ Форма найдена:",this.todoForm)}setupEventListeners(){if(console.log("🎧 Настраиваю обработчики событий..."),!this.todoForm||!this.todoInput||!this.addButton){console.error("❌ Не все элементы найдены!");return}console.log("✅ Все элементы готовы к работе"),d.setOnDeleteCallback(this.handleDeleteTodo.bind(this)),d.setOnToggleCallback(this.handleToggleTodo.bind(this)),this.hasLoadedTasks&&(console.log("🎨 Отрисовываю загруженные из localStorage задачи..."),this.updateUI()),this.todoForm.addEventListener("submit",o=>{console.log("🎯 Событие submit сработало!"),o.preventDefault();const t=this.todoInput.value;if(console.log("📝 Текст из поля ввода:",t),t.trim()===""){console.log("⚠️ Пустая задача, не добавляем");return}console.log("💾 Добавляю задачу в модель...");const e=n.addTodo(t);if(e){console.log("✅ Задача добавлена в модель:",e);const s=n.getAllTodos();console.log("📋 Все задачи в модели:",s),this.updateUI()}else console.log("❌ Не удалось добавить задачу в модель");this.todoInput.value="",console.log("🧹 Поле ввода очищено"),this.todoInput.focus(),console.log("✅ Задача должна быть добавлена:",t)}),console.log("✅ Обработчик события submit добавлен")}handleDeleteTodo(o){if(console.log("🎯 Обрабатываю удаление задачи с id:",o),n.removeTodo(o)){console.log("✅ Задача удалена из модели");const e=n.getAllTodos();console.log("📋 Обновленный список задач:",e),this.updateUI()}else console.error("❌ Не удалось удалить задачу из модели")}updateUI(){console.log("🔄 Обновляю весь интерфейс...");const o=n.getAllTodos();console.log("📋 Задачи для отрисовки:",o);const t=n.getCounters();console.log("📊 Данные счётчиков:",t),d.renderTodos(o),d.updateCounters(t),console.log("✅ Интерфейс обновлён")}handleToggleTodo(o){if(console.log("🎯 Обрабатываю переключение статуса задачи с id:",o),n.toggleTodo(o)){console.log("✅ Статус задачи переключен");const e=n.getAllTodos();console.log("📋 Все задачи в модели:",e),this.updateUI()}else console.error("❌ Не удалось переключить статус задачи")}}const v=new f;console.log("🎯 Starting Components Collection...");console.log("✅ SCSS styles imported");console.log("✅ Components loader imported");console.log("✅ SVG loader imported");console.log("🚀 All modules loaded - waiting for components...");console.log("✅ Todo Controller импортирован");v.init();console.log("📦 Доступные компоненты:",Object.keys(a));
