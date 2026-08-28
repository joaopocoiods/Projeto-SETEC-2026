/* =========================================================
   AVENTURA PIXEL
   GAME.JS
   Motor principal do jogo
========================================================= */

"use strict";

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const GAME = {

    width: 960,
    height: 540,

    gravity: 0.65,

    maxFallSpeed: 14,

    playerSpeed: 4.5,

    runSpeed: 7,

    jumpForce: -12.5,

    friction: 0.82,

    worldWidth: 5000,

    groundHeight: 90,

    totalLevels: 12,

    currentLevel: 1,

    running: false,

    paused: false,

    gameOver: false,

    levelComplete: false,

    cameraX: 0,

    musicVolume: 0.7,

    sfxVolume: 0.8,

    mobileControls: true
};


/* =========================================================
   ESTADO DO JOGADOR
========================================================= */

const player = {

    x: 120,

    y: 0,

    width: 48,

    height: 65,

    vx: 0,

    vy: 0,

    speed: GAME.playerSpeed,

    jumpForce: GAME.jumpForce,

    onGround: false,

    facing: 1,

    running: false,

    invincible: false,

    invincibleTimer: 0,

    dead: false,

    lives: 3,

    coins: 0,

    stars: 0,

    score: 0,

    checkpointX: 120,

    checkpointY: 0
};


/* =========================================================
   INPUT
========================================================= */

const keys = {

    left: false,

    right: false,

    jump: false,

    run: false,

    pause: false
};


/* =========================================================
   OBJETOS DO JOGO
========================================================= */

let blocks = [];

let coins = [];

let enemies = [];

let effects = [];

let decorations = [];

let levelData = [];

let selectedCharacter = 0;


/* =========================================================
   ELEMENTOS HTML
========================================================= */

const $ = id => document.getElementById(id);

const elements = {};


/* =========================================================
   INICIALIZAÇÃO DOS ELEMENTOS
========================================================= */

function cacheElements() {

    elements.loadingScreen =
        $("loading-screen");

    elements.loadingProgress =
        $("loading-progress");

    elements.loadingText =
        $("loading-text");

    elements.mainMenu =
        $("main-menu");

    elements.game =
        $("game");

    elements.worldMapScreen =
        $("world-map-screen");

    elements.pauseScreen =
        $("pause-screen");

    elements.gameOverScreen =
        $("game-over-screen");

    elements.victoryScreen =
        $("victory-screen");

    elements.optionsScreen =
        $("options-screen");

    elements.inventoryScreen =
        $("inventory-screen");

    elements.characterScreen =
        $("character-screen");

    elements.world =
        $("world");

    elements.player =
        $("player");

    elements.blockLayer =
        $("block-layer");

    elements.itemLayer =
        $("item-layer");

    elements.enemyLayer =
        $("enemy-layer");

    elements.effectLayer =
        $("effect-layer");

    elements.decorationLayer =
        $("decoration-layer");

    elements.backgroundLayer =
        $("background-layer");

    elements.groundLayer =
        $("ground-layer");

    elements.finishObject =
        $("finish-object");

    elements.checkpoint =
        $("checkpoint");

    elements.levelMessage =
        $("level-message");

    elements.levelWorldName =
        $("level-world-name");

    elements.levelName =
        $("level-name");

    elements.hudLives =
        $("hud-lives");

    elements.hudCoins =
        $("hud-coins");

    elements.hudStars =
        $("hud-stars");

    elements.hudScore =
        $("hud-score");

    elements.hudWorld =
        $("hud-world");

    elements.pauseButton =
        $("pause-button");

    elements.miniMapPlayer =
        $("mini-map-player");

    elements.notificationContainer =
        $("notification-container");

    elements.popupContainer =
        $("popup-container");

    elements.levelTransition =
        $("level-transition");

    elements.transitionWorld =
        $("transition-world");

    elements.transitionLevel =
        $("transition-level");

    elements.transitionTitle =
        $("transition-title");

    elements.musicPlayer =
        $("music-player");

    elements.sfxPlayer =
        $("sfx-player");

    elements.musicVolume =
        $("music-volume");

    elements.musicVolumeValue =
        $("music-volume-value");

    elements.sfxVolume =
        $("sfx-volume");

    elements.sfxVolumeValue =
        $("sfx-volume-value");

    elements.mobileControlsToggle =
        $("mobile-controls-toggle");

    elements.mobileControls =
        $("mobile-controls");

    elements.mobileControlsToggle =
        $("mobile-controls-toggle");

    elements.inventoryItems =
        $("inventory-items");

    elements.characterList =
        $("character-list");

    elements.gameOverCoins =
        $("game-over-coins");

    elements.gameOverScore =
        $("game-over-score");

    elements.victoryCoins =
        $("victory-coins");

    elements.victoryStars =
        $("victory-stars");

    elements.victoryScore =
        $("victory-score");
}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );
}


function distance(x1, y1, x2, y2) {

    return Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2)
    );
}


function random(min, max) {

    return Math.random() *
        (max - min) +
        min;
}


function randomInt(min, max) {

    return Math.floor(
        random(min, max + 1)
    );
}


function rectsCollide(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}


/* =========================================================
   TELAS
========================================================= */

function showScreen(screen) {

    const screens = [

        elements.loadingScreen,

        elements.mainMenu,

        elements.game,

        elements.worldMapScreen,

        elements.characterScreen

    ];

    screens.forEach(item => {

        if (!item) return;

        item.classList.add("hidden");

    });

    if (screen) {

        screen.classList.remove("hidden");

    }
}


function showOverlay(overlay) {

    if (!overlay) return;

    overlay.classList.remove("hidden");
}


function hideOverlay(overlay) {

    if (!overlay) return;

    overlay.classList.add("hidden");
}


/* =========================================================
   CARREGAMENTO
========================================================= */

function startLoading() {

    let progress = 0;

    const interval = setInterval(() => {

        progress += randomInt(3, 8);

        progress =
            Math.min(progress, 100);

        if (elements.loadingProgress) {

            elements.loadingProgress.style.width =
                `${progress}%`;

        }

        if (elements.loadingText) {

            if (progress < 25) {

                elements.loadingText.textContent =
                    "Preparando mundo...";

            } else if (progress < 50) {

                elements.loadingText.textContent =
                    "Carregando personagens...";

            } else if (progress < 75) {

                elements.loadingText.textContent =
                    "Criando fases...";

            } else if (progress < 100) {

                elements.loadingText.textContent =
                    "Quase pronto...";

            } else {

                elements.loadingText.textContent =
                    "Aventura pronta!";

            }

        }

        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                showScreen(
                    elements.mainMenu
                );

            }, 500);

        }

    }, 70);
}


/* =========================================================
   DADOS DAS FASES
========================================================= */

function createLevels() {

    const names = [

        "Aventura Verde",

        "Floresta Misteriosa",

        "Colinas Douradas",

        "Deserto Escaldante",

        "Caverna Sombria",

        "Montanha Gelada",

        "Lago Cristalino",

        "Cidade Mecânica",

        "Floresta Noturna",

        "Vulcão Ardente",

        "Castelo Perdido",

        "O Grande Castelo"

    ];


    for (
        let i = 0;
        i < GAME.totalLevels;
        i++
    ) {

        levelData.push({

            id: i + 1,

            name:
                names[i] ||
                `Aventura ${i + 1}`,

            world:
                Math.floor(i / 3) + 1,

            width:
                5000 + i * 250,

            difficulty:
                i + 1

        });

    }
}


/* =========================================================
   CONSTRUIR FASE
========================================================= */

function buildLevel(level = 1) {

    GAME.currentLevel =
        clamp(
            level,
            1,
            GAME.totalLevels
        );

    const data =
        levelData[GAME.currentLevel - 1];


    blocks = [];
    coins = [];
    enemies = [];
    effects = [];
    decorations = [];


    GAME.worldWidth =
        data.width;


    player.x = 120;

    player.y =
        window.innerHeight -
        GAME.groundHeight -
        player.height;

    player.vx = 0;

    player.vy = 0;

    player.onGround = false;

    player.checkpointX = 120;

    player.checkpointY =
        player.y;

    player.dead = false;

    GAME.cameraX = 0;

    GAME.levelComplete = false;


    createLevelBlocks();

    createLevelCoins();

    createLevelEnemies();

    createLevelDecorations();

    renderWorld();

    updateHUD();

    showLevelTitle();

}


/* =========================================================
   BLOCOS DA FASE
========================================================= */

function createLevelBlocks() {

    const level =
        GAME.currentLevel;


    /* Plataformas iniciais */

    addBlock(450, 360, "question");

    addBlock(500, 360, "brick");

    addBlock(550, 360, "coin");

    addBlock(600, 360, "brick");


    addBlock(800, 300, "brick");

    addBlock(850, 300, "question");

    addBlock(900, 300, "brick");


    /* Escadas */

    for (let i = 0; i < 5; i++) {

        for (let j = 0; j <= i; j++) {

            addBlock(
                1100 + i * 48,
                450 - j * 48,
                "brick"
            );

        }

    }


    /* Plataformas médias */

    for (let i = 0; i < 8; i++) {

        addBlock(
            1500 + i * 48,
            330,
            i % 3 === 0
                ? "question"
                : "brick"
        );

    }


    /* Seção longa */

    for (let i = 0; i < 15; i++) {

        const y =
            280 +
            Math.sin(i) * 50;

        addBlock(
            2100 + i * 55,
            y,
            i % 5 === 0
                ? "question"
                : "brick"
        );

    }


    /* Final */

    for (let i = 0; i < 8; i++) {

        addBlock(
            3000 + i * 48,
            350,
            i % 2
                ? "brick"
                : "question"
        );

    }


    /* Castelo */

    if (level >= 10) {

        for (let i = 0; i < 15; i++) {

            addBlock(
                3500 + i * 50,
                250 +
                (i % 3) * 50,
                "brick"
            );

        }

    }

}


/* =========================================================
   ADICIONAR BLOCO
========================================================= */

function addBlock(x, y, type = "brick") {

    blocks.push({

        id:
            `block-${blocks.length}`,

        x,

        y,

        width: 48,

        height: 48,

        type,

        active: true,

        hit: false

    });

}


/* =========================================================
   MOEDAS
========================================================= */

function createLevelCoins() {

    const positions = [

        [300, 420],

        [450, 300],

        [500, 300],

        [550, 300],

        [700, 400],

        [850, 240],

        [900, 240],

        [1300, 350],

        [1350, 300],

        [1400, 250],

        [1700, 250],

        [1750, 250],

        [1800, 250],

        [2200, 220],

        [2300, 180],

        [2400, 220],

        [2500, 180],

        [2600, 220],

        [2800, 400],

        [2900, 350],

        [3000, 300],

        [3200, 400],

        [3300, 350],

        [3400, 300]

    ];


    positions.forEach(
        ([x, y]) => {

            addCoin(x, y);

        }
    );

}


/* =========================================================
   ADICIONAR MOEDA
========================================================= */

function addCoin(x, y) {

    coins.push({

        id:
            `coin-${coins.length}`,

        x,

        y,

        width: 28,

        height: 32,

        collected: false,

        animation:
            Math.random() * Math.PI * 2

    });

}


/* =========================================================
   INIMIGOS
========================================================= */

function createLevelEnemies() {

    const level =
        GAME.currentLevel;


    const positions = [

        [650, 0],

        [1000, 0],

        [1250, 0],

        [1550, 0],

        [1900, 0],

        [2150, 0],

        [2450, 0],

        [2750, 0],

        [3100, 0],

        [3350, 0]

    ];


    positions.forEach(
        ([x]) => {

            addEnemy(
                x,
                getGroundY() - 43
            );

        }
    );


    if (level >= 4) {

        addEnemy(
            3600,
            getGroundY() - 43,
            "fast"
        );

    }


    if (level >= 7) {

        addEnemy(
            4000,
            getGroundY() - 43,
            "strong"
        );

    }

}


/* =========================================================
   ADICIONAR INIMIGO
========================================================= */

function addEnemy(
    x,
    y,
    type = "normal"
) {

    enemies.push({

        id:
            `enemy-${enemies.length}`,

        x,

        y,

        width: 48,

        height: 43,

        vx:
            type === "fast"
                ? -2.2
                : -1.1,

        vy: 0,

        type,

        alive: true,

        direction: -1,

        startX: x,

        minX:
            x - 180,

        maxX:
            x + 180

    });

}


/* =========================================================
   DECORAÇÕES
========================================================= */

function createLevelDecorations() {

    for (
        let x = 100;
        x < GAME.worldWidth;
        x += randomInt(180, 330)
    ) {

        decorations.push({

            type:
                Math.random() > .5
                    ? "tree"
                    : "bush",

            x,

            y:
                getGroundY()

        });

    }

}


/* =========================================================
   RENDERIZAR MUNDO
========================================================= */

function renderWorld() {

    elements.blockLayer.innerHTML = "";

    elements.itemLayer.innerHTML = "";

    elements.enemyLayer.innerHTML = "";

    elements.decorationLayer.innerHTML = "";


    /* Blocos */

    blocks.forEach(block => {

        const div =
            document.createElement("div");

        div.className =
            `block ${block.type}-block`;

        div.dataset.id =
            block.id;

        div.style.left =
            `${block.x}px`;

        div.style.top =
            `${block.y}px`;

        if (
            block.type === "question"
        ) {

            div.textContent = "?";

        } else if (
            block.type === "coin"
        ) {

            div.textContent = "🪙";

        }

        elements.blockLayer.appendChild(div);

    });


    /* Moedas */

    coins.forEach(coin => {

        if (coin.collected) return;

        const div =
            document.createElement("div");

        div.className = "coin";

        div.dataset.id =
            coin.id;

        div.style.left =
            `${coin.x}px`;

        div.style.top =
            `${coin.y}px`;

        elements.itemLayer.appendChild(div);

    });


    /* Inimigos */

    enemies.forEach(enemy => {

        if (!enemy.alive) return;

        const div =
            document.createElement("div");

        div.className =
            "enemy";

        div.dataset.id =
            enemy.id;

        div.style.left =
            `${enemy.x}px`;

        div.style.top =
            `${enemy.y}px`;

        elements.enemyLayer.appendChild(div);

    });


    /* Decorações */

    decorations.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            item.type === "tree"
                ? "decoration-tree"
                : "decoration-bush";

        div.style.position =
            "absolute";

        div.style.left =
            `${item.x}px`;

        div.style.bottom =
            `${GAME.groundHeight}px`;

        if (item.type === "tree") {

            div.style.width = "55px";

            div.style.height = "130px";

            div.style.background =
                "linear-gradient(#2c7d35 0 60%, #744523 60%)";

            div.style.borderRadius =
                "50% 50% 10px 10px";

        } else {

            div.style.width = "70px";

            div.style.height = "35px";

            div.style.background =
                "#278735";

            div.style.borderRadius =
                "50%";

        }

        elements.decorationLayer.appendChild(div);

    });

}


/* =========================================================
   GROUND
========================================================= */

function getGroundY() {

    return window.innerHeight -
        GAME.groundHeight;

}


/* =========================================================
   INPUT - TECLADO
========================================================= */

function setupKeyboard() {

    window.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toLowerCase();


            if (
                key === "arrowleft" ||
                key === "a"
            ) {

                keys.left = true;

            }


            if (
                key === "arrowright" ||
                key === "d"
            ) {

                keys.right = true;

            }


            if (
                key === "arrowdown" ||
                key === "s"
            ) {

                keys.run = true;

            }


            if (
                key === "shift"
            ) {

                keys.run = true;

            }


            if (
                key === " " ||
                key === "arrowup" ||
                key === "w"
            ) {

                if (!keys.jump) {

                    jump();

                }

                keys.jump = true;

                event.preventDefault();

            }


            if (
                key === "escape" ||
                key === "p"
            ) {

                togglePause();

            }


            if (
                key === "i"
            ) {

                toggleInventory();

            }

        }
    );


    window.addEventListener(
        "keyup",
        event => {

            const key =
                event.key.toLowerCase();


            if (
                key === "arrowleft" ||
                key === "a"
            ) {

                keys.left = false;

            }


            if (
                key === "arrowright" ||
                key === "d"
            ) {

                keys.right = false;

            }


            if (
                key === "shift" ||
                key === "s"
            ) {

                keys.run = false;

            }


            if (
                key === " " ||
                key === "arrowup" ||
                key === "w"
            ) {

                keys.jump = false;

            }

        }
    );

}


/* =========================================================
   CONTROLES TOUCH
========================================================= */

function setupMobileControls() {

    const controls = {

        left:
            $("control-left"),

        right:
            $("control-right"),

        jump:
            $("control-jump"),

        run:
            $("control-run")

    };


    bindHold(
        controls.left,
        () => keys.left = true,
        () => keys.left = false
    );


    bindHold(
        controls.right,
        () => keys.right = true,
        () => keys.right = false
    );


    bindHold(
        controls.run,
        () => keys.run = true,
        () => keys.run = false
    );


    if (controls.jump) {

        controls.jump.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                jump();

            }
        );

    }

}


function bindHold(
    element,
    start,
    end
) {

    if (!element) return;


    element.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            start();

        }
    );


    element.addEventListener(
        "pointerup",
        event => {

            event.preventDefault();

            end();

        }
    );


    element.addEventListener(
        "pointercancel",
        end
    );


    element.addEventListener(
        "pointerleave",
        end
    );

}


/* =========================================================
   PULO
========================================================= */

function jump() {

    if (
        !GAME.running ||
        GAME.paused ||
        player.dead
    ) {

        return;

    }


    if (player.onGround) {

        player.vy =
            player.jumpForce;

        player.onGround =
            false;

        player.element =
            elements.player;

        elements.player.classList.add(
            "jumping"
        );

        setTimeout(() => {

            elements.player.classList.remove(
                "jumping"
            );

        }, 200);

        playSfx("jump");

    }

}


/* =========================================================
   MOVIMENTO DO JOGADOR
========================================================= */

function updatePlayer() {

    if (
        player.dead ||
        GAME.paused
    ) {

        return;

    }


    let direction = 0;


    if (keys.left) {

        direction--;

    }


    if (keys.right) {

        direction++;

    }


    player.running =
        keys.run;


    const maxSpeed =
        player.running
            ? GAME.runSpeed
            : GAME.playerSpeed;


    if (direction !== 0) {

        player.vx +=
            direction * 0.7;

        player.vx =
            clamp(
                player.vx,
                -maxSpeed,
                maxSpeed
            );

        player.facing =
            direction;

    } else {

        player.vx *=
            GAME.friction;

    }


    player.vy +=
        GAME.gravity;


    player.vy =
        Math.min(
            player.vy,
            GAME.maxFallSpeed
        );


    const oldX =
        player.x;

    const oldY =
        player.y;


    player.x +=
        player.vx;

    player.y +=
        player.vy;


    player.x =
        clamp(
            player.x,
            0,
            GAME.worldWidth -
            player.width
        );


    handleBlockCollisions(
        oldX,
        oldY
    );


    const ground =
        getGroundY();


    if (
        player.y +
        player.height >=
        ground
    ) {

        player.y =
            ground -
            player.height;

        player.vy = 0;

        player.onGround = true;

    } else {

        player.onGround = false;

    }


    if (
        player.y >
        window.innerHeight + 200
    ) {

        damagePlayer();

    }


    if (
        player.invincible
    ) {

        player.invincibleTimer--;

        if (
            player.invincibleTimer <= 0
        ) {

            player.invincible = false;

            elements.player.classList.remove(
                "hit"
            );

        }

    }

}


/* =========================================================
   COLISÃO COM BLOCOS
========================================================= */

function handleBlockCollisions(
    oldX,
    oldY
) {

    blocks.forEach(block => {

        if (!block.active) return;


        const horizontal =
            player.x <
                block.x +
                block.width &&
            player.x +
                player.width >
                block.x;


        const vertical =
            player.y <
                block.y +
                block.height &&
            player.y +
                player.height >
                block.y;


        if (
            !horizontal ||
            !vertical
        ) {

            return;

        }


        const oldBottom =
            oldY +
            player.height;

        const oldTop =
            oldY;


        /* Caindo em cima */

        if (
            player.vy >= 0 &&
            oldBottom <= block.y + 10
        ) {

            player.y =
                block.y -
                player.height;

            player.vy = 0;

            player.onGround = true;

            return;

        }


        /* Batendo por baixo */

        if (
            player.vy < 0 &&
            oldTop >=
                block.y +
                block.height -
                10
        ) {

            player.y =
                block.y +
                block.height;

            player.vy = 1;

            hitBlock(block);

            return;

        }


        /* Colisão lateral */

        if (
            player.vx > 0
        ) {

            player.x =
                block.x -
                player.width;

        } else if (
            player.vx < 0
        ) {

            player.x =
                block.x +
                block.width;

        }

        player.vx = 0;

    });

}


/* =========================================================
   BATER NO BLOCO
========================================================= */

function hitBlock(block) {

    if (block.hit) return;


    block.hit = true;


    const element =
        document.querySelector(
            `[data-id="${block.id}"]`
        );


    if (element) {

        element.style.transform =
            "translateY(-8px)";

        setTimeout(() => {

            element.style.transform =
                "";

        }, 120);

    }


    if (
        block.type === "question"
    ) {

        addCoin(
            block.x + 10,
            block.y - 45
        );

        createCoinEffect(
            block.x + 20,
            block.y
        );

        addScore(100);

        playSfx("coin");

    }

}


/* =========================================================
   MOEDAS
========================================================= */

function updateCoins() {

    coins.forEach(coin => {

        if (
            coin.collected
        ) {

            return;

        }


        coin.animation +=
            0.08;


        const bob =
            Math.sin(
                coin.animation
            ) * 4;


        const element =
            document.querySelector(
                `[data-id="${coin.id}"]`
            );


        if (element) {

            element.style.transform =
                `translateY(${bob}px)`;

        }


        if (
            rectsCollide(
                player,
                coin
            )
        ) {

            collectCoin(coin);

        }

    });

}


/* =========================================================
   PEGAR MOEDA
========================================================= */

function collectCoin(coin) {

    if (coin.collected) return;


    coin.collected = true;

    player.coins++;

    addScore(100);

    updateHUD();

    createCoinEffect(
        coin.x,
        coin.y
    );

    playSfx("coin");


    const element =
        document.querySelector(
            `[data-id="${coin.id}"]`
        );


    if (element) {

        element.classList.add(
            "collected"
        );

    }

}


/* =========================================================
   EFEITO DA MOEDA
========================================================= */

function createCoinEffect(
    x,
    y
) {

    const effect =
        document.createElement("div");

    effect.textContent =
        "+100";

    effect.style.position =
        "absolute";

    effect.style.left =
        `${x}px`;

    effect.style.top =
        `${y}px`;

    effect.style.color =
        "#ffe34d";

    effect.style.fontWeight =
        "900";

    effect.style.fontSize =
        "18px";

    effect.style.zIndex =
        "200";

    elements.effectLayer.appendChild(
        effect
    );


    setTimeout(() => {

        effect.style.transform =
            "translateY(-40px)";

        effect.style.opacity =
            "0";

        effect.style.transition =
            ".5s";

    }, 20);


    setTimeout(() => {

        effect.remove();

    }, 600);

}


/* =========================================================
   INIMIGOS
========================================================= */

function updateEnemies() {

    enemies.forEach(enemy => {

        if (!enemy.alive) return;


        enemy.x +=
            enemy.vx;


        if (
            enemy.x <
            enemy.minX
        ) {

            enemy.x =
                enemy.minX;

            enemy.vx =
                Math.abs(enemy.vx);

        }


        if (
            enemy.x >
            enemy.maxX
        ) {

            enemy.x =
                enemy.maxX;

            enemy.vx =
                -Math.abs(enemy.vx);

        }


        enemy.y =
            getGroundY() -
            enemy.height;


        const element =
            document.querySelector(
                `[data-id="${enemy.id}"]`
            );


        if (element) {

            element.style.left =
                `${enemy.x}px`;

            element.style.top =
                `${enemy.y}px`;

        }


        if (
            rectsCollide(
                player,
                enemy
            )
        ) {

            handleEnemyCollision(
                enemy
            );

        }

    });

}


/* =========================================================
   COLISÃO COM INIMIGO
========================================================= */

function handleEnemyCollision(enemy) {

    if (
        player.invincible ||
        !enemy.alive
    ) {

        return;

    }


    const playerBottom =
        player.y +
        player.height;


    const enemyTop =
        enemy.y;


    if (
        player.vy > 0 &&
        playerBottom <
            enemyTop + 25
    ) {

        enemy.alive = false;

        player.vy =
            player.jumpForce * .55;

        addScore(
            enemy.type === "strong"
                ? 500
                : 200
        );

        createEnemyDefeatEffect(
            enemy
        );

        playSfx("stomp");

    } else {

        damagePlayer();

    }

}


/* =========================================================
   EFEITO INIMIGO
========================================================= */

function createEnemyDefeatEffect(
    enemy
) {

    const element =
        document.querySelector(
            `[data-id="${enemy.id}"]`
        );


    if (!element) return;


    element.style.transform =
        "scaleY(.25)";

    element.style.opacity =
        "0.5";


    setTimeout(() => {

        element.remove();

    }, 300);

}


/* =========================================================
   DANO
========================================================= */

function damagePlayer() {

    if (
        player.invincible ||
        player.dead
    ) {

        return;

    }


    player.lives--;

    updateHUD();

    player.invincible =
        true;

    player.invincibleTimer =
        120;


    elements.player.classList.add(
        "hit"
    );


    playSfx("hurt");


    if (
        player.lives <= 0
    ) {

        triggerGameOver();

        return;

    }


    respawnPlayer();

}


/* =========================================================
   RESPAWN
========================================================= */

function respawnPlayer() {

    player.x =
        player.checkpointX;

    player.y =
        player.checkpointY;

    player.vx = 0;

    player.vy = 0;


    GAME.cameraX =
        Math.max(
            0,
            player.x - 250
        );


    showNotification(
        "Você perdeu uma vida!",
        "danger"
    );

}


/* =========================================================
   CHECKPOINT
========================================================= */

function updateCheckpoint() {

    if (
        player.x >= 1900 &&
        player.checkpointX <
            1900
    ) {

        player.checkpointX =
            1900;

        player.checkpointY =
            getGroundY() -
            player.height;


        if (
            elements.checkpoint
        ) {

            elements.checkpoint.classList.remove(
                "hidden"
            );

        }


        showNotification(
            "Checkpoint ativado!",
            "success"
        );

        playSfx("checkpoint");

    }

}


/* =========================================================
   FINAL DA FASE
========================================================= */

function updateFinish() {

    const finishX =
        GAME.worldWidth - 500;


    if (
        player.x >= finishX &&
        !GAME.levelComplete
    ) {

        completeLevel();

    }

}


/* =========================================================
   COMPLETAR FASE
========================================================= */

function completeLevel() {

    GAME.levelComplete =
        true;

    GAME.running =
        false;

    player.vx = 0;

    player.vy = 0;


    elements.victoryCoins.textContent =
        player.coins;

    elements.victoryStars.textContent =
        player.stars;

    elements.victoryScore.textContent =
        formatScore(
            player.score
        );


    saveGame();


    setTimeout(() => {

        showOverlay(
            elements.victoryScreen
        );

    }, 500);

}


/* =========================================================
   GAME OVER
========================================================= */

function triggerGameOver() {

    player.dead = true;

    GAME.running = false;

    GAME.gameOver = true;


    elements.gameOverCoins.textContent =
        player.coins;

    elements.gameOverScore.textContent =
        formatScore(
            player.score
        );


    showOverlay(
        elements.gameOverScreen
    );

}


/* =========================================================
   REINICIAR FASE
========================================================= */

function restartLevel() {

    player.lives = 3;

    player.coins = 0;

    player.score = 0;

    player.stars = 0;

    GAME.gameOver = false;

    GAME.paused = false;

    hideOverlay(
        elements.gameOverScreen
    );

    hideOverlay(
        elements.victoryScreen
    );

    buildLevel(
        GAME.currentLevel
    );

    GAME.running = true;

}


/* =========================================================
   PRÓXIMA FASE
========================================================= */

function nextLevel() {

    hideOverlay(
        elements.victoryScreen
    );


    if (
        GAME.currentLevel <
        GAME.totalLevels
    ) {

        GAME.currentLevel++;

        saveGame();

        showLevelTransition(
            GAME.currentLevel
        );


        setTimeout(() => {

            buildLevel(
                GAME.currentLevel
            );

            GAME.running = true;

            hideLevelTransition();

        }, 1000);

    } else {

        showNotification(
            "Você terminou toda a aventura!",
            "success"
        );

        showWorldMap();

    }

}


/* =========================================================
   CÂMERA
========================================================= */

function updateCamera() {

    const screenWidth =
        window.innerWidth;


    const target =
        player.x -
        screenWidth * 0.35;


    GAME.cameraX +=
        (
            target -
            GAME.cameraX
        ) * 0.1;


    GAME.cameraX =
        clamp(
            GAME.cameraX,
            0,
            GAME.worldWidth -
            screenWidth
        );


    elements.world.style.transform =
        `translateX(${-GAME.cameraX}px)`;


    if (
        elements.miniMapPlayer
    ) {

        const percentage =
            player.x /
            GAME.worldWidth;

        elements.miniMapPlayer.style.left =
            `${percentage * 180}px`;

    }

}


/* =========================================================
   RENDER PLAYER
========================================================= */

function renderPlayer() {

    elements.player.style.left =
        `${player.x}px`;

    elements.player.style.top =
        `${player.y}px`;


    if (
        player.facing < 0
    ) {

        elements.player.style.transform =
            "scaleX(-1)";

    } else {

        elements.player.style.transform =
            "scaleX(1)";

    }

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    if (
        elements.hudLives
    ) {

        elements.hudLives.textContent =
            player.lives;

    }


    if (
        elements.hudCoins
    ) {

        elements.hudCoins.textContent =
            player.coins;

    }


    if (
        elements.hudStars
    ) {

        elements.hudStars.textContent =
            player.stars;

    }


    if (
        elements.hudScore
    ) {

        elements.hudScore.textContent =
            formatScore(
                player.score
            );

    }


    if (
        elements.hudWorld
    ) {

        elements.hudWorld.textContent =
            `${Math.ceil(GAME.currentLevel / 3)}-${((GAME.currentLevel - 1) % 3) + 1}`;

    }

}


/* =========================================================
   SCORE
========================================================= */

function addScore(value) {

    player.score += value;

    updateHUD();

}


function formatScore(score) {

    return String(
        Math.max(0, score)
    ).padStart(
        6,
        "0"
    );

}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    if (
        !GAME.running
    ) {

        return;

    }


    GAME.paused =
        !GAME.paused;


    if (
        GAME.paused
    ) {

        showOverlay(
            elements.pauseScreen
        );

    } else {

        hideOverlay(
            elements.pauseScreen
        );

    }

}


/* =========================================================
   INVENTÁRIO
========================================================= */

function toggleInventory() {

    if (
        !GAME.running
    ) {

        return;

    }


    if (
        elements.inventoryScreen.classList.contains(
            "hidden"
        )
    ) {

        renderInventory();

        showOverlay(
            elements.inventoryScreen
        );

    } else {

        hideOverlay(
            elements.inventoryScreen
        );

    }

}


function renderInventory() {

    elements.inventoryItems.innerHTML = "";


    const items = [

        {
            icon: "🪙",
            name: `Moedas: ${player.coins}`
        },

        {
            icon: "⭐",
            name: `Estrelas: ${player.stars}`
        },

        {
            icon: "❤️",
            name: `Vidas: ${player.lives}`
        },

        {
            icon: "🔥",
            name: "Power-up"
        },

        {
            icon: "🛡️",
            name: "Escudo"
        },

        {
            icon: "⚡",
            name: "Velocidade"
        }

    ];


    items.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            "inventory-item";

        div.innerHTML = `
            <strong>${item.icon}</strong>
            <span>${item.name}</span>
        `;

        elements.inventoryItems.appendChild(
            div
        );

    });

}


/* =========================================================
   MAPA
========================================================= */

function showWorldMap() {

    GAME.running = false;

    hideOverlay(
        elements.victoryScreen
    );

    hideOverlay(
        elements.pauseScreen
    );

    showScreen(
        elements.worldMapScreen
    );

    createWorldMap();

}


function createWorldMap() {

    const map =
        $("world-map");

    if (!map) return;


    map.innerHTML = "";


    for (
        let i = 1;
        i <= GAME.totalLevels;
        i++
    ) {

        const button =
            document.createElement("button");

        button.className =
            "level-node";

        button.textContent =
            i;

        button.dataset.level =
            i;


        button.style.position =
            "absolute";

        button.style.left =
            `${10 + ((i - 1) % 4) * 25}%`;

        button.style.top =
            `${10 + Math.floor((i - 1) / 4) * 27}%`;


        if (
            i <= getUnlockedLevel()
        ) {

            button.disabled =
                false;

            button.style.cursor =
                "pointer";

        } else {

            button.disabled =
                true;

            button.style.opacity =
                ".4";

        }


        button.addEventListener(
            "click",
            () => {

                startLevel(i);

            }
        );


        map.appendChild(
            button
        );

    }

}


/* =========================================================
   NÍVEL DESBLOQUEADO
========================================================= */

function getUnlockedLevel() {

    return Math.max(
        1,
        Number(
            localStorage.getItem(
                "aventuraUnlockedLevel"
            ) || 1
        )
    );

}


/* =========================================================
   COMEÇAR FASE
========================================================= */

function startLevel(level) {

    showScreen(
        elements.game
    );

    GAME.gameOver = false;

    GAME.paused = false;

    hideOverlay(
        elements.pauseScreen
    );

    hideOverlay(
        elements.gameOverScreen
    );

    hideOverlay(
        elements.victoryScreen
    );

    buildLevel(level);

    GAME.running = true;

}


/* =========================================================
   TÍTULO DA FASE
========================================================= */

function showLevelTitle() {

    const data =
        levelData[
            GAME.currentLevel - 1
        ];


    elements.levelWorldName.textContent =
        `MUNDO ${data.world}`;

    elements.levelName.textContent =
        data.name;


    elements.levelMessage.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        elements.levelMessage.classList.add(
            "hidden"
        );

    }, 1800);

}


/* =========================================================
   TRANSIÇÃO
========================================================= */

function showLevelTransition(level) {

    const data =
        levelData[level - 1];


    elements.transitionWorld.textContent =
        `MUNDO ${data.world}`;

    elements.transitionLevel.textContent =
        `${data.world}-${((level - 1) % 3) + 1}`;

    elements.transitionTitle.textContent =
        data.name;


    elements.levelTransition.classList.remove(
        "hidden"
    );

}


function hideLevelTransition() {

    elements.levelTransition.classList.add(
        "hidden"
    );

}


/* =========================================================
   NOTIFICAÇÃO
========================================================= */

function showNotification(
    message,
    type = "normal"
) {

    const notification =
        document.createElement("div");

    notification.className =
        "notification";


    if (
        type === "success"
    ) {

        notification.style.borderColor =
            "#35d66a";

    }


    if (
        type === "danger"
    ) {

        notification.style.borderColor =
            "#ff4052";

    }


    notification.textContent =
        message;


    elements.notificationContainer.appendChild(
        notification
    );


    setTimeout(() => {

        notification.style.opacity =
            "0";

        notification.style.transform =
            "translateX(30px)";

        notification.style.transition =
            ".3s";

    }, 2200);


    setTimeout(() => {

        notification.remove();

    }, 2600);

}


/* =========================================================
   ÁUDIO
========================================================= */

const audioContext =
    window.AudioContext
        ? new AudioContext()
        : null;


function playSfx(type) {

    if (!audioContext) return;

    if (
        GAME.sfxVolume <= 0
    ) {

        return;

    }


    try {

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();


        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );


        let frequency = 440;

        let duration = .08;


        if (
            type === "coin"
        ) {

            frequency = 900;

            duration = .09;

        }


        if (
            type === "jump"
        ) {

            frequency = 520;

            duration = .12;

        }


        if (
            type === "stomp"
        ) {

            frequency = 160;

            duration = .1;

        }


        if (
            type === "hurt"
        ) {

            frequency = 110;

            duration = .25;

        }


        if (
            type === "checkpoint"
        ) {

            frequency = 700;

            duration = .3;

        }


        oscillator.frequency.value =
            frequency;


        gain.gain.setValueAtTime(
            GAME.sfxVolume * .12,
            audioContext.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            .001,
            audioContext.currentTime +
            duration
        );


        oscillator.start();

        oscillator.stop(
            audioContext.currentTime +
            duration
        );

    } catch (error) {

        console.warn(
            "Áudio indisponível:",
            error
        );

    }

}


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

function setupOptions() {

    if (
        elements.musicVolume
    ) {

        elements.musicVolume.addEventListener(
            "input",
            () => {

                GAME.musicVolume =
                    Number(
                        elements.musicVolume.value
                    ) / 100;

                elements.musicVolumeValue.textContent =
                    `${elements.musicVolume.value}%`;

            }
        );

    }


    if (
        elements.sfxVolume
    ) {

        elements.sfxVolume.addEventListener(
            "input",
            () => {

                GAME.sfxVolume =
                    Number(
                        elements.sfxVolume.value
                    ) / 100;

                elements.sfxVolumeValue.textContent =
                    `${elements.sfxVolume.value}%`;

            }
        );

    }


    if (
        elements.mobileControlsToggle
    ) {

        elements.mobileControlsToggle.addEventListener(
            "click",
            () => {

                GAME.mobileControls =
                    !GAME.mobileControls;


                elements.mobileControlsToggle.classList.toggle(
                    "active",
                    GAME.mobileControls
                );


                elements.mobileControlsToggle.textContent =
                    GAME.mobileControls
                        ? "ATIVADOS"
                        : "DESATIVADOS";


                if (
                    elements.mobileControls
                ) {

                    elements.mobileControls.style.display =
                        GAME.mobileControls
                            ? ""
                            : "none";

                }

            }
        );

    }


    const fullscreen =
        $("fullscreen-button");


    if (fullscreen) {

        fullscreen.addEventListener(
            "click",
            async () => {

                try {

                    if (
                        !document.fullscreenElement
                    ) {

                        await document.documentElement.requestFullscreen();

                    } else {

                        await document.exitFullscreen();

                    }

                } catch (error) {

                    console.warn(
                        "Fullscreen indisponível."
                    );

                }

            }
        );

    }

}


/* =========================================================
   MENU
========================================================= */

function setupMenu() {

    $("new-game-button")
        ?.addEventListener(
            "click",
            () => {

                player.lives = 3;

                player.coins = 0;

                player.stars = 0;

                player.score = 0;

                startLevel(1);

            }
        );


    $("continue-button")
        ?.addEventListener(
            "click",
            () => {

                const savedLevel =
                    Number(
                        localStorage.getItem(
                            "aventuraCurrentLevel"
                        ) || 1
                    );

                startLevel(
                    clamp(
                        savedLevel,
                        1,
                        GAME.totalLevels
                    )
                );

            }
        );


    $("world-map-button")
        ?.addEventListener(
            "click",
            showWorldMap
        );


    $("options-button")
        ?.addEventListener(
            "click",
            () => {

                showOverlay(
                    elements.optionsScreen
                );

            }
        );


    $("pause-button")
        ?.addEventListener(
            "click",
            togglePause
        );


    $("resume-button")
        ?.addEventListener(
            "click",
            togglePause
        );


    $("pause-options-button")
        ?.addEventListener(
            "click",
            () => {

                showOverlay(
                    elements.optionsScreen
                );

            }
        );


    $("close-options-button")
        ?.addEventListener(
            "click",
            () => {

                hideOverlay(
                    elements.optionsScreen
                );

            }
        );


    $("quit-button")
        ?.addEventListener(
            "click",
            () => {

                GAME.running =
                    false;

                GAME.paused =
                    false;

                hideOverlay(
                    elements.pauseScreen
                );

                showScreen(
                    elements.mainMenu
                );

            }
        );


    $("retry-button")
        ?.addEventListener(
            "click",
            restartLevel
        );


    $("game-over-menu-button")
        ?.addEventListener(
            "click",
            () => {

                hideOverlay(
                    elements.gameOverScreen
                );

                showScreen(
                    elements.mainMenu
                );

            }
        );


    $("next-level-button")
        ?.addEventListener(
            "click",
            nextLevel
        );


    $("victory-map-button")
        ?.addEventListener(
            "click",
            showWorldMap
        );


    $("map-back-button")
        ?.addEventListener(
            "click",
            () => {

                showScreen(
                    elements.mainMenu
                );

            }
        );


    $("close-inventory-button")
        ?.addEventListener(
            "click",
            () => {

                hideOverlay(
                    elements.inventoryScreen
                );

            }
        );

}


/* =========================================================
   SAVE
========================================================= */

function saveGame() {

    try {

        localStorage.setItem(
            "aventuraCurrentLevel",
            GAME.currentLevel
        );


        localStorage.setItem(
            "aventuraCoins",
            player.coins
        );


        localStorage.setItem(
            "aventuraStars",
            player.stars
        );


        localStorage.setItem(
            "aventuraScore",
            player.score
        );


        const unlocked =
            getUnlockedLevel();


        if (
            GAME.currentLevel >=
            unlocked
        ) {

            localStorage.setItem(
                "aventuraUnlockedLevel",
                Math.min(
                    GAME.currentLevel + 1,
                    GAME.totalLevels
                )
            );

        }

    } catch (error) {

        console.warn(
            "Não foi possível salvar.",
            error
        );

    }

}


/* =========================================================
   CARREGAR SAVE
========================================================= */

function loadGame() {

    try {

        player.coins =
            Number(
                localStorage.getItem(
                    "aventuraCoins"
                ) || 0
            );


        player.stars =
            Number(
                localStorage.getItem(
                    "aventuraStars"
                ) || 0
            );


        player.score =
            Number(
                localStorage.getItem(
                    "aventuraScore"
                ) || 0
            );

    } catch (error) {

        console.warn(
            "Save não encontrado."
        );

    }

}


/* =========================================================
   LOOP PRINCIPAL
========================================================= */

let lastTime = 0;


function gameLoop(timestamp) {

    const delta =
        Math.min(
            (timestamp - lastTime) / 16.67,
            2
        );


    lastTime =
        timestamp;


    if (
        GAME.running &&
        !GAME.paused
    ) {

        updatePlayer();

        updateCoins();

        updateEnemies();

        updateCheckpoint();

        updateFinish();

        updateCamera();

        renderPlayer();

    }


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   REDIMENSIONAMENTO
========================================================= */

function handleResize() {

    if (
        !GAME.running
    ) {

        return;

    }


    const ground =
        getGroundY();


    if (
        player.y >
        ground
    ) {

        player.y =
            ground -
            player.height;

    }

}


/* =========================================================
   PREVENIR MENU DO BOTÃO DIREITO
========================================================= */

document.addEventListener(
    "contextmenu",
    event => {

        if (
            event.target.closest(
                "#game"
            )
        ) {

            event.preventDefault();

        }

    }
);


/* =========================================================
   PREVENIR ZOOM NO CELULAR
========================================================= */

document.addEventListener(
    "gesturestart",
    event => {

        event.preventDefault();

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initGame() {

    cacheElements();

    createLevels();

    loadGame();

    setupKeyboard();

    setupMobileControls();

    setupOptions();

    setupMenu();

    handleResize();

    startLoading();

    requestAnimationFrame(
        gameLoop
    );

}


/* =========================================================
   EVENTOS
========================================================= */

window.addEventListener(
    "resize",
    handleResize
);


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initGame
);
