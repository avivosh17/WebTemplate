import { send } from "../utilities";


let currentUserId = localStorage.getItem("userId");
let username = await send("getUsername", currentUserId) as string | null;
if (!username) {
    localStorage.removeItem("userId");
    //location.href = "index.html";
    alert(username);
}

const calendarTitle = document.getElementById("calendarTitle") as HTMLHeadingElement;
calendarTitle.innerText = `${username}'s Calendar`;


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

let currentWeek = 1;

// Setup week selector
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

    loadMood(week);
}
const moodSelect = document.getElementById("weekmood") as HTMLSelectElement;

function loadMood(week: number) {
    send("getmood", { userId: currentUserId, weeknum: week }).then((data: { mood: number }) => {
        moodSelect.value = data.mood?.toString() ?? "0";
    });
}

moodSelect.addEventListener("change", () => {
    const mood = parseInt(moodSelect.value);
    send("setmood", { UserId: currentUserId, weeknum: currentWeek, mood });
});

// Initial load
loadWeek(currentWeek);

const estimatedMonth = document.getElementById("estimated-month") as HTMLParagraphElement;

const monthMap = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

function updateEstimatedMonth(week: number) {
    const monthIndex = Math.floor((week - 1) / 4);
    estimatedMonth.textContent = `Estimated Month: ${monthMap[monthIndex] ?? "—"}`;
}

// Call this when the week is changed:
weekSelect.addEventListener("change", () => {
    const selectedWeek = parseInt(weekSelect.value);
    if (!isNaN(selectedWeek)) {
        updateEstimatedMonth(selectedWeek);
    }
});

if (!isNaN(parseInt(weekSelect.value))) {
    updateEstimatedMonth(parseInt(weekSelect.value));
}
let logoutbutton = document.getElementById("logoutbutton") as HTMLButtonElement;
logoutbutton.onclick = () => {
    localStorage.removeItem("userId");
    location.href = "index.html";
};

