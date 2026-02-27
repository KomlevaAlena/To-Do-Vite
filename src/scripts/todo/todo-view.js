// Представление (View) для Todo листа
class TodoView {
  constructor() {
    console.log('👁️ Представление создано');

    // НЕ ищем элемент сразу - он может быть ещё не загружен
    this.todoListContainer = null;
    this.onDeleteCallback = null; // Колбэк для удаления
    this.onToggleCallback = null; // ← новое поле для чекбоксов
    this.onFilterCallback = null; // ← новое поле для колбэка фильтрации
    this.onCopyCallback = null;
    this.onEditCallback = null;
    this.onDragDropCallback = null; // Колбэк для drag & drop
  }
  // Установить колбэк для удаления
  setOnDeleteCallback(callback) {
    this.onDeleteCallback = callback;
    console.log('✅ Колбэк для удаления установлен');
  }

  // Метод для установки колбэка
  setOnToggleCallback(callback) {
    this.onToggleCallback = callback;
    console.log('✅ Колбэк для переключения статуса установлен');
  }

  // Метод для установки колбэка фильтрации
  setOnFilterCallback(callback) {
    this.onFilterCallback = callback;
    console.log('✅ Колбэк для фильтрации установлен');
  }

  setOnCopyCallback(callback) {
    this.onCopyCallback = callback;
    console.log('✅ Колбэк для копирования установлен');
  }

  setOnEditCallback(callback) {
    this.onEditCallback = callback;
    console.log('✅ Колбэк для редактирования установлен');
  }

  setOnDragDropCallback(callback) {
    this.onDragDropCallback = callback;
    console.log('✅ Колбэк для drag & drop установлен');
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
    todoItem.draggable = true; // Разрешаем тащить эту задачу
    todoItem.dataset.id = todo.id; // Сохраняем id в data-атрибут

    // Определяем класс для выполненной задачи
    const completedClass = todo.completed ? 'todo-item--completed' : '';

    // Заполняем HTML
    todoItem.innerHTML = `
    <div class="todo-item__checkbox">
      <input 
        type="checkbox" 
        class="todo-item__checkbox-input" 
        ${todo.completed ? 'checked' : ''}
        data-action="toggle"
      >
    </div>
    <div class="todo-item__content ${completedClass}">
      <span class="todo-item__text" data-id="${todo.id}">${this.escapeHtml(todo.text)}</span>
    </div>
    <button class="todo-item__copy" data-action="copy" title="Копировать задачу">📋</button>
    <button class="todo-item__delete" data-action="delete" title="Удалить задачу">🗑️</button>
  `;

    // Добавляем обработчик двойного клика
    const textSpan = todoItem.querySelector('.todo-item__text');
    textSpan.addEventListener('dblclick', (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log('🔥🔥🔥 ДВОЙНОЙ КЛИК СРАБОТАЛ! Задача:', todo.id);
      // Вызываем метод для создания редактора
      this.createInlineEditor(textSpan, todo);
    });
    return todoItem;
  }

  addDragDropHandlers() {
    console.log('🎯 Добавляю drag & drop обработчики (УПРОЩЁННО)');

    const todoItems = document.querySelectorAll('.todo-item');
    console.log('Найдено задач:', todoItems.length);

    todoItems.forEach((item) => {
      // dragstart
      item.addEventListener('dragstart', (e) => {
        console.log('🟢 DRAGSTART', item.dataset.id);
        e.dataTransfer.setData('text/plain', item.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      // dragover - ОБЯЗАТЕЛЬНО!
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        console.log('🟡 DRAGOVER НАД', item.dataset.id);
      });

      // drop
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔥🔥🔥 DROP НА', item.dataset.id);

        const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
        const targetId = parseInt(item.dataset.id);

        console.log('Перемещаем', draggedId, '→', targetId);

        // ВЫЗЫВАЕМ КОЛБЭК!
        if (this.onDragDropCallback) {
          console.log('📞 Вызываю колбэк');
          this.onDragDropCallback(draggedId, targetId);
        }
      });
    });
  }
  // Защита от XSS - экранирование HTML

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text; // textContent не интерпретирует HTML
    return div.innerHTML; // innerHTML вернет экранированный текст
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
    todos.forEach((todo) => {
      const todoElement = this.createTodoItem(todo);
      container.appendChild(todoElement);
    });

    console.log('✅ Задачи отрисованы');
    // Добавляем обработчики событий на ВСЕ элементы
    this.addEventHandlers();
  }
  // Добавить обработчики удаления
  addDeleteHandlers() {
    // Находим все кнопки удаления
    const deleteButtons = document.querySelectorAll('.todo-item__delete');
    // Для каждой кнопки добавляем обработчик
    deleteButtons.forEach((button) => {
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
  // Создать редактор прямо в строке
  createInlineEditor(textSpan, todo) {
    // Сохраняем оригинальный текст
    const originalText = todo.text;
    // Создаём поле ввода
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.className = 'todo-item__edit-input';
    // Заменяем span на input
    const parentDiv = textSpan.parentElement;
    parentDiv.replaceChild(input, textSpan);
    input.focus(); // Ставим курсор в поле

    // Функция для очистки всех обработчиков
    const cleanup = () => {
      input.removeEventListener('blur', onBlur);
      input.removeEventListener('keypress', onKeyPress);
      input.removeEventListener('keydown', onKeyDown);
    };
    // Обработчик потери фокуса
    const onBlur = () => {
      cleanup();
      this.saveEdit(input, todo.id, parentDiv);
    };
    // Обработчик нажатия Enter
    const onKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        cleanup();
        this.saveEdit(input, todo.id, parentDiv);
      }
    };
    // Обработчик Escape
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        cleanup();
        this.cancelEdit(input, originalText, parentDiv);
      }
    };
    // 👇 ВОТ ТУТ МЫ ДОБАВЛЯЕМ НОВЫЕ ОБРАБОТЧИКИ 👇
    input.addEventListener('blur', onBlur);
    input.addEventListener('keypress', onKeyPress);
    input.addEventListener('keydown', onKeyDown);
  }

  // Сохранить изменения
  saveEdit(input, todoId, parentDiv) {
    const newText = input.value.trim();
    // Создаём span обратно
    const newSpan = document.createElement('span');
    newSpan.className = 'todo-item__text';
    // Если пусто - отменяем
    if (newText === '') {
      newSpan.textContent = input.defaultValue;
      parentDiv.replaceChild(newSpan, input);
      return;
    }
    // Обновляем текст в span
    newSpan.textContent = this.escapeHtml(newText);
    parentDiv.replaceChild(newSpan, input);
    // Вызываем колбэк для сохранения в модели
    if (this.onEditCallback) {
      this.onEditCallback(todoId, newText);
    }
  }
  // Отменить редактирование
  cancelEdit(input, originalText, parentDiv) {
    const newSpan = document.createElement('span');
    newSpan.className = 'todo-item__text';
    newSpan.textContent = this.escapeHtml(originalText);
    parentDiv.replaceChild(newSpan, input);
  }

  // Обновить счётчики задач
  updateCounters(counters) {
    console.log('📊 Обновляю счётчики:', counters);
    // Находим все элементы счётчиков
    const totalElement = document.querySelector('[data-counter="total"] .todo-counter__value');
    const completedElement = document.querySelector(
      '[data-counter="completed"] .todo-counter__value'
    );
    const activeElement = document.querySelector('[data-counter="active"] .todo-counter__value');

    // Проверяем, что элементы найдены
    if (totalElement && completedElement && activeElement) {
      // Устанавливаем новые значения
      totalElement.textContent = counters.total;
      completedElement.textContent = counters.completed;
      activeElement.textContent = counters.active;

      console.log('✅ Счётчики обновлены');
    } else {
      console.warn('⚠️ Элементы счётчиков не найдены');
    }
  }

  // Добавить обработчики на все интерактивные элементы
  addEventHandlers() {
    this.addDeleteHandlers();
    this.addToggleHandlers(); // ← добавляем обработчики чекбоксов
    // this.addFilterHandlers(); // ← добавляем обработчики фильтров
    this.addCopyHandlers();
    this.addDragDropHandlers();
  }
  // Добавить обработчики на чекбоксы
  addToggleHandlers() {
    // Находим все чекбоксы
    const checkboxes = document.querySelectorAll('.todo-item__checkbox-input');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (event) => {
        // Предотвращаем всплытие
        event.stopPropagation();

        // Находим родительскую задачу
        const todoItem = checkbox.closest('.todo-item');
        const todoId = parseInt(todoItem.dataset.id);

        console.log('☑️ Изменён чекбокс у задачи с id:', todoId);
        console.log('📊 Новое значение:', checkbox.checked);

        // Если есть колбэк - вызываем его
        if (this.onToggleCallback) {
          this.onToggleCallback(todoId);
        } else {
          console.warn('⚠️ Нет колбэка для переключения статуса');
        }
      });
    });
  }
  // Обновить активную кнопку фильтра
  updateActiveFilter(activeFilter) {
    console.log('🎯 Обновляю активный фильтр:', activeFilter);

    // Находим все кнопки фильтров
    const filterButtons = document.querySelectorAll('.todo-filter');

    // Убираем класс active у всех кнопок
    filterButtons.forEach((button) => {
      button.classList.remove('todo-filter--active');
    });

    // Находим нужную кнопку и добавляем класс active
    const activeButton = document.querySelector(`[data-filter="${activeFilter}"]`);
    if (activeButton) {
      activeButton.classList.add('todo-filter--active');
      console.log('✅ Активный фильтр обновлён');
    } else {
      console.warn('⚠️ Кнопка фильтра не найдена:', activeFilter);
    }
  }
  // Добавить обработчики на кнопки фильтров
  addFilterHandlers() {
    const filterButtons = document.querySelectorAll('.todo-filter');

    filterButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();

        const filter = button.dataset.filter; // получаем значение из data-filter
        console.log('🔘 Нажата кнопка фильтра:', filter);
        // Обработчики фильтров теперь в контроллере
        console.log('🎯 Фильтр выбран в представлении:', filter);
        // Обработчик будет вызван напрямую из setupFilterHandlersOnce()
        // Ничего не делаем здесь
      });
    });
  }
  //Добавить обработчик кликов на кнопки копирования
  addCopyHandlers() {
    const copyButtons = document.querySelectorAll('.todo-item__copy');
    copyButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const todoTtem = button.closest('.todo-item');
        const todoId = parseInt(todoTtem.dataset.id);
        console.log('📋 Копирую задачу с id:', todoId);
        if (this.onCopyCallback) {
          this.onCopyCallback(todoId);
        }
      });
    });
  }

  updateButtonsState(counters) {
    console.log('🎯 Обновляю состояние всех кнопок:', counters);
    // 1. Кнопка "Все"
    const allButton = document.querySelector('[data-filter="all"]');
    if (allButton) {
      allButton.disabled = counters.total === 0;
      if (counters.total === 0) {
        allButton.classList.add('todo-filter--disabled');
      } else {
        allButton.classList.remove('todo-filter--disabled');
      }
    }

    // 2. Кнопка "Активные"
    const activeButton = document.querySelector('[data-filter="active"]');
    if (activeButton) {
      activeButton.disabled = counters.active === 0;
      if (counters.active === 0) {
        activeButton.classList.add('todo-filter--disabled');
      } else {
        activeButton.classList.remove('todo-filter--disabled');
      }
    }

    // 3. Кнопка "Выполненные"
    const completedButton = document.querySelector('[data-filter="completed"]');
    if (completedButton) {
      completedButton.disabled = counters.completed === 0;
      if (counters.completed === 0) {
        completedButton.classList.add('todo-filter--disabled');
      } else {
        completedButton.classList.remove('todo-filter--disabled');
      }
    }

    // 4. Кнопка "Очистить выполненные"
    const clearButton = document.querySelector('.todo-clear');
    if (clearButton) {
      clearButton.disabled = counters.completed === 0;
      if (counters.completed === 0) {
        clearButton.classList.add('todo-clear--disabled'); // ← ЭТА СТРОКА ПРАВИЛЬНАЯ
        clearButton.textContent = '🧹 Очистить выполненные';
      } else {
        clearButton.classList.remove('todo-clear--disabled'); // ← И ЭТА ТОЖЕ
        clearButton.textContent = `🧹 Очистить выполненные (${counters.completed})`;
      }
    }
    console.log('✅ Состояние кнопок обновлено');
  }
}
// Создаем и экспортируем экземпляр представления
export const todoView = new TodoView();
