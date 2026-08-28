"use strict";

/* =========================================================
   SAVE.JS
   Sistema de salvamento do jogo
========================================================= */

const SAVE = {

    /* =====================================================
       CONFIGURAÇÕES
    ===================================================== */

    key: "aventuraSave",

    version: 1,


    /* =====================================================
       DADOS PADRÃO
    ===================================================== */

    defaultData() {

        return {

            version: this.version,

            player: {

                name: "Jogador",

                lives: 3,

                coins: 0,

                stars: 0,

                score: 0,

                level: 1,

                checkpoint: 0,

                powerup: "small",

                fireFlower: false,

                starPower: false

            },


            progress: {

                currentLevel: 1,

                unlockedLevel: 1,

                completedLevels: [],

                worldsCompleted: []

            },


            inventory: {

                mushrooms: 0,

                flowers: 0,

                stars: 0,

                shields: 0

            },


            settings: {

                music: true,

                sound: true,

                musicVolume: 0.5,

                soundVolume: 0.7,

                mobileControls: true

            },


            statistics: {

                totalCoins: 0,

                totalEnemies: 0,

                totalDeaths: 0,

                totalLevels: 0,

                playTime: 0

            },

            date:

                new Date().toISOString()

        };

    },


    /* =====================================================
       PEGAR SAVE
    ===================================================== */

    get() {

        try {

            const saved =
                localStorage.getItem(
                    this.key
                );


            if (!saved) {

                return this.defaultData();

            }


            const data =
                JSON.parse(saved);


            return this.merge(
                this.defaultData(),
                data
            );

        } catch (error) {

            console.error(
                "Erro ao carregar save:",
                error
            );


            return this.defaultData();

        }

    },


    /* =====================================================
       MESCLAR DADOS
    ===================================================== */

    merge(defaultData, savedData) {

        const result = {
            ...defaultData
        };


        Object.keys(defaultData)
            .forEach(key => {

                if (
                    typeof defaultData[key]
                    === "object" &&

                    defaultData[key] !== null &&

                    !Array.isArray(
                        defaultData[key]
                    )
                ) {

                    result[key] = {

                        ...defaultData[key],

                        ...(savedData[key] || {})

                    };

                } else {

                    if (
                        savedData[key] !==
                        undefined
                    ) {

                        result[key] =
                            savedData[key];

                    }

                }

            });


        return result;

    },


    /* =====================================================
       SALVAR
    ===================================================== */

    save(data = null) {

        try {

            const saveData =
                data || this.collect();


            saveData.version =
                this.version;


            saveData.date =
                new Date().toISOString();


            localStorage.setItem(

                this.key,

                JSON.stringify(
                    saveData
                )

            );


            console.log(
                "Jogo salvo!"
            );


            return true;

        } catch (error) {

            console.error(
                "Erro ao salvar:",
                error
            );


            return false;

        }

    },


    /* =====================================================
       PEGAR DADOS DO JOGO
    ===================================================== */

    collect() {

        const data =
            this.get();


        /* -----------------------------------------------
           PLAYER
        ------------------------------------------------ */

        if (
            typeof player !==
            "undefined"
        ) {

            data.player.lives =
                Number(
                    player.lives ??
                    data.player.lives
                );


            data.player.coins =
                Number(
                    player.coins ??
                    data.player.coins
                );


            data.player.stars =
                Number(
                    player.stars ??
                    data.player.stars
                );


            data.player.score =
                Number(
                    player.score ??
                    data.player.score
                );


            data.player.checkpoint =
                Number(
                    player.checkpointX ??
                    data.player.checkpoint
                );


            if (
                player.powerup
                !== undefined
            ) {

                data.player.powerup =
                    player.powerup;

            }

        }


        /* -----------------------------------------------
           GAME
        ------------------------------------------------ */

        if (
            typeof GAME !==
            "undefined"
        ) {

            data.progress.currentLevel =
                Number(
                    GAME.currentLevel ??
                    data.progress.currentLevel
                );

        }


        /* -----------------------------------------------
           LEVELS
        ------------------------------------------------ */

        if (
            typeof LEVELS !==
            "undefined"
        ) {

            data.progress.currentLevel =
                Number(
                    LEVELS.currentLevel ??
                    data.progress.currentLevel
                );

        }


        return data;

    },


    /* =====================================================
       SALVAR PROGRESSO
    ===================================================== */

    saveProgress(level = null) {

        const data =
            this.get();


        if (level !== null) {

            level =
                Number(level);


            data.progress.currentLevel =
                level;


            data.player.level =
                level;

        }


        let unlocked =
            Number(
                data.progress.unlockedLevel
                || 1
            );


        if (
            level !== null &&
            level > unlocked
        ) {

            unlocked = level;

        }


        data.progress.unlockedLevel =
            unlocked;


        this.save(data);

    },


    /* =====================================================
       DESBLOQUEAR FASE
    ===================================================== */

    unlockLevel(level) {

        level =
            Number(level);


        const data =
            this.get();


        if (
            level >
            data.progress.unlockedLevel
        ) {

            data.progress.unlockedLevel =
                level;

        }


        this.save(data);

    },


    /* =====================================================
       CONCLUIR FASE
    ===================================================== */

    completeLevel(level) {

        level =
            Number(level);


        const data =
            this.get();


        if (
            !data.progress.completedLevels
                .includes(level)
        ) {

            data.progress.completedLevels
                .push(level);

        }


        data.statistics.totalLevels++;


        if (
            level >=
            data.progress.unlockedLevel
        ) {

            data.progress.unlockedLevel =
                Math.min(
                    level + 1,
                    12
                );

        }


        data.progress.currentLevel =
            Math.min(
                level + 1,
                12
            );


        this.save(data);

    },


    /* =====================================================
       SALVAR MOEDAS
    ===================================================== */

    addCoins(amount = 1) {

        amount =
            Number(amount);


        const data =
            this.get();


        data.player.coins +=
            amount;


        data.statistics.totalCoins +=
            amount;


        /* A cada 100 moedas ganha uma vida */

        if (
            data.player.coins >= 100
        ) {

            const extraLives =
                Math.floor(
                    data.player.coins / 100
                );


            data.player.lives +=
                extraLives;


            data.player.coins %=
                100;

        }


        this.save(data);


        return data.player.coins;

    },


    /* =====================================================
       ADICIONAR VIDA
    ===================================================== */

    addLife(amount = 1) {

        const data =
            this.get();


        data.player.lives +=
            Number(amount);


        this.save(data);


        return data.player.lives;

    },


    /* =====================================================
       PERDER VIDA
    ===================================================== */

    loseLife() {

        const data =
            this.get();


        data.player.lives =
            Math.max(
                0,
                data.player.lives - 1
            );


        data.statistics.totalDeaths++;


        this.save(data);


        return data.player.lives;

    },


    /* =====================================================
       ADICIONAR ESTRELA
    ===================================================== */

    addStar(amount = 1) {

        const data =
            this.get();


        data.player.stars +=
            Number(amount);


        data.inventory.stars +=
            Number(amount);


        this.save(data);


        return data.player.stars;

    },


    /* =====================================================
       ADICIONAR PONTUAÇÃO
    ===================================================== */

    addScore(amount) {

        const data =
            this.get();


        data.player.score +=
            Number(amount);


        this.save(data);


        return data.player.score;

    },


    /* =====================================================
       ADICIONAR ITEM
    ===================================================== */

    addItem(type, amount = 1) {

        const data =
            this.get();


        amount =
            Number(amount);


        if (
            data.inventory[type]
            !== undefined
        ) {

            data.inventory[type] +=
                amount;

        }


        this.save(data);

    },


    /* =====================================================
       USAR ITEM
    ===================================================== */

    useItem(type) {

        const data =
            this.get();


        if (
            !data.inventory[type] ||
            data.inventory[type] <= 0
        ) {

            return false;

        }


        data.inventory[type]--;


        this.save(data);


        return true;

    },


    /* =====================================================
       CHECKPOINT
    ===================================================== */

    saveCheckpoint(
        x = 0,
        y = 0
    ) {

        const data =
            this.get();


        data.player.checkpoint =
            x;


        data.player.checkpointY =
            y;


        this.save(data);

    },


    /* =====================================================
       CONFIGURAÇÕES
    ===================================================== */

    saveSettings(settings) {

        const data =
            this.get();


        data.settings = {

            ...data.settings,

            ...settings

        };


        this.save(data);

    },


    /* =====================================================
       PEGAR CONFIGURAÇÕES
    ===================================================== */

    getSettings() {

        return this.get().settings;

    },


    /* =====================================================
       SALVAR TEMPO
    ===================================================== */

    addPlayTime(seconds) {

        const data =
            this.get();


        data.statistics.playTime +=
            Number(seconds);


        this.save(data);

    },


    /* =====================================================
       PEGAR ESTATÍSTICAS
    ===================================================== */

    getStatistics() {

        return this.get().statistics;

    },


    /* =====================================================
       VERIFICAR SE EXISTE SAVE
    ===================================================== */

    exists() {

        return (
            localStorage.getItem(
                this.key
            ) !== null
        );

    },


    /* =====================================================
       RESETAR SAVE
    ===================================================== */

    reset() {

        localStorage.removeItem(
            this.key
        );


        localStorage.removeItem(
            "aventuraCurrentLevel"
        );


        localStorage.removeItem(
            "aventuraUnlockedLevel"
        );


        console.log(
            "Save apagado!"
        );

    },


    /* =====================================================
       EXPORTAR SAVE
    ===================================================== */

    export() {

        const data =
            this.get();


        return btoa(
            encodeURIComponent(
                JSON.stringify(data)
            )
        );

    },


    /* =====================================================
       IMPORTAR SAVE
    ===================================================== */

    import(code) {

        try {

            const json =
                decodeURIComponent(
                    atob(code)
                );


            const data =
                JSON.parse(json);


            this.save(data);


            return true;

        } catch (error) {

            console.error(
                "Save inválido:",
                error
            );


            return false;

        }

    },


    /* =====================================================
       DOWNLOAD DO SAVE
    ===================================================== */

    download() {

        const data =
            JSON.stringify(
                this.get(),
                null,
                4
            );


        const blob =
            new Blob(
                [data],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            "aventura-save.json";


        link.click();


        URL.revokeObjectURL(
            url
        );

    },


    /* =====================================================
       MOSTRAR SAVE NO CONSOLE
    ===================================================== */

    debug() {

        console.table(
            this.get().player
        );


        console.table(
            this.get().progress
        );


        console.table(
            this.get().statistics
        );

    }

};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

window.SAVE = SAVE;


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

function saveGame() {

    return SAVE.save();

}


function loadGame() {

    return SAVE.get();

}


function resetSave() {

    SAVE.reset();

}


function saveProgress(level) {

    SAVE.saveProgress(level);

}


function unlockLevel(level) {

    SAVE.unlockLevel(level);

}


function completeLevelSave(level) {

    SAVE.completeLevel(level);

}


/* =========================================================
   SALVAMENTO AUTOMÁTICO
========================================================= */

setInterval(() => {

    if (
        typeof GAME !==
        "undefined"
    ) {

        if (
            GAME.running &&
            !GAME.gameOver
        ) {

            SAVE.save();

        }

    }

}, 30000);


/* =========================================================
   SALVAR QUANDO FECHAR A PÁGINA
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        SAVE.save();

    }
);


/* =========================================================
   CARREGAR CONFIGURAÇÕES
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const settings =
            SAVE.getSettings();


        if (
            typeof GAME !==
            "undefined"
        ) {

            GAME.musicVolume =
                settings.musicVolume;


            GAME.sfxVolume =
                settings.soundVolume;


            GAME.mobileControls =
                settings.mobileControls;

        }

    }
);
