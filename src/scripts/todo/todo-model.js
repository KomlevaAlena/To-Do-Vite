// Модель данных для Todo листа
class TodoModel {
  constructor() {// Конструктор класса - выполняется при создании нового объекта
    this.todos = []; // Массив задач Создаем пустой массив для хранения задач
    this.nextId = 1; // Счётчик для ID Уникальный идентификатор для каждой новой задачи Каждая задача получит id: 1, 2, 3, ...
    this.currentFilter = 'all'; // 'all', 'active', 'completed' ← добавляем состояние фильтра
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
  // Получить отфильтрованные задачи
  getFilteredTodos() {
    console.log('🎯 getFilteredTodos вызван');
    console.log('🎯 Текущий фильтр:', this.currentFilter);
    console.log('🎯 Всего задач:', this.todos.length);
    console.log('=== getFilteredTodos DEBUG ===');
    console.log('1. currentFilter:', this.currentFilter);
    console.log('2. все задачи:', this.todos);
    console.log('3. выполненные задачи:', this.todos.filter(t => t.completed));
    console.log('4. активные задачи:', this.todos.filter(t => !t.completed));
    let result;

    switch (this.currentFilter) {
      case 'active':
      console.log('🔵 Фильтр ACTIVE');
      result = this.todos.filter(todo => !todo.completed);
      break;
      case 'completed':
        console.log('🟢 Фильтр COMPLETED');
        console.log('🟢 Выполненные задачи (должны быть в результате):', 
                    this.todos.filter(todo => todo.completed));
        result = this.todos.filter(todo => todo.completed);
        break;
      case 'all':
      default:
        console.log('🟡 Фильтр ALL');
        result = [...this.todos];
        break;
    }

    console.log('5. Результат фильтрации:', result);
    console.log('6. Количество в результате:', result.length);
    console.log('=============================');
    return result;
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
      localStorage.setItem('todoApp_todos', JSON.stringify(this.todos));
      // Сохраняем фильтр
      localStorage.setItem('todoApp_filter', this.currentFilter);
      console.log('💾 Сохранены задачи и фильтр:', this.currentFilter);
    } catch (error) {
      console.error('❌ Ошибка сохранения:', error);
    }
  }
  // Загрузить задачи из localStorage
  loadFromLocalStorage() {
    try {
      // Загружаем задачи
      const todosData = localStorage.getItem('todoApp_todos');
      if (todosData) {
        this.todos = JSON.parse(todosData);
        
        if (this.todos.length > 0) {
          this.nextId = Math.max(...this.todos.map(todo => todo.id)) + 1;
        }
      }
      
      // Загружаем фильтр (если есть)
      const filterData = localStorage.getItem('todoApp_filter');
      if (filterData && ['all', 'active', 'completed'].includes(filterData)) {
        this.currentFilter = filterData;
      }
      
      console.log('📂 Загружены задачи и фильтр:', this.currentFilter);
      return true;
    } catch (error) {
      console.error('❌ Ошибка загрузки:', error);
    }
    return false;
  }

  // Получить отфильтрованные задачи
  // getFilteredTodos() {
  //   switch (this.currentFilter) {
  //     case 'active':
  //       return this.todos.filter(todo => !todo.completed);
  //     case 'complited':
  //       return this.todos.filter(todo => todo.completed);
  //     case 'all':
  //       default:
  //       return [...this.todos];// возвращаем копию
  //   }
  // }

  setFilter(filter) {
    console.log('🔥 setFilter вызван с:', filter);
    console.log('🔥 Текущий фильтр до:', this.currentFilter);

    // Проверяем что фильтр валидный
    const validFilters = ['all', 'active', 'completed'];
    if (validFilters.includes(filter)) {
      this.currentFilter = filter;
      this.saveToLocalStorage(); // сохраняем выбор фильтра
      console.log('🎯 Фильтр установлен:', filter);

      console.log('🔥 Новый текущий фильтр:', this.currentFilter);
      console.log('🔥 Все задачи:', this.todos);
      console.log('🔥 Выполненные задачи:', this.todos.filter(t => t.completed));

      return true;
    }
    console.log('🔥 Ошибка: неверный фильтр');
    console.warn('⚠️ Неизвестный фильтр:', filter);
    return false;
  }

    // Получить текущий фильтр
  getCurrentFilter() {
    return this.currentFilter;
  }

  clearCompleted() {
    console.log('🧹 Удаляю выполненные задачи...');
    // Сохраняем старый размер для отладки
    const oldLength = this.todos.length;
    // Фильтруем: оставляем только НЕ выполненные задачи
    const activeTodos = this.todos.filter(todo => !todo.completed);
    // Заменяем массив
    this.todos = activeTodos;
    // Считаем сколько удалили
    const removedCount = oldLength - this.todos.length;
    // Сохраняем в localStorage
    this.saveToLocalStorage();
    console.log(`✅ Удалено ${removedCount} выполненных задач`);
    console.log(`📋 Осталось ${this.todos.length} активных задач`);
    
    return removedCount; // Возвращаем сколько удалили
  }
  // Копировать задачу по ID
  copyTodo(id) {
    console.log('📋 Копирую задачу с id:', id);
    // Находим задачу
    const originalTodo = this.todos.find(todo => todo.id === id);
    if (!originalTodo) {
      console.log('❌ Задача не найдена');
      return null;
    }
    // Создаём копию с новым ID
    const copiedTodo = {
      id: this.nextId++,
      text: originalTodo.text + ' (копия)',
      completed: false // Копия всегда не выполнена
    };
    // Добавляем в массив
    this.todos.push(copiedTodo);
    //Save
    this.saveToLocalStorage();
    console.log('✅ Задача скопирована:', copiedTodo);
    return copiedTodo;
  }

}

// if (typeof window !== 'undefined') {
//   window.todoModel = todoModel;
//   console.log('🔧 todoModel добавлена в window для отладки');
// }
// Экспортируем экземпляр модели (синглтон) Создаем один экземпляр (объект) модели "синглтон" - только один экземпляр на всё приложение
export const todoModel = new TodoModel();
// Временная отладка - ПОСЛЕ export!
if (typeof window !== 'undefined') {
  window.todoModel = todoModel;
  console.log('🔧 todoModel добавлена в window для отладки');
}
