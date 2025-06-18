document.querySelector('.task-lists').addEventListener('click', function (e) {
    // If 'add task' button is clicked
    if (e.target.className === 'add-task-button') {
        // Find which task column the button is in
        const column = e.target.closest('.task-column');
        let priority = '';
        if (column.id === 'high-priority') priority = 'high';
        else if (column.id === 'medium-priority') priority = 'medium';
        else if (column.id === 'low-priority') priority = 'low';
        else return;

        // Prompt for task text
        const taskText = prompt(`Enter a new ${priority} priority task:`);
        if (!taskText) return;

        // Create new task
        const li = document.createElement('li');
        li.textContent = taskText.trim();

        // Add to the correct list
        const taskList = document.getElementById(`${priority}-tasks`);
        taskList.appendChild(li);

        // Add a delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-task';
        delBtn.textContent = 'Delete';
        li.appendChild(delBtn);
    }
    
    // If delete task button clicked, remove task
    if (e.target.className === 'delete-task') {
        const li = e.target.closest('li');
        if (li) li.remove();
    }
});