document.addEventListener("DOMContentLoaded", () => {
    type Task = {
        id: string;
        text: string;
        completed: boolean;
    };

    const quadrantIds = [
        "list-urgent-important",
        "list-not-urgent-important",
        "list-urgent-not-important",
        "list-not-urgent-not-important",
    ];

    const today: Date = new Date();
    const formattedDate: string = `${('0' + today.getDate()).slice(-2)}.${('0' + (today.getMonth() + 1)).slice(-2)}.${today.getFullYear()}`;
    
    const dateTitleElement = document.getElementById("date-title");
    const dateTitleH1Element = document.getElementById("date-title-h1");

    if (dateTitleElement) {
        dateTitleElement.innerText = formattedDate;
    }
    if (dateTitleH1Element) {
        dateTitleH1Element.innerText = formattedDate;
    }

    // Aufgabe in den Quadranten hinzufügen
    const addTask = (quadrantId: string, taskText: string, taskId?: string, completed: boolean = false) => {
        const listElement = document.getElementById(quadrantId) as HTMLUListElement;
        const listItem = document.createElement("li");
        listItem.draggable = true;

        // Füge eine ID hinzu, um die Aufgabe eindeutig zu identifizieren
        const taskUniqueId = taskId ? taskId : new Date().getTime().toString();
        listItem.setAttribute("data-id", taskUniqueId);

        // Drag-and-Drop-Ereignisse hinzufügen
        listItem.addEventListener("dragstart", (event) => {
            event.dataTransfer?.setData("text/plain", taskUniqueId);
            listItem.classList.add("dragging");
        });

        listItem.addEventListener("dragend", () => {
            listItem.classList.remove("dragging");
        });

        // Checkbox zum Abhaken der Aufgabe
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.classList.add("task-checkbox");
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                listItem.classList.add("completed");
                deleteButton.style.display = "none";
            } else {
                listItem.classList.remove("completed");
                deleteButton.style.display = "inline-block";
            }
            updateTaskStatusInLocalStorage(quadrantId, taskUniqueId, checkbox.checked);
        });

        if (completed) {
            listItem.classList.add("completed");
        }

        // Aufgaben-Text
        const taskTextElement = document.createElement("span");
        taskTextElement.textContent = taskText;

        // Entfernen Button für Aufgaben
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Entfernen";
        deleteButton.classList.add("delete-button");
        deleteButton.style.display = completed ? "none" : "inline-block";
        deleteButton.addEventListener("click", () => {
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

    // Aufgabenstatus in localStorage aktualisieren
    const updateTaskStatusInLocalStorage = (quadrantId: string, taskId: string, completed: boolean) => {
        const tasks = getTasksFromLocalStorage(quadrantId);
        let taskIndex = -1;
        for (let i = 0; i < tasks.length; i++) {
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
    const loadTasks = () => {
        quadrantIds.forEach(quadrantId => {
            const tasks = getTasksFromLocalStorage(quadrantId);
            tasks.forEach(task => addTask(quadrantId, task.text, task.id, task.completed));
        });
    };

    // Drag-and-Drop für die Quadranten einrichten
    quadrantIds.forEach(quadrantId => {
        const quadrantElement = document.getElementById(quadrantId) as HTMLUListElement;

        quadrantElement.addEventListener("dragover", (event) => {
            event.preventDefault();
            quadrantElement.classList.add("drag-over");
        });

        quadrantElement.addEventListener("dragleave", () => {
            quadrantElement.classList.remove("drag-over");
        });

        quadrantElement.addEventListener("drop", (event) => {
            event.preventDefault();
            quadrantElement.classList.remove("drag-over");
            const taskId = event.dataTransfer?.getData("text/plain");
            if (taskId) {
                const taskElement = document.querySelector(`[data-id='${taskId}']`) as HTMLLIElement;
                const oldQuadrantId = taskElement.parentElement?.id;
                if (oldQuadrantId) {
                    removeTaskFromLocalStorage(oldQuadrantId, taskId);
                    quadrantElement.appendChild(taskElement);
                    const taskText = taskElement.querySelector("span")?.textContent || "";
                    const completed = taskElement.classList.contains("completed");
                    saveTaskToLocalStorage(quadrantId, { id: taskId, text: taskText, completed });
                }
            }
        });
    });

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
