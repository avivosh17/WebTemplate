import { send } from "../utilities";


if (localStorage.getItem("userId")) {
    location.href = "loahshana.html";
}


let submitlogin = document.getElementById("submitlogin") as HTMLButtonElement;
let submitsignup = document.getElementById("submitsignup") as HTMLButtonElement;
let signupbutton = document.getElementById("signupbutton") as HTMLButtonElement;
let loginbutton = document.getElementById("loginbutton") as HTMLButtonElement;
let cancellogin = document.getElementById("cancellogin") as HTMLButtonElement;
let cancelsignup = document.getElementById("cancelsignup") as HTMLButtonElement;
let signupconfirmpassword = document.getElementById("signupconfirmpassword") as HTMLInputElement;
let qmark = document.getElementById("qmark") as HTMLDivElement;
let closeqbutton = document.getElementById("closeqbutton") as HTMLButtonElement;
let signuppassword = document.getElementById("signuppassword") as HTMLInputElement;
let signupusername = document.getElementById("signupusername") as HTMLInputElement;
let loginusername = document.getElementById("loginusername") as HTMLInputElement;
let loginpassword = document.getElementById("loginpassword") as HTMLInputElement;

closeqbutton.onclick = () => {
    const popup = document.getElementById("qpopup");
    if (popup) popup.style.display = "none";
};
cancelsignup.onclick = () => {
    const popup = document.getElementById("signupPopup");
    if (popup) popup.style.display = "none";
};
cancellogin.onclick = () => {
    const popup = document.getElementById("loginPopup");
    if (popup) popup.style.display = "none";
};

qmark.onclick = () => {
    const popup = document.getElementById("qpopup");
    if (popup) popup.style.display = "flex";
};

loginbutton.onclick = () => {
    const popup = document.getElementById("loginPopup");
    if (popup) popup.style.display = "flex";
};

signupbutton.onclick = () => {
    const popup = document.getElementById("signupPopup");
    if (popup) popup.style.display = "flex";
};

submitsignup.onclick = async () => {
    if (signupconfirmpassword.value !== signuppassword.value) {
        alert("Passwords do not match");
        return;
    }

    let userId = await send("signUp", [
        signupusername.value,
        signuppassword.value,
    ]) as string | null;

    if (userId == null) {
        alert("Username already exists");
        return;
    }

    localStorage.setItem("userId", userId);
    location.href = "loahshana.html";

};

submitlogin.onclick = async () => {
    let userId = await send("logIn", [loginusername.value, loginpassword.value,]) as string | null;

    if (userId == null) {
        alert("Incorrect username or password");
        return;
    }

    localStorage.setItem("userId", userId);
    location.href = "loahshana.html";
}

signupconfirmpassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitsignup.click();
});
loginpassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitlogin.click();
});
