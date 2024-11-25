export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        const score = data.score;
        const celeryDodged = data.celeryDodged;
        const allScores = data.allScores;
        const highScore = Math.max(...allScores);
        // Display "Game Over" text at the center of the screen
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'OH NO', {
            font: '120px pixelFont',
            //fill: '#ff6e29',
            fill: '#32CD32',
        }).setOrigin(0.5);

        // Display score
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20,
            `You dodged ${celeryDodged} pieces of celery!`,
            {font: '30px pixelFont', fill: '#FFF'}).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 60, 
            `Your Score: ${score}`,
            {font: '50px pixelFont', fill: '#32CD32'}).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 120, 
            `High Score: ${highScore}`,
            {font: '50px pixelFont', fill: '#FFF'}).setOrigin(0.5);

        // Display instructions to press "Enter" to restart
        this.add.text(this.cameras.main.centerX, (this.sys.game.config.height - 60), 'Press Enter to Restart', {
            font: '24px pixelFont',
            fill: '#32CD32'
        }).setOrigin(0.5); // center the text

        // Set background image
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(1).setAlpha(0.3);

        // Set up input for restarting the game
        this.input.keyboard.on('keydown-ENTER', () => {
            // Restart the game by switching to the 'MainScene'
            this.scene.start('MainScene');
        });
    }
}
