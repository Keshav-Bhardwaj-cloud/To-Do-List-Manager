export class Project {
    constructor(name, desc) {
        this.id = Date.now();
        this.name = name;
        this.desc = desc;
        this.todos = [];
    }

    addTodo(task) {
        this.todos.push({ todoTask: task, completed: false });
    }

    deleteTodo(index) {
        this.todos.splice(index, 1);
    }

    getTodos() {
        return this.todos;
    }
}
