// Модель данных для Todo листа
class TodoModel {
  constructor() {// Конструктор класса - выполняется при создании нового объекта
    this.todos = []; // Массив задач Создаем пустой массив для хранения задач
    this.nextId = 1; // Счётчик для ID Уникальный идентификатор для каждой новой задачи Каждая задача получит id: 1, 2, 3, ...
    this.currentFilter = 'all';// 'all', 'active', 'completed'
  }

  // Добавить задачу
  addTodo(text) { // Проверяем, что текст не пустой
    if (!text || text.trim() === '') {
      return null; // Пустые задачи не добавляем
      
    }

    const todo = { // Создаем объект задачи
      id: this.nextId++,// Присваиваем id и увеличиваем счетчик
      text: text.trim(), // Убираем лишние пробелы
      completed: false // По умолчанию задача не выполнена
    };

    this.todos.push(todo);// Добавляем задачу в массив
    this.saveToLocalStorage(); // ← ДОБАВЛЯЕМ СОХРАНЕНИЕ
    return todo;// Возвращаем созданную задачу
  }

  // Удалить задачу по ID Метод для удаления задачи по ID
  removeTodo(id) {
    const index = this.todos.findIndex(todo => todo.id === id); // Находим индекс задачи в массиве findIndex проходит по всем задачам и ищет ту, у которой id совпада
    if (index !== -1) { // Если задача найдена (индекс не -1)
      this.todos.splice(index, 1); // Удаляем задачу из массива splice удаляет элемент по индексу
      this.saveToLocalStorage(); // ← ДОБАВЛЯЕМ СОХРАНЕНИЕ
      return true; // Успешно удалил
    }
    return false; // Задача не найдена
  }

  // Получить все задачи Метод для получения всех задач
  getAllTodos() {
    return [...this.todos]; // Возвращаем копию  Spread оператор создает новый массив
  }

  // Проверить, есть ли задачи
  hasTodos() {
    return this.todos.length > 0; // Возвращает true если массив не пустой, false если пустой
  }

  getTotalCount() { // Получить количество всех задач
    return this.todos.length;
  }
  // Получить количество выполненных задач
  getCompletedCount() {
    // filter создает новый массив с задачами, где completed === true
    // length возвращает количество элементов
    return this.todos.filter(todo => todo.completed).length;
  }
  // Получить количество активных (не выполненных) задач
  getActiveCount() {
    // filter создает новый массив с задачами, где completed === false
    return this.todos.filter(todo => !todo.completed).length;
  }
  // Метод для получения всех данных счётчиков сразу
  getCounters() {
    return {
      total: this.getTotalCount(),
      completed: this.getCompletedCount(),
      active: this.getActiveCount()
    };
  }
  // Переключить статус выполнения задачи
  toggleTodo(id) {
    console.log('🔄 Переключаю статус задачи с id:', id);
    // Находим задачу по id
    const todo = this.todos.find(todo => todo.id === id);

    if (todo) {
      // Меняем статус на противоположный
    // Если было true → станет false, если было false → станет true
    todo.completed = !todo.completed;
    this.saveToLocalStorage(); // ← ДОБАВЛЯЕМ СОХРАНЕНИЕ
    console.log('✅ Статус изменён:', todo.completed);
    return true;
    }
    console.log('❌ Задача не найдена');
    return false;
  }

  saveToLocalStorage() {
    try {
      // JSON.stringify преобразует объект в строку JSON
      const data = JSON.stringify(this.todos);
      localStorage.setItem('todoApp_todos', data);
      // Сохраняем фильтр
      localStorage.setItem('todoApp_filter', this.currentFilter);
      console.log('💾 Задачи сохранены в localStorage');
    } catch (error) {
      console.error('❌ Ошибка сохранения в localStorage:', error);
    }
  }
  // Загрузить задачи из localStorage
  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('todoApp_todos');constructor
      if (data) {
        // JSON.parse преобразует строку JSON обратно в объект
        this.todos = JSON.parse(data);

        // Восстанавливаем nextId (максимальный id + 1)
        if (this.todos.length > 0) {
        this.nextId = Math.max(...this.todos.map(todo => todo.id)) + 1;
        }
        console.log('📂 Задачи загружены из localStorage:', this.todos);
        return true;
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки из localStorage:', error);
    }
    return false;
  }

  // Получить отфильтрованные задачи
  getFilteredTodos() {
    switch (this.currentFilter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'complited':
        return this.todos.filter(todo => todo.completed);
      case 'all':
        default:
        return [...this.todos];// возвращаем копию
    }
  }

  setFilter(filter) {
    if (['all', 'active', 'complited'].includes(filter)) {
      this.currentFilter = filter;
      this.saveToLocalStorage(); // сохраняем выбранный фильтр
      return true;
    }
    return false;
  }

    // Получить текущий фильтр
  getCurrentFilter() {
    return this.currentFilter;
  }
}

// Экспортируем экземпляр модели (синглтон) Создаем один экземпляр (объект) модели "синглтон" - только один экземпляр на всё приложение
export const todoModel = new TodoModel();
