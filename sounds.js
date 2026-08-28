"use strict";

/* =========================================================
   SOUNDS.JS
   Sistema de sons do jogo
========================================================= */

const SOUNDS = {

    audio: null,

    masterVolume: 0.7,

    musicVolume: 0.35,

    sfxVolume: 0.7,

    musicEnabled: true,

    soundEnabled: true,

    musicTimer: null,

    musicPlaying: false,


    /* =====================================================
       INICIAR ÁUDIO
    ===================================================== */

    init() {

        if (!this.audio) {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContext) {

                console.warn(
                    "Web Audio API não suportada."
                );

                return;

            }

            this.audio =
                new AudioContext();

        }


        if (
            this.audio.state ===
            "suspended"
        ) {

            this.audio.resume();

        }

    },


    /* =====================================================
       DESBLOQUEAR ÁUDIO
    ===================================================== */

    unlock() {

        this.init();

    },


    /* =====================================================
       CRIAR OSCILADOR
    ===================================================== */

    tone(
        frequency,
        duration,
        type = "square",
        volume = 0.2,
        delay = 0
    ) {

        if (
            !this.soundEnabled
        ) return;


        this.init();


        if (!this.audio) return;


        const now =
            this.audio.currentTime +
            delay;


        const oscillator =
            this.audio.createOscillator();


        const gain =
            this.audio.createGain();


        oscillator.type =
            type;


        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );


        gain.gain.setValueAtTime(
            0,
            now
        );


        gain.gain.linearRampToValueAtTime(
            volume *
            this.sfxVolume *
            this.masterVolume,
            now + 0.01
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + duration
        );


        oscillator.connect(
            gain
        );


        gain.connect(
            this.audio.destination
        );


        oscillator.start(
            now
        );


        oscillator.stop(
            now + duration + 0.02
        );

    },


    /* =====================================================
       MOEDA
    ===================================================== */

    coin() {

        this.tone(
            988,
            0.08,
            "square",
            0.25
        );


        this.tone(
            1319,
            0.12,
            "square",
            0.2,
            0.07
        );

    },


    /* =====================================================
       PULO
    ===================================================== */

    jump() {

        this.tone(
            420,
            0.08,
            "square",
            0.15
        );


        this.tone(
            620,
            0.12,
            "square",
            0.12,
            0.06
        );

    },


    /* =====================================================
       PULO GRANDE
    ===================================================== */

    superJump() {

        this.tone(
            350,
            0.08,
            "square",
            0.18
        );


        this.tone(
            500,
            0.08,
            "square",
            0.16,
            0.07
        );


        this.tone(
            750,
            0.12,
            "square",
            0.14,
            0.14
        );

    },


    /* =====================================================
       INIMIGO DERROTADO
    ===================================================== */

    enemyHit() {

        this.tone(
            180,
            0.08,
            "square",
            0.2
        );


        this.tone(
            100,
            0.1,
            "square",
            0.15,
            0.07
        );

    },


    /* =====================================================
       PISAR NO INIMIGO
    ===================================================== */

    stomp() {

        this.tone(
            180,
            0.06,
            "square",
            0.2
        );


        this.tone(
            300,
            0.08,
            "square",
            0.15,
            0.05
        );

    },


    /* =====================================================
       BLOCO
    ===================================================== */

    block() {

        this.tone(
            180,
            0.05,
            "square",
            0.18
        );


        this.tone(
            130,
            0.07,
            "square",
            0.12,
            0.04
        );

    },


    /* =====================================================
       BLOCO DESTRUIDO
    ===================================================== */

    blockBreak() {

        this.tone(
            250,
            0.05,
            "square",
            0.2
        );


        this.tone(
            400,
            0.06,
            "square",
            0.16,
            0.04
        );


        this.tone(
            180,
            0.08,
            "square",
            0.12,
            0.08
        );

    },


    /* =====================================================
       POWER-UP
    ===================================================== */

    powerUp() {

        this.tone(
            330,
            0.08,
            "square",
            0.18
        );


        this.tone(
            440,
            0.08,
            "square",
            0.18,
            0.08
        );


        this.tone(
            660,
            0.08,
            "square",
            0.18,
            0.16
        );


        this.tone(
            880,
            0.16,
            "square",
            0.18,
            0.24
        );

    },


    /* =====================================================
       COGUMELO
    ===================================================== */

    mushroom() {

        this.tone(
            392,
            0.08,
            "square",
            0.18
        );


        this.tone(
            523,
            0.08,
            "square",
            0.18,
            0.08
        );


        this.tone(
            659,
            0.12,
            "square",
            0.18,
            0.16
        );

    },


    /* =====================================================
       FLOR DE FOGO
    ===================================================== */

    fireFlower() {

        this.tone(
            523,
            0.08,
            "square",
            0.18
        );


        this.tone(
            659,
            0.08,
            "square",
            0.18,
            0.08
        );


        this.tone(
            784,
            0.08,
            "square",
            0.18,
            0.16
        );


        this.tone(
            1047,
            0.15,
            "square",
            0.18,
            0.24
        );

    },


    /* =====================================================
       ESTRELA
    ===================================================== */

    star() {

        const notes = [

            659,
            784,
            988,
            1319,
            1568

        ];


        notes.forEach(
            (note, index) => {

                this.tone(
                    note,
                    0.08,
                    "square",
                    0.18,
                    index * 0.07
                );

            }
        );

    },


    /* =====================================================
       VIDA EXTRA
    ===================================================== */

    extraLife() {

        this.tone(
            523,
            0.08,
            "square",
            0.2
        );


        this.tone(
            659,
            0.08,
            "square",
            0.2,
            0.08
        );


        this.tone(
            784,
            0.08,
            "square",
            0.2,
            0.16
        );


        this.tone(
            1047,
            0.18,
            "square",
            0.2,
            0.24
        );

    },


    /* =====================================================
       DANO
    ===================================================== */

    damage() {

        this.tone(
            120,
            0.15,
            "sawtooth",
            0.25
        );


        this.tone(
            80,
            0.18,
            "sawtooth",
            0.18,
            0.1
        );

    },


    /* =====================================================
       MORTE
    ===================================================== */

    death() {

        this.tone(
            392,
            0.1,
            "square",
            0.2
        );


        this.tone(
            330,
            0.1,
            "square",
            0.18,
            0.1
        );


        this.tone(
            262,
            0.1,
            "square",
            0.18,
            0.2
        );


        this.tone(
            196,
            0.2,
            "square",
            0.18,
            0.3
        );

    },


    /* =====================================================
       CHECKPOINT
    ===================================================== */

    checkpoint() {

        this.tone(
            523,
            0.08,
            "square",
            0.18
        );


        this.tone(
            659,
            0.08,
            "square",
            0.18,
            0.08
        );


        this.tone(
            784,
            0.16,
            "square",
            0.18,
            0.16
        );

    },


    /* =====================================================
       BANDEIRA / FIM DA FASE
    ===================================================== */

    levelComplete() {

        const melody = [

            523,
            659,
            784,
            1047,
            784,
            1047

        ];


        melody.forEach(
            (note, index) => {

                this.tone(
                    note,
                    0.16,
                    "square",
                    0.2,
                    index * 0.13
                );

            }
        );

    },


    /* =====================================================
       VITÓRIA FINAL
    ===================================================== */

    victory() {

        const melody = [

            523,
            523,
            659,
            784,
            659,
            784,
            1047,
            1319

        ];


        melody.forEach(
            (note, index) => {

                this.tone(
                    note,
                    0.18,
                    "square",
                    0.2,
                    index * 0.16
                );

            }
        );

    },


    /* =====================================================
       MENU
    ===================================================== */

    menuMove() {

        this.tone(
            500,
            0.05,
            "square",
            0.12
        );

    },


    /* =====================================================
       SELECIONAR MENU
    ===================================================== */

    menuSelect() {

        this.tone(
            700,
            0.06,
            "square",
            0.15
        );


        this.tone(
            900,
            0.1,
            "square",
            0.15,
            0.06
        );

    },


    /* =====================================================
       PAUSE
    ===================================================== */

    pause() {

        this.tone(
            400,
            0.08,
            "square",
            0.15
        );


        this.tone(
            300,
            0.12,
            "square",
            0.12,
            0.08
        );

    },


    /* =====================================================
       CANO
    ===================================================== */

    pipe() {

        this.tone(
            180,
            0.1,
            "square",
            0.18
        );


        this.tone(
            280,
            0.1,
            "square",
            0.16,
            0.1
        );


        this.tone(
            400,
            0.15,
            "square",
            0.14,
            0.2
        );

    },


    /* =====================================================
       SALTO NO CANO
    ===================================================== */

    pipeEnter() {

        this.tone(
            250,
            0.1,
            "square",
            0.16
        );


        this.tone(
            180,
            0.12,
            "square",
            0.14,
            0.1
        );

    },


    /* =====================================================
       BOLA DE FOGO
    ===================================================== */

    fireball() {

        this.tone(
            800,
            0.05,
            "square",
            0.14
        );


        this.tone(
            500,
            0.08,
            "square",
            0.12,
            0.04
        );

    },


    /* =====================================================
       EXPLOSÃO
    ===================================================== */

    explosion() {

        this.tone(
            100,
            0.2,
            "sawtooth",
            0.3
        );


        this.tone(
            70,
            0.25,
            "sawtooth",
            0.25,
            0.08
        );

    },


    /* =====================================================
       GAME OVER
    ===================================================== */

    gameOver() {

        const notes = [

            392,
            330,
            262,
            196

        ];


        notes.forEach(
            (note, index) => {

                this.tone(
                    note,
                    0.25,
                    "square",
                    0.18,
                    index * 0.22
                );

            }
        );

    },


    /* =====================================================
       LIGAR / DESLIGAR SONS
    ===================================================== */

    toggleSound() {

        this.soundEnabled =
            !this.soundEnabled;


        if (
            typeof SAVE !==
            "undefined"
        ) {

            SAVE.saveSettings({

                sound:
                    this.soundEnabled

            });

        }


        return this.soundEnabled;

    },


    /* =====================================================
       LIGAR / DESLIGAR MÚSICA
    ===================================================== */

    toggleMusic() {

        this.musicEnabled =
            !this.musicEnabled;


        if (
            !this.musicEnabled
        ) {

            this.stopMusic();

        }


        if (
            typeof SAVE !==
            "undefined"
        ) {

            SAVE.saveSettings({

                music:
                    this.musicEnabled

            });

        }


        return this.musicEnabled;

    },


    /* =====================================================
       VOLUME DOS EFEITOS
    ===================================================== */

    setSfxVolume(value) {

        this.sfxVolume =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(value)
                )
            );


        if (
            typeof SAVE !==
            "undefined"
        ) {

            SAVE.saveSettings({

                soundVolume:
                    this.sfxVolume

            });

        }

    },


    /* =====================================================
       VOLUME DA MÚSICA
    ===================================================== */

    setMusicVolume(value) {

        this.musicVolume =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(value)
                )
            );


        if (
            typeof SAVE !==
            "undefined"
        ) {

            SAVE.saveSettings({

                musicVolume:
                    this.musicVolume

            });

        }

    },


    /* =====================================================
       MÚSICA SIMPLES DE FUNDO
    ===================================================== */

    startMusic() {

        if (
            !this.musicEnabled
        ) return;


        if (this.musicPlaying)
            return;


        this.init();


        if (!this.audio)
            return;


        this.musicPlaying =
            true;


        const melody = [

            262,
            330,
            392,
            330,
            262,
            330,
            392,
            523,

            392,
            330,
            262,
            330,
            392,
            330,
            262,
            196

        ];


        let index = 0;


        const playNote = () => {

            if (
                !this.musicPlaying ||
                !this.musicEnabled
            ) {

                return;

            }


            const note =
                melody[index];


            this.musicTone(
                note,
                0.18
            );


            index =
                (index + 1) %
                melody.length;


            this.musicTimer =
                setTimeout(
                    playNote,
                    220
                );

        };


        playNote();

    },


    /* =====================================================
       NOTA DA MÚSICA
    ===================================================== */

    musicTone(
        frequency,
        duration
    ) {

        if (
            !this.audio ||
            !this.musicEnabled
        ) return;


        const now =
            this.audio.currentTime;


        const oscillator =
            this.audio.createOscillator();


        const gain =
            this.audio.createGain();


        oscillator.type =
            "triangle";


        oscillator.frequency.setValueAtTime(
            frequency,
            now
        );


        gain.gain.setValueAtTime(
            0,
            now
        );


        gain.gain.linearRampToValueAtTime(
            this.musicVolume *
            this.masterVolume,
            now + 0.02
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + duration
        );


        oscillator.connect(
            gain
        );


        gain.connect(
            this.audio.destination
        );


        oscillator.start(
            now
        );


        oscillator.stop(
            now + duration
        );

    },


    /* =====================================================
       PARAR MÚSICA
    ===================================================== */

    stopMusic() {

        this.musicPlaying =
            false;


        if (
            this.musicTimer
        ) {

            clearTimeout(
                this.musicTimer
            );


            this.musicTimer =
                null;

        }

    }

};


/* =========================================================
   DISPONIBILIZAR GLOBALMENTE
========================================================= */

window.SOUNDS =
    SOUNDS;


/* =========================================================
   ATIVAR ÁUDIO NO PRIMEIRO CLIQUE
========================================================= */

document.addEventListener(
    "click",
    () => {

        SOUNDS.unlock();

    },
    {
        once: true
    }
);


/* =========================================================
   FUNÇÕES FÁCEIS PARA O GAME.JS
========================================================= */

function playCoinSound() {

    SOUNDS.coin();

}


function playJumpSound() {

    SOUNDS.jump();

}


function playEnemySound() {

    SOUNDS.stomp();

}


function playPowerUpSound() {

    SOUNDS.powerUp();

}


function playDamageSound() {

    SOUNDS.damage();

}


function playDeathSound() {

    SOUNDS.death();

}


function playVictorySound() {

    SOUNDS.victory();

}


function playGameOverSound() {

    SOUNDS.gameOver();

}


function playLevelCompleteSound() {

    SOUNDS.levelComplete();

}


function playBlockSound() {

    SOUNDS.block();

}


function playFireballSound() {

    SOUNDS.fireball();

}


/* =========================================================
   INICIAR CONFIGURAÇÕES
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            typeof SAVE !==
            "undefined"
        ) {

            const settings =
                SAVE.getSettings();


            SOUNDS.musicEnabled =
                settings.music;


            SOUNDS.soundEnabled =
                settings.sound;


            SOUNDS.musicVolume =
                settings.musicVolume;


            SOUNDS.sfxVolume =
                settings.soundVolume;

        }

    }
);
