// ============================================================
// PARODIUS — Main Config & Launch
// ============================================================

const gameConfig = {
    type: Phaser.AUTO,
    width: CFG.W,
    height: CFG.H,
    parent: 'game-container',
    backgroundColor: '#0a0a18',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        }
    },
    scene: [BootScene, TitleScene, SelectScene, GameScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
        pixelArt: false,
        antialias: true,
    },
    pipeline: { BloomPostFX },
};

const game = new Phaser.Game(gameConfig);
