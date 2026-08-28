"use strict";

/* =========================================================
   MENU.JS
   Sistema completo de menus do jogo
========================================================= */

const Menu = {

    currentScreen: "main",

    soundEnabled: true,

    musicEnabled: true,

    initialized: false,

    /* -----------------------------------------------------
       INICIAR MENU
    ----------------------------------------------------- */

    init() {

        if (this.initialized) return;

        this.initialized = true;

        this.setupMainMenu();

        this.setupPauseMenu();

        this.setupGameOverMenu();

        this.setupVictoryMenu();

        this.setupOptionsMenu();

        this.setupWorldMap();

        this.setupInventory();

        this.setupKeyboard();

        this.updateContinueButton();

        console.log("Menu carregado!");

    },


    /* -----------------------------------------------------
       PEGAR ELEMENTO
    ----------------------------------------------------- */

    get(id) {

        return document.getElementById(id);

    },


    /* -----------------------------------------------------
       MOSTRAR TELA
    ----------------------------------------------------- */

    show(element) {

        if (!element) return;

        element.classList.remove("hidden");

    },


    /* -----------------------------------------------------
       ESCONDER TELA
    ----------------------------------------------------- */

    hide(element) {

        if (!element) return;

        element.classList.add("hidden");

    },


    /* -----------------------------------------------------
       MOSTRAR MENU PRINCIPAL
    ----------------------------------------------------- */

    showMainMenu() {

        this.hide(this.get("game"));

        this.hide(this.get("world-map-screen"));

        this.hide(this.get("pause-screen"));

        this.hide(this.get("game-over-screen"));

        this.hide(this.get("victory-screen"));

        this.hide(this.get("options-screen"));

        this.hide(this.get("inventory-screen"));

        this.show(this.get("main-menu"));

        this.currentScreen = "main";

        if (typeof GAME !== "undefined") {

            GAME.running = false;

            GAME.paused = false;

        }

        this.updateContinueButton();

    },


    /* -----------------------------------------------------
       BOTÕES DO MENU PRINCIPAL
    ----------------------------------------------------- */

    setupMainMenu() {

        const newGame =
            this.get("new-game-button");

        const continueGame =
            this.get("continue-button");

        const worldMap =
            this.get("world-map-button");

        const options =
            this.get("options-button");


        if (newGame) {

            newGame.addEventListener(
                "click",
                () => {

                    this.newGame();

                }
            );

        }


        if (continueGame) {

            continueGame.addEventListener(
                "click",
                () => {

                    this.continueGame();

                }
            );

        }


        if (worldMap) {

            worldMap.addEventListener(
                "click",
                () => {

                    this.openWorldMap();

                }
            );

        }


        if (options) {

            options.addEventListener(
                "click",
                () => {

                    this.openOptions();

                }
            );

        }

    },


    /* -----------------------------------------------------
       NOVO JOGO
    ----------------------------------------------------- */

    newGame() {

        this.clearSave();

        if (typeof player !== "undefined") {

            player.lives = 3;

            player.coins = 0;

            player.stars = 0;

            player.score = 0;

            player.checkpointX = 120;

            player.checkpointY = 0;

        }


        if (typeof GAME !== "undefined") {

            GAME.currentLevel = 1;

            GAME.gameOver = false;

            GAME.levelComplete = false;

            GAME.paused = false;

        }


        this.startGame(1);

    },


    /* -----------------------------------------------------
       CONTINUAR
    ----------------------------------------------------- */

    continueGame() {

        const level =
            Number(
                localStorage.getItem(
                    "aventuraCurrentLevel"
                ) || 1
            );


        const unlocked =
            Number(
                localStorage.getItem(
                    "aventuraUnlockedLevel"
                ) || 1
            );


        const selected =
            Math.max(
                1,
                Math.min(
                    level,
                    unlocked
                )
            );


        this.startGame(selected);

    },


    /* -----------------------------------------------------
       ATUALIZAR BOTÃO CONTINUAR
    ----------------------------------------------------- */

    updateContinueButton() {

        const button =
            this.get("continue-button");

        if (!button) return;


        const save =
            localStorage.getItem(
                "aventuraCurrentLevel"
            );


        if (save) {

            button.disabled = false;

            button.style.opacity = "1";

            button.textContent =
                `CONTINUAR — FASE ${save}`;

        } else {

            button.disabled = true;

            button.style.opacity = ".5";

            button.textContent =
                "CONTINUAR";

        }

    },


    /* -----------------------------------------------------
       INICIAR JOGO
    ----------------------------------------------------- */

    startGame(level = 1) {

        this.hide(this.get("main-menu"));

        this.hide(this.get("world-map-screen"));

        this.hide(this.get("options-screen"));

        this.hide(this.get("game-over-screen"));

        this.hide(this.get("victory-screen"));

        this.hide(this.get("pause-screen"));


        this.show(this.get("game"));


        if (
            typeof startLevel === "function"
        ) {

            startLevel(level);

        } else {

            console.warn(
                "startLevel() não encontrada."
            );

        }


        this.currentScreen = "game";

    },


    /* -----------------------------------------------------
       PAUSE
    ----------------------------------------------------- */

    setupPauseMenu() {

        const pauseButton =
            this.get("pause-button");

        const resume =
            this.get("resume-button");

        const options =
            this.get("pause-options-button");

        const quit =
            this.get("quit-button");


        if (pauseButton) {

            pauseButton.addEventListener(
                "click",
                () => {

                    this.pause();

                }
            );

        }


        if (resume) {

            resume.addEventListener(
                "click",
                () => {

                    this.resume();

                }
            );

        }


        if (options) {

            options.addEventListener(
                "click",
                () => {

                    this.openOptions();

                }
            );

        }


        if (quit) {

            quit.addEventListener(
                "click",
                () => {

                    this.quitToMenu();

                }
            );

        }

    },


    /* -----------------------------------------------------
       PAUSAR
    ----------------------------------------------------- */

    pause() {

        if (
            typeof GAME !== "undefined"
        ) {

            GAME.paused = true;

        }


        this.show(
            this.get("pause-screen")
        );

        this.currentScreen = "pause";

    },


    /* -----------------------------------------------------
       CONTINUAR
    ----------------------------------------------------- */

    resume() {

        this.hide(
            this.get("pause-screen")
        );


        if (
            typeof GAME !== "undefined"
        ) {

            GAME.paused = false;

        }


        this.currentScreen = "game";

    },


    /* -----------------------------------------------------
       SAIR PARA MENU
    ----------------------------------------------------- */

    quitToMenu() {

        if (
            typeof GAME !== "undefined"
        ) {

            GAME.running = false;

            GAME.paused = false;

        }


        this.hide(
            this.get("pause-screen")
        );

        this.showMainMenu();

    },


    /* -----------------------------------------------------
       GAME OVER
    ----------------------------------------------------- */

    setupGameOverMenu() {

        const retry =
            this.get("retry-button");

        const menu =
            this.get("game-over-menu-button");


        if (retry) {

            retry.addEventListener(
                "click",
                () => {

                    this.retry();

                }
            );

        }


        if (menu) {

            menu.addEventListener(
                "click",
                () => {

                    this.showMainMenu();

                }
            );

        }

    },


    /* -----------------------------------------------------
       TENTAR NOVAMENTE
    ----------------------------------------------------- */

    retry() {

        this.hide(
            this.get("game-over-screen")
        );


        if (
            typeof restartLevel === "function"
        ) {

            restartLevel();

        } else {

            this.startGame(
                typeof GAME !== "undefined"
                    ? GAME.currentLevel
                    : 1
            );

        }

    },


    /* -----------------------------------------------------
       VITÓRIA
    ----------------------------------------------------- */

    setupVictoryMenu() {

        const next =
            this.get("next-level-button");

        const map =
            this.get("victory-map-button");


        if (next) {

            next.addEventListener(
                "click",
                () => {

                    this.nextLevel();

                }
            );

        }


        if (map) {

            map.addEventListener(
                "click",
                () => {

                    this.openWorldMap();

                }
            );

        }

    },


    /* -----------------------------------------------------
       PRÓXIMA FASE
    ----------------------------------------------------- */

    nextLevel() {

        if (
            typeof nextLevel === "function"
        ) {

            nextLevel();

            return;

        }


        let level = 1;


        if (
            typeof GAME !== "undefined"
        ) {

            level =
                GAME.currentLevel + 1;

        }


        this.startGame(level);

    },


    /* -----------------------------------------------------
       OPÇÕES
    ----------------------------------------------------- */

    setupOptionsMenu() {

        const close =
            this.get("close-options-button");

        const music =
            this.get("music-volume");

        const sfx =
            this.get("sfx-volume");

        const mobile =
            this.get("mobile-controls-toggle");


        if (close) {

            close.addEventListener(
                "click",
                () => {

                    this.closeOptions();

                }
            );

        }


        if (music) {

            music.addEventListener(
                "input",
                () => {

                    this.setMusicVolume(
                        music.value
                    );

                }
            );

        }


        if (sfx) {

            sfx.addEventListener(
                "input",
                () => {

                    this.setSfxVolume(
                        sfx.value
                    );

                }
            );

        }


        if (mobile) {

            mobile.addEventListener(
                "click",
                () => {

                    this.toggleMobileControls();

                }
            );

        }

    },


    /* -----------------------------------------------------
       ABRIR OPÇÕES
    ----------------------------------------------------- */

    openOptions() {

        this.show(
            this.get("options-screen")
        );

        this.currentScreen =
            "options";

    },


    /* -----------------------------------------------------
       FECHAR OPÇÕES
    ----------------------------------------------------- */

    closeOptions() {

        this.hide(
            this.get("options-screen")
        );


        if (
            typeof GAME !== "undefined" &&
            GAME.paused
        ) {

            this.currentScreen =
                "pause";

        } else {

            this.currentScreen =
                "game";

        }

    },


    /* -----------------------------------------------------
       VOLUME DA MÚSICA
    ----------------------------------------------------- */

    setMusicVolume(value) {

        const volume =
            Number(value) / 100;


        this.musicEnabled =
            volume > 0;


        if (
            typeof GAME !== "undefined"
        ) {

            GAME.musicVolume =
                volume;

        }


        const text =
            this.get("music-volume-value");


        if (text) {

            text.textContent =
                `${value}%`;

        }


        this.saveSettings();

    },


    /* -----------------------------------------------------
       VOLUME DOS EFEITOS
    ----------------------------------------------------- */

    setSfxVolume(value) {

        const volume =
            Number(value) / 100;


        this.soundEnabled =
            volume > 0;


        if (
            typeof GAME !== "undefined"
        ) {

            GAME.sfxVolume =
                volume;

        }


        const text =
            this.get("sfx-volume-value");


        if (text) {

            text.textContent =
                `${value}%`;

        }


        this.saveSettings();

    },


    /* -----------------------------------------------------
       CONTROLES MOBILE
    ----------------------------------------------------- */

    toggleMobileControls() {

        const controls =
            this.get("mobile-controls");

        const button =
            this.get(
                "mobile-controls-toggle"
            );


        const enabled =
            !controls ||
            controls.style.display !== "none";


        if (controls) {

            controls.style.display =
                enabled
                    ? "none"
                    : "";

        }


        if (button) {

            button.textContent =
                enabled
                    ? "DESATIVADOS"
                    : "ATIVADOS";

            button.classList.toggle(
                "active",
                !enabled
            );

        }


        if (
            typeof GAME !== "undefined"
        ) {

            GAME.mobileControls =
                !enabled;

        }


        localStorage.setItem(
            "aventuraMobileControls",
            !enabled
                ? "true"
                : "false"
        );

    },


    /* -----------------------------------------------------
       MAPA
    ----------------------------------------------------- */

    setupWorldMap() {

        const back =
            this.get("map-back-button");


        if (back) {

            back.addEventListener(
                "click",
                () => {

                    this.showMainMenu();

                }
            );

        }

    },


    /* -----------------------------------------------------
       ABRIR MAPA
    ----------------------------------------------------- */

    openWorldMap() {

        if (
            typeof GAME !== "undefined"
        ) {

            GAME.running = false;

            GAME.paused = false;

        }


        this.hide(
            this.get("main-menu")
        );

        this.hide(
            this.get("game")
        );

        this.hide(
            this.get("pause-screen")
        );

        this.hide(
            this.get("options-screen")
        );

        this.hide(
            this.get("victory-screen")
        );


        this.show(
            this.get("world-map-screen")
        );


        this.createMap();


        this.currentScreen =
            "map";

    },


    /* -----------------------------------------------------
       CRIAR MAPA
    ----------------------------------------------------- */

    createMap() {

        const map =
            this.get("world-map");

        if (!map) return;


        map.innerHTML = "";


        const unlocked =
            Number(
                localStorage.getItem(
                    "aventuraUnlockedLevel"
                ) || 1
            );


        const total =
            typeof GAME !== "undefined"
                ? GAME.totalLevels
                : 12;


        for (
            let i = 1;
            i <= total;
            i++
        ) {

            const node =
                document.createElement(
                    "button"
                );


            node.className =
                "level-node";


            node.textContent =
                i;


            node.dataset.level =
                i;


            const row =
                Math.floor(
                    (i - 1) / 4
                );

            const column =
                (i - 1) % 4;


            node.style.position =
                "absolute";


            node.style.left =
                `${10 + column * 25}%`;


            node.style.top =
                `${10 + row * 27}%`;


            if (i <= unlocked) {

                node.disabled = false;

                node.classList.add(
                    "unlocked"
                );


                node.addEventListener(
                    "click",
                    () => {

                        this.startGame(i);

                    }
                );

            } else {

                node.disabled = true;

                node.classList.add(
                    "locked"
                );

                node.textContent =
                    "🔒";

            }


            map.appendChild(
                node
            );

        }

    },


    /* -----------------------------------------------------
       INVENTÁRIO
    ----------------------------------------------------- */

    setupInventory() {

        const close =
            this.get(
                "close-inventory-button"
            );


        if (close) {

            close.addEventListener(
                "click",
                () => {

                    this.closeInventory();

                }
            );

        }

    },


    /* -----------------------------------------------------
       ABRIR INVENTÁRIO
    ----------------------------------------------------- */

    openInventory() {

        this.renderInventory();

        this.show(
            this.get("inventory-screen")
        );

    },


    /* -----------------------------------------------------
       FECHAR INVENTÁRIO
    ----------------------------------------------------- */

    closeInventory() {

        this.hide(
            this.get("inventory-screen")
        );

    },


    /* -----------------------------------------------------
       INVENTÁRIO
    ----------------------------------------------------- */

    renderInventory() {

        const container =
            this.get(
                "inventory-items"
            );

        if (!container) return;


        container.innerHTML = "";


        const coins =
            typeof player !== "undefined"
                ? player.coins
                : 0;


        const stars =
            typeof player !== "undefined"
                ? player.stars
                : 0;


        const lives =
            typeof player !== "undefined"
                ? player.lives
                : 3;


        const items = [

            {
                icon: "🪙",
                name: "Moedas",
                value: coins
            },

            {
                icon: "⭐",
                name: "Estrelas",
                value: stars
            },

            {
                icon: "❤️",
                name: "Vidas",
                value: lives
            },

            {
                icon: "🔥",
                name: "Flor de Fogo",
                value: "—"
            },

            {
                icon: "🍄",
                name: "Cogumelo",
                value: "—"
            },

            {
                icon: "🛡️",
                name: "Escudo",
                value: "—"
            }

        ];


        items.forEach(
            item => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "inventory-item";


                div.innerHTML = `

                    <div class="inventory-icon">
                        ${item.icon}
                    </div>

                    <div class="inventory-name">
                        ${item.name}
                    </div>

                    <div class="inventory-value">
                        ${item.value}
                    </div>

                `;


                container.appendChild(
                    div
                );

            }
        );

    },


    /* -----------------------------------------------------
       TECLADO DO MENU
    ----------------------------------------------------- */

    setupKeyboard() {

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    this.handleEscape();

                }


                if (
                    event.key.toLowerCase()
                    === "i"
                ) {

                    if (
                        this.currentScreen
                        === "game"
                    ) {

                        this.openInventory();

                    }

                }

            }
        );

    },


    /* -----------------------------------------------------
       ESC
    ----------------------------------------------------- */

    handleEscape() {

        const options =
            this.get(
                "options-screen"
            );

        const inventory =
            this.get(
                "inventory-screen"
            );


        if (
            options &&
            !options.classList.contains(
                "hidden"
            )
        ) {

            this.closeOptions();

            return;

        }


        if (
            inventory &&
            !inventory.classList.contains(
                "hidden"
            )
        ) {

            this.closeInventory();

            return;

        }


        if (
            this.currentScreen ===
            "game"
        ) {

            if (
                typeof togglePause ===
                "function"
            ) {

                togglePause();

            } else {

                this.pause();

            }

        }

    },


    /* -----------------------------------------------------
       SALVAR CONFIGURAÇÕES
    ----------------------------------------------------- */

    saveSettings() {

        localStorage.setItem(
            "aventuraMusicEnabled",
            this.musicEnabled
        );


        localStorage.setItem(
            "aventuraSoundEnabled",
            this.soundEnabled
        );

    },


    /* -----------------------------------------------------
       LIMPAR SAVE
    ----------------------------------------------------- */

    clearSave() {

        localStorage.removeItem(
            "aventuraCurrentLevel"
        );

        localStorage.removeItem(
            "aventuraCoins"
        );

        localStorage.removeItem(
            "aventuraStars"
        );

        localStorage.removeItem(
            "aventuraScore"
        );

        localStorage.setItem(
            "aventuraUnlockedLevel",
            "1"
        );

    }

};


/* =========================================================
   INICIAR MENU
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Menu.init();

    }
);


/* =========================================================
   FUNÇÕES GLOBAIS
   Compatibilidade com o game.js
========================================================= */

function abrirMenu() {

    Menu.showMainMenu();

}


function novoJogo() {

    Menu.newGame();

}


function continuarJogo() {

    Menu.continueGame();

}


function abrirMapa() {

    Menu.openWorldMap();

}


function abrirOpcoes() {

    Menu.openOptions();

}


function fecharOpcoes() {

    Menu.closeOptions();

}


function pausarJogo() {

    Menu.pause();

}


function continuarJogoAtual() {

    Menu.resume();

}


function sairDoJogo() {

    Menu.quitToMenu();

}


function reiniciarFase() {

    Menu.retry();

}


function proximaFase() {

    Menu.nextLevel();

}


function abrirInventario() {

    Menu.openInventory();

}
