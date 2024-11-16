document.addEventListener("DOMContentLoaded", function () {
    var quadrantIds = [
        "list-urgent-important",
        "list-not-urgent-important",
        "list-urgent-not-important",
        "list-not-urgent-not-important",
    ];
    var today = new Date();
    var formattedDate = "".concat(('0' + today.getDate()).slice(-2), ".").concat(('0' + (today.getMonth() + 1)).slice(-2), ".").concat(today.getFullYear());
    var dateTitleElement = document.getElementById("date-title");
    var dateTitleH1Element = document.getElementById("date-title-h1");
    if (dateTitleElement) {
        dateTitleElement.innerText = formattedDate;
    }
    if (dateTitleH1Element) {
        dateTitleH1Element.innerText = formattedDate;
    }
    // Aufgabe in den Quadranten hinzufügen
    var addTask = function (quadrantId, taskText, taskId, completed) {
        if (completed === void 0) { completed = false; }
        var listElement = document.getElementById(quadrantId);
        var listItem = document.createElement("li");
        listItem.draggable = true;
        // Füge eine ID hinzu, um die Aufgabe eindeutig zu identifizieren
        var taskUniqueId = taskId ? taskId : new Date().getTime().toString();
        listItem.setAttribute("data-id", taskUniqueId);
        // Drag-and-Drop-Ereignisse hinzufügen
        listItem.addEventListener("dragstart", function (event) {
            var _a;
            (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text/plain", taskUniqueId);
            listItem.classList.add("dragging");
        });
        listItem.addEventListener("dragend", function () {
            listItem.classList.remove("dragging");
        });
        // Checkbox zum Abhaken der Aufgabe
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.classList.add("task-checkbox");
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                listItem.classList.add("completed");
                deleteButton.style.display = "none";
            }
            else {
                listItem.classList.remove("completed");
                deleteButton.style.display = "inline-block";
            }
            updateTaskStatusInLocalStorage(quadrantId, taskUniqueId, checkbox.checked);
        });
        if (completed) {
            listItem.classList.add("completed");
        }
        // Aufgaben-Text
        var taskTextElement = document.createElement("span");
        taskTextElement.textContent = taskText;
        // Entfernen Button für Aufgaben
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Entfernen";
        deleteButton.classList.add("delete-button");
        deleteButton.style.display = completed ? "none" : "inline-block";
        deleteButton.addEventListener("click", function () {
            listElement.removeChild(listItem);
            removeTaskFromLocalStorage(quadrantId, taskUniqueId);
        });
        // Zusammenfügen der Elemente
        listItem.appendChild(checkbox);
        listItem.appendChild(taskTextElement);
        listItem.appendChild(deleteButton);
        listElement.appendChild(listItem);
        // Nur beim Hinzufügen durch das Formular speichern
        if (!taskId) {
            saveTaskToLocalStorage(quadrantId, { id: taskUniqueId, text: taskText, completed: false });
        }
    };
    // Aufgaben in localStorage speichern
    var saveTaskToLocalStorage = function (quadrantId, task) {
        var tasks = getTasksFromLocalStorage(quadrantId);
        tasks.push(task);
        localStorage.setItem(quadrantId, JSON.stringify(tasks));
    };
    // Aufgaben aus localStorage laden
    var getTasksFromLocalStorage = function (quadrantId) {
        var tasks = localStorage.getItem(quadrantId);
        return tasks ? JSON.parse(tasks) : [];
    };
    // Aufgabe aus localStorage entfernen
    var removeTaskFromLocalStorage = function (quadrantId, taskId) {
        var tasks = getTasksFromLocalStorage(quadrantId);
        var updatedTasks = tasks.filter(function (task) { return task.id !== taskId; });
        localStorage.setItem(quadrantId, JSON.stringify(updatedTasks));
    };
    // Aufgabenstatus in localStorage aktualisieren
    var updateTaskStatusInLocalStorage = function (quadrantId, taskId, completed) {
        var tasks = getTasksFromLocalStorage(quadrantId);
        var taskIndex = -1;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === taskId) {
                taskIndex = i;
                break;
            }
        }
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = completed;
            localStorage.setItem(quadrantId, JSON.stringify(tasks));
        }
    };
    // Bestehende Aufgaben laden und in die Liste einfügen
    var loadTasks = function () {
        quadrantIds.forEach(function (quadrantId) {
            var tasks = getTasksFromLocalStorage(quadrantId);
            tasks.forEach(function (task) { return addTask(quadrantId, task.text, task.id, task.completed); });
        });
    };
    // Drag-and-Drop für die Quadranten einrichten
    quadrantIds.forEach(function (quadrantId) {
        var quadrantElement = document.getElementById(quadrantId);
        quadrantElement.addEventListener("dragover", function (event) {
            event.preventDefault();
            quadrantElement.classList.add("drag-over");
        });
        quadrantElement.addEventListener("dragleave", function () {
            quadrantElement.classList.remove("drag-over");
        });
        quadrantElement.addEventListener("drop", function (event) {
            var _a, _b, _c;
            event.preventDefault();
            quadrantElement.classList.remove("drag-over");
            var taskId = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text/plain");
            if (taskId) {
                var taskElement = document.querySelector("[data-id='".concat(taskId, "']"));
                var oldQuadrantId = (_b = taskElement.parentElement) === null || _b === void 0 ? void 0 : _b.id;
                if (oldQuadrantId) {
                    removeTaskFromLocalStorage(oldQuadrantId, taskId);
                    quadrantElement.appendChild(taskElement);
                    var taskText = ((_c = taskElement.querySelector("span")) === null || _c === void 0 ? void 0 : _c.textContent) || "";
                    var completed = taskElement.classList.contains("completed");
                    saveTaskToLocalStorage(quadrantId, { id: taskId, text: taskText, completed: completed });
                }
            }
        });
    });
    // Formular zum Hinzufügen von Aufgaben
    var addTaskButton = document.getElementById("add-task-button");
    addTaskButton.addEventListener("click", function () {
        var taskInput = document.getElementById("task-input");
        var taskQuadrant = document.getElementById("task-quadrant");
        var task = taskInput.value.trim();
        var quadrantId = taskQuadrant.value;
        if (task !== "") {
            addTask(quadrantId, task);
            taskInput.value = ""; // Eingabefeld leeren
        }
        else {
            alert("Bitte eine Aufgabe eingeben.");
        }
    });
    // Aufgaben beim Laden der Seite aus localStorage laden
    loadTasks();
});
