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

const weekData: { [week: number]: string[] } = {};

for (let i = 1; i <= 52; i++) {
    const option = document.createElement("option");
    option.value = i.toString();
    option.text = `Week ${i}`;
    weekSelect.appendChild(option);

    weekData[i] = ["", "", "", "", "", "", ""];
}

weekSelect.value = "1";

loadWeek(currentWeek);

weekSelect.addEventListener("change", () => {
    for (let i = 0; i < 7; i++) {
        weekData[currentWeek][i] = textareas[i].value;
    }

    currentWeek = parseInt(weekSelect.value);

    loadWeek(currentWeek);
});

function loadWeek(week: number) {
    for (let i = 0; i < 7; i++) {
        textareas[i].value = weekData[week][i];
    }
}

