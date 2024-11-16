document.addEventListener("DOMContentLoaded", () => {
    const addTask = (quadrantId: string, task: string) => {
        const listElement = document.getElementById(quadrantId) as HTMLUListElement;
        const listItem = document.createElement("li");
        listItem.textContent = task;
        listElement.appendChild(listItem);
    };

    // Beispielhafte Aufgaben hinzufügen
    addTask("list-urgent-important", "Beispielaufgabe 1: Sofort erledigen");
    addTask("list-not-urgent-important", "Beispielaufgabe 2: Planen");
});
