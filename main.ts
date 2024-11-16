document.addEventListener("DOMContentLoaded", () => {
    type Task = {
        id: string;
        text: string;
    };

    const quadrantIds = [
        "list-urgent-important",
        "list-not-urgent-important",
        "list-urgent-not-important",
        "list-not-urgent-not-important",
    ];

    // Aufgabe in den Quadranten hinzufügen
    const addTask = (quadrantId: string, taskText: string, taskId?: string) => {
        const listElement = document.getElementById(quadrantId) as HTMLUListElement;
        const listItem = document.createElement("li");
        listItem.textContent = taskText;

        // Füge eine ID hinzu, um die Aufgabe eindeutig zu identifizieren
        const taskUniqueId = taskId ? taskId : new Date().getTime().toString();
        listItem.setAttribute("data-id", taskUniqueId);

        // Entfernen Button für Aufgaben
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Entfernen";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
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
    const saveTaskToLocalStorage = (quadrantId: string, task: Task) => {
        const tasks = getTasksFromLocalStorage(quadrantId);
        tasks.push(task);
        localStorage.setItem(quadrantId, JSON.stringify(tasks));
    };

    // Aufgaben aus localStorage laden
    const getTasksFromLocalStorage = (quadrantId: string): Task[] => {
        const tasks = localStorage.getItem(quadrantId);
        return tasks ? JSON.parse(tasks) : [];
    };

    // Aufgabe aus localStorage entfernen
    const removeTaskFromLocalStorage = (quadrantId: string, taskId: string) => {
        const tasks = getTasksFromLocalStorage(quadrantId);
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem(quadrantId, JSON.stringify(updatedTasks));
    };

    // Bestehende Aufgaben laden und in die Liste einfügen
    const loadTasks = () => {
        quadrantIds.forEach(quadrantId => {
            const tasks = getTasksFromLocalStorage(quadrantId);
            tasks.forEach(task => addTask(quadrantId, task.text, task.id));
        });
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

    // Aufgaben beim Laden der Seite aus localStorage laden
    loadTasks();
});
