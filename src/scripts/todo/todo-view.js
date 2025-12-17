// Представление (View) для Todo листа
class TodoView {
  constructor() {
    console.log('👁️ Представление создано');
    
    // НЕ ищем элемент сразу - он может быть ещё не загружен
    this.todoListContainer = null;
    // Колбэк для удаления
    this.onDeleteCallback = null;
  }
  // Установить колбэк для удаления
  setOnDeleteCallback(callback) {
    this.onDeleteCallback = callback;
    console.log('✅ Колбэк для удаления установлен');
  }

  // Найти контейнер для списка (вызываем когда точно нужен)
  findContainer() {
    if (!this.todoListContainer) {
      console.log('🔍 Ищу контейнер для списка задач...');
      this.todoListContainer = document.querySelector('.todo-list__container');
      
      if (this.todoListContainer) {
        console.log('✅ Контейнер найден:', this.todoListContainer);
      } else {
        console.error('❌ Контейнер .todo-list__container не найден!');
      }
    }
    return this.todoListContainer;
  }

  // Создать HTML для одной задачи
  createTodoItem(todo) {
    // Создаем div для задачи
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';
    todoItem.dataset.id = todo.id; // Сохраняем id в data-атрибут
    
    // Заполняем HTML
    todoItem.innerHTML = `
      <div class="todo-item__content">
        <span class="todo-item__text">${this.escapeHtml(todo.text)}</span>
      </div>
      <button class="todo-item__delete" data-action="delete">🗑️</button>
    `;
    
    return todoItem;
  }

  // Защита от XSS - экранирование HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text; // textContent не интерпретирует HTML
    return div.innerHTML;   // innerHTML вернет экранированный текст
  }

  // Показать все задачи
  renderTodos(todos) {
    console.log('🎨 Отрисовываю задачи:', todos);
    
    // Находим контейнер (если ещё не нашли)
    const container = this.findContainer();
    
    // Если контейнер не найден - выходим
    if (!container) {
      console.error('❌ Не могу отрисовать задачи: контейнер не найден');
      return;
    }
    
    // Очищаем контейнер
    container.innerHTML = '';

    // Если задач нет - показываем сообщение
    if (todos.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'todo-list__empty';
      emptyMessage.textContent = '📝 Список задач пуст. Добавьте первую задачу!';
      container.appendChild(emptyMessage);
      return;
    }

    // Для каждой задачи создаём элемент и добавляем в контейнер
    todos.forEach(todo => {
      const todoElement = this.createTodoItem(todo);
      container.appendChild(todoElement);
    });
    
    console.log('✅ Задачи отрисованы');
    // ШАГ: Добавляем обработчики на кнопки удаления
    this.addDeleteHandlers();
  }
  // Добавить обработчики удаления
  addDeleteHandlers() {
    // Находим все кнопки удаления
    const deleteButtons = document.querySelectorAll('.todo-item__delete');
    // Для каждой кнопки добавляем обработчик
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Предотвращаем всплытие события
            event.stopPropagation();
            // Находим родительский элемент (саму задачу)
            const todoItem = button.closest('.todo-item');
            // Получаем id задачи из data-атрибута
            const todoId = parseInt(todoItem.dataset.id);

            console.log('🗑️ Пытаюсь удалить задачу с id:', todoId);
            // Если есть колбэк - вызываем его
            if (this.onDeleteCallback) {
                this.onDeleteCallback(todoId);
            } else {
                console.warn('⚠️ Нет колбэка для удаления');
                todoItem.remove();
            }
            // Здесь будем вызывать метод удаления из контроллера
            // Пока просто удаляем элемент со страницы (временно)
            
            console.log('✅ Задача удалена со страницы (временно)');
        });
    });
  }
}

// Создаем и экспортируем экземпляр представления
export const todoView = new TodoView();
