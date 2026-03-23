/* menu select */
const options = document.querySelectorAll(".option");
let index = 1;
let siteReady = false;

function updateSelection() {
    options.forEach(opt => opt.classList.remove("active", "selector"));
    options[index].classList.add("active", "selector");
}

const uiClick = document.getElementById("uiClick");
const warningScreen = document.getElementById("warningScreen");
const warningProceed = document.getElementById("warningProceed");
const warningQuit = document.getElementById("warningQuit");
const volumeSlider = document.getElementById("masterVolume");
const volumeValue = document.getElementById("volumeValue");

const loadingScreen = document.getElementById("loadingScreen");
const loadingText = document.getElementById("loadingText");
const learnPage = document.getElementById("learnPage");

const menuAudio = document.getElementById("bgAudio");
const faqAudio = document.getElementById("faqAudio");

let loadingTimer = null;
let loadingDotsTimer = null;
let masterVolume = Number(volumeSlider.value) / 100;

function syncVolumeDisplay() {
    volumeValue.textContent = `${Math.round(masterVolume * 100)}%`;
}

function applyMasterVolume() {
    const uiVolume = Math.max(masterVolume * 0.35, 0);
    uiClick.volume = uiVolume;

    if (!menuAudio.paused) {
        menuAudio.volume = masterVolume;
    }

    if (!faqAudio.paused) {
        faqAudio.volume = masterVolume;
    }

    syncVolumeDisplay();
}

function playClick() {
    uiClick.currentTime = 0;
    uiClick.volume = Math.max(masterVolume * 0.35, 0);
    uiClick.play().catch(() => {});
}

function fadeAudio(audioEl, from, to, duration, onDone) {
    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        audioEl.volume = from + (to - from) * progress;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else if (onDone) {
            onDone();
        }
    }

    requestAnimationFrame(step);
}

function playMenuMusic() {
    faqAudio.pause();
    faqAudio.currentTime = 0;
    faqAudio.volume = 0;

    menuAudio.currentTime = 0;
    menuAudio.volume = 0;

    menuAudio.play().catch(() => {});
    fadeAudio(menuAudio, 0, masterVolume, 600);
}

function prepareFaqMusic() {
    faqAudio.currentTime = 0;
    faqAudio.volume = 0;
    faqAudio.play().catch(() => {});
}

function revealFaqMusic() {
    faqAudio.play().catch(() => {});
    fadeAudio(faqAudio, 0, masterVolume, 600);
}

volumeSlider.addEventListener("input", () => {
    masterVolume = Number(volumeSlider.value) / 100;
    applyMasterVolume();
});

warningProceed.addEventListener("click", () => {
    playClick();
    warningScreen.classList.add("hidden");
    siteReady = true;
    playMenuMusic();
});

warningQuit.addEventListener("click", () => {
    playClick();
    setTimeout(() => {
        window.location.replace("about:blank");
    }, 120);
});

document.addEventListener("keydown", (e) => {
    if (!siteReady) return;

    if (e.key === "ArrowDown") {
        index = (index + 1) % options.length;
        updateSelection();
    }

    if (e.key === "ArrowUp") {
        index = (index - 1 + options.length) % options.length;
        updateSelection();
    }

    if (e.key === "Enter") {
        playClick();
        if (index === 0) startLoading();
        if (index === 1) triggerLearn();
    }
});

options.forEach((opt, i) => {
    opt.addEventListener("mouseenter", () => {
        if (!siteReady) return;
        index = i;
        updateSelection();
    });

    opt.addEventListener("click", () => {
        if (!siteReady) return;
        playClick();
        if (i === 0) startLoading();
        if (i === 1) triggerLearn();
    });
});


/* RSVP */
function startLoading() {
    const formWindow = window.open("", "_blank");
    if (!formWindow) return;

    formWindow.document.write(`
        <html>
        <head>
        <title>Loading...</title>
        <style>
        body{
            margin:0;
            background:black;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            flex-direction:column;
            font-family:"Courier New",monospace;
            color:white;
        }

        img{
            width:200px;
            animation:float 2s ease-in-out infinite;
        }

        .loadingText{
            margin-top:20px;
            font-size:24px;
        }

        @keyframes float{
            0%{transform:translateY(0px);}
            50%{transform:translateY(-15px);}
            100%{transform:translateY(0px);}
        }
        </style>
        </head>

        <body>
        <img src="https://cdn.hackclub.com/019d09b8-1577-7d2d-8b85-1cd251a5e09c/bob-eye-horror-evil.gif">
        <div class="loadingText" id="loadingText">Loading</div>

        <script>
        let dots = 0;
        const text = document.getElementById("loadingText");

        setInterval(() => {
            dots = (dots + 1) % 4;
            text.innerText = "Loading" + ".".repeat(dots);
        }, 400);

        const delay = Math.random() * 6000 + 2000;

        setTimeout(() => {
            window.location.href = "https://forms.fillout.com/t/fuxhBdNbhdus";
        }, delay);
        <\/script>
        </body>
        </html>
    `);
}


/* FAQ */
let faqReady = false;

function triggerLearn() {
    if (loadingTimer) return;

    loadingScreen.classList.add("active");

    let dots = 0;
    loadingDotsTimer = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingText.innerText = "Loading" + ".".repeat(dots);
    }, 400);

    prepareFaqMusic();

    fadeAudio(menuAudio, menuAudio.volume || masterVolume, 0, 500, () => {
        menuAudio.pause();
        menuAudio.currentTime = 0;
    });

    const delay = Math.random() * 900 + 700;

    loadingTimer = setTimeout(() => {
        clearInterval(loadingDotsTimer);
        loadingDotsTimer = null;
        loadingTimer = null;

        learnPage.classList.add("active");
        loadingScreen.classList.remove("active");

        if (!faqReady) {
            faqReady = true;
        }

        revealFaqMusic();
    }, delay);
}


/* back */
document.getElementById("backBtn").addEventListener("click", () => {
    playClick();
    learnPage.classList.add("fadeOut");

    playMenuMusic();

    setTimeout(() => {
        learnPage.classList.remove("active");
        learnPage.classList.remove("fadeOut");
    }, 600);
});


/* faq */
document.querySelectorAll(".faqToggle").forEach(button => {
    button.addEventListener("click", () => {
        playClick();

        const node = button.closest(".faqNode");
        const img = button.querySelector("img");

        const isOpen = node.classList.toggle("open");

        img.src = isOpen
            ? "https://cdn.hackclub.com/019d155f-b707-7536-b45a-f45556a31211/openeye.png"
            : "https://cdn.hackclub.com/019d155f-c68f-70bb-bfd9-047b7a7224bb/closed%20eye.png";

        button.setAttribute("aria-expanded", String(isOpen));
    });
});

document.querySelectorAll(".faqAnswer a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.stopPropagation();
    });
});

applyMasterVolume();
syncVolumeDisplay();
updateSelection();