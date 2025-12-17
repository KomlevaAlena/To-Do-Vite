// Здесь храним HTML всех компонентов
export const components = {
  'todo-app': `
    <div class="todo-app">
      <h1 class="todo-app__title">To-Do List</h1>
      <div data-component="todo-input"></div>
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
