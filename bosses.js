"use strict";

/* =========================================================
   BOSSES.JS
   Sistema de chefes do jogo
========================================================= */

class Boss {

    constructor(x, y, type = "king") {

        this.x = x;
        this.y = y;

        this.type = type;

        this.width = 64;
        this.height = 64;

        this.vx = 0;
        this.vy = 0;

        this.gravity = 0.5;

        this.speed = 1.2;

        this.direction = -1;

        this.grounded = false;

        this.dead = false;

        /* Vida */

        this.maxHealth = 10;
        this.health = this.maxHealth;

        /* Combate */

        this.attackTimer = 0;
        this.attackCooldown = 120;

        this.jumpTimer = 0;
        this.jumpCooldown = 180;

        this.fireTimer = 0;
        this.fireCooldown = 150;

        /* Fase da batalha */

        this.phase = 1;

        /* Invencibilidade */

        this.invincible = false;
        this.invincibleTimer = 0;

        /* Animação */

        this.animation = 0;
        this.animationTimer = 0;

        /* Projéteis */

        this.projectiles = [];

        /* Estado */

        this.hurt = false;
        this.hurtTimer = 0;

        this.defeated = false;

        this.intro = true;
        this.introTimer = 120;

        this.score = 5000;

    }


    /* =====================================================
       ATUALIZAR
    ===================================================== */

    update(delta = 1) {

        if (this.dead) {
            return;
        }


        if (this.intro) {

            this.updateIntro();

            return;

        }


        this.updateTimers();

        this.updatePhase();

        this.updateAI();

        this.applyPhysics();

        this.x += this.vx;

        this.y += this.vy;

        this.updateProjectiles();

        this.updateAnimation();

    }


    /* =====================================================
       INTRODUÇÃO
    ===================================================== */

    updateIntro() {

        this.introTimer--;

        this.vx = 0;


        if (
            this.introTimer <= 0
        ) {

            this.intro = false;

        }

    }


    /* =====================================================
       INTELIGÊNCIA ARTIFICIAL
    ===================================================== */

    updateAI() {

        if (
            typeof player !==
            "undefined" &&
            player &&
            !player.dead
        ) {

            if (
                player.x <
                this.x
            ) {

                this.direction =
                    -1;

            }

            else {

                this.direction =
                    1;

            }

        }


        this.vx =
            this.direction *
            this.speed;


        /* Pulo */

        this.jumpTimer++;


        if (
            this.jumpTimer >=
            this.jumpCooldown &&
            this.grounded
        ) {

            this.jump();

            this.jumpTimer = 0;

        }


        /* Ataque */

        this.attackTimer++;


        if (
            this.attackTimer >=
            this.attackCooldown
        ) {

            this.attack();

            this.attackTimer = 0;

        }


        /* Fogo */

        this.fireTimer++;


        if (
            this.fireTimer >=
            this.fireCooldown
        ) {

            this.fireAttack();

            this.fireTimer = 0;

        }

    }


    /* =====================================================
       FASE DA BATALHA
    ===================================================== */

    updatePhase() {

        const percent =
            this.health /
            this.maxHealth;


        if (
            percent <= 0.30
        ) {

            this.phase = 3;

            this.speed = 2.4;

            this.attackCooldown = 65;

            this.jumpCooldown = 100;

            this.fireCooldown = 80;

        }

        else if (
            percent <= 0.60
        ) {

            this.phase = 2;

            this.speed = 1.8;

            this.attackCooldown = 90;

            this.jumpCooldown = 130;

            this.fireCooldown = 110;

        }

        else {

            this.phase = 1;

            this.speed = 1.2;

        }

    }


    /* =====================================================
       PULO
    ===================================================== */

    jump() {

        if (
            !this.grounded
        ) {

            return;

        }


        this.vy =
            -12;


        this.grounded =
            false;


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.superJump();

        }

    }


    /* =====================================================
       ATAQUE FÍSICO
    ===================================================== */

    attack() {

        this.vx =
            this.direction *
            4;


        this.attackTimer = 0;

    }


    /* =====================================================
       ATAQUE DE FOGO
    ===================================================== */

    fireAttack() {

        const count =
            this.phase >= 3
                ? 3
                : this.phase >= 2
                    ? 2
                    : 1;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                count === 1
                    ? 0
                    : (
                        i -
                        (count - 1) / 2
                    ) * 0.3;


            this.projectiles.push({

                x:
                    this.x +
                    this.width / 2,

                y:
                    this.y +
                    25,

                width:
                    14,

                height:
                    14,

                vx:
                    Math.cos(angle) *
                    this.direction *
                    5,

                vy:
                    Math.sin(angle) *
                    5,

                gravity:
                    0.1,

                alive:
                    true

            });

        }


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.fireball();

        }

    }


    /* =====================================================
       GRAVIDADE
    ===================================================== */

    applyPhysics() {

        if (
            !this.grounded
        ) {

            this.vy +=
                this.gravity;


            this.vy =
                Math.min(
                    this.vy,
                    14
                );

        }

    }


    /* =====================================================
       TEMPORIZADORES
    ===================================================== */

    updateTimers() {

        if (
            this.invincibleTimer > 0
        ) {

            this.invincibleTimer--;

        }

        else {

            this.invincible =
                false;

        }


        if (
            this.hurtTimer > 0
        ) {

            this.hurtTimer--;

        }

        else {

            this.hurt =
                false;

        }

    }


    /* =====================================================
       PROJÉTEIS
    ===================================================== */

    updateProjectiles() {

        this.projectiles.forEach(
            projectile => {

                if (
                    !projectile.alive
                ) {

                    return;

                }


                projectile.vy +=
                    projectile.gravity;


                projectile.x +=
                    projectile.vx;


                projectile.y +=
                    projectile.vy;


                if (
                    projectile.y >
                    900
                ) {

                    projectile.alive =
                        false;

                }

            }
        );


        this.projectiles =
            this.projectiles.filter(
                projectile =>
                    projectile.alive
            );

    }


    /* =====================================================
       ATINGIR BOSS
    ===================================================== */

    takeDamage(amount = 1) {

        if (
            this.dead ||
            this.invincible
        ) {

            return false;

        }


        this.health -=
            amount;


        this.hurt =
            true;


        this.hurtTimer =
            20;


        this.invincible =
            true;


        this.invincibleTimer =
            30;


        this.vx =
            -this.direction *
            3;


        this.vy =
            -5;


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.enemyHit();

        }


        if (
            this.health <= 0
        ) {

            this.defeat();

        }


        return true;

    }


    /* =====================================================
       DERROTAR
    ===================================================== */

    defeat() {

        if (this.dead) {

            return;

        }


        this.health = 0;

        this.dead = true;

        this.defeated = true;

        this.vx = 0;

        this.vy = -10;


        if (
            typeof SOUNDS !==
            "undefined"
        ) {

            SOUNDS.victory();

        }


        if (
            typeof player !==
            "undefined" &&
            player
        ) {

            player.score +=
                this.score;

        }


        /* Avisar ao sistema do jogo */

        if (
            typeof GAME !==
            "undefined" &&
            typeof GAME.bossDefeated ===
            "function"
        ) {

            GAME.bossDefeated(
                this
            );

        }

    }


    /* =====================================================
       COLISÃO COM PLAYER
    ===================================================== */

    checkPlayerCollision(
        targetPlayer
    ) {

        if (
            this.dead ||
            !targetPlayer ||
            targetPlayer.dead
        ) {

            return;

        }


        if (
            this.intersects(
                targetPlayer
            )
        ) {

            /* Player caiu em cima */

            if (
                targetPlayer.vy > 0 &&
                targetPlayer.y +
                targetPlayer.height -
                10 <
                this.y +
                this.height / 2
            ) {

                this.takeDamage(1);

                targetPlayer.bounce(
                    10
                );

            }

            else {

                targetPlayer.takeDamage();

            }

        }


        /* Projéteis do boss */

        this.projectiles.forEach(
            projectile => {

                if (
                    !projectile.alive
                ) {

                    return;

                }


                if (
                    this.intersects(
                        projectile,
                        targetPlayer
                    )
                ) {

                    projectile.alive =
                        false;


                    targetPlayer.takeDamage();

                }

            }
        );

    }


    /* =====================================================
       COLISÃO COM BOLA DE FOGO
    ===================================================== */

    checkFireballs(
        targetPlayer
    ) {

        if (
            !targetPlayer ||
            this.dead
        ) {

            return;

        }


        targetPlayer.fireballs.forEach(
            fireball => {

                if (
                    !fireball.alive
                ) {

                    return;

                }


                if (
                    this.intersects(
                        fireball,
                        this
                    )
                ) {

                    fireball.alive =
                        false;


                    this.takeDamage(1);

                }

            }
        );

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
       COLISÃO COM CHÃO
    ===================================================== */

    land(y) {

        this.y =
            y -
            this.height;


        this.vy =
            0;


        this.grounded =
            true;

    }


    /* =====================================================
       COLISÃO COM PAREDE
    ===================================================== */

    hitWall() {

        this.direction *=
            -1;

    }


    /* =====================================================
       ANIMAÇÃO
    ===================================================== */

    updateAnimation() {

        this.animationTimer++;


        if (
            this.animationTimer >=
            10
        ) {

            this.animation++;

            this.animationTimer =
                0;

        }

    }


    /* =====================================================
       DESENHAR
    ===================================================== */

    draw(
        ctx,
        cameraX = 0
    ) {

        if (
            !ctx ||
            this.dead
        ) {

            return;

        }


        const x =
            this.x -
            cameraX;


        const y =
            this.y;


        /* Piscar quando recebe dano */

        if (
            this.hurt &&
            Math.floor(
                this.hurtTimer / 3
            ) % 2 === 0
        ) {

            return;

        }


        /* =================================================
           SOMBRA
        ================================================= */

        ctx.fillStyle =
            "rgba(0,0,0,0.25)";


        ctx.beginPath();

        ctx.ellipse(

            x + this.width / 2,

            y + this.height,

            this.width / 2,

            6,

            0,

            0,

            Math.PI * 2

        );

        ctx.fill();


        /* =================================================
           CORPO
        ================================================= */

        ctx.fillStyle =
            "#7b1fa2";


        ctx.fillRect(

            x + 5,

            y + 18,

            this.width - 10,

            this.height - 18

        );


        /* =================================================
           CABEÇA
        ================================================= */

        ctx.fillStyle =
            "#9c4dcc";


        ctx.beginPath();

        ctx.arc(

            x + this.width / 2,

            y + 20,

            25,

            0,

            Math.PI * 2

        );

        ctx.fill();


        /* =================================================
           CHIFRES
        ================================================= */

        ctx.fillStyle =
            "#f4d03f";


        ctx.beginPath();

        ctx.moveTo(
            x + 8,
            y + 10
        );

        ctx.lineTo(
            x + 16,
            y - 12
        );

        ctx.lineTo(
            x + 25,
            y + 10
        );

        ctx.fill();


        ctx.beginPath();

        ctx.moveTo(
            x + 39,
            y + 10
        );

        ctx.lineTo(
            x + 48,
            y - 12
        );

        ctx.lineTo(
            x + 56,
            y + 10
        );

        ctx.fill();


        /* =================================================
           OLHOS
        ================================================= */

        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            x + 13,
            y + 15,
            13,
            11
        );


        ctx.fillRect(
            x + 38,
            y + 15,
            13,
            11
        );


        ctx.fillStyle =
            "#ff0000";


        ctx.fillRect(
            x + 19,
            y + 17,
            6,
            8
        );


        ctx.fillRect(
            x + 39,
            y + 17,
            6,
            8
        );


        /* =================================================
           BOCA
        ================================================= */

        ctx.fillStyle =
            "#111";


        ctx.fillRect(

            x + 13,

            y + 37,

            38,

            14

        );


        /* DENTES */

        ctx.fillStyle =
            "#ffffff";


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            ctx.fillRect(

                x + 16 +
                i * 7,

                y + 37,

                5,

                7

            );

        }


        /* =================================================
           PÉS
        ================================================= */

        ctx.fillStyle =
            "#45200f";


        ctx.fillRect(

            x,

            y + this.height - 8,

            25,

            8

        );


        ctx.fillRect(

            x + 39,

            y + this.height - 8,

            25,

            8

        );


        /* =================================================
           PROJÉTEIS
        ================================================= */

        this.projectiles.forEach(
            projectile => {

                if (
                    !projectile.alive
                ) {

                    return;

                }


                ctx.fillStyle =
                    "#ff4500";


                ctx.beginPath();

                ctx.arc(

                    projectile.x -
                    cameraX,

                    projectile.y,

                    8,

                    0,

                    Math.PI * 2

                );

                ctx.fill();


                ctx.fillStyle =
                    "#ffff00";


                ctx.beginPath();

                ctx.arc(

                    projectile.x -
                    cameraX,

                    projectile.y,

                    4,

                    0,

                    Math.PI * 2

                );

                ctx.fill();

            }
        );

    }


    /* =====================================================
       BARRA DE VIDA
    ===================================================== */

    drawHealthBar(
        ctx,
        canvasWidth
    ) {

        if (
            !ctx ||
            this.dead
        ) {

            return;

        }


        const width =
            Math.min(
                400,
                canvasWidth * 0.6
            );


        const height =
            20;


        const x =
            (canvasWidth -
            width) / 2;


        const y =
            25;


        /* Fundo */

        ctx.fillStyle =
            "#222";


        ctx.fillRect(

            x - 4,

            y - 4,

            width + 8,

            height + 8

        );


        /* Vida */

        const healthWidth =
            width *
            (
                this.health /
                this.maxHealth
            );


        ctx.fillStyle =
            this.phase === 3
                ? "#ff2222"
                : "#e53935";


        ctx.fillRect(

            x,

            y,

            healthWidth,

            height

        );


        /* Borda */

        ctx.strokeStyle =
            "#ffffff";


        ctx.lineWidth =
            2;


        ctx.strokeRect(

            x,

            y,

            width,

            height

        );


        /* Texto */

        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "bold 14px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(

            "BOSS",

            canvasWidth / 2,

            y + 15

        );

    }

}


/* =========================================================
   GERENCIADOR DE BOSSES
========================================================= */

const BOSSES = {

    list: [],


    /* =====================================================
       CRIAR
    ===================================================== */

    create(
        x,
        y,
        type = "king"
    ) {

        const boss =
            new Boss(
                x,
                y,
                type
            );


        this.list.push(
            boss
        );


        return boss;

    },


    /* =====================================================
       ATUALIZAR
    ===================================================== */

    update(delta = 1) {

        this.list.forEach(
            boss => {

                boss.update(
                    delta
                );

            }
        );


        this.removeDefeated();

    },


    /* =====================================================
       COLISÕES
    ===================================================== */

    checkCollisions(
        targetPlayer
    ) {

        this.list.forEach(
            boss => {

                boss.checkPlayerCollision(
                    targetPlayer
                );


                boss.checkFireballs(
                    targetPlayer
                );

            }
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
            boss => {

                boss.draw(
                    ctx,
                    cameraX
                );

            }
        );

    },


    /* =====================================================
       BARRA DE VIDA
    ===================================================== */

    drawHealthBars(
        ctx,
        canvasWidth
    ) {

        this.list.forEach(
            boss => {

                if (
                    !boss.dead
                ) {

                    boss.drawHealthBar(
                        ctx,
                        canvasWidth
                    );

                }

            }
        );

    },


    /* =====================================================
       REMOVER DERROTADOS
    ===================================================== */

    removeDefeated() {

        this.list =
            this.list.filter(
                boss =>
                    !boss.defeated
            );

    },


    /* =====================================================
       LIMPAR
    ===================================================== */

    clear() {

        this.list = [];

    },


    /* =====================================================
       BOSS ATUAL
    ===================================================== */

    getCurrentBoss() {

        if (
            this.list.length === 0
        ) {

            return null;

        }


        return this.list[0];

    },


    /* =====================================================
       DERROTAR TODOS
    ===================================================== */

    defeatAll() {

        this.list.forEach(
            boss => {

                boss.defeat();

            }
        );

    }

};


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

function createBoss(
    x,
    y,
    type = "king"
) {

    return BOSSES.create(
        x,
        y,
        type
    );

}


function getCurrentBoss() {

    return BOSSES.getCurrentBoss();

}


/* =========================================================
   EXPORTAR
========================================================= */

window.Boss =
    Boss;

window.BOSSES =
    BOSSES;

window.createBoss =
    createBoss;

window.getCurrentBoss =
    getCurrentBoss;
