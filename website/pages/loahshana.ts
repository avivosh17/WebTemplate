import { send } from "../utilities";

const weekSelect = document.getElementById("weekselect") as HTMLSelectElement;
const textareas = [
    document.getElementById("textarea1"),
    document.getElementById("textarea2"),
    document.getElementById("textarea3"),
    document.getElementById("textarea4"),
    document.getElementById("textarea5"),
    document.getElementById("textarea6"),
    document.getElementById("textarea7"),
] as HTMLTextAreaElement[];

let currentUserId = localStorage.getItem("userId")!;
let currentWeek = 1;

for (let i = 1; i <= 52; i++) {
    const option = document.createElement("option");
    option.value = i.toString();
    option.text = `Week ${i}`;
    weekSelect.appendChild(option);
}

weekSelect.addEventListener("change", () => {
    currentWeek = parseInt(weekSelect.value);
    loadWeek(currentWeek);
});

textareas.forEach((textarea, index) => {
    textarea.addEventListener("input", () => {
        send("saveEntry", {
            userId: currentUserId,
            weeknum: currentWeek,
            weekday: index,
            text: textarea.value
        });
    });
});

function loadWeek(week: number) {
    send("loadWeek", {
        userId: currentUserId,
        weeknum: week
    }).then((data: Record<number, string>) => {
        textareas.forEach((ta, i) => {
            ta.value = data[i] || "";
        });
    });
}


loadWeek(currentWeek);
