import MainScene from "./src/MainScene.js";
import GameOverScene from "./src/GameOverScene.js";

//game config
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    scene: [MainScene, GameOverScene],
    physics: {
        default: 'arcade', //enable arcade physics system
    }
};

//create the game instance
const game = new Phaser.Game(config);
