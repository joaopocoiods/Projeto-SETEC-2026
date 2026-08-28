"use strict";

/* =========================================================
   LEVELS.JS
   Sistema de fases do jogo
========================================================= */

const LEVELS = {

    /* =====================================================
       CONFIGURAÇÕES
    ===================================================== */

    tileSize: 40,

    totalLevels: 12,

    currentLevel: 1,

    levels: {},


    /* =====================================================
       CRIAR TODAS AS FASES
    ===================================================== */

    init() {

        this.createLevel1();
        this.createLevel2();
        this.createLevel3();
        this.createLevel4();

        this.createLevel5();
        this.createLevel6();
        this.createLevel7();
        this.createLevel8();

        this.createLevel9();
        this.createLevel10();
        this.createLevel11();
        this.createLevel12();

        console.log(
            "12 fases carregadas!"
        );

    },


    /* =====================================================
       GERAR FASE
    ===================================================== */

    createLevel(number, data) {

        this.levels[number] = {

            id: number,

            name:
                data.name ||
                `Fase ${number}`,

            world:
                data.world ||
                Math.ceil(number / 4),

            width:
                data.width ||
                200,

            height:
                data.height ||
                15,

            theme:
                data.theme ||
                "grass",

            time:
                data.time ||
                300,

            start: data.start || {
                x: 80,
                y: 400
            },

            ground:
                data.ground || [],

            platforms:
                data.platforms || [],

            blocks:
                data.blocks || [],

            coins:
                data.coins || [],

            enemies:
                data.enemies || [],

            pipes:
                data.pipes || [],

            checkpoints:
                data.checkpoints || [],

            powerups:
                data.powerups || [],

            flag:
                data.flag || {
                    x: 190,
                    y: 11
                }

        };

    },


    /* =====================================================
       FASE 1
    ===================================================== */

    createLevel1() {

        this.createLevel(1, {

            name: "Planície Verde",

            world: 1,

            theme: "grass",

            width: 220,

            time: 300,

            start: {
                x: 80,
                y: 400
            },

            ground: [

                [0, 13, 220, 2]

            ],

            platforms: [

                [15, 10, 5, 1],

                [28, 8, 4, 1],

                [42, 10, 6, 1],

                [60, 7, 5, 1],

                [78, 10, 6, 1],

                [100, 8, 5, 1],

                [120, 10, 4, 1],

                [145, 7, 6, 1],

                [170, 10, 5, 1]

            ],

            blocks: [

                [20, 9, "question"],

                [21, 9, "brick"],

                [30, 7, "question"],

                [31, 7, "brick"],

                [65, 9, "question"],

                [105, 7, "question"]

            ],

            coins: [

                [16, 9],
                [17, 9],
                [18, 9],

                [29, 7],
                [30, 7],
                [31, 7],

                [45, 9],
                [46, 9],
                [47, 9],

                [80, 9],
                [81, 9],
                [82, 9]

            ],

            enemies: [

                {
                    type: "goomba",
                    x: 24,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 38,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 75,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 110,
                    y: 12
                },

                {
                    type: "koopa",
                    x: 135,
                    y: 12
                }

            ],

            pipes: [

                [50, 11, 2],

                [90, 10, 3],

                [130, 11, 2]

            ],

            powerups: [

                {
                    type: "mushroom",
                    x: 20,
                    y: 8
                },

                {
                    type: "flower",
                    x: 65,
                    y: 8
                }

            ],

            checkpoints: [

                {
                    x: 100,
                    y: 12
                }

            ],

            flag: {
                x: 200,
                y: 5
            }

        });

    },


    /* =====================================================
       FASE 2
    ===================================================== */

    createLevel2() {

        this.createLevel(2, {

            name: "Colinas",

            world: 1,

            theme: "hills",

            width: 230,

            time: 300,

            ground: [

                [0, 13, 230, 2]

            ],

            platforms: [

                [12, 10, 5, 1],

                [25, 8, 5, 1],

                [40, 6, 5, 1],

                [55, 9, 7, 1],

                [75, 7, 5, 1],

                [90, 10, 6, 1],

                [110, 8, 5, 1],

                [130, 6, 5, 1],

                [150, 9, 6, 1],

                [175, 7, 5, 1]

            ],

            coins: [

                [13, 9],
                [14, 9],
                [15, 9],

                [26, 7],
                [27, 7],
                [28, 7],

                [41, 5],
                [42, 5],
                [43, 5],

                [76, 6],
                [77, 6]

            ],

            blocks: [

                [32, 9, "question"],

                [50, 8, "brick"],

                [70, 8, "question"],

                [100, 7, "question"],

                [140, 8, "brick"]

            ],

            enemies: [

                {
                    type: "goomba",
                    x: 20,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 36,
                    y: 12
                },

                {
                    type: "koopa",
                    x: 60,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 95,
                    y: 12
                },

                {
                    type: "koopa",
                    x: 120,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 160,
                    y: 12
                }

            ],

            pipes: [

                [65, 10, 3],

                [115, 11, 2],

                [160, 10, 3]

            ],

            powerups: [

                {
                    type: "mushroom",
                    x: 32,
                    y: 8
                },

                {
                    type: "star",
                    x: 100,
                    y: 6
                }

            ],

            checkpoints: [

                {
                    x: 115,
                    y: 12
                }

            ],

            flag: {
                x: 210,
                y: 5
            }

        });

    },


    /* =====================================================
       FASE 3
    ===================================================== */

    createLevel3() {

        this.createLevel(3, {

            name: "Caverna",

            world: 1,

            theme: "cave",

            width: 240,

            time: 280,

            ground: [

                [0, 13, 240, 2]

            ],

            platforms: [

                [10, 10, 6, 1],

                [25, 7, 5, 1],

                [40, 10, 5, 1],

                [55, 6, 6, 1],

                [75, 9, 5, 1],

                [90, 7, 6, 1],

                [110, 10, 5, 1],

                [130, 6, 6, 1],

                [150, 9, 5, 1],

                [175, 7, 6, 1],

                [200, 10, 5, 1]

            ],

            blocks: [

                [15, 9, "question"],

                [30, 6, "brick"],

                [60, 5, "question"],

                [95, 6, "question"],

                [135, 5, "brick"],

                [180, 6, "question"]

            ],

            coins: [

                [11, 9],
                [12, 9],
                [13, 9],

                [26, 6],
                [27, 6],

                [56, 5],
                [57, 5],
                [58, 5],

                [91, 6],
                [92, 6],

                [176, 6],
                [177, 6]

            ],

            enemies: [

                {
                    type: "goomba",
                    x: 20,
                    y: 12
                },

                {
                    type: "koopa",
                    x: 50,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 82,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 105,
                    y: 12
                },

                {
                    type: "koopa",
                    x: 145,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 190,
                    y: 12
                }

            ],

            pipes: [

                [35, 10, 3],

                [100, 11, 2],

                [165, 10, 3]

            ],

            powerups: [

                {
                    type: "flower",
                    x: 60,
                    y: 4
                },

                {
                    type: "mushroom",
                    x: 135,
                    y: 4
                }

            ],

            flag: {
                x: 220,
                y: 5
            }

        });

    },


    /* =====================================================
       FASE 4
    ===================================================== */

    createLevel4() {

        this.createLevel(4, {

            name: "Castelo",

            world: 1,

            theme: "castle",

            width: 250,

            time: 300,

            ground: [

                [0, 13, 250, 2]

            ],

            platforms: [

                [15, 9, 5, 1],

                [30, 6, 4, 1],

                [45, 10, 5, 1],

                [65, 7, 5, 1],

                [85, 5, 5, 1],

                [110, 8, 5, 1],

                [130, 6, 5, 1],

                [155, 9, 5, 1],

                [180, 6, 5, 1],

                [205, 8, 5, 1]

            ],

            blocks: [

                [20, 8, "brick"],

                [35, 5, "question"],

                [70, 6, "brick"],

                [90, 4, "question"],

                [135, 5, "question"],

                [185, 5, "brick"]

            ],

            coins: [

                [16, 8],
                [17, 8],

                [31, 5],
                [32, 5],

                [66, 6],
                [67, 6],

                [86, 4],
                [87, 4],

                [156, 8],
                [157, 8]

            ],

            enemies: [

                {
                    type: "goomba",
                    x: 25,
                    y: 12
                },

                {
                    type: "koopa",
                    x: 55,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 100,
                    y: 12
                },

                {
                    type: "koopa",
                    x: 145,
                    y: 12
                },

                {
                    type: "goomba",
                    x: 195,
                    y: 12
                }

            ],

            pipes: [

                [50, 11, 2],

                [100, 10, 3],

                [145, 11, 2],

                [195, 10, 3]

            ],

            powerups: [

                {
                    type: "star",
                    x: 90,
                    y: 3
                }

            ],

            checkpoints: [

                {
                    x: 125,
                    y: 12
                }

            ],

            flag: {
                x: 230,
                y: 5
            }

        });

    },


    /* =====================================================
       FASES 5-8
    ===================================================== */

    createLevel5() {

        this.createLevel(5, {

            name: "Deserto",

            world: 2,

            theme: "desert",

            width: 240,

            time: 300,

            ground: [
                [0, 13, 240, 2]
            ],

            platforms: [
                [15, 10, 5, 1],
                [30, 8, 5, 1],
                [50, 10, 6, 1],
                [70, 7, 5, 1],
                [95, 9, 5, 1],
                [120, 6, 6, 1],
                [145, 9, 5, 1],
                [170, 7, 5, 1],
                [195, 10, 6, 1]
            ],

            coins: [
                [16, 9],
                [17, 9],
                [31, 7],
                [32, 7],
                [51, 9],
                [52, 9],
                [71, 6],
                [72, 6],
                [121, 5],
                [122, 5]
            ],

            enemies: [
                { type: "goomba", x: 25, y: 12 },
                { type: "goomba", x: 45, y: 12 },
                { type: "koopa", x: 80, y: 12 },
                { type: "goomba", x: 110, y: 12 },
                { type: "koopa", x: 160, y: 12 },
                { type: "goomba", x: 185, y: 12 }
            ],

            blocks: [
                [35, 7, "question"],
                [75, 6, "brick"],
                [125, 5, "question"],
                [175, 6, "brick"]
            ],

            flag: {
                x: 220,
                y: 5
            }

        });

    },


    createLevel6() {

        this.createLevel(6, {

            name: "Oceano",

            world: 2,

            theme: "water",

            width: 250,

            time: 300,

            ground: [
                [0, 13, 250, 2]
            ],

            platforms: [
                [10, 10, 5, 1],
                [25, 7, 5, 1],
                [42, 10, 5, 1],
                [60, 6, 6, 1],
                [80, 9, 5, 1],
                [100, 7, 5, 1],
                [125, 10, 5, 1],
                [145, 6, 6, 1],
                [170, 9, 5, 1],
                [195, 7, 6, 1]
            ],

            coins: [
                [11, 9],
                [12, 9],
                [26, 6],
                [27, 6],
                [61, 5],
                [62, 5],
                [81, 8],
                [82, 8],
                [146, 5],
                [147, 5]
            ],

            enemies: [
                { type: "goomba", x: 20, y: 12 },
                { type: "koopa", x: 50, y: 12 },
                { type: "goomba", x: 90, y: 12 },
                { type: "koopa", x: 135, y: 12 },
                { type: "goomba", x: 180, y: 12 },
                { type: "koopa", x: 210, y: 12 }
            ],

            powerups: [
                { type: "mushroom", x: 60, y: 5 },
                { type: "flower", x: 145, y: 5 }
            ],

            flag: {
                x: 230,
                y: 5
            }

        });

    },


    createLevel7() {

        this.createLevel(7, {

            name: "Floresta",

            world: 2,

            theme: "forest",

            width: 260,

            time: 300,

            ground: [
                [0, 13, 260, 2]
            ],

            platforms: [
                [12, 9, 6, 1],
                [30, 6, 5, 1],
                [50, 9, 5, 1],
                [70, 7, 6, 1],
                [95, 5, 5, 1],
                [120, 9, 6, 1],
                [145, 6, 5, 1],
                [170, 8, 6, 1],
                [200, 5, 5, 1],
                [225, 8, 5, 1]
            ],

            coins: [
                [13, 8],
                [14, 8],
                [31, 5],
                [32, 5],
                [71, 6],
                [72, 6],
                [96, 4],
                [97, 4],
                [146, 5],
                [147, 5],
                [201, 4],
                [202, 4]
            ],

            enemies: [
                { type: "goomba", x: 22, y: 12 },
                { type: "goomba", x: 40, y: 12 },
                { type: "koopa", x: 60, y: 12 },
                { type: "goomba", x: 85, y: 12 },
                { type: "koopa", x: 115, y: 12 },
                { type: "goomba", x: 155, y: 12 },
                { type: "koopa", x: 190, y: 12 },
                { type: "goomba", x: 215, y: 12 }
            ],

            blocks: [
                [34, 5, "question"],
                [75, 6, "brick"],
                [100, 4, "question"],
                [150, 5, "question"],
                [205, 4, "brick"]
            ],

            checkpoints: [
                { x: 130, y: 12 }
            ],

            flag: {
                x: 240,
                y: 5
            }

        });

    },


    createLevel8() {

        this.createLevel(8, {

            name: "Fortaleza",

            world: 2,

            theme: "fortress",

            width: 270,

            time: 300,

            ground: [
                [0, 13, 270, 2]
            ],

            platforms: [
                [15, 9, 5, 1],
                [35, 6, 5, 1],
                [55, 9, 5, 1],
                [75, 6, 5, 1],
                [100, 9, 5, 1],
                [125, 6, 5, 1],
                [150, 9, 5, 1],
                [175, 6, 5, 1],
                [200, 9, 5, 1],
                [225, 6, 5, 1]
            ],

            coins: [
                [16, 8],
                [36, 5],
                [56, 8],
                [76, 5],
                [101, 8],
                [126, 5],
                [151, 8],
                [176, 5],
                [201, 8],
                [226, 5]
            ],

            enemies: [
                { type: "koopa", x: 25, y: 12 },
                { type: "goomba", x: 45, y: 12 },
                { type: "koopa", x: 65, y: 12 },
                { type: "goomba", x: 90, y: 12 },
                { type: "koopa", x: 115, y: 12 },
                { type: "goomba", x: 140, y: 12 },
                { type: "koopa", x: 165, y: 12 },
                { type: "goomba", x: 190, y: 12 },
                { type: "koopa", x: 215, y: 12 }
            ],

            powerups: [
                { type: "star", x: 125, y: 5 }
            ],

            flag: {
                x: 250,
                y: 5
            }

        });

    },


    /* =====================================================
       FASES 9-12
    ===================================================== */

    createLevel9() {

        this.createLevel(9, {

            name: "Montanha",

            world: 3,

            theme: "mountain",

            width: 280,

            time: 320,

            ground: [
                [0, 13, 280, 2]
            ],

            platforms: [
                [10, 10, 5, 1],
                [25, 7, 5, 1],
                [42, 4, 5, 1],
                [60, 8, 5, 1],
                [80, 5, 5, 1],
                [100, 9, 6, 1],
                [125, 6, 5, 1],
                [150, 4, 5, 1],
                [175, 8, 6, 1],
                [200, 5, 5, 1],
                [225, 8, 5, 1]
            ],

            coins: [
                [11, 9],
                [26, 6],
                [43, 3],
                [61, 7],
                [81, 4],
                [101, 8],
                [126, 5],
                [151, 3],
                [176, 7],
                [201, 4]
            ],

            enemies: [
                { type: "goomba", x: 20, y: 12 },
                { type: "koopa", x: 38, y: 12 },
                { type: "goomba", x: 55, y: 12 },
                { type: "koopa", x: 95, y: 12 },
                { type: "goomba", x: 115, y: 12 },
                { type: "koopa", x: 140, y: 12 },
                { type: "goomba", x: 165, y: 12 },
                { type: "koopa", x: 210, y: 12 }
            ],

            checkpoints: [
                { x: 140, y: 12 }
            ],

            flag: {
                x: 255,
                y: 5
            }

        });

    },


    createLevel10() {

        this.createLevel(10, {

            name: "Vulcão",

            world: 3,

            theme: "volcano",

            width: 290,

            time: 300,

            ground: [
                [0, 13, 290, 2]
            ],

            platforms: [
                [15, 10, 5, 1],
                [35, 7, 5, 1],
                [55, 10, 5, 1],
                [75, 6, 5, 1],
                [100, 9, 5, 1],
                [125, 5, 5, 1],
                [150, 8, 5, 1],
                [175, 5, 5, 1],
                [200, 9, 5, 1],
                [225, 6, 5, 1],
                [250, 9, 5, 1]
            ],

            blocks: [
                [38, 6, "question"],
                [78, 5, "brick"],
                [128, 4, "question"],
                [178, 4, "brick"],
                [228, 5, "question"]
            ],

            coins: [
                [16, 9],
                [36, 6],
                [56, 9],
                [76, 5],
                [101, 8],
                [126, 4],
                [151, 7],
                [176, 4],
                [201, 8],
                [226, 5]
            ],

            enemies: [
                { type: "goomba", x: 25, y: 12 },
                { type: "koopa", x: 45, y: 12 },
                { type: "goomba", x: 65, y: 12 },
                { type: "koopa", x: 90, y: 12 },
                { type: "goomba", x: 115, y: 12 },
                { type: "koopa", x: 140, y: 12 },
                { type: "goomba", x: 165, y: 12 },
                { type: "koopa", x: 190, y: 12 },
                { type: "goomba", x: 215, y: 12 },
                { type: "koopa", x: 240, y: 12 }
            ],

            powerups: [
                { type: "flower", x: 128, y: 3 },
                { type: "star", x: 178, y: 3 }
            ],

            flag: {
                x: 270,
                y: 5
            }

        });

    },


    createLevel11() {

        this.createLevel(11, {

            name: "Mundo Sombrio",

            world: 3,

            theme: "dark",

            width: 300,

            time: 300,

            ground: [
                [0, 13, 300, 2]
            ],

            platforms: [
                [10, 8, 5, 1],
                [30, 5, 5, 1],
                [50, 9, 5, 1],
                [70, 6, 5, 1],
                [95, 4, 5, 1],
                [120, 8, 5, 1],
                [145, 5, 5, 1],
                [170, 9, 5, 1],
                [195, 6, 5, 1],
                [220, 4, 5, 1],
                [245, 8, 5, 1],
                [270, 5, 5, 1]
            ],

            coins: [
                [11, 7],
                [31, 4],
                [51, 8],
                [71, 5],
                [96, 3],
                [121, 7],
                [146, 4],
                [171, 8],
                [196, 5],
                [221, 3],
                [246, 7],
                [271, 4]
            ],

            blocks: [
                [32, 4, "question"],
                [72, 5, "brick"],
                [97, 3, "question"],
                [147, 4, "brick"],
                [197, 5, "question"],
                [222, 3, "brick"]
            ],

            enemies: [
                { type: "goomba", x: 20, y: 12 },
                { type: "koopa", x: 40, y: 12 },
                { type: "goomba", x: 60, y: 12 },
                { type: "koopa", x: 85, y: 12 },
                { type: "goomba", x: 110, y: 12 },
                { type: "koopa", x: 135, y: 12 },
                { type: "goomba", x: 160, y: 12 },
                { type: "koopa", x: 185, y: 12 },
                { type: "goomba", x: 210, y: 12 },
                { type: "koopa", x: 235, y: 12 },
                { type: "goomba", x: 260, y: 12 }
            ],

            checkpoints: [
                { x: 150, y: 12 }
            ],

            powerups: [
                { type: "star", x: 97, y: 2 }
            ],

            flag: {
                x: 285,
                y: 5
            }

        });

    },


    createLevel12() {

        this.createLevel(12, {

            name: "Castelo Final",

            world: 3,

            theme: "final",

            width: 320,

            time: 400,

            ground: [
                [0, 13, 320, 2]
            ],

            platforms: [
                [15, 10, 5, 1],
                [35, 7, 5, 1],
                [55, 4, 5, 1],
                [75, 9, 5, 1],
                [95, 6, 5, 1],
                [115, 3, 5, 1],
                [140, 8, 5, 1],
                [160, 5, 5, 1],
                [180, 9, 5, 1],
                [200, 6, 5, 1],
                [220, 3, 5, 1],
                [245, 8, 5, 1],
                [270, 5, 5, 1],
                [295, 8, 5, 1]
            ],

            blocks: [
                [37, 6, "question"],
                [57, 3, "brick"],
                [97, 5, "question"],
                [117, 2, "brick"],
                [162, 4, "question"],
                [202, 5, "brick"],
                [222, 2, "question"],
                [272, 4, "brick"]
            ],

            coins: [
                [16, 9],
                [36, 6],
                [56, 3],
                [76, 8],
                [96, 5],
                [116, 2],
                [141, 7],
                [161, 4],
                [181, 8],
                [201, 5],
                [221, 2],
                [246, 7],
                [271, 4],
                [296, 7]
            ],

            enemies: [
                { type: "goomba", x: 25, y: 12 },
                { type: "koopa", x: 45, y: 12 },
                { type: "goomba", x: 65, y: 12 },
                { type: "koopa", x: 85, y: 12 },
                { type: "goomba", x: 105, y: 12 },
                { type: "koopa", x: 130, y: 12 },
                { type: "goomba", x: 150, y: 12 },
                { type: "koopa", x: 170, y: 12 },
                { type: "goomba", x: 190, y: 12 },
                { type: "koopa", x: 210, y: 12 },
                { type: "goomba", x: 235, y: 12 },
                { type: "koopa", x: 260, y: 12 },
                { type: "goomba", x: 285, y: 12 }
            ],

            powerups: [

                {
                    type: "mushroom",
                    x: 57,
                    y: 2
                },

                {
                    type: "flower",
                    x: 117,
                    y: 1
                },

                {
                    type: "star",
                    x: 222,
                    y: 1
                }

            ],

            checkpoints: [

                {
                    x: 150,
                    y: 12
                },

                {
                    x: 240,
                    y: 12
                }

            ],

            flag: {
                x: 305,
                y: 5
            }

        });

    },


    /* =====================================================
       PEGAR FASE
    ===================================================== */

    getLevel(number) {

        return this.levels[number] ||
               this.levels[1];

    },


    /* =====================================================
       CARREGAR FASE
    ===================================================== */

    load(number) {

        const level =
            this.getLevel(number);


        this.currentLevel =
            level.id;


        localStorage.setItem(
            "aventuraCurrentLevel",
            level.id
        );


        return level;

    },


    /* =====================================================
       DESBLOQUEAR PRÓXIMA FASE
    ===================================================== */

    unlockNextLevel() {

        const current =
            this.currentLevel;


        const unlocked =
            Number(
                localStorage.getItem(
                    "aventuraUnlockedLevel"
                ) || 1
            );


        const next =
            Math.min(
                current + 1,
                this.totalLevels
            );


        if (next > unlocked) {

            localStorage.setItem(
                "aventuraUnlockedLevel",
                next
            );

        }

    },


    /* =====================================================
       FINALIZAR FASE
    ===================================================== */

    completeLevel() {

        this.unlockNextLevel();


        localStorage.setItem(
            "aventuraCurrentLevel",
            this.currentLevel
        );


        console.log(
            `Fase ${this.currentLevel} concluída!`
        );

    },


    /* =====================================================
       REINICIAR
    ===================================================== */

    restart() {

        return this.load(
            this.currentLevel
        );

    },


    /* =====================================================
       PRÓXIMA
    ===================================================== */

    next() {

        const next =
            Math.min(
                this.currentLevel + 1,
                this.totalLevels
            );


        return this.load(next);

    },


    /* =====================================================
       FASE ANTERIOR
    ===================================================== */

    previous() {

        const previous =
            Math.max(
                1,
                this.currentLevel - 1
            );


        return this.load(previous);

    }

};


/* =========================================================
   INICIALIZAR
========================================================= */

LEVELS.init();


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

function getLevel(number) {

    return LEVELS.getLevel(number);

}


function loadLevel(number) {

    return LEVELS.load(number);

}


function completeLevel() {

    LEVELS.completeLevel();

}


function unlockNextLevel() {

    LEVELS.unlockNextLevel();

}


/* =========================================================
   DISPONIBILIZAR PARA O GAME.JS
========================================================= */

window.LEVELS = LEVELS;
window.getLevel = getLevel;
window.loadLevel = loadLevel;
window.completeLevel = completeLevel;
