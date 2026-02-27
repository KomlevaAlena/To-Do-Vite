import { todoModel } from './todo-model.js';
import { todoView } from './todo-view.js';
class TodoController {
    constructor() {
        console.log('✅ Контроллер создан');
        // Это специальный метод, который запускается автоматически
    // при создании нового экземпляра класса

    this.todoForm = null;
    this.todoInput = null;
    this.addButton = null;

    this.currentTheme = localStorage.getItem('todoApp_theme') || 'light';

    this.setupKeyboardShortcuts();

    // Временно для отладки
    window.todoController = this;
    window.todoModel = todoModel;
    window.todoView = todoView;

    console.log('📊 Модель и представление подключены');
    }

    init() {
        console.log('✅ Контроллер запускается');
        
        // Загружаем задачи из localStorage
        console.log('📂 Пытаюсь загрузить задачи из localStorage...');
        const hasLoaded = todoModel.loadFromLocalStorage();
        
        this.hasLoadedTasks = hasLoaded;
        
        if (hasLoaded) {
            console.log('✅ Задачи загружены из localStorage');
            // НЕ вызываем updateUI() здесь - вызовем в setupEventListeners()
        } else {
            console.log('📝 localStorage пуст, начинаем с чистого листа');
        }
        
        // Ищем элементы
        this.findElements();
        
        if (!this.todoForm) {
            console.log('⏳ Подождите, ищем элементы...');
            this.waitForComponents();
        } else {
            this.setupEventListeners();
        }
    }

    waitForComponents() {
        const checkInterval = setInterval(() => {
            console.log('🔍 Проверяю наличие элементов...');
            this.findElements();

            if (this.todoForm) {
                console.log('🎉 Элементы найдены!');
                clearInterval(checkInterval);// Останавливаем проверку
                this.setupEventListeners();// Настраиваем обработчики
            }
        }, 100);
    }

    // Метод для поиска элементов
    findElements() {
       console.log('🔍 Ищу элементы на странице...');
       // Находим форму по классу
       this.todoForm = document.querySelector('.todo-input__form');
       // Находим поле ввода по классу
       this.todoInput = document.querySelector('.todo-input__field');
       // Находим кнопку по классу
       this.addButton = document.querySelector('.todo-input__button');

       if (this.todoForm) {
        console.log('✅ Форма найдена:', this.todoForm);
       }
    }

    // Метод для настройки обработчиков событий
    setupEventListeners() {
        console.log('🎧 Настраиваю обработчики событий...');

        if (!this.todoForm || !this.todoInput || !this.addButton) {
            console.error('❌ Не все элементы найдены!');
            return;
        }
        console.log('✅ Все элементы готовы к работе');
        // Устанавливаем колбэк для удаления в представлении
        todoView.setOnDeleteCallback(this.handleDeleteTodo.bind(this));// bind создаёт новую функцию, где this всегда = текущий объект
        todoView.setOnToggleCallback(this.handleToggleTodo.bind(this));// В методе setupEventListeners() добавляем установку колбэка:
        // todoView.setOnFilterCallback(this.handleFilterChange.bind(this)); // ← новое! добавляем установку колбэка
        todoView.setOnCopyCallback(this.handleCopyTodo.bind(this));// Устанавливаем колбэк для копирования
        todoView.setOnEditCallback(this.handlerEditTodo.bind(this));// Устанавливаем колбэк для редактирования
        todoView.setOnDragDropCallback(this.handleDragDrop.bind(this));// Устанавливаем колбэк для drag & drop

        this.setupThemeToggle();

        // ДОБАВЛЯЕМ ОБРАБОТЧИКИ КНОПОК ФИЛЬТРОВ (ТОЛЬКО ОДИН РАЗ)
        this.setupFilterHandlersOnce();
        // ДОБАВЛЯЕМ ОБРАБОТЧИК КНОПКИ "ОЧИСТИТЬ ВЫПОЛНЕННЫЕ"
        this.setupClearButtonHandler();
        // ЕСЛИ БЫЛИ ЗАГРУЖЕНЫ ЗАДАЧИ - отрисовываем их сейчас


        if (this.hasLoadedTasks) {
            console.log('🎨 Отрисовываю загруженные из localStorage задачи...');
            this.updateUI();
        }
        // ШАГ 1: Добавляем обработчик события submit на форму
        this.todoForm.addEventListener('submit', (event) => {
            // Это стандартная функция обработчик события
            console.log('🎯 Событие submit сработало!');
            // Предотвращаем стандартное поведение формы
            // (перезагрузку страницы и отправку на сервер)
            event.preventDefault();
            // ШАГ 2: Получаем текст из поля ввода
            const todoText = this.todoInput.value;
            console.log('📝 Текст из поля ввода:', todoText);
            // ШАГ 3: Проверяем, не пустой ли текст
            // .trim() удаляет пробелы в начале и конце
            if (todoText.trim() === '') {
                console.log('⚠️ Пустая задача, не добавляем');
                return; //выходим из задачи
            }
            // ШАГ 4: Добавляем задачу в модель данных
            console.log('💾 Добавляю задачу в модель...');
            const newTodo = todoModel.addTodo(todoText);

            if (newTodo) {
                console.log('✅ Задача добавлена в модель:', newTodo);
                // ПОЛУЧАЕМ ВСЕ ЗАДАЧИ ИЗ МОДЕЛИ
                const allTodos = todoModel.getAllTodos();
                console.log('📋 Все задачи в модели:', allTodos);
                // ПЕРЕДАЕМ ЗАДАЧИ В ПРЕДСТАВЛЕНИЕ ДЛЯ ОТОБРАЖЕНИЯ
                this.updateUI(); // ← ВЫЗЫВАЕМ updateUI() ВМЕСТО renderTodos()
            } else {
                console.log('❌ Не удалось добавить задачу в модель');
            }
            // ШАГ 5: Очищаем поле ввода
            this.todoInput.value = '';
            console.log('🧹 Поле ввода очищено');
            // ШАГ 6: Фокус возвращаем в поле ввода (удобно для пользователя)
            this.todoInput.focus();
            // Пока просто выводим в консоль
            console.log('✅ Задача должна быть добавлена:', todoText);
        });
        console.log('✅ Обработчик события submit добавлен');
    }
    // Метод для обработки удаления задачи
    handleDeleteTodo(todoId) {
        console.log('🎯 Обрабатываю удаление задачи с id:', todoId);
        // Удаляем задачу из модели
        const isDeleted = todoModel.removeTodo(todoId);

        if (isDeleted) {
            console.log('✅ Задача удалена из модели');
            // Получаем обновленный список задач
            const allTodos = todoModel.getAllTodos();
            console.log('📋 Обновленный список задач:', allTodos);
            // Перерисовываем список
            this.updateUI(); // ← ВЫЗЫВАЕМ updateUI()
        } else {
            console.error('❌ Не удалось удалить задачу из модели');
        }
    }

    updateUI() {
        console.log('🔄 Обновляю весь интерфейс...');
        
        // 1. Получаем ОТФИЛЬТРОВАННЫЕ задачи
        const filteredTodos = todoModel.getFilteredTodos();
        console.log('📋 Отфильтрованные задачи для отрисовки:', filteredTodos);
        
        // 2. Получаем данные счётчиков (ВСЕХ задач, а не отфильтрованных)
        const counters = todoModel.getCounters();
        console.log('📊 Данные счётчиков (все задачи):', counters);
        
        // 3. Отрисовываем ОТФИЛЬТРОВАННЫЕ задачи
        todoView.renderTodos(filteredTodos);
        
        // 4. Обновляем счётчики (показываем ВСЕ задачи)
        todoView.updateCounters(counters);

        // 4.5. Обновляем состояние ВСЕХ кнопок
        todoView.updateButtonsState(counters);
        
        // 5. Обновляем активную кнопку фильтра
        const currentFilter = todoModel.getCurrentFilter();
        todoView.updateActiveFilter(currentFilter);
        
        console.log('✅ Интерфейс обновлён');
    }

    handleToggleTodo(todoId) {
        console.log('🎯 Обрабатываю переключение статуса задачи с id:', todoId);
        // Переключаем статус в модели
        const isToggled = todoModel.toggleTodo(todoId);

        if (isToggled) {
            console.log('✅ Статус задачи переключен');
            // Получаем обновленный список задач
            const allTodos = todoModel.getAllTodos();
            console.log('📋 Все задачи в модели:', allTodos);
            // Перерисовываем список
            this.updateUI(); // ← ВЫЗЫВАЕМ updateUI()
        } else {
            console.error('❌ Не удалось переключить статус задачи');
        }
    }

    // Метод для обработки изменения фильтра
    handleFilterChange(filter) {
        console.log('🎯🎯🎯 ВЫЗВАН handleFilterChange с фильтром:', filter);
        console.log('🎯 Обрабатываю изменение фильтра на:', filter);
        
        // Устанавливаем фильтр в модели
        const isFilterSet = todoModel.setFilter(filter);
        
        if (isFilterSet) {
            console.log('✅ Фильтр установлен в модели');
            
            // Обновляем активную кнопку в представлении
            // todoView.updateActiveFilter(filter);
            
            // Обновляем отображение задач
            this.updateUI();// ← ЭТА СТРОКА ВЫЗОВЕТ updateActiveFilter() САМА
        } else {
            console.error('❌ Не удалось установить фильтр');
        }
    }

    setupFilterHandlersOnce() {
        console.log('🎯 Настраиваю обработчики кнопок фильтров (один раз)');
        // Находим все кнопки фильтров
        const filterButtons = document.querySelectorAll('.todo-filter');
        // Для каждой кнопки добавляем обработчик
        filterButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();// Отменяем стандартное поведение

                // Проверяем, не отключена ли кнопка
                if (button.disabled || button.classList.contains('todo-filter--disabled')) {
                    console.log('⏸️ Кнопка отключена, игнорируем клик');
                    return;
                }

                const filter = button.dataset.filter;// Берем тип фильтра из data-filter
                console.log('🔘 Нажата кнопка фильтра:', filter);
                // Вызываем обработчик фильтрации
                this.handleFilterChange(filter);
            });
        });
        console.log('✅ Обработчики фильтров добавлены (один раз)');
    }

    setupClearButtonHandler() {
        const clearButton = document.querySelector('.todo-clear');
        if (clearButton) {
            clearButton.addEventListener('click', (event) => {
                event.preventDefault();// Отменяем стандартное поведение
                console.log('🧹 Нажата кнопка "Очистить выполненные"');
                this.handleClearCompleted();
            });
            console.log('✅ Обработчик кнопки "Очистить выполненные" добавлен');
        } else {
            console.warn('⚠️ Кнопка "Очистить выполненные" не найдена');
        }
    }

    handleClearCompleted() { // Метод для очистки выполненных задач
        console.log('🎯 Обрабатываю очистку выполненных задач');
        // Вызываем метод модели
        const removedCount = todoModel.clearCompleted();
        if (removedCount > 0) {
            console.log(`✅ Удалено ${removedCount} выполненных задач`);
            // Если сейчас выбран фильтр "completed" - переключаем на "all"
            const currentFilter = todoModel.getCurrentFilter();
            if (currentFilter === 'completed') {
                console.log('🔄 Фильтр "completed" пуст, переключаю на "all"');
                todoModel.setFilter('all');
            }
            // Обновляем интерфейс
            this.updateUI();
        } else {
            console.log('📝 Нет выполненных задач для удаления');
            // Можно показать сообщение пользователю
        }
    }
    // Метод для обработки копирования задачи
    handleCopyTodo(todoId) {
        console.log('🎯 Обрабатываю копирование задачи с id:', todoId);
        const copiedTodo = todoModel.copyTodo(todoId);
        if (copiedTodo) {
            console.log('✅ Задача скопирована:', copiedTodo);
            this.updateUI();
        }
    }
    // Метод для обработки редактирования задачи
    handlerEditTodo(todoId, newText) {
        console.log('🎯 Обрабатываю редактирование задачи с id:', todoId, 'новый текст:', newText);

        const isEdited = todoModel.edinTodo(todoId, newText);
        if (isEdited) {
            console.log('✅ Задача отредактирована');
            this.updateUI();// Обновляем интерфейс
        } else {
            console.error('❌ Не удалось отредактировать задачу');
        }
    }
    // Метод для обработки перетаскивания
    handleDragDrop(draggedId, targetId) {
        console.log('🎯 Обрабатываю перетаскивание задачи', draggedId, '→', targetId);
        // Вызываем метод модели
        const isMoved = todoModel.moveTodo(draggedId, targetId);
        if(isMoved) {
            console.log('✅ Порядок изменён, обновляю интерфейс');
            this.updateUI(); // Перерисовываем задачи в новом порядке
        }
    }
    setupThemeToggle() {
    const themeButton = document.querySelector('.theme-toggle');
    if (!themeButton) return;
    // Удаляем старый обработчик, если есть
    const oldButton = themeButton;
    const newButton = oldButton.cloneNode(true); // клонируем кнопку
    oldButton.parentNode.replaceChild(newButton, oldButton); // заменяем
    // Устанавливаем начальное состояние
    if (this.currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        newButton.textContent = '☀️ Светлая тема';
    } else {
        newButton.textContent = '🌙 Темная тема';
    }
    // Вешаем новый обработчик
    newButton.addEventListener('click', () => {
        this.toggleTeme();
    });
}

    toggleTeme() {
        // Переключаем тему
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        // Устанавливаем атрибут на html
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        // Меняем текст кнопки
        const themeButton = document.querySelector('.theme-toggle');
        if (themeButton) {
            themeButton.textContent = this.currentTheme === 'light'
                ? '🌙 Темная тема'
                : '☀️ Светлая тема';
        }
        // Сохраняем в localStorage
        localStorage.setItem('todoApp_theme', this.currentTheme);
        console.log('🎨 Тема переключена на:', this.currentTheme);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') { // Игнорируем, если пользователь печатает в поле ввода
                return;
            }
            console.log('⌨️ Нажата клавиша:', event.key);

            switch(event.key) {
                case '1':
                    console.log('📋 Горячая клавиша: Все задачи');
                    this.handleFilterChange('all');
                    break;
                case '2':
                    console.log('⏳ Горячая клавиша: Активные');
                    this.handleFilterChange('active');
                    break;
                case '3':
                    console.log('✅ Горячая клавиша: Выполненные');
                    this.handleFilterChange('completed');
                    break;
                case '?':
                case '/':
                    event.preventDefault();
                    this.showKeyboardHelp();
                    break;
                case 'Escape':
                    console.log('🔚 Escape нажат');// Escape уже обрабатывается в редактировании
                    break;
                default:// Ничего не делаем
                break;
            }
        });
        console.log('⌨️ Клавиатурные сокращения настроены');
    }
    // Показать справку
    showKeyboardHelp() {
        const helpMessage = `
            ⌨️ Клавиатурные сокращения:
            
            1 - Показать все задачи
            2 - Показать активные задачи
            3 - Показать выполненные задачи
            Esc - Отменить редактирование
            ? - Показать эту справку
        `;
        
        alert(helpMessage); // Можно заменить на красивое модальное окно
    }
    
}

const todoController = new TodoController(); // Создаём экземпляр (объект) нашего контроллера



export { todoController }; // Экспортируем его, чтобы использовать в других файлах
