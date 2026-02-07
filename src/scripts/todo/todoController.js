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
    console.log('📊 Модель и представление подключены');
    }

    init() {
        // Метод для инициализации (запуска) контроллера
        console.log('✅ Контроллер запускается');
        // Здесь будем настраивать всё приложение
        // Загружаем задачи из localStorage (если есть)
        console.log('📂 Пытаюсь загрузить задачи из localStorage...');
        const hasLoaded = todoModel.loadFromLocalStorage();
        // Сохраняем флаг что есть загруженные задачи
        this.hasLoadedTasks = hasLoaded;

        if (hasLoaded) {
            console.log('✅ Задачи загружены из localStorage');// Показываем загруженные задачи
            // this.updateUI();НЕ вызываем updateUI() сразу - ждём загрузки компонентов
        } else {
            console.log('📝 localStorage пуст, начинаем с чистого листа');
        }
        // Пробуем найти элементы сразу
        this.findElements();
        // Если не нашли - ждём и пробуем снова через 100мс
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
        todoView.setOnFilterCallback(this.handleFilterChange.bind(this)); // ← новое! добавляем установку колбэка
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
        console.log('🎯 Обрабатываю изменение фильтра на:', filter);
        
        // Устанавливаем фильтр в модели
        const isFilterSet = todoModel.setFilter(filter);
        
        if (isFilterSet) {
            console.log('✅ Фильтр установлен в модели');
            
            // Обновляем активную кнопку в представлении
            todoView.updateActiveFilter(filter);
            
            // Обновляем отображение задач
            this.updateUI();
        } else {
            console.error('❌ Не удалось установить фильтр');
        }
    }



}

const todoController = new TodoController(); // Создаём экземпляр (объект) нашего контроллера

export { todoController }; // Экспортируем его, чтобы использовать в других файлах
