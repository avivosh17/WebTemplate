let submitlogin = document.getElementById("submitlogin") as HTMLButtonElement;
let submitsignup = document.getElementById("submitsignup") as HTMLButtonElement;
let signupbutton = document.getElementById("signupbutton") as HTMLButtonElement;
let loginbutton = document.getElementById("loginbutton") as HTMLButtonElement;

loginbutton.onclick = function () {
    const popup = document.getElementById("loginPopup");
    if (popup) popup.style.display = "flex";
};

submitlogin.onclick = async function () {
    const usernameInput = document.getElementById("username") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    const username = usernameInput?.value;
    const password = passwordInput?.value;

    console.log("Login Username:", username);
    console.log("Login Password:", password);

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    });

    if (response.ok) {
        alert("Login successful");
    } else {
        alert("Login failed");
    }

    const popup = document.getElementById("loginPopup");
    if (popup) popup.style.display = "none";
};

signupbutton.onclick = function () {
    const popup = document.getElementById("signupPopup");
    if (popup) popup.style.display = "flex";
};

submitsignup.onclick = async function () {
    const usernameInput = document.getElementById("signup-username") as HTMLInputElement;
    const passwordInput = document.getElementById("signup-password") as HTMLInputElement;
    const confirmInput = document.getElementById("signup-confirm-password") as HTMLInputElement;

    const username = usernameInput?.value;
    const password = passwordInput?.value;
    const confirmPassword = confirmInput?.value;

    console.log("Signup Username:", username);
    console.log("Signup Password:", password);
    console.log("Confirm Password:", confirmPassword);

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    });

    if (response.ok) {
        alert("Signup successful");
    } else {
        alert("Signup failed");
    }

    const popup = document.getElementById("signupPopup");
    if (popup) popup.style.display = "none";
};

function closePopup(event: MouseEvent, popupId: string): void {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = "none";
    }
}

(window as any).closePopup = closePopup;