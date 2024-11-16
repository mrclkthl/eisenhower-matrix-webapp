document.addEventListener("DOMContentLoaded", function () {
    var addTask = function (quadrantId, task) {
        var listElement = document.getElementById(quadrantId);
        var listItem = document.createElement("li");
        listItem.textContent = task;
        listElement.appendChild(listItem);
    };
    // Beispielhafte Aufgaben hinzufügen
    addTask("list-urgent-important", "Beispielaufgabe 1: Sofort erledigen");
    addTask("list-not-urgent-important", "Beispielaufgabe 2: Planen");
});
