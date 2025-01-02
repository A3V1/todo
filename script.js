const TodoApp = {
    // Initialize lists to manage todos
    todoList: [],  // List of all tasks
    comdoList: [], // List of completed tasks
    remList: [],   // List of remaining (incomplete) tasks

    // Initialize the application
    init() {
        // Cache DOM elements for future use
        this.addButton = document.getElementById("add-button");
        this.todoInput = document.getElementById("todo-input");
        this.deleteAllButton = document.getElementById("delete-all");
        this.allTodos = document.getElementById("all-todos");
        this.deleteSButton = document.getElementById("delete-selected");

        // Load existing tasks from localStorage
        this.loadFromStorage();

        // Attach event listeners to handle user interactions
        this.addButton.addEventListener("click", () => this.add());
        this.deleteAllButton.addEventListener("click", () => this.deleteAll());
        this.deleteSButton.addEventListener("click", () => this.deleteCompleted());

        // Add a keypress listener for the Enter key in the input field
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.add();
        });

        // Add a global click listener to handle task actions
        document.addEventListener('click', (e) => this.handleActions(e));
    },

    // Load tasks from localStorage and render them
    loadFromStorage() {
        const storedList = JSON.parse(localStorage.getItem("todoList")); // Retrieve tasks
        this.todoList = storedList || []; // If no tasks are stored, initialize with an empty array
        this.update(); // Update UI counts
        this.renderList(this.todoList); // Render the task list
    },

    // Save the current tasks to localStorage
    saveToStorage() {
        localStorage.setItem("todoList", JSON.stringify(this.todoList));
    },

    // Update counts and categorize tasks
    update() {
        this.comdoList = this.todoList.filter(task => task.complete); // Get completed tasks
        this.remList = this.todoList.filter(task => !task.complete); // Get incomplete tasks

        // Update the UI with the task counts
        document.getElementById("r-count").innerText = this.todoList.length.toString(); // Total count
        document.getElementById("c-count").innerText = this.comdoList.length.toString(); // Completed count
    },

    // Add a new task
    add() {
        const value = this.todoInput.value.trim(); // Get and trim the input value
        if (value === '') { // Prevent adding empty tasks
            alert("😮 Task cannot be empty");
            return;
        }

        // Add a new task object to the list
        this.todoList.push({
            task: value,
            id: Date.now().toString(), // Unique ID for the task
            complete: false, // Mark as incomplete initially
        });

        this.todoInput.value = ""; // Clear the input field
        this.saveToStorage(); // Save changes to localStorage
        this.update(); // Update UI counts
        this.renderList(this.todoList); // Render the updated task list
    },

    // Render a list of tasks in the UI
    renderList(list) {
        this.allTodos.innerHTML = ""; // Clear the current list

        // Iterate through each task and create its HTML
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
            this.allTodos.innerHTML += taskElement; // Append each task element
        });
    },

    // Handle actions on tasks (complete, delete, filter)
    handleActions(event) {
        const targetClass = event.target.className.split(' ')[0]; // Get the main class of the clicked element
        if (targetClass === 'complete' || targetClass === 'ci') {
            this.completeTask(event); // Mark a task as complete/incomplete
        } else if (targetClass === 'delete' || targetClass === 'di') {
            this.deleteTask(event); // Delete a task
        } else if (event.target.id === "all") {
            this.renderList(this.todoList); // Show all tasks
        } else if (event.target.id === "rem") {
            this.renderList(this.remList); // Show remaining (incomplete) tasks
        } else if (event.target.id === "com") {
            this.renderList(this.comdoList); // Show completed tasks
        }
    },

    // Toggle the completion status of a task
    completeTask(event) {
        const taskId = event.target.closest('.todo-item').id; // Get the task ID
        this.todoList = this.todoList.map(task => {
            if (task.id === taskId) {
                task.complete = !task.complete; // Toggle the 'complete' property
            }
            return task;
        });

        this.saveToStorage(); // Save changes to localStorage
        this.update(); // Update UI counts
        this.renderList(this.todoList); // Re-render the task list
    },

    // Delete a specific task
    deleteTask(event) {
        const taskId = event.target.closest('.todo-item').id; // Get the task ID
        this.todoList = this.todoList.filter(task => task.id !== taskId); // Remove the task

        this.saveToStorage(); // Save changes to localStorage
        this.update(); // Update UI counts
        this.renderList(this.todoList); // Re-render the task list
    },

    // Delete all tasks after confirmation
    deleteAll() {
        if (confirm("Are you sure you want to delete all tasks?")) { // Show confirmation dialog
            this.todoList = []; // Clear the task list
            this.saveToStorage(); // Save changes to localStorage
            this.update(); // Update UI counts
            this.renderList(this.todoList); // Re-render the task list
        }
    },

    // Delete only completed tasks
    deleteCompleted() {
        this.todoList = this.todoList.filter(task => !task.complete); // Remove completed tasks
        this.saveToStorage(); // Save changes to localStorage
        this.update(); // Update UI counts
        this.renderList(this.todoList); // Re-render the task list
    }
};

// Initialize the TodoApp when the script loads
TodoApp.init();
