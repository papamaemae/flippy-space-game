export default class TitleScene extends Phaser.Scene {
    constructor() {
        super ({ key: 'TitleScene' });
        this.cursors = null;
    }

    create () {
        this.cursors = this.input.keyboard.createCursorKeys()

        this.add.text(this.game.config.width/2, 300, 'Press Enter to Start', {
            font: '48px pixelFont',
            fill: '#32CD32'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('MainScene');
        })
    }
}