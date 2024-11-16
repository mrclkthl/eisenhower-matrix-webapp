document.addEventListener("DOMContentLoaded", () => {
    // Aufgabe in den Quadranten hinzufügen
    const addTask = (quadrantId: string, task: string) => {
        const listElement = document.getElementById(quadrantId) as HTMLUListElement;
        const listItem = document.createElement("li");
        listItem.textContent = task;

        // Entfernen Button für Aufgaben
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Entfernen";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
            listElement.removeChild(listItem);
        });

        listItem.appendChild(deleteButton);
        listElement.appendChild(listItem);
    };

    // Formular zum Hinzufügen von Aufgaben
    const addTaskButton = document.getElementById("add-task-button") as HTMLButtonElement;
    addTaskButton.addEventListener("click", () => {
        const taskInput = document.getElementById("task-input") as HTMLInputElement;
        const taskQuadrant = document.getElementById("task-quadrant") as HTMLSelectElement;

        const task = taskInput.value.trim();
        const quadrantId = taskQuadrant.value;

        if (task !== "") {
            addTask(quadrantId, task);
            taskInput.value = ""; // Eingabefeld leeren
        } else {
            alert("Bitte eine Aufgabe eingeben.");
        }
    });
});
