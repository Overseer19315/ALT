
"use strict";

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const ACCESS_PASSWORD = "Sonrisa";

const accessScreen = document.getElementById("accessScreen");
const storyScreen = document.getElementById("storyScreen");

const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("passwordInput");
const loginFeedback = document.getElementById("loginFeedback");
const enterButton = document.getElementById("enterButton");

const sceneSvg = document.getElementById("sceneSvg");

const subtitlePanel = document.getElementById("subtitlePanel");
const subtitleSpeaker = document.getElementById("subtitleSpeaker");
const subtitleText = document.getElementById("subtitleText");

const pauseButton = document.getElementById("pauseButton");
const pauseIcon = document.getElementById("pauseIcon");
const pauseText = document.getElementById("pauseText");
const restartButton = document.getElementById("restartButton");

const blackout = document.getElementById("blackout");
const endingScreen = document.getElementById("endingScreen");
const storyControls = document.getElementById("storyControls");

const councilFurniture = document.getElementById("councilFurniture");
const councilMembers = document.getElementById("councilMembers");
const paperLayer = document.getElementById("paperLayer");
const snowLayer = document.getElementById("snowLayer");

const andres = document.getElementById("andres");
const blanca = document.getElementById("blanca");
const andresMotion = document.getElementById("andresMotion");
const blueAccused = document.getElementById("blueAccused");

let sequenceId = 0;
let paused = false;
let loginBusy = false;


/* =====================================================
   UTILIDADES
===================================================== */

function getElement(id) {
    const element = document.getElementById(id);

    if (!element) {
        console.error(`No se ha encontrado el elemento: ${id}`);
    }

    return element;
}


function setVisible(id, visible) {
    const element = getElement(id);

    if (!element) return;

    element.classList.toggle("is-visible", visible);
}


function activateBackdrop(id) {
    const backdrops = [
        "introBackdrop",
        "courtBackdrop",
        "winterBackdrop"
    ];

    backdrops.forEach(backdropId => {
        setVisible(backdropId, backdropId === id);
    });
}


function caption(text, speaker = "NARRADOR") {
    subtitlePanel.classList.remove("is-on");

    subtitleSpeaker.textContent = speaker;
    subtitleText.textContent = text;

    requestAnimationFrame(() => {
        subtitlePanel.classList.add("is-on");
    });
}


function hideCaption() {
    subtitlePanel.classList.remove("is-on");
}


/*
 * Espera una cantidad de tiempo sin contar el tiempo
 * durante el que la historia está pausada.
 */
function wait(milliseconds, currentSequence) {
    return new Promise(resolve => {
        let remaining = milliseconds;
        let previousTime = performance.now();

        function tick(currentTime) {
            if (currentSequence !== sequenceId) {
                resolve(false);
                return;
            }

            const delta = Math.min(currentTime - previousTime, 100);
            previousTime = currentTime;

            if (!paused && !document.hidden) {
                remaining -= delta;
            }

            if (remaining <= 0) {
                resolve(true);
                return;
            }

            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    });
}


/* =====================================================
   CREACIÓN DE LOS 13 MIEMBROS
===================================================== */

function createCouncil() {
    councilFurniture.innerHTML = "";
    councilMembers.innerHTML = "";

    const upperRow = [
        160, 340, 520, 700, 880, 1060, 1240
    ];

    const lowerRow = [
        250, 430, 610, 790, 970, 1150
    ];

    const positions = [
        ...upperRow.map(x => ({ x, y: 155 })),
        ...lowerRow.map(x => ({ x, y: 350 }))
    ];

    positions.forEach((position, index) => {

        const { x, y } = position;

        /*
         * Atril individual.
         * Se crea primero para que el personaje
         * aparezca delante de él.
         */

        const podium = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        podium.setAttribute("class", "council-podium");
        podium.setAttribute(
            "transform",
            `translate(${x} ${y})`
        );

        podium.innerHTML = `
            <rect x="-56" y="96"
                width="112" height="80"
                rx="2"
                fill="#21161c"
                stroke="#61404a"
                stroke-width="2"/>

            <rect x="-56" y="96"
                width="112" height="7"
                class="podium-accent"/>

            <path d="M-42 119 H42"
                stroke="#75424c"
                stroke-width="2"
                opacity=".7"/>

            <text x="0" y="145"
                text-anchor="middle"
                fill="#9e8588"
                font-family="Arial, sans-serif"
                font-size="11"
                letter-spacing="2">
                ${String(index + 1).padStart(2, "0")}
            </text>
        `;

        councilFurniture.appendChild(podium);


        /*
         * Stickman de cinta roja.
         * Cada miembro tiene su propia posición.
         */

        const member = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

        member.setAttribute(
            "class",
            "council-member"
        );

        member.setAttribute(
            "transform",
            `translate(${x} ${y})`
        );

        member.style.animationDelay = `${index * 0.045}s`;

        member.innerHTML = `
            <circle class="head"
                cx="0" cy="0" r="18"/>

            <path class="body-line"
                d="M0 20 V83"/>

            <path class="body-line"
                d="M0 42 L-31 67"/>

            <path class="body-line"
                d="M0 42 L31 67"/>

            <path class="body-line"
                d="M0 83 L-24 126 M0 83 L24 126"/>

            <path class="ribbon"
                d="M-25 47 L-15 56"/>

        `;

        councilMembers.appendChild(member);
    });

    console.assert(
        councilMembers.children.length === 13,
        "El consejo debe tener exactamente 13 miembros."
    );
}


/* =====================================================
   PAPELES DEL JUICIO
===================================================== */

function createPapers() {
    paperLayer.innerHTML = "";

    for (let i = 0; i < 30; i++) {

        const paper = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );

        const x = 330 + ((i * 83) % 740);
        const y = 430 + ((i * 37) % 100);

        const width = 13 + (i % 5) * 3;
        const height = 20 + (i % 4) * 5;

        paper.setAttribute("x", x);
        paper.setAttribute("y", y);
        paper.setAttribute("width", width);
        paper.setAttribute("height", height);
        paper.setAttribute("rx", "1");
        paper.setAttribute("class", "paper");

        paper.style.setProperty(
            "--duration",
            `${2.4 + (i % 6) * 0.38}s`
        );

        paper.style.setProperty(
            "--delay",
            `${(i % 10) * 0.11}s`
        );

        paper.style.setProperty(
            "--drift",
            `${((i % 7) - 3) * 28}px`
        );

        paper.style.setProperty(
            "--spin",
            `${(i % 2 === 0 ? 1 : -1) * (220 + i * 13)}deg`
        );

        paperLayer.appendChild(paper);
    }
}


function releasePapers() {
    const papers = paperLayer.querySelectorAll(".paper");

    papers.forEach(paper => {
        paper.classList.add("is-falling");
    });
}


/* =====================================================
   NIEVE
===================================================== */

function createSnow() {
    snowLayer.innerHTML = "";

    for (let i = 0; i < 100; i++) {

        const snowflake = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        const x = (i * 137) % 1400;
        const y = (i * 83) % 900;
        const radius = 1 + (i % 4) * 0.65;

        snowflake.setAttribute("cx", x);
        snowflake.setAttribute("cy", y);
        snowflake.setAttribute("r", radius);
        snowflake.setAttribute("class", "snowflake");

        snowflake.style.setProperty(
            "--duration",
            `${6 + (i % 8) * 1.1}s`
        );

        snowflake.style.setProperty(
            "--delay",
            `${-((i * 0.37) % 12)}s`
        );

        snowflake.style.setProperty(
            "--drift",
            `${((i % 9) - 4) * 13}px`
        );

        snowLayer.appendChild(snowflake);
    }
}


/* =====================================================
   REINICIO VISUAL
===================================================== */

function resetScene() {

    const visibleElements = [
        "dream",
        "spear",
        "dreamFragments",
        "impactFlash",
        "councilFurniture",
        "councilMembers",
        "blueAccused",
        "snowLayer",
        "winterGlow"
    ];

    visibleElements.forEach(id => setVisible(id, false));

    activateBackdrop("introBackdrop");

    andres.classList.remove(
        "is-visible",
        "enter-left",
        "approach",
        "walk-toward"
    );

    blanca.classList.remove(
        "is-visible",
        "enter-right"
    );

    blueAccused.classList.remove("is-visible");

    const spear = getElement("spear");
    const spearMotion = getElement("spearMotion");

    spear.classList.remove("is-falling");
    spear.classList.remove("is-visible");

    spearMotion.style.animation = "none";
    void spearMotion.getBoundingClientRect();
    spearMotion.style.animation = "";

    andresMotion.style.animation = "none";
    void andresMotion.getBoundingClientRect();
    andresMotion.style.animation = "";

    councilMembers.innerHTML = "";
    councilFurniture.innerHTML = "";
    paperLayer.innerHTML = "";

    subtitleSpeaker.textContent = "NARRADOR";
    subtitleText.textContent = "";
    hideCaption();

    blackout.classList.remove("is-black");
    endingScreen.classList.remove("is-visible");

    storyControls.style.opacity = "1";
    storyControls.style.pointerEvents = "auto";

    pauseButton.setAttribute("aria-pressed", "false");
    pauseButton.setAttribute("aria-label", "Pausar historia");

    pauseIcon.textContent = "Ⅱ";
    pauseText.textContent = "PAUSAR";

    createCouncil();
    createPapers();
}


/* =====================================================
   HISTORIA COMPLETA
===================================================== */

async function playStory() {

    const currentSequence = ++sequenceId;

    paused = false;
    storyScreen.classList.remove("paused");

    resetScene();

    const pauseFor = async milliseconds => {
        return await wait(milliseconds, currentSequence);
    };


    /* -------------------------------------------------
       ESCENA 1 — EL PRINCIPIO
    ------------------------------------------------- */

    activateBackdrop("introBackdrop");

    caption(
        "Todo comenzó sin grandes promesas. Solo era un día cualquiera."
    );

    if (!(await pauseFor(4300))) return;


    /* -------------------------------------------------
       ESCENA 2 — ANDRÉS
    ------------------------------------------------- */

    andres.classList.add("is-visible", "enter-left");

    caption(
        "Alguien caminaba sin saber que aquel día acabaría siendo diferente."
    );

    if (!(await pauseFor(4200))) return;

    caption(
        "No tenía ninguna certeza. Ni siquiera sabía qué esperaba encontrar."
    );

    if (!(await pauseFor(3800))) return;


    /* -------------------------------------------------
       ESCENA 3 — BLANCA
    ------------------------------------------------- */

    blanca.classList.add("is-visible", "enter-right");

    caption(
        "Y entonces apareció ella."
    );

    if (!(await pauseFor(4000))) return;

    caption(
        "Por un instante, el ruido de todo lo demás pareció quedar lejos."
    );

    if (!(await pauseFor(4000))) return;


    /* -------------------------------------------------
       ESCENA 4 — ACERCAMIENTO
    ------------------------------------------------- */

    andres.classList.remove("enter-left");
    andres.classList.add("approach");

    caption(
        "Andrés dio un paso hacia ella. No sabía qué decir, pero quería acercarse."
    );

    if (!(await pauseFor(4400))) return;

    caption(
        "A veces, lo que uno imagina es más sencillo que lo que se atreve a hacer."
    );

    if (!(await pauseFor(4000))) return;


    /* -------------------------------------------------
       ESCENA 5 — LA IMAGINACIÓN
    ------------------------------------------------- */

    setVisible("dream", true);

    caption(
        "En su imaginación, no había explicaciones que dar."
    );

    if (!(await pauseFor(3500))) return;

    caption(
        "No había distancia. No había preguntas. Solo dos personas."
    );

    if (!(await pauseFor(3500))) return;

    caption(
        "Y dos manos que, por un instante, encontraban la forma de estar juntas."
    );

    if (!(await pauseFor(5200))) return;


    /* -------------------------------------------------
       ESCENA 6 — LA INTERRUPCIÓN
    ------------------------------------------------- */

    caption(
        "Pero no todas las historias reciben permiso para existir."
    );

    if (!(await pauseFor(2600))) return;

    setVisible("spear", true);

    const spear = getElement("spear");
    spear.classList.add("is-falling");

    caption(
        "Algo cayó desde arriba. Y aquel pequeño mundo empezó a romperse."
    );

    if (!(await pauseFor(1100))) return;

    setVisible("impactFlash", true);
    setVisible("dreamFragments", true);
    setVisible("dream", false);

    if (!(await pauseFor(2600))) return;


    /* -------------------------------------------------
       ESCENA 7 — EL CONSEJO
    ------------------------------------------------- */

    activateBackdrop("courtBackdrop");

    andres.classList.remove("is-visible");
    blanca.classList.remove("is-visible");
    spear.classList.remove("is-visible");

    caption(
        "Desde arriba, alguien había estado observando."
    );

    if (!(await pauseFor(3600))) return;

    setVisible("councilFurniture", true);
    setVisible("councilMembers", true);
    setVisible("blueAccused", true);

    caption(
        "Trece figuras. Trece cintas rojas. Una sola persona frente a ellas."
    );

    if (!(await pauseFor(4800))) return;


    /* -------------------------------------------------
       ESCENA 8 — EL JUICIO
    ------------------------------------------------- */

    caption(
        "Los de arriba no veían a alguien que intentaba acercarse. Veían a alguien a quien juzgar.",
        "NARRADOR"
    );

    if (!(await pauseFor(4300))) return;

    caption(
        "¿Quién te ha dado derecho a acercarte?",
        "LOS DE ARRIBA"
    );

    if (!(await pauseFor(4200))) return;

    caption(
        "¿Acaso no conoces el lugar que te corresponde?",
        "LOS DE ARRIBA"
    );

    if (!(await pauseFor(4200))) return;

    caption(
        "No esperaban una respuesta. La decisión ya estaba tomada.",
        "NARRADOR"
    );

    if (!(await pauseFor(4600))) return;


    /* -------------------------------------------------
       ESCENA 9 — LOS PAPELES
    ------------------------------------------------- */

    caption(
        "Cada palabra caía sobre él como una sentencia."
    );

    if (!(await pauseFor(3000))) return;

    releasePapers();

    caption(
        "Después llegaron los papeles. Como si unas cuantas hojas pudieran decidir el valor de alguien."
    );

    if (!(await pauseFor(5200))) return;


    /* -------------------------------------------------
       ESCENA 10 — EL SILENCIO
    ------------------------------------------------- */

    setVisible("councilMembers", false);
    setVisible("councilFurniture", false);

    caption(
        "Cuando terminaron, nadie dijo nada más."
    );

    if (!(await pauseFor(3800))) return;

    caption(
        "El azul permaneció allí. No porque no tuviera nada que decir, sino porque ya nadie parecía dispuesto a escuchar."
    );

    if (!(await pauseFor(5200))) return;

    setVisible("blueAccused", false);


    /* -------------------------------------------------
       ESCENA 11 — INVIERNO
    ------------------------------------------------- */

    activateBackdrop("winterBackdrop");

    andres.classList.remove("approach", "enter-left");
    blanca.classList.remove("enter-right");

    andres.classList.add("is-visible");
    blanca.classList.add("is-visible");

    caption(
        "El tiempo pasó. Las voces se quedaron atrás."
    );

    if (!(await pauseFor(4000))) return;

    caption(
        "Llegó el frío. Las calles se fueron quedando vacías."
    );

    if (!(await pauseFor(4000))) return;

    setVisible("snowLayer", true);
    setVisible("winterGlow", true);

    caption(
        "Pero hay cosas que no desaparecen solo porque el mundo siga adelante."
    );

    if (!(await pauseFor(5000))) return;


    /* -------------------------------------------------
       ESCENA 12 — EL CAMINO
    ------------------------------------------------- */

    caption(
        "A lo lejos, Blanca seguía allí."
    );

    if (!(await pauseFor(3500))) return;

    caption(
        "Andrés la miró durante unos segundos. Esta vez no había nadie entre ellos."
    );

    if (!(await pauseFor(4500))) return;

    caption(
        "No sabía qué ocurriría después. Aun así, decidió dar el primer paso."
    );

    if (!(await pauseFor(4000))) return;


    /* -------------------------------------------------
       ESCENA 13 — ANTES DE LLEGAR
    ------------------------------------------------- */

    const motion = andresMotion;

    motion.getAnimations().forEach(animation => {
        animation.cancel();
    });

    motion.animate(
        [
            { transform: "translateX(0px)" },
            { transform: "translateX(455px)" }
        ],
        {
            duration: 6500,
            easing: "cubic-bezier(.35,.1,.25,1)",
            fill: "forwards"
        }
    );

    caption(
        "Un paso. Luego otro. Y, por primera vez, parecía que podía acercarse."
    );

    if (!(await pauseFor(4200))) return;

    caption(
        "Pero algunas historias todavía no han llegado al momento de encontrarse."
    );

    if (!(await pauseFor(3400))) return;


    /* -------------------------------------------------
       ESCENA 14 — FINAL ABIERTO
    ------------------------------------------------- */

    hideCaption();

    storyControls.style.opacity = "0";
    storyControls.style.pointerEvents = "none";

    blackout.classList.add("is-black");

    if (!(await pauseFor(3300))) return;

    endingScreen.classList.add("is-visible");
}


/* =====================================================
   ACCESO
===================================================== */

loginForm.addEventListener("submit", event => {
    event.preventDefault();

    if (loginBusy) return;

    const password = passwordInput.value.trim();

    if (password.toLowerCase() !== ACCESS_PASSWORD.toLowerCase()) {

        loginFeedback.textContent = "La contraseña no es correcta.";
        passwordInput.classList.remove("invalid");

        void passwordInput.offsetWidth;

        passwordInput.classList.add("invalid");
        passwordInput.focus();

        return;
    }

    loginBusy = true;

    loginFeedback.textContent = "";
    enterButton.disabled = true;
    enterButton.querySelector("span").textContent = "ENTRANDO...";

    accessScreen.classList.add("is-leaving");

    window.setTimeout(() => {

        accessScreen.hidden = true;
        storyScreen.hidden = false;

        playStory();

    }, 850);
});


/* =====================================================
   PAUSA Y REANUDACIÓN
===================================================== */

function togglePause() {

    if (endingScreen.classList.contains("is-visible")) {
        return;
    }

    paused = !paused;

    storyScreen.classList.toggle("paused", paused);

    if (paused) {

        document.getAnimations().forEach(animation => {
            animation.pause();
        });

        pauseIcon.textContent = "▶";
        pauseText.textContent = "CONTINUAR";

        pauseButton.setAttribute("aria-pressed", "true");
        pauseButton.setAttribute("aria-label", "Reanudar historia");

    } else {

        document.getAnimations().forEach(animation => {
            animation.play();
        });

        pauseIcon.textContent = "Ⅱ";
        pauseText.textContent = "PAUSAR";

        pauseButton.setAttribute("aria-pressed", "false");
        pauseButton.setAttribute("aria-label", "Pausar historia");
    }
}


/* =====================================================
   REINICIO
===================================================== */

function restartStory() {

    sequenceId++;

    paused = false;

    storyScreen.classList.remove("paused");

    document.getAnimations().forEach(animation => {
        animation.cancel();
    });

    resetScene();

    playStory();
}


/* =====================================================
   EVENTOS
===================================================== */

pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", restartStory);


/* =====================================================
   INICIALIZACIÓN
===================================================== */

createCouncil();
createPapers();
createSnow();

resetScene();

console.log("A LITTLE HISTORY — Sistema inicializado.");
console.log("Consejo: 13 miembros.");
console.log("Personajes: cinta azul y cinta blanca.");
console.log("Historia preparada.");
