"use strict";

/* =========================================================
   PLAYER.JS
   Sistema completo do jogador
========================================================= */

class Player {

    constructor(x = 80, y = 400) {

        /* Posição */
        this.x = x;
        this.y = y;

        /* Tamanho */
        this.width = 32;
        this.height = 40;

        /* Velocidade */
        this.vx = 0;
        this.vy = 0;

        /* Física */
        this.speed = 4;
        this.runSpeed = 6;
        this.jumpForce = 12;
        this.gravity = 0.5;

        /* Estado */
        this.grounded = false;
        this.facing = 1;

        this.running = false;
        this.jumping = false;
        this.falling = false;

        this.dead = false;
        this.invincible = false;

        this.invincibleTime = 0;

        /* Vida */
        this.lives = 3;

        /* Pontuação */
        this.score = 0;

        /* Moedas */
        this.coins = 0;

        /* Estrelas */
        this.stars = 0;

        /* Power-up */
        this.powerup = "small";

        this.fireFlower = false;
        this.starPower = false;

        this.starTimer = 0;

        /* Animação */
        this.frame = 0;
        this.animationTimer = 0;

        this.walkFrame = 0;

        /* Direção */
        this.left = false;
        this.right = false;

        this.jumpPressed = false;

        /* Checkpoint */
        this.checkpointX = x;
        this.checkpointY = y;

        /* Bolas de fogo */
        this.fireballs = [];

        /* Tiros */
        this.fireCooldown = 0;

        /* Coyote time */
        this.coyoteTime = 0;

        /* Pulo */
        this.jumpBuffer = 0;

        /* Ataques */
        this.attacking = false;

    }


    /* =====================================================
       ATUALIZAR
    ===================================================== */

    update(delta = 1) {

        if (this.dead) {

            this.updateDeath(delta);

            return;

        }


        this.handleInput();

        this.applyPhysics(delta);

        this.updateMovement(delta);

        this.updateAnimation(delta);

        this.updateTimers(delta);

        this.updateFireballs(delta);

    }


    /* =====================================================
       INPUT
    ===================================================== */

    handleInput() {

        if (
            typeof keys === "undefined"
        ) {

            return;

        }


        this.left =
            keys["ArrowLeft"] ||
            keys["a"] ||
            keys["A"];


        this.right =
            keys["ArrowRight"] ||
            keys["d"] ||
            keys["D"];


        const jump =
            keys["ArrowUp"] ||
            keys["w"] ||
            keys["W"] ||
            keys[" "];


        const run =
            keys["Shift"];


        this.running =
            !!run;


        /* Direção */

        if (this.left) {

            this.facing = -1;

        }


        if (this.right) {

            this.facing = 1;

        }


        /* Pulo */

        if (jump && !this.jumpPressed) {

            this.jump();

        }


        this.jumpPressed =
            !!jump;


        /* Bola de fogo */

        if (
            keys["x"] ||
            keys["X"]
        ) {

            this.shootFireball();

        }

    }


    /* =====================================================
       MOVIMENTO
    ===================================================== */

    updateMovement() {

        const maxSpeed =
            this.running
                ? this.runSpeed
                : this.speed;


        if (this.left) {

            this.vx =
                Math.max(
                    this.vx - 0.6,
                    -maxSpeed
                );

        }


        else if (this.right) {

            this.vx =
                Math.min(
                    this.vx + 0.6,
                    maxSpeed
                );

        }


        else {

            /* Atrito */

            if (this.vx > 0) {

                this.vx =
                    Math.max(
                        0,
                        this.vx - 0.45
                    );

            }


            if (this.vx < 0) {

                this.vx =
                    Math.min(
                        0,
                        this.vx + 0.45
                    );

            }

        }


        this.x += this.vx;

    }


    /* =====================================================
       FÍSICA
    ===================================================== */

    applyPhysics() {

        if (!this.grounded) {

            this.vy += this.gravity;

            this.vy =
                Math.min(
                    this.vy,
                    14
                );

        }


        this.y += this.vy;


        if (this.vy < 0) {

            this.jumping = true;
            this.falling = false;

        }

        else if (this.vy > 0) {

            this.jumping = false;
            this.falling = true;

        }

    }


    /* =====================================================
       PULO
    ===================================================== */

    jump() {

        if (
            this.grounded ||
            this.coyoteTime > 0
        ) {

            this.vy =
                -this.jumpForce;


            this.grounded =
                false;


            this.jumping =
                true;


            this.coyoteTime =
                0;


            if (
                typeof SOUNDS !==
                "undefined"
            ) {

                SOUNDS.jump();

            }

        }

    }


    /* =====================================================
       PULO AUTOMÁTICO
    ===================================================== */

    bounce(force = 13) {

        this.vy =
            -force;


        this.grounded =
            false;


        this.jumping =
            true;


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.superJump();

        }

    }


    /* =====================================================
       COLISÃO COM CHÃO
    ===================================================== */

    land(y) {

        this.y =
            y - this.height;


        this.vy =
            0;


        this.grounded =
            true;


        this.jumping =
            false;


        this.falling =
            false;


        this.coyoteTime =
            8;

    }


    /* =====================================================
       SAIR DO CHÃO
    ===================================================== */

    leaveGround() {

        if (this.grounded) {

            this.coyoteTime =
                8;

        }


        this.grounded =
            false;

    }


    /* =====================================================
       DANO
    ===================================================== */

    takeDamage() {

        if (
            this.invincible ||
            this.starPower ||
            this.dead
        ) {

            return;

        }


        /* Power-up protege primeiro */

        if (
            this.powerup !==
            "small"
        ) {

            this.powerup =
                "small";


            this.fireFlower =
                false;


            this.invincible =
                true;


            this.invincibleTime =
                120;


            this.vy =
                -8;


            this.vx =
                -this.facing * 4;


            if (
                typeof SOUNDS !==
                "undefined"
            ) {

                SOUNDS.damage();

            }


            return;

        }


        /* Perde vida */

        this.die();

    }


    /* =====================================================
       MORTE
    ===================================================== */

    die() {

        if (this.dead) {

            return;

        }


        this.dead =
            true;


        this.lives =
            Math.max(
                0,
                this.lives - 1
            );


        this.vx =
            0;


        this.vy =
            -10;


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.death();

        }


        if (
            typeof SAVE !==
            "undefined"
        ) {

            SAVE.loseLife();

        }

    }


    /* =====================================================
       ATUALIZAR MORTE
    ===================================================== */

    updateDeath() {

        this.vy +=
            this.gravity;


        this.y +=
            this.vy;


        if (
            this.y > 800
        ) {

            this.respawn();

        }

    }


    /* =====================================================
       RENASCER
    ===================================================== */

    respawn() {

        if (
            this.lives <= 0
        ) {

            if (
                typeof GAME !==
                "undefined" &&
                GAME.gameOver
            ) {

                GAME.gameOver();

            }

            return;

        }


        this.x =
            this.checkpointX;


        this.y =
            this.checkpointY;


        this.vx =
            0;


        this.vy =
            0;


        this.dead =
            false;


        this.grounded =
            false;


        this.invincible =
            true;


        this.invincibleTime =
            150;

    }


    /* =====================================================
       CHECKPOINT
    ===================================================== */

    setCheckpoint(x, y) {

        this.checkpointX =
            x;


        this.checkpointY =
            y;


        if (
            typeof SAVE !==
            "undefined"
        ) {

            SAVE.saveCheckpoint(
                x,
                y
            );

        }


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.checkpoint();

        }

    }


    /* =====================================================
       PEGAR MOEDA
    ===================================================== */

    collectCoin() {

        this.coins++;

        this.score +=
            100;


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.coin();

        }


        if (
            typeof SAVE !==
            "undefined"
        ) {

            SAVE.addCoins(1);

            SAVE.addScore(100);

        }


        /* 100 moedas = vida */

        if (
            this.coins >= 100
        ) {

            this.coins -=
                100;


            this.addLife();

        }

    }


    /* =====================================================
       VIDA EXTRA
    ===================================================== */

    addLife() {

        this.lives++;


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.extraLife();

        }


        if (
            typeof SAVE !==
            "undefined"
        ) {

            SAVE.addLife();

        }

    }


    /* =====================================================
       POWER-UP
    ===================================================== */

    collectPowerUp(type) {

        switch (type) {

            case "mushroom":

                this.powerup =
                    "big";


                this.width =
                    34;


                this.height =
                    48;


                this.score +=
                    1000;


                if (
                    typeof SOUNDS !==
                    "undefined"
                ) {

                    SOUNDS.mushroom();

                }

                break;


            case "flower":

                this.powerup =
                    "fire";


                this.fireFlower =
                    true;


                this.width =
                    34;


                this.height =
                    48;


                this.score +=
                    1000;


                if (
                    typeof SOUNDS !==
                    "undefined"
                ) {

                    SOUNDS.fireFlower();

                }

                break;


            case "star":

                this.starPower =
                    true;


                this.starTimer =
                    600;


                this.score +=
                    1000;


                if (
                    typeof SOUNDS !==
                    "undefined"
                ) {

                    SOUNDS.star();

                }

                break;


            case "life":

                this.addLife();

                break;

        }


        if (
            typeof SAVE !==
            "undefined"
        ) {

            SAVE.addScore(1000);

        }

    }


    /* =====================================================
       ESTRELA
    ===================================================== */

    activateStar() {

        this.starPower =
            true;


        this.starTimer =
            600;


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.star();

        }

    }


    /* =====================================================
       BOLA DE FOGO
    ===================================================== */

    shootFireball() {

        if (
            !this.fireFlower ||
            this.fireCooldown > 0
        ) {

            return;

        }


        this.fireCooldown =
            25;


        const fireball = {

            x:
                this.x +
                (
                    this.facing > 0
                        ? this.width
                        : -12
                ),

            y:
                this.y +
                this.height / 2,

            vx:
                this.facing * 8,

            vy:
                -2,

            width:
                12,

            height:
                12,

            alive:
                true

        };


        this.fireballs.push(
            fireball
        );


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.fireball();

        }

    }


    /* =====================================================
       ATUALIZAR BOLAS DE FOGO
    ===================================================== */

    updateFireballs() {

        if (
            this.fireCooldown > 0
        ) {

            this.fireCooldown--;

        }


        this.fireballs.forEach(
            fireball => {

                if (
                    !fireball.alive
                ) {

                    return;

                }


                fireball.vy +=
                    0.35;


                fireball.x +=
                    fireball.vx;


                fireball.y +=
                    fireball.vy;

            }
        );


        this.fireballs =
            this.fireballs.filter(
                fireball =>
                    fireball.alive &&
                    fireball.x > -100 &&
                    fireball.x < 20000 &&
                    fireball.y < 1000
            );

    }


    /* =====================================================
       COLISÃO COM INIMIGO
    ===================================================== */

    attackEnemy(enemy) {

        if (
            !enemy ||
            enemy.dead
        ) {

            return;

        }


        if (
            this.starPower
        ) {

            enemy.dead =
                true;


            this.score +=
                200;


            if (
                typeof SOUNDS !==
                "undefined"
            ) {

                SOUNDS.enemyHit();

            }


            return;

        }


        /* Ataque por cima */

        if (
            this.vy > 0
        ) {

            enemy.dead =
                true;


            this.bounce(9);


            this.score +=
                100;


            if (
                typeof SOUNDS !==
                "undefined"
            ) {

                SOUNDS.stomp();

            }

        }

        else {

            this.takeDamage();

        }

    }


    /* =====================================================
       ATUALIZAR TEMPORIZADORES
    ===================================================== */

    updateTimers() {

        if (
            this.invincibleTime > 0
        ) {

            this.invincibleTime--;

        }

        else {

            this.invincible =
                false;

        }


        if (
            this.starTimer > 0
        ) {

            this.starTimer--;

        }

        else {

            this.starPower =
                false;

        }


        if (
            this.coyoteTime > 0
        ) {

            this.coyoteTime--;

        }


        if (
            this.jumpBuffer > 0
        ) {

            this.jumpBuffer--;

        }

    }


    /* =====================================================
       ANIMAÇÃO
    ===================================================== */

    updateAnimation() {

        if (
            Math.abs(this.vx) > 0.2
        ) {

            this.animationTimer++;


            if (
                this.animationTimer > 8
            ) {

                this.walkFrame++;


                this.animationTimer =
                    0;

            }

        }

        else {

            this.walkFrame =
                0;

        }

    }


    /* =====================================================
       GETTER DA HITBOX
    ===================================================== */

    getHitbox() {

        return {

            x: this.x,

            y: this.y,

            width: this.width,

            height: this.height

        };

    }


    /* =====================================================
       COLISÃO
    ===================================================== */

    intersects(object) {

        return (

            this.x <
            object.x +
            object.width &&

            this.x +
            this.width >
            object.x &&

            this.y <
            object.y +
            object.height &&

            this.y +
            this.height >
            object.y

        );

    }


    /* =====================================================
       TELEPORTAR
    ===================================================== */

    teleport(x, y) {

        this.x =
            x;


        this.y =
            y;


        this.vx =
            0;


        this.vy =
            0;

    }


    /* =====================================================
       RESETAR
    ===================================================== */

    reset(x = 80, y = 400) {

        this.x =
            x;


        this.y =
            y;


        this.vx =
            0;


        this.vy =
            0;


        this.dead =
            false;


        this.grounded =
            false;


        this.jumping =
            false;


        this.falling =
            false;


        this.powerup =
            "small";


        this.fireFlower =
            false;


        this.starPower =
            false;


        this.starTimer =
            0;


        this.fireballs =
            [];

    }


    /* =====================================================
       DESENHAR
    ===================================================== */

    draw(ctx, cameraX = 0) {

        if (!ctx) {

            return;

        }


        /* Piscar durante invencibilidade */

        if (
            this.invincible &&
            Math.floor(
                this.invincibleTime / 5
            ) % 2 === 0
        ) {

            return;

        }


        const x =
            this.x -
            cameraX;


        const y =
            this.y;


        /* -------------------------------------------------
           Corpo
        ------------------------------------------------- */

        let color =
            "#e52521";


        if (
            this.powerup ===
            "fire"
        ) {

            color =
                "#ffffff";

        }


        if (
            this.starPower
        ) {

            const colors = [

                "#ff0000",
                "#ffff00",
                "#00ff00",
                "#00ffff",
                "#ff00ff"

            ];


            color =
                colors[
                    Math.floor(
                        Date.now() / 100
                    ) %
                    colors.length
                ];

        }


        /* Chapéu */

        ctx.fillStyle =
            color;


        ctx.fillRect(

            x + 5,

            y,

            this.width - 10,

            10

        );


        /* Cabeça */

        ctx.fillStyle =
            "#f2b27b";


        ctx.fillRect(

            x + 7,

            y + 9,

            this.width - 14,

            13

        );


        /* Corpo */

        ctx.fillStyle =
            color;


        ctx.fillRect(

            x + 4,

            y + 22,

            this.width - 8,

            this.height - 22

        );


        /* Olhos */

        ctx.fillStyle =
            "#111";


        const eyeX =
            this.facing > 0
                ? x + 21
                : x + 8;


        ctx.fillRect(

            eyeX,

            y + 12,

            3,

            4

        );


        /* Bigode */

        ctx.fillRect(

            x + 10,

            y + 19,

            12,

            3

        );


        /* Botas */

        ctx.fillStyle =
            "#713f27";


        ctx.fillRect(

            x + 2,

            y + this.height - 6,

            12,

            6

        );


        ctx.fillRect(

            x + this.width - 14,

            y + this.height - 6,

            12,

            6

        );


        /* -------------------------------------------------
           Bolas de fogo
        ------------------------------------------------- */

        this.fireballs.forEach(
            fireball => {

                ctx.fillStyle =
                    "#ffcc00";


                ctx.beginPath();

                ctx.arc(

                    fireball.x -
                    cameraX +
                    6,

                    fireball.y +
                    6,

                    6,

                    0,

                    Math.PI * 2

                );

                ctx.fill();


                ctx.fillStyle =
                    "#ff4500";


                ctx.beginPath();

                ctx.arc(

                    fireball.x -
                    cameraX +
                    6,

                    fireball.y +
                    6,

                    3,

                    0,

                    Math.PI * 2

                );

                ctx.fill();

            }
        );

    }

}


/* =========================================================
   CRIAR JOGADOR GLOBAL
========================================================= */

let player;


/* =========================================================
   CRIAR PLAYER
========================================================= */

function createPlayer(
    x = 80,
    y = 400
) {

    player =
        new Player(
            x,
            y
        );


    window.player =
        player;


    return player;

}


/* =========================================================
   INICIALIZAÇÃO AUTOMÁTICA
========================================================= */

if (
    typeof window !==
    "undefined"
) {

    window.Player =
        Player;

    window.createPlayer =
        createPlayer;

}
