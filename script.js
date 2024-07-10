document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Event listener for form submission
    todoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
        } else {
            alert('Please enter a task.');
        }
    });

    // Function to add a new task
    function addTask(taskText) {
        const taskId = new Date().getTime(); // Unique ID for each task
        const taskItem = createTaskElement(taskId, taskText);
        taskList.appendChild(taskItem);
        saveTask(taskId, taskText);
    }

    // Function to create task list item
    function createTaskElement(id, text) {
        const li = document.createElement('li');
        li.dataset.taskId = id;
        li.innerHTML = `<span>${text}</span>
                        <button class="edit-button">Edit</button>
                        <button class="delete-button">Delete</button>`;
        
        // Event listener for delete button
        const deleteButton = li.querySelector('.delete-button');
        deleteButton.addEventListener('click', function() {
            deleteTask(id);
        });

        // Event listener for edit button
        const editButton = li.querySelector('.edit-button');
        editButton.addEventListener('click', function() {
            editTask(id);
        });

        return li;
    }

    // Function to delete task
    function deleteTask(id) {
        const taskItem = document.querySelector(`li[data-task-id="${id}"]`);
        if (taskItem) {
            taskItem.remove();
            removeTaskFromLocalStorage(id);
        }
    }

    // Function to edit task
    function editTask(id) {
        const taskItem = document.querySelector(`li[data-task-id="${id}"]`);
        if (taskItem) {
            const span = taskItem.querySelector('span');
            const currentText = span.textContent;
            const newText = prompt('Edit task:', currentText);
            if (newText !== null && newText.trim() !== '' && newText !== currentText) {
                span.textContent = newText;
                updateTaskInLocalStorage(id, newText);
            } else if (newText !== currentText) {
                alert('Task edit canceled or no changes made.');
            }
        }
    }

    // Function to save task to local storage
    function saveTask(id, text) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ id, text });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to remove task from local storage
    function removeTaskFromLocalStorage(id) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to update task in local storage
    function updateTaskInLocalStorage(id, newText) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { id, text: newText };
            } else {
                return task;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from local storage on page load
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskElement(task.id, task.text);
            taskList.appendChild(taskItem);
        });
    }

    // Call loadTasks on page load
    loadTasks();
});
