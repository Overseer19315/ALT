
const me = document.getElementById("me");
const blanca = document.getElementById("blanca");
const dream = document.getElementById("dream");
const spear = document.getElementById("spear");
const council = document.getElementById("council");
const members = document.getElementById("members");
const snow = document.getElementById("snow");
const tree = document.getElementById("tree");
const blackout = document.getElementById("blackout");
const caption = document.getElementById("caption");
const pauseButton = document.getElementById("pauseButton");

let timers = [];
let paused = false;
let finished = false;
let currentStep = 0;
let stepTimeout = null;

const wait = (ms) => new Promise(resolve => {
    stepTimeout = setTimeout(resolve, ms);
});

function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];

    if (stepTimeout) {
        clearTimeout(stepTimeout);
        stepTimeout = null;
    }
}

function setCaption(text) {
    caption.textContent = text;
}

function show(element) {
    element.style.opacity = "1";
}

function hide(element) {
    element.style.opacity = "0";
}

function createCouncil() {
    members.innerHTML = "";

    for (let i = 0; i < 13; i++) {
        const x = 55 + i * 74;
        const y = 270 + (i % 2) * 12;

        const person = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        person.setAttribute("class", "council-member");
        person.innerHTML = `
            <rect x="${x - 23}" y="${y + 45}" width="46" height="85"
                rx="3" fill="#292a30"/>
            <circle cx="${x}" cy="${y}" r="12" fill="#050505"/>
            <path d="M${x} ${y + 13} L${x} ${y + 57}"
                stroke="#050505" stroke-width="8" stroke-linecap="round"/>
            <path d="M${x - 4} ${y + 29} L${x + 19} ${y + 37}"
                stroke="#050505" stroke-width="6" stroke-linecap="round"/>
            <path d="M${x - 4} ${y + 27} L${x + 5} ${y + 30}"
                stroke="#b51f2b" stroke-width="6" stroke-linecap="round"/>
        `;

        members.appendChild(person);
    }
}

function createSnow() {
    snow.innerHTML = "";

    for (let i = 0; i < 90; i++) {
        const flake = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        const x = Math.random() * 1000;
        const y = Math.random() * 560;
        const radius = Math.random() * 2.5 + 1;

        flake.setAttribute("cx", x);
        flake.setAttribute("cy", y);
        flake.setAttribute("r", radius);
        flake.setAttribute("fill", "white");
        flake.setAttribute("opacity", Math.random() * 0.7 + 0.3);

        const animation = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "animate"
        );

        animation.setAttribute("attributeName", "cy");
        animation.setAttribute("from", "-20");
        animation.setAttribute("to", "580");
        animation.setAttribute("dur", `${Math.random() * 5 + 5}s`);
        animation.setAttribute("repeatCount", "indefinite");

        flake.appendChild(animation);
        snow.appendChild(flake);
    }
}

function createPapers() {
    for (let i = 0; i < 28; i++) {
        const paper = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );

        const x = 80 + Math.random() * 840;
        const y = 190 + Math.random() * 100;

        paper.setAttribute("x", x);
        paper.setAttribute("y", y);
        paper.setAttribute("width", 9 + Math.random() * 9);
        paper.setAttribute("height", 12 + Math.random() * 8);
        paper.setAttribute("fill", "#d7d4ce");
        paper.setAttribute("opacity", "0");

        const animation = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "animateTransform"
        );

        animation.setAttribute("attributeName", "transform");
        animation.setAttribute("type", "translate");
        animation.setAttribute("from", "0 -100");
        animation.setAttribute("to", "0 420");
        animation.setAttribute("dur", `${2 + Math.random() * 2}s`);
        animation.setAttribute("begin", "0s");
        animation.setAttribute("fill", "freeze");

        paper.appendChild(animation);

        const opacity = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "animate"
        );

        opacity.setAttribute("attributeName", "opacity");
        opacity.setAttribute("from", "0");
        opacity.setAttribute("to", "0.9");
        opacity.setAttribute("dur", "0.5s");
        opacity.setAttribute("fill", "freeze");

        paper.appendChild(opacity);
        members.appendChild(paper);
    }
}

function resetScene() {
    clearTimers();

    paused = false;
    finished = false;
    currentStep = 0;

    pauseButton.textContent = "PAUSAR";

    me.style.transform = "translateX(-450px)";
    blanca.style.transform = "translateX(450px)";

    hide(dream);
    hide(spear);
    hide(council);
    hide(blackout);

    tree.style.opacity = "0";
    snow.style.opacity = "0";

    members.innerHTML = "";

    setCaption("A LITTLE HISTORY");
}

function sleep(ms) {
    return new Promise(resolve => {
        const start = Date.now();

        function check() {
            if (paused) {
                setTimeout(check, 100);
                return;
            }

            if (Date.now() - start >= ms) {
                resolve();
            } else {
                setTimeout(check, 50);
            }
        }

        check();
    });
}

async function playStory() {
    resetScene();

    // 1. Aparece Andrés
    currentStep = 1;
    await sleep(1200);

    me.style.transition = "transform 3s ease";
    me.style.transform = "translateX(-90px)";

    await sleep(3200);

    // 2. Aparece Blanca
    currentStep = 2;
    blanca.style.transition = "transform 3s ease";
    blanca.style.transform = "translateX(90px)";

    await sleep(3500);

    // 3. El sueño
    currentStep = 3;
    setCaption("");
    show(dream);

    await sleep(4500);

    // 4. La lanza rompe el sueño
    currentStep = 4;
    show(spear);

    spear.style.transition = "transform 0.7s ease";
    spear.style.transform = "translateY(0)";

    await sleep(1300);

    hide(dream);
    hide(spear);

    await sleep(900);

    // 5. El consejo
    currentStep = 5;
    createCouncil();
    show(council);
    setCaption("");

    await sleep(1700);

    createPapers();

    await sleep(4200);

    // 6. Silencio
    currentStep = 6;
    hide(council);
    members.innerHTML = "";

    setCaption("");
    await sleep(2800);

    // 7. Navidad
    currentStep = 7;
    tree.style.opacity = "1";
    show(snow);

    setCaption("");

    await sleep(4000);

    // 8. Andrés camina hacia Blanca
    currentStep = 8;

    me.style.transition = "transform 5s ease";
    me.style.transform = "translateX(20px)";

    await sleep(4200);

    // 9. Final
    currentStep = 9;
    show(blackout);

    await sleep(1000);

    finished = true;
}

function togglePause() {
    if (finished) return;

    paused = !paused;

    pauseButton.textContent = paused ? "CONTINUAR" : "PAUSAR";

    document.getAnimations().forEach(animation => {
        if (paused) {
            animation.pause();
        } else {
            animation.play();
        }
    });
}

function restart() {
    playStory();
}

createSnow();
resetScene();

window.togglePause = togglePause;
window.restart = restart;

playStory();
