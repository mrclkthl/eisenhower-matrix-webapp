document.addEventListener("DOMContentLoaded", function () {
    // Aufgabe in den Quadranten hinzufügen
    var addTask = function (quadrantId, task) {
        var listElement = document.getElementById(quadrantId);
        var listItem = document.createElement("li");
        listItem.textContent = task;
        // Entfernen Button für Aufgaben
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Entfernen";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", function () {
            listElement.removeChild(listItem);
        });
        listItem.appendChild(deleteButton);
        listElement.appendChild(listItem);
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
});
