"use strict";

/* =========================================================
   ENEMIES.JS
   Sistema de inimigos
========================================================= */

class Enemy {

    constructor(x, y, type = "goomba") {

        this.x = x;
        this.y = y;

        this.type = type;

        this.width = 32;
        this.height = 32;

        this.vx = -1;
        this.vy = 0;

        this.speed = 1;

        this.gravity = 0.5;

        this.grounded = false;

        this.dead = false;

        this.direction = -1;

        this.animation = 0;

        this.animationTimer = 0;

        this.shell = false;

        this.shellSpeed = 6;

        this.hp = 1;

        this.jumpTimer = 0;

        this.flyHeight = y;

        this.flyTimer = 0;

        this.boss = false;

        this.fireTimer = 0;

    }


    /* =====================================================
       ATUALIZAR
    ===================================================== */

    update(delta = 1) {

        if (this.dead) {
            return;
        }


        switch (this.type) {

            case "goomba":

                this.updateGoomba(delta);

                break;


            case "koopa":

                this.updateKoopa(delta);

                break;


            case "flying":

                this.updateFlying(delta);

                break;


            case "fire":

                this.updateFireEnemy(delta);

                break;


            case "boss":

                this.updateBoss(delta);

                break;


            default:

                this.updateBasic(delta);

                break;

        }


        this.applyGravity(delta);

        this.x += this.vx;

        this.y += this.vy;


        this.updateAnimation(delta);

    }


    /* =====================================================
       GOOMBA
    ===================================================== */

    updateGoomba() {

        this.speed = 1.2;

        this.vx =
            this.direction *
            this.speed;

    }


    /* =====================================================
       KOOPA
    ===================================================== */

    updateKoopa() {

        if (this.shell) {

            this.vx =
                this.direction *
                this.shellSpeed;

            return;

        }


        this.speed = 1;


        this.vx =
            this.direction *
            this.speed;

    }


    /* =====================================================
       INIMIGO VOADOR
    ===================================================== */

    updateFlying() {

        this.speed = 1.5;


        this.vx =
            this.direction *
            this.speed;


        this.flyTimer += 0.05;


        this.y =
            this.flyHeight +
            Math.sin(
                this.flyTimer
            ) * 25;

    }


    /* =====================================================
       INIMIGO DE FOGO
    ===================================================== */

    updateFireEnemy() {

        this.speed = 0.8;


        this.vx =
            this.direction *
            this.speed;


        this.fireTimer++;


        if (
            this.fireTimer > 120
        ) {

            this.fireTimer = 0;

            this.shoot();

        }

    }


    /* =====================================================
       BOSS
    ===================================================== */

    updateBoss() {

        this.boss = true;

        this.width = 64;

        this.height = 64;

        this.speed = 1.3;


        this.vx =
            this.direction *
            this.speed;


        this.jumpTimer++;


        if (
            this.jumpTimer > 150 &&
            this.grounded
        ) {

            this.vy = -12;

            this.jumpTimer = 0;

        }

    }


    /* =====================================================
       MOVIMENTO BÁSICO
    ===================================================== */

    updateBasic() {

        this.vx =
            this.direction *
            this.speed;

    }


    /* =====================================================
       GRAVIDADE
    ===================================================== */

    applyGravity() {

        if (
            this.type === "flying"
        ) {

            return;

        }


        if (!this.grounded) {

            this.vy +=
                this.gravity;


            this.vy =
                Math.min(
                    this.vy,
                    12
                );

        }

    }


    /* =====================================================
       ANIMAÇÃO
    ===================================================== */

    updateAnimation() {

        this.animationTimer++;


        if (
            this.animationTimer > 10
        ) {

            this.animation++;

            this.animationTimer = 0;

        }

    }


    /* =====================================================
       VIRAR
    ===================================================== */

    turnAround() {

        this.direction *= -1;

    }


    /* =====================================================
       COLISÃO COM PAREDE
    ===================================================== */

    hitWall() {

        this.turnAround();

    }


    /* =====================================================
       PISAR NO INIMIGO
    ===================================================== */

    stomp() {

        if (this.type === "koopa") {

            if (!this.shell) {

                this.shell = true;

                this.width = 32;

                this.height = 25;

                this.vx = 0;

            }

            else {

                this.shell = false;

                this.width = 32;

                this.height = 32;

            }

        }

        else {

            this.die();

        }


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.stomp();

        }

    }


    /* =====================================================
       MATAR
    ===================================================== */

    die() {

        if (this.dead) {

            return;

        }


        this.dead = true;


        this.vx = 0;

        this.vy = -5;


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.enemyHit();

        }


        if (
            typeof player !==
            "undefined"
        ) {

            player.score += 100;

        }

    }


    /* =====================================================
       ATINGIDO POR BOLA DE FOGO
    ===================================================== */

    hitByFireball() {

        if (this.type === "boss") {

            this.hp--;


            if (
                this.hp <= 0
            ) {

                this.die();

            }

        }

        else {

            this.die();

        }

    }


    /* =====================================================
       TIRO
    ===================================================== */

    shoot() {

        if (
            typeof ENEMIES ===
            "undefined"
        ) {

            return;

        }


        ENEMIES.projectiles.push({

            x:
                this.x,

            y:
                this.y + 10,

            width:
                10,

            height:
                10,

            vx:
                this.direction * 4,

            vy:
                0,

            alive:
                true

        });

    }


    /* =====================================================
       HITBOX
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
       DESENHAR
    ===================================================== */

    draw(ctx, cameraX = 0) {

        if (
            this.dead ||
            !ctx
        ) {

            return;

        }


        const x =
            this.x -
            cameraX;


        const y =
            this.y;


        /* =================================================
           GOOMBA
        ================================================= */

        if (
            this.type ===
            "goomba"
        ) {

            /* Cabeça */

            ctx.fillStyle =
                "#9b4d24";


            ctx.beginPath();

            ctx.arc(

                x + 16,

                y + 13,

                15,

                Math.PI,

                0

            );

            ctx.fill();


            /* Corpo */

            ctx.fillStyle =
                "#9b4d24";


            ctx.fillRect(

                x + 3,

                y + 13,

                26,

                14

            );


            /* Olhos */

            ctx.fillStyle =
                "#ffffff";


            ctx.fillRect(
                x + 7,
                y + 8,
                6,
                9
            );


            ctx.fillRect(
                x + 19,
                y + 8,
                6,
                9
            );


            ctx.fillStyle =
                "#111";


            ctx.fillRect(
                x + 9,
                y + 11,
                3,
                5
            );


            ctx.fillRect(
                x + 20,
                y + 11,
                3,
                5
            );


            /* Pés */

            ctx.fillStyle =
                "#542817";


            ctx.fillRect(
                x,
                y + 27,
                14,
                5
            );


            ctx.fillRect(
                x + 18,
                y + 27,
                14,
                5
            );

        }


        /* =================================================
           KOOPA
        ================================================= */

        else if (
            this.type ===
            "koopa"
        ) {

            /* Casco */

            ctx.fillStyle =
                "#24a832";


            ctx.beginPath();

            ctx.arc(

                x + 16,

                y + 16,

                15,

                Math.PI,

                0

            );

            ctx.fill();


            ctx.fillStyle =
                "#f6e6a5";


            ctx.fillRect(

                x + 6,

                y + 14,

                20,

                14

            );


            /* Cabeça */

            if (!this.shell) {

                ctx.fillStyle =
                    "#f2c38b";


                ctx.fillRect(

                    x + 10,

                    y + 7,

                    18,

                    14

                );


                ctx.fillStyle =
                    "#111";


                ctx.fillRect(

                    x + 21,

                    y + 10,

                    3,

                    4

                );

            }


            /* Pés */

            ctx.fillStyle =
                "#f2c38b";


            ctx.fillRect(
                x + 2,
                y + 27,
                10,
                5
            );


            ctx.fillRect(
                x + 20,
                y + 27,
                10,
                5
            );

        }


        /* =================================================
           INIMIGO VOADOR
        ================================================= */

        else if (
            this.type ===
            "flying"
        ) {

            ctx.fillStyle =
                "#c62828";


            ctx.beginPath();

            ctx.arc(

                x + 16,

                y + 16,

                13,

                0,

                Math.PI * 2

            );

            ctx.fill();


            /* Asas */

            ctx.fillStyle =
                "#ffffff";


            ctx.fillRect(
                x - 8,
                y + 4,
                12,
                8
            );


            ctx.fillRect(
                x + 28,
                y + 4,
                12,
                8
            );


            /* Olhos */

            ctx.fillStyle =
                "#ffffff";


            ctx.fillRect(
                x + 7,
                y + 10,
                6,
                7
            );


            ctx.fillRect(
                x + 19,
                y + 10,
                6,
                7
            );


            ctx.fillStyle =
                "#111";


            ctx.fillRect(
                x + 9,
                y + 12,
                3,
                4
            );


            ctx.fillRect(
                x + 20,
                y + 12,
                3,
                4
            );

        }


        /* =================================================
           INIMIGO DE FOGO
        ================================================= */

        else if (
            this.type ===
            "fire"
        ) {

            ctx.fillStyle =
                "#ff4500";


            ctx.beginPath();

            ctx.arc(

                x + 16,

                y + 16,

                15,

                0,

                Math.PI * 2

            );

            ctx.fill();


            ctx.fillStyle =
                "#ffff00";


            ctx.beginPath();

            ctx.arc(

                x + 16,

                y + 18,

                8,

                0,

                Math.PI * 2

            );

            ctx.fill();


            ctx.fillStyle =
                "#ffffff";


            ctx.fillRect(
                x + 8,
                y + 8,
                5,
                6
            );


            ctx.fillRect(
                x + 19,
                y + 8,
                5,
                6
            );

        }


        /* =================================================
           BOSS
        ================================================= */

        else if (
            this.type ===
            "boss"
        ) {

            /* Corpo */

            ctx.fillStyle =
                "#7226a8";


            ctx.fillRect(

                x,

                y + 15,

                64,

                49

            );


            /* Cabeça */

            ctx.fillStyle =
                "#9c4dcc";


            ctx.beginPath();

            ctx.arc(

                x + 32,

                y + 20,

                25,

                0,

                Math.PI * 2

            );

            ctx.fill();


            /* Chifres */

            ctx.fillStyle =
                "#f4d03f";


            ctx.beginPath();

            ctx.moveTo(
                x + 8,
                y + 4
            );

            ctx.lineTo(
                x + 20,
                y - 15
            );

            ctx.lineTo(
                x + 25,
                y + 8
            );

            ctx.fill();


            ctx.beginPath();

            ctx.moveTo(
                x + 39,
                y + 8
            );

            ctx.lineTo(
                x + 44,
                y - 15
            );

            ctx.lineTo(
                x + 56,
                y + 4
            );

            ctx.fill();


            /* Olhos */

            ctx.fillStyle =
                "#ffffff";


            ctx.fillRect(
                x + 14,
                y + 14,
                12,
                10
            );


            ctx.fillRect(
                x + 38,
                y + 14,
                12,
                10
            );


            ctx.fillStyle =
                "#ff0000";


            ctx.fillRect(
                x + 19,
                y + 17,
                5,
                6
            );


            ctx.fillRect(
                x + 40,
                y + 17,
                5,
                6
            );


            /* Boca */

            ctx.fillStyle =
                "#111";


            ctx.fillRect(
                x + 15,
                y + 35,
                34,
                10
            );


            /* Dentes */

            ctx.fillStyle =
                "#ffffff";


            for (
                let i = 0;
                i < 5;
                i++
            ) {

                ctx.fillRect(

                    x + 17 +
                    i * 7,

                    y + 35,

                    5,

                    6

                );

            }

        }

    }

}


/* =========================================================
   GERENCIADOR DE INIMIGOS
========================================================= */

const ENEMIES = {

    list: [],

    projectiles: [],


    /* =====================================================
       CRIAR INIMIGO
    ===================================================== */

    create(
        type,
        x,
        y
    ) {

        const enemy =
            new Enemy(
                x,
                y,
                type
            );


        this.list.push(
            enemy
        );


        return enemy;

    },


    /* =====================================================
       CRIAR INIMIGOS DA FASE
    ===================================================== */

    loadFromLevel(level) {

        this.list = [];

        this.projectiles = [];


        if (
            !level ||
            !level.enemies
        ) {

            return;

        }


        level.enemies.forEach(
            data => {

                const enemy =
                    this.create(

                        data.type ||
                        "goomba",

                        data.x *
                        (
                            typeof LEVELS !==
                            "undefined"
                                ? LEVELS.tileSize
                                : 40
                        ),

                        data.y *
                        (
                            typeof LEVELS !==
                            "undefined"
                                ? LEVELS.tileSize
                                : 40
                        )

                    );


                if (
                    data.direction
                ) {

                    enemy.direction =
                        data.direction;

                }

            }
        );

    },


    /* =====================================================
       ATUALIZAR TODOS
    ===================================================== */

    update(delta = 1) {

        this.list.forEach(
            enemy => {

                enemy.update(
                    delta
                );

            }
        );


        this.updateProjectiles();


        this.removeDead();

    },


    /* =====================================================
       ATUALIZAR PROJÉTEIS
    ===================================================== */

    updateProjectiles() {

        this.projectiles.forEach(
            projectile => {

                if (
                    !projectile.alive
                ) {

                    return;

                }


                projectile.x +=
                    projectile.vx;


                projectile.y +=
                    projectile.vy;

            }
        );


        this.projectiles =
            this.projectiles.filter(
                projectile =>
                    projectile.alive &&
                    projectile.x > -500 &&
                    projectile.x < 20000 &&
                    projectile.y > -500 &&
                    projectile.y < 1000
            );

    },


    /* =====================================================
       REMOVER MORTOS
    ===================================================== */

    removeDead() {

        this.list =
            this.list.filter(
                enemy =>
                    !enemy.dead
            );

    },


    /* =====================================================
       DESENHAR
    ===================================================== */

    draw(
        ctx,
        cameraX = 0
    ) {

        this.list.forEach(
            enemy => {

                enemy.draw(
                    ctx,
                    cameraX
                );

            }
        );


        this.drawProjectiles(
            ctx,
            cameraX
        );

    },


    /* =====================================================
       DESENHAR PROJÉTEIS
    ===================================================== */

    drawProjectiles(
        ctx,
        cameraX = 0
    ) {

        this.projectiles.forEach(
            projectile => {

                ctx.fillStyle =
                    "#ff4500";


                ctx.beginPath();

                ctx.arc(

                    projectile.x -
                    cameraX,

                    projectile.y,

                    5,

                    0,

                    Math.PI * 2

                );

                ctx.fill();

            }
        );

    },


    /* =====================================================
       COLISÃO COM PLAYER
    ===================================================== */

    checkPlayerCollision(
        player
    ) {

        if (
            !player ||
            player.dead
        ) {

            return;

        }


        this.list.forEach(
            enemy => {

                if (
                    enemy.dead
                ) {

                    return;

                }


                if (
                    player.intersects(
                        enemy
                    )
                ) {

                    /* Player caindo */

                    if (
                        player.vy > 0 &&
                        player.y +
                        player.height -
                        10 <
                        enemy.y +
                        enemy.height / 2
                    ) {

                        player.bounce(
                            9
                        );


                        enemy.stomp();

                    }

                    else {

                        player.takeDamage();

                    }

                }

            }
        );

    },


    /* =====================================================
       COLISÃO COM BOLAS DE FOGO
    ===================================================== */

    checkFireballs(
        player
    ) {

        if (!player) {

            return;

        }


        player.fireballs.forEach(
            fireball => {

                if (
                    !fireball.alive
                ) {

                    return;

                }


                this.list.forEach(
                    enemy => {

                        if (
                            enemy.dead
                        ) {

                            return;

                        }


                        if (
                            this.intersects(
                                fireball,
                                enemy
                            )
                        ) {

                            enemy.hitByFireball();


                            fireball.alive =
                                false;


                            if (
                                typeof SOUNDS !==
                                "undefined"
                            ) {

                                SOUNDS.explosion();

                            }

                        }

                    }
                );

            }
        );

    },


    /* =====================================================
       COLISÃO ENTRE OBJETOS
    ===================================================== */

    intersects(
        a,
        b
    ) {

        return (

            a.x <
            b.x +
            b.width &&

            a.x +
            a.width >
            b.x &&

            a.y <
            b.y +
            b.height &&

            a.y +
            a.height >
            b.y

        );

    },


    /* =====================================================
       MATAR TODOS
    ===================================================== */

    killAll() {

        this.list.forEach(
            enemy => {

                enemy.die();

            }
        );

    },


    /* =====================================================
       LIMPAR
    ===================================================== */

    clear() {

        this.list = [];

        this.projectiles = [];

    }

};


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

function createEnemy(
    type,
    x,
    y
) {

    return ENEMIES.create(
        type,
        x,
        y
    );

}


function loadEnemies(level) {

    ENEMIES.loadFromLevel(
        level
    );

}


/* =========================================================
   EXPORTAR
========================================================= */

window.Enemy =
    Enemy;

window.ENEMIES =
    ENEMIES;

window.createEnemy =
    createEnemy;

window.loadEnemies =
    loadEnemies;
