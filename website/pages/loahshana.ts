const weekSelect = document.getElementById("weekselect") as HTMLSelectElement;
const textareas = [
    document.getElementById("textarea1") as HTMLTextAreaElement,
    document.getElementById("textarea2") as HTMLTextAreaElement,
    document.getElementById("textarea3") as HTMLTextAreaElement,
    document.getElementById("textarea4") as HTMLTextAreaElement,
    document.getElementById("textarea5") as HTMLTextAreaElement,
    document.getElementById("textarea6") as HTMLTextAreaElement,
    document.getElementById("textarea7") as HTMLTextAreaElement,
];

let currentWeek = 1;

for (let i = 1; i <= 52; i++) {
    const option = document.createElement("option");
    option.value = i.toString();
    option.text = `Week ${i}`;
    weekSelect.appendChild(option);
}
weekSelect.value = "1";

async function loadWeek(week: number) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const res = await fetch("/getWeekData", {
        method: "POST",
        body: JSON.stringify([userId, week]),
        headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
        const data = await res.json();
        if (data) {
            textareas[0].value = data.sunday || "";
            textareas[1].value = data.monday || "";
            textareas[2].value = data.tuesday || "";
            textareas[3].value = data.wednesday || "";
            textareas[4].value = data.thursday || "";
            textareas[5].value = data.friday || "";
            textareas[6].value = data.saturday || "";
        } else {
            // clear textareas if no data
            for (let textarea of textareas) textarea.value = "";
        }
    }
}

async function saveWeek(week: number) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const body = {
        userId,
        weekNumber: week,
        sunday: textareas[0].value,
        monday: textareas[1].value,
        tuesday: textareas[2].value,
        wednesday: textareas[3].value,
        thursday: textareas[4].value,
        friday: textareas[5].value,
        saturday: textareas[6].value,
    };

    await fetch("/saveWeekData", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    });
}

// Save current week and load new one when switching
weekSelect.onchange = async () => {
    const newWeek = parseInt(weekSelect.value);
    await saveWeek(currentWeek);
    currentWeek = newWeek;
    await loadWeek(currentWeek);
};

// Initial load
loadWeek(currentWeek);
