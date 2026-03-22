const options = document.querySelectorAll(".option");
let index = 1;
let loadingTimer = null;
let loadingDotsTimer = null;
let formWindow = null;

function updateSelection() {
    options.forEach(opt => opt.classList.remove("active", "selector"));
    options[index].classList.add("active", "selector");
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
        index = (index + 1) % options.length;
        updateSelection();
    }

    if (e.key === "ArrowUp") {
        index = (index - 1 + options.length) % options.length;
        updateSelection();
    }

    if (e.key === "Enter") {
        if (index === 0) startLoading();
        if (index === 1) triggerLearn();
    }
});

options.forEach((opt, i) => {
    opt.addEventListener("mouseenter", () => {
        index = i;
        updateSelection();
    });

    opt.addEventListener("click", () => {
        if (i === 0) startLoading();
        if (i === 1) triggerLearn();
    });
});

/* RSVP */
function startLoading() {
    const screen = document.getElementById("loadingScreen");
    const text = document.getElementById("loadingText");

    if (loadingTimer) return;

    screen.classList.add("active");

    let dots = 0;
    loadingDotsTimer = setInterval(() => {
        dots = (dots + 1) % 4;
        text.innerText = "Loading" + ".".repeat(dots);
    }, 400);

    formWindow = window.open("about:blank", "_blank");

    const delay = Math.random() * 5000 + 3000;

    loadingTimer = setTimeout(() => {
        clearInterval(loadingDotsTimer);
        loadingTimer = null;
        loadingDotsTimer = null;

        screen.classList.remove("active");

        if (formWindow && !formWindow.closed) {
            formWindow.location.href = "https://forms.fillout.com/t/fuxhBdNbhdus";
            formWindow.focus();
        }
    }, delay);
}

/* LEARN MORE */
const glitch = document.getElementById("glitchOverlay");
const learnPage = document.getElementById("learnPage");

function triggerLearn() {
    glitch.classList.add("active");
    learnPage.classList.add("active");

    setTimeout(() => {
        glitch.classList.remove("active");
    }, 500);
}

document.getElementById("backBtn").addEventListener("click", () => {
    learnPage.classList.remove("active");
});

document.querySelectorAll(".faq").forEach(faq => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("open");
    });
});

document.querySelectorAll(".answer a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.stopPropagation();
    });
});

/* AUDIO */
const audio = document.getElementById("bgAudio");
function tryPlay() {
    audio.play().catch(() => {});
}
window.addEventListener("load", tryPlay);
document.addEventListener("click", tryPlay);
document.addEventListener("keydown", tryPlay);

updateSelection();