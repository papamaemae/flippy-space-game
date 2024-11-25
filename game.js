import LoadingScene from "./src/LoadingScene.js"
import TitleScene from "./src/TitleScene.js"
import MainScene from "./src/MainScene.js";
import GameOverScene from "./src/GameOverScene.js";

//game config
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    scene: [LoadingScene, TitleScene, MainScene, GameOverScene],
    physics: {
        default: 'arcade', //enable arcade physics system
    }
};

//create the game instance
const game = new Phaser.Game(config);
