const countValue = document.getElementById("countValue");
var taskListArray = [];
let taskCount = 0; // Initialize to 0, will be updated based on loaded tasks

// Load data from localStorage on page load
const isLocalDataPresent = localStorage.getItem("todoTaskList");
if (isLocalDataPresent !== null) {
    taskListArray = JSON.parse(isLocalDataPresent);
    renderTaskList(); // Render tasks after loading
}

// Event listener for form submission
document.getElementById("taskForm").addEventListener("submit", saveTask);

function saveTask(event) {
    event.preventDefault(); // Prevent default form submission
    let newTaskInput = document.getElementById("taskInput").value.trim(); // Trim whitespace
    let pattern = /^[a-zA-Z0-9][a-zA-Z0-9\s.,!?'"-]{2,}$/; // Adjusted pattern for at least 3 characters after first character

    if (pattern.test(newTaskInput)) {
        var todoObj = {
            // Assign a unique ID using current timestamp to avoid duplicates if tasks are added quickly
            taskId: Date.now(),
            taskName: newTaskInput,
            completed: false // Add a completed status
        }
        taskListArray.push(todoObj);
        localStorage.setItem("todoTaskList", JSON.stringify(taskListArray));
        document.getElementById("taskInput").value = ""; // Clear the input field
        renderTaskList();
    } else {
        alert("Task should not start with a special symbol and must have at least 3 characters.");
    }
}

function renderTaskList() {
    document.getElementById("myTaskList").innerHTML = ""; // Clear existing tasks
    taskCount = 0; // Reset task count before re-rendering

    if (taskListArray.length === 0) {
        document.getElementById("myTaskList").innerHTML = "<p style='text-align: center; color: #888;'>No tasks to display yet!</p>";
    } else {
        for (var index = 0; index < taskListArray.length; index++) {
            var dynamicLi = document.createElement("li");
            dynamicLi.classList.add("task");

            var myLabel = document.createElement("label");
            var taskCheckbox = document.createElement("input");
            taskCheckbox.type = "checkbox";
            taskCheckbox.classList.add("task-checkbox");
            taskCheckbox.addEventListener("change", checKBoxUtility);
            taskCheckbox.dataset.taskId = taskListArray[index].taskId; // Use dataset for task ID

            var myPara = document.createElement("p");
            myPara.textContent = taskListArray[index].taskName;

            myLabel.appendChild(taskCheckbox);
            myLabel.appendChild(myPara);
            dynamicLi.appendChild(myLabel);

            var myDiv = document.createElement("div");
            myDiv.classList.add("settings");

            var editIcon = document.createElement("i");
            editIcon.classList.add("fa-regular", "fa-pen-to-square", "edit");
            editIcon.addEventListener("click", editTask);
            editIcon.dataset.taskId = taskListArray[index].taskId; // Use dataset for task ID

            var deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-solid", "fa-trash", "delete"); // Changed icon to fa-trash for better visual
            deleteIcon.addEventListener("click", deleteTask);
            deleteIcon.dataset.taskId = taskListArray[index].taskId; // Use dataset for task ID

            myDiv.appendChild(editIcon);
            myDiv.appendChild(deleteIcon);
            dynamicLi.appendChild(myDiv);

            // Apply completed styles and update checkbox state
            if (taskListArray[index].completed) {
                taskCheckbox.checked = true;
                dynamicLi.classList.add("completed");
            } else {
                taskCount++; // Only count incomplete tasks as pending
            }

            document.getElementById("myTaskList").appendChild(dynamicLi);
        }
    }
    countValue.innerText = taskCount;
}

function deleteTask(event) {
    const taskIdToDelete = parseInt(event.target.dataset.taskId); // Parse to integer
    taskListArray = taskListArray.filter(task => task.taskId !== taskIdToDelete);
    localStorage.setItem("todoTaskList", JSON.stringify(taskListArray));
    renderTaskList();
}

function editTask(event) {
    var taskElement = event.target.closest(".task"); // Use closest to get the task li element
    var taskId = parseInt(event.target.dataset.taskId);

    var taskIndex = taskListArray.findIndex(m => m.taskId === taskId);
    var task = taskListArray[taskIndex];

    var label = taskElement.querySelector("label");
    var currentParagraph = label.querySelector("p");

    // Hide current paragraph and checkbox
    currentParagraph.style.display = "none";
    taskElement.querySelector(".task-checkbox").style.display = "none";


    var inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = task.taskName;
    inputField.classList.add("editInput");
    label.appendChild(inputField);

    inputField.focus();

    inputField.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            var editedTaskName = inputField.value.trim();
            let pattern = /^[a-zA-Z0-9][a-zA-Z0-9\s.,!?'"-]{2,}$/;

            if (pattern.test(editedTaskName)) {
                task.taskName = editedTaskName;
                localStorage.setItem("todoTaskList", JSON.stringify(taskListArray));
                renderTaskList(); // Re-render to show updated task and restore layout
            } else {
                alert("Task should not start with a special symbol and must have at least 3 characters.");
                // Revert to original state if invalid
                inputField.remove();
                currentParagraph.style.display = "block";
                taskElement.querySelector(".task-checkbox").style.display = "block";
            }
        }
    });

    // Handle blur event to save if user clicks outside
    inputField.addEventListener("blur", function() {
        var editedTaskName = inputField.value.trim();
        let pattern = /^[a-zA-Z0-9][a-zA-Z0-9\s.,!?'"-]{2,}$/;

        if (pattern.test(editedTaskName)) {
            task.taskName = editedTaskName;
            localStorage.setItem("todoTaskList", JSON.stringify(taskListArray));
            renderTaskList();
        } else {
             // Revert to original state if invalid on blur
            inputField.remove();
            currentParagraph.style.display = "block";
            taskElement.querySelector(".task-checkbox").style.display = "block";
        }
    });
}

function checKBoxUtility(event) {
    const taskId = parseInt(event.target.dataset.taskId);
    const taskIndex = taskListArray.findIndex(m => m.taskId === taskId);
    taskListArray[taskIndex].completed = event.target.checked;

    const taskElement = event.target.closest(".task"); // Get the parent li element

    if (event.target.checked) {
        taskElement.classList.add("completed");
    } else {
        taskElement.classList.remove("completed");
    }

    localStorage.setItem("todoTaskList", JSON.stringify(taskListArray));
    renderTaskList(); // Re-render to update pending task count
}

function removeAll() {
    if (confirm("Are you sure you want to clear all tasks?")) { // Confirmation dialog
        taskListArray = []; // Empty the array
        localStorage.removeItem("todoTaskList"); // Remove from local storage
        renderTaskList();
    }
}
