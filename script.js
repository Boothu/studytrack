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

        // Add a finished button
        const delBtn = document.createElement('button');
        delBtn.className = 'finished-task';
        delBtn.textContent = '✓';
        li.appendChild(delBtn);
    }

    // Add a delete button next to the tasks which are in the finished column - if you press it, it will delete the task
    if (
        e.target.className === 'delete-task' &&
        e.target.closest('.task-column')?.id ==='finished'
    ) {
        const li = e.target.closest('li');
        if (li) li.remove();
    }

    // If 'finished' button is clicked, move the task to the finished column
    if (e.target.className === 'finished-task') {
        const li = e.target.closest('li');
        if (li) {
            // Create a new list item for the finished tasks
            const finishedLi = document.createElement('li');
            // Remove the finished button text
            finishedLi.textContent = li.textContent.replace('✓', '').trim();

            // Add a delete button
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-task';
            delBtn.textContent = '✕';
            finishedLi.appendChild(delBtn);

            // Add the finished task to the finished tasks list
            const finishedTasks = document.getElementById('finished-tasks');
            finishedTasks.appendChild(finishedLi);
            // Remove the original task from its column
            li.remove();
        }
    }
});

document.querySelector('.finished-button').addEventListener('click', function (e) {
    // Hide finished tasks column if it is currently visible, or show it if it is hidden
    const finishedCol = document.getElementById('finished');
    if (finishedCol.style.display === 'none') {
        finishedCol.style.display = '';
        e.target.textContent = 'Hide Finished';
    } else {
        finishedCol.style.display = 'none';
        e.target.textContent = 'Show Finished';
    }
});

// Pomodoro timer Logic
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isFocusSession = true; // Tracks whether current session is for focus or for break
let pomodoroCount = 0;

// Split total time (which is in seconds) into minutes and seconds and update timer display
function updateTimerDisplay() {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    document.getElementById('timer-display').textContent = minutes + ":" + seconds;
}

// If 'start' button is clicked
document.getElementById('start-button').addEventListener('click', function () {
    // If there is already a timer running, do nothing
    if (timerInterval) return;
    // Calculate the session duration (25 minutes for focus or 5/25 minutes for breaks) and store the current timeLeft
    const sessionDuration = isFocusSession ? 25 * 60 : (pomodoroCount % 4 === 0 ? 25 * 60 : 5 * 60);
    const startTime = timeLeft;
    // Start interval which runs every second
    timerInterval = setInterval(function () {
        // Decrease time as long as there is time left
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
            // If this is a focus session, track elapsed minutes and seconds, then update the progress bar
            if (isFocusSession) {
                const elapsedSeconds = startTime - timeLeft;
                const elapsedMinutes = elapsedSeconds / 60;
                minutesCompleted = Math.min(elapsedMinutes, dailyGoal);
                updateProgress();
            }
        }
        // Otherwise, stop the timer and reset timerInterval
        else {
            clearInterval(timerInterval);
            timerInterval = null;

            // If a focus session has just ended, begin a break
            if (isFocusSession) {
                pomodoroCount++;
                isFocusSession = false;
                // If number of pomodoros completed is divisible by 4, start a long break
                // Otherwise, start a short break
                timeLeft = (pomodoroCount % 4 === 0) ? 25 * 60 : 5 * 60;
                alert((pomodoroCount % 4 === 0) ? "Time for a long break!" : "Time for a short break!");
            }
            // If a break session has just ended, start a focus session
            else {
                isFocusSession = true;
                timeLeft = 25 * 60;
                alert("Back to work!");
            }
            updateTimerDisplay();
        }
    }, 1000); // 1000 ms = 1 second
});

// If 'pause' button is clicked, halt timerInterval
document.getElementById('pause-button').addEventListener('click', function () {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
});

// If 'reset' button is clicked reset everything to default
document.getElementById('reset-button').addEventListener('click', function () {
    clearInterval(timerInterval);
    timerInterval = null;
    isFocusSession = true;
    pomodoroCount = 0;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// If 'skip5' button is clicked
document.getElementById('skip5-button').addEventListener('click', function () {
    clearInterval(timerInterval);
    timerInterval = null;
    isFocusSession = false;
    timeLeft = 5 * 60;
    updateTimerDisplay();
});

// If 'skip25' button is clicked
document.getElementById('skip25-button').addEventListener('click', function () {
    clearInterval(timerInterval);
    timerInterval = null;
    isFocusSession = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

let dailyGoal = 0;
let minutesCompleted = 0;

const goalInput = document.getElementById("goal-input");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

// If 'set goal' button is clicked, set the daily goal and reset progress
document.getElementById('set-goal').addEventListener('click', function () {
    dailyGoal = parseInt(goalInput.value);
    minutesCompleted = 0;
    updateProgress();
});

// Calculate and update the progress bar based on the daily goal and completed minutes
function updateProgress() {
    let percent = 0;
    if (dailyGoal > 0) {
        percent = (minutesCompleted / dailyGoal) * 100;
        if (percent > 100) {
            percent = 100;
        }
    }
    const displayMinutes = Math.floor(minutesCompleted);
    progressText.textContent = `${displayMinutes} / ${dailyGoal} mins`;
    progressBar.style.width = `${percent}%`;
}
