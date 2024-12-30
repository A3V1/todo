
const TodoApp = {
    todoList: [],
    comdoList: [],
    remList: [],
    init() {
        // Initialize DOM elements
        this.addButton = document.getElementById("add-button");
        this.todoInput = document.getElementById("todo-input");
        this.deleteAllButton = document.getElementById("delete-all");
        this.allTodos = document.getElementById("all-todos");
        this.deleteSButton = document.getElementById("delete-selected");

        // Load existing data from local Storage
        this.loadFromStorage();

        // Attach event listeners
        this.addButton.addEventListener("click", () => this.add());
        this.deleteAllButton.addEventListener("click", () => this.deleteAll());
        this.deleteSButton.addEventListener("click", () => this.deleteCompleted());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.add();
        });

        document.addEventListener('click', (e) => this.handleActions(e));
    },
    loadFromStorage() {
        const storedList = JSON.parse(localStorage.getItem("todoList"));
        this.todoList = storedList || [];
        this.update();
        this.renderList(this.todoList);
    },
    saveToStorage() {
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
    },
    update() {
        this.comdoList = this.todoList.filter(task => task.complete);
        this.remList = this.todoList.filter(task => !task.complete);

        document.getElementById("r-count").innerText = this.todoList.length.toString();
        document.getElementById("c-count").innerText = this.comdoList.length.toString();
    },
    add() {
        const value = this.todoInput.value.trim();
        if (value === '') {
            alert("😮 Task cannot be empty");
            return;
        }
        this.todoList.push({
            task: value,
            id: Date.now().toString(),
            complete: false,
        });

        this.todoInput.value = "";
        this.saveToStorage();
        this.update();
        this.renderList(this.todoList);
    },
    renderList(list) {
        this.allTodos.innerHTML = "";
        list.forEach(task => {
            const taskElement = `
                <li id="${task.id}" class="todo-item">
                    <p id="task">${task.complete ? `<strike>${task.task}</strike>` : task.task}</p>
                    <div class="todo-actions">
                        <button class="complete btn btn-success">
                            <i class="ci bx bx-check bx-sm"></i>
                        </button>
                        <button class="delete btn btn-error">
                            <i class="di bx bx-trash bx-sm"></i>
                        </button>
                    </div>
                </li>`;
            this.allTodos.innerHTML += taskElement;
        });
    },
    handleActions(event) {
        const targetClass = event.target.className.split(' ')[0];
        if (targetClass === 'complete' || targetClass === 'ci') {
            this.completeTask(event);
        } else if (targetClass === 'delete' || targetClass === 'di') {
            this.deleteTask(event);
        } else if (event.target.id === "all") {
            this.renderList(this.todoList);
        } else if (event.target.id === "rem") {
            this.renderList(this.remList);
        } else if (event.target.id === "com") {
            this.renderList(this.comdoList);
        }
    },
    completeTask(event) {
        const taskId = event.target.closest('.todo-item').id;
        this.todoList = this.todoList.map(task => {
            if (task.id === taskId) {
                task.complete = !task.complete;
            }
            return task;
        });

        this.saveToStorage();
        this.update();
        this.renderList(this.todoList);
    },
    deleteTask(event) {
        const taskId = event.target.closest('.todo-item').id;
        this.todoList = this.todoList.filter(task => task.id !== taskId);

        this.saveToStorage();
        this.update();
        this.renderList(this.todoList);
    },
    deleteAll() {
        if (confirm("Are you sure you want to delete all tasks?")) {
            this.todoList = [];
            this.saveToStorage();
            this.update();
            this.renderList(this.todoList);
        }
    },
    deleteCompleted() {
        this.todoList = this.todoList.filter(task => !task.complete);
        this.saveToStorage();
        this.update();
        this.renderList(this.todoList);
    }
};

// Initialize TodoApp
TodoApp.init();
