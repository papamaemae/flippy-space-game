export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super ({ key: 'LoadingScene'});

    }
    
    preload() {
        // Load flippy and celery assets
        this.load.image('flippy', 'assets/images/flippy.png');
        this.load.image('celery', 'assets/images/celery.png');
        this.load.image('background', 'assets/images/background.png');
        this.load.font('pixelFont', 'assets/fonts/Minecraft.ttf');
        this.load.audio('intro', 'assets/music/BossIntro.mp3');
        this.load.audio('main', 'assets/music/BossMain.mp3');
        this.load.audio('loser', 'assets/music/WarpJingle.mp3');

        let loadingText = this.add.text(500, 300, 'Loading...', {
            font: '48px pixelFont',
            fill: '#32CD32'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => loadingText.setText(`Loading: ${Math.round(value * 100)}%`))
    }

    create() {
        this.scene.start('TitleScene');
    }
}