// Здесь храним HTML всех компонентов
export const components = {
  'todo-app': `
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
    
    <!-- Форма добавления -->
    <div data-component="todo-input"></div>
    
    <!-- Список задач -->
    <div data-component="todo-list"></div>
  </div>
`,
  
  'todo-input': `
    <div class="todo-input">
      <form class="todo-input__form">
        <input type="text" class="todo-input__field" placeholder="Что нужно сделать?" required>
        <button type="submit" class="todo-input__button">
          Add
        </button>
      </form>
    </div>
  `,
  
  'todo-list': `
    <div class="todo-list">
      <div class="todo-list__container">
        <div class="todo-list__empty">
          📝 Список задач пуст. Добавьте первую задачу!
        </div>
      </div>
    </div>
  `
};
