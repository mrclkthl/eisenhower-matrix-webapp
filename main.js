document.addEventListener("DOMContentLoaded", function () {
    var quadrantIds = [
        "list-urgent-important",
        "list-not-urgent-important",
        "list-urgent-not-important",
        "list-not-urgent-not-important",
    ];
    // Aufgabe in den Quadranten hinzufügen
    var addTask = function (quadrantId, taskText, taskId) {
        var listElement = document.getElementById(quadrantId);
        var listItem = document.createElement("li");
        listItem.textContent = taskText;
        // Füge eine ID hinzu, um die Aufgabe eindeutig zu identifizieren
        var taskUniqueId = taskId ? taskId : new Date().getTime().toString();
        listItem.setAttribute("data-id", taskUniqueId);
        // Entfernen Button für Aufgaben
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Entfernen";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", function () {
            listElement.removeChild(listItem);
            removeTaskFromLocalStorage(quadrantId, taskUniqueId);
        });
        listItem.appendChild(deleteButton);
        listElement.appendChild(listItem);
        // Nur beim Hinzufügen durch das Formular speichern
        if (!taskId) {
            saveTaskToLocalStorage(quadrantId, { id: taskUniqueId, text: taskText });
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
    // Bestehende Aufgaben laden und in die Liste einfügen
    var loadTasks = function () {
        quadrantIds.forEach(function (quadrantId) {
            var tasks = getTasksFromLocalStorage(quadrantId);
            tasks.forEach(function (task) { return addTask(quadrantId, task.text, task.id); });
        });
    };
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
