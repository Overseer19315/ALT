
"use strict";

/* =========================================
   CONFIGURACIÓN
========================================= */

const ACCESS_PASSWORD = "Sonrisa";

const accessScreen = document.getElementById("accessScreen");
const storyScreen = document.getElementById("storyScreen");

const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("passwordInput");
const loginFeedback = document.getElementById("loginFeedback");
const loginCard = document.querySelector(".login-card");
const enterButton = document.getElementById("enterButton");

const sceneSvg = document.getElementById("sceneSvg");

const andresEntrance = document.getElementById("andresEntrance");
const blancaEntrance = document.getElementById("blancaEntrance");
const andresWalk = document.getElementById("andresWalk");

const dream = document.getElementById("dream");
const spear = document.getElementById("spear");
const council = document.getElementById("council");

const members = document.getElementById("members");
const papers = document.getElementById("papers");

const treeGroup = document.getElementById("treeGroup");
const christmasGlow = document.getElementById("christmasGlow");
const snow = document.getElementById("snow");

const endingScreen = document.getElementById("endingScreen");

const pauseButton = document.getElementById("pauseButton");
const pauseIcon = document.getElementById("pauseIcon");
const pauseText = document.getElementById("pauseText");
const restartButton = document.getElementById("restartButton");


/* =========================================
   ESTADO
========================================= */

let paused = false;
let finished = false;
let runToken = 0;


/* =========================================
   UTILIDADES
========================================= */

function setVisible(element, visible) {
    if (!element) return;

    element.classList.toggle("is-visible", visible);
}

function beginSvgAnimation(id) {
    const animation = document.getElementById(id);

    if (!animation) {
        console.warn(`No se encontró la animación: ${id}`);
        return;
    }

    if (typeof animation.beginElement === "function") {
        animation.beginElement();
    }
}

/*
    Espera el tiempo indicado.
    El tiempo no avanza mientras la historia
    está pausada o la pestaña está oculta.
*/

function wait(milliseconds, token) {
    return new Promise(resolve => {
        let elapsed = 0;
        let previousTime = null;

        function frame(currentTime) {
            if (token !== runToken) {
                resolve(false);
                return;
            }

            if (previousTime !== null && !paused && !document.hidden) {
                const delta = Math.min(currentTime - previousTime, 100);
                elapsed += delta;
            }

            previousTime = currentTime;

            if (elapsed >= milliseconds) {
                resolve(true);
                return;
            }

            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    });
}


/* =========================================
   PANTALLA DE ACCESO
========================================= */

loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (enterButton.disabled) return;

    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword.toLocaleLowerCase("es") !==
        ACCESS_PASSWORD.toLocaleLowerCase("es")) {

        loginFeedback.textContent = "La contraseña no es correcta.";
        passwordInput.setAttribute("aria-invalid", "true");

        loginCard.classList.remove("shake");

        // Reinicia la animación de error.
        void loginCard.offsetWidth;

        loginCard.classList.add("shake");

        passwordInput.select();
        return;
    }

    loginFeedback.textContent = "Acceso concedido.";
    passwordInput.setAttribute("aria-invalid", "false");

    enterButton.disabled = true;

    // Presentamos la historia detrás de la pantalla de acceso.
    storyScreen.hidden = false;

    requestAnimationFrame(() => {
        storyScreen.classList.add("is-live");
        accessScreen.classList.add("is-leaving");
    });

    await new Promise(resolve => setTimeout(resolve, 850));

    accessScreen.hidden = true;

    playStory();
});

passwordInput.addEventListener("input", () => {
    passwordInput.removeAttribute("aria-invalid");
    loginFeedback.textContent = "";
    loginCard.classList.remove("shake");
});


/* =========================================
   GENERADOR DE NIEVE
========================================= */

function createSnow() {
    snow.replaceChildren();

    const svgNS = "http://www.w3.org/2000/svg";

    for (let i = 0; i < 95; i++) {
        const flake = document.createElementNS(svgNS, "circle");

        const x = Math.random() * 1200;
        const radius = Math.random() * 2.2 + 0.7;
        const duration = 6 + Math.random() * 8;
        const opacity = 0.25 + Math.random() * 0.65;

        flake.setAttribute("cx", x.toFixed(1));
        flake.setAttribute("cy", "-30");
        flake.setAttribute("r", radius.toFixed(1));
        flake.setAttribute("fill", "#f2f0eb");
        flake.setAttribute("opacity", opacity.toFixed(2));

        const fall = document.createElementNS(svgNS, "animate");

        fall.setAttribute("attributeName", "cy");
        fall.setAttribute("from", "-30");
        fall.setAttribute("to", "750");
        fall.setAttribute("dur", `${duration.toFixed(2)}s`);
        fall.setAttribute("begin", "0s");
        fall.setAttribute("repeatCount", "indefinite");

        flake.appendChild(fall);

        const drift = document.createElementNS(svgNS, "animate");

        drift.setAttribute("attributeName", "cx");
        drift.setAttribute(
            "values",
            `${x};${x + 16};${x - 12};${x + 7}`
        );
        drift.setAttribute("dur", `${(duration * 1.2).toFixed(2)}s`);
        drift.setAttribute("begin", "0s");
        drift.setAttribute("repeatCount", "indefinite");

        flake.appendChild(drift);
        snow.appendChild(flake);
    }
}


/* =========================================
   GENERADOR DEL CONSEJO
   EXACTAMENTE 13 MIEMBROS
========================================= */

function createCouncil() {
    members.replaceChildren();

    const svgNS = "http://www.w3.org/2000/svg";
    const totalMembers = 13;

    const firstPosition = 68;
    const spacing = 88.7;

    for (let i = 0; i < totalMembers; i++) {
        const x = firstPosition + spacing * i;

        const person = document.createElementNS(svgNS, "g");

        person.setAttribute("class", "council-member");
        person.setAttribute("transform", `translate(${x} 0)`);
        person.style.animationDelay = `${i * 65}ms`;

        /*
            Cada miembro tiene:
            - Un atril.
            - Una cabeza.
            - Un cuerpo.
            - Dos brazos.
            - Una cinta roja.
        */

        person.innerHTML = `

            <!-- ATRIL -->
            <rect
                x="-29"
                y="353"
                width="58"
                height="91"
                rx="2"
                fill="#252831"
                stroke="#444650"
                stroke-width="1"
            />

            <rect
                x="-25"
                y="359"
                width="50"
                height="4"
                fill="#60616a"
                opacity=".45"
            />

            <!-- CABEZA -->
            <circle
                cx="0"
                cy="252"
                r="14"
                fill="#030406"
            />

            <!-- CUERPO -->
            <path
                d="M0 267 L0 353"
                fill="none"
                stroke="#030406"
                stroke-width="9"
                stroke-linecap="round"
            />

            <!-- BRAZO IZQUIERDO -->
            <path
                d="M0 285 L-22 326"
                fill="none"
                stroke="#030406"
                stroke-width="7"
                stroke-linecap="round"
            />

            <!-- BRAZO DERECHO -->
            <path
                d="M0 285 L25 322"
                fill="none"
                stroke="#030406"
                stroke-width="7"
                stroke-linecap="round"
            />

            <!-- CINTA ROJA -->
            <path
                d="M-18 301 L-11 305"
                fill="none"
                stroke="#b62936"
                stroke-width="7"
                stroke-linecap="round"
            />

            <!-- PIERNAS -->
            <path
                d="M0 345 L-13 382 M0 345 L13 382"
                fill="none"
                stroke="#030406"
                stroke-width="7"
                stroke-linecap="round"
            />

            <!-- IDENTIFICADOR -->
            <text
                x="0"
                y="430"
                text-anchor="middle"
                font-size="9"
                fill="#9a9ca4"
                font-family="Arial, sans-serif"
                letter-spacing="1"
            >
                ${String(i + 1).padStart(2, "0")}
            </text>
        `;

        members.appendChild(person);
    }

    // Comprobación para evitar cambios accidentales.
    console.assert(
        members.children.length === 13,
        "El consejo debe tener exactamente 13 miembros."
    );
}


/* =========================================
   PAPELES ARROJADOS POR EL CONSEJO
========================================= */

function createPapers() {
    papers.replaceChildren();

    const svgNS = "http://www.w3.org/2000/svg";

    for (let i = 0; i < 30; i++) {
        const group = document.createElementNS(svgNS, "g");

        const x = 65 + Math.random() * 1070;
        const y = 280 + Math.random() * 65;

        const distance = 290 + Math.random() * 190;
        const sideways = -100 + Math.random() * 200;
        const rotation = -180 + Math.random() * 360;

        const duration = 2.1 + Math.random() * 2.1;

        group.setAttribute("class", "paper");
        group.setAttribute("transform", `translate(${x} ${y})`);

        const paper = document.createElementNS(svgNS, "rect");

        paper.setAttribute("x", "-6");
        paper.setAttribute("y", "-9");
        paper.setAttribute("width", 10 + Math.random() * 12);
        paper.setAttribute("height", 14 + Math.random() * 9);
        paper.setAttribute("rx", "1");
        paper.setAttribute("fill", i % 3 === 0 ? "#b9b5ad" : "#e1ded6");
        paper.setAttribute("opacity", ".93");

        group.appendChild(paper);

        const fall = document.createElementNS(svgNS, "animateTransform");

        fall.setAttribute("attributeName", "transform");
        fall.setAttribute("type", "translate");
        fall.setAttribute("from", "0 0");
        fall.setAttribute("to", `${sideways} ${distance}`);
        fall.setAttribute("dur", `${duration}s`);
        fall.setAttribute("begin", "indefinite");
        fall.setAttribute("fill", "freeze");

        group.appendChild(fall);

        const spin = document.createElementNS(svgNS, "animateTransform");

        spin.setAttribute("attributeName", "transform");
        spin.setAttribute("type", "rotate");
        spin.setAttribute(
            "from",
            `${rotation} 0 0`
        );
        spin.setAttribute(
            "to",
            `${rotation + 220} 0 0`
        );
        spin.setAttribute("dur", `${duration}s`);
        spin.setAttribute("begin", "indefinite");
        spin.setAttribute("additive", "sum");
        spin.setAttribute("fill", "freeze");

        group.appendChild(spin);

        const fade = document.createElementNS(svgNS, "animate");

        fade.setAttribute("attributeName", "opacity");
        fade.setAttribute("from", "0");
        fade.setAttribute("to", "1");
        fade.setAttribute("dur", ".25s");
        fade.setAttribute("begin", "indefinite");
        fade.setAttribute("fill", "freeze");

        group.appendChild(fade);

        papers.appendChild(group);

        // Iniciamos las animaciones después de añadir el papel al SVG.
        fall.beginElement();
        spin.beginElement();
        fade.beginElement();
    }
}


/* =========================================
   REINICIO DEL ESCENARIO
========================================= */

function resetScene() {
    paused = false;
    finished = false;

    storyScreen.classList.remove("is-paused");

    pauseButton.classList.remove("is-paused");
    pauseButton.disabled = false;

    pauseIcon.textContent = "Ⅱ";
    pauseText.textContent = "PAUSAR";

    // Reiniciar las animaciones SVG.
    sceneSvg.pauseAnimations();
    sceneSvg.setCurrentTime(0);

    // Posiciones iniciales.
    andresEntrance.setAttribute("transform", "translate(-520 0)");
    blancaEntrance.setAttribute("transform", "translate(520 0)");
    andresWalk.setAttribute("transform", "translate(0 0)");
    spear.setAttribute("transform", "translate(600 -350)");

    // Ocultar las escenas posteriores.
    setVisible(andresEntrance, false);
    setVisible(blancaEntrance, false);
    setVisible(dream, false);
    setVisible(spear, false);
    setVisible(council, false);
    setVisible(treeGroup, false);
    setVisible(christmasGlow, false);
    setVisible(snow, false);

    endingScreen.classList.remove("is-visible");

    members.replaceChildren();
    papers.replaceChildren();

    sceneSvg.style.filter = "none";

    // Reiniciar el reloj de las animaciones.
    sceneSvg.unpauseAnimations();
}


/* =========================================
   HISTORIA PRINCIPAL
========================================= */

async function playStory() {

    // Cada reproducción tiene un identificador propio.
    // Así, un reinicio invalida la secuencia anterior.
    const token = ++runToken;

    resetScene();

    const pause = milliseconds => wait(milliseconds, token);

    // 1. APARICIÓN DE ANDRÉS

    if (!(await pause(700))) return;

    setVisible(andresEntrance, true);
    beginSvgAnimation("andresEnter");

    if (!(await pause(2700))) return;


    // 2. APARICIÓN DE BLANCA

    setVisible(blancaEntrance, true);
    beginSvgAnimation("blancaEnter");

    if (!(await pause(3000))) return;


    // 3. EL SUEÑO

    setVisible(dream, true);

    if (!(await pause(3700))) return;


    // 4. LA LANZA

    setVisible(spear, true);
    beginSvgAnimation("spearDrop");

    if (!(await pause(650))) return;

    // Breve impacto visual.
    sceneSvg.style.filter = "brightness(1.65)";

    await pause(180);

    sceneSvg.style.filter = "brightness(1)";

    setVisible(dream, false);
    setVisible(spear, false);

    if (!(await pause(1100))) return;


    // 5. EL CONSEJO DE TRECE

    createCouncil();
    setVisible(council, true);

    if (!(await pause(1600))) return;

    createPapers();

    if (!(await pause(3900))) return;


    // 6. SILENCIO

    setVisible(council, false);

    members.replaceChildren();
    papers.replaceChildren();

    if (!(await pause(2500))) return;


    // 7. NAVIDAD

    setVisible(christmasGlow, true);
    setVisible(treeGroup, true);
    setVisible(snow, true);

    if (!(await pause(3500))) return;


    // 8. ANDRÉS CAMINA HACIA BLANCA

    beginSvgAnimation("andresWalkAnim");

    if (!(await pause(4650))) return;


    // 9. FINAL

    endingScreen.classList.add("is-visible");

    finished = true;
    pauseButton.disabled = true;
}


/* =========================================
   PAUSAR Y CONTINUAR
========================================= */

function togglePause() {
    if (finished || storyScreen.hidden) return;

    paused = !paused;

    storyScreen.classList.toggle("is-paused", paused);
    pauseButton.classList.toggle("is-paused", paused);

    if (paused) {
        sceneSvg.pauseAnimations();

        document.getAnimations().forEach(animation => {
            animation.pause();
        });

        pauseIcon.textContent = "▶";
        pauseText.textContent = "CONTINUAR";

    } else {
        sceneSvg.unpauseAnimations();

        document.getAnimations().forEach(animation => {
            animation.play();
        });

        pauseIcon.textContent = "Ⅱ";
        pauseText.textContent = "PAUSAR";
    }
}


/* =========================================
   REINICIAR
========================================= */

function restart() {
    if (storyScreen.hidden) return;

    playStory();
}


/* =========================================
   EVENTOS
========================================= */

pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", restart);


/* =========================================
   INICIALIZACIÓN
========================================= */

createSnow();

resetScene();

console.log("A LITTLE HISTORY — Sistema iniciado.");
