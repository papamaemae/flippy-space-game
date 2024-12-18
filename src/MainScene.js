export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.cursors = null;
        this.wasdKeys = null;
        this.flippy = null;
        this.celeryProjectiles = null;
        this.lastProjectileTime = 0;
        this.timeCount = 0;
        this.scoreText = null;
        this.celeryCount = 0;
        this.scoreArray = [];
    }

    create () {
        // Set background image and music
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(1).setAlpha(0.7);
        this.introMusic = this.sound.add('intro');
        this.introMusic.play();
        // Loop second track after intro track
        this.introMusic.on('complete', () => {
            this.mainMusic = this.sound.add('main', { loop: true });
            this.mainMusic.play();
        });
        this.loserSound = this.sound.add('loser');
        

        // Create the flippy with physics
        this.flippy = this.physics.add.image(400, 300, 'flippy');
        this.flippy.setBounce(0.8);
        this.flippy.setCollideWorldBounds(true);
        this.flippy.setMaxVelocity(400, 400);
        this.flippy.setMass(1);
        this.flippy.setDrag(1000);

        // Set up arrow key input for movement
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasdKeys = {
            up: this.input.keyboard.addKey('W'),
            down: this.input.keyboard.addKey('S'),
            left: this.input.keyboard.addKey('A'),
            right: this.input.keyboard.addKey('D')
        };

        // Create physics group to hold celery projectiles (max 10 celery sprites on screen at once)
        this.celeryProjectiles = this.physics.add.group({
            defaultKey: 'celery',
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 10
        });

        // Create timer event to spawn celery at random intervals
        this.time.addEvent({
            delay: Phaser.Math.Between(200, 1000), // Interval in ms for checking if we spawn a projectile
            callback: this.spawnCelery, // Bind the spawnCelery function to the current scene's context
            callbackScope: this,
            loop: true, // Repeatedly call the spawnCelery() callback
        });

        // Create gameplay timer
        this.time.addEvent({
            delay: 100, // ms
            callback: this.countTime,
            callbackScope: this,
            loop: true,
        });

        // Use the font in your text object
        this.scoreText = this.add.text(50, 50, `Score: ${this.timeCount}`, { 
            fontFamily: 'pixelFont', fontSize: '32px', color: '#FFF' 
    })
    }

    update () {
        // Handle input (move flippy)
        if (this.cursors.left.isDown || this.wasdKeys.left.isDown) {
            this.flippy.setVelocityX(this.flippy.body.velocity.x - 200); // Move left
        } else if (this.cursors.right.isDown || this.wasdKeys.right.isDown) {
            this.flippy.setVelocityX(this.flippy.body.velocity.x + 200); // Move right
        }
        if (this.cursors.up.isDown || this.wasdKeys.up.isDown) {
            this.flippy.setVelocityY(this.flippy.body.velocity.y - 200); // Move up
        } else if (this.cursors.down.isDown || this.wasdKeys.down.isDown) {
            this.flippy.setVelocityY(this.flippy.body.velocity.y + 200); // Move down
        }

        // Iterate over all children of the celery projectiles group
        this.celeryProjectiles.children.entries.forEach(celery => {
        
            // If celery is active, check if it has collided with another celery (it rebounds), 
            // world bounds (it disappears) or flippy (game over)
            if (celery.active) {
                celery.rotation += 0.1;

                this.physics.world.collide(this.celeryProjectiles, this.celeryProjectiles, this.onCeleryCollide, null, this);
            
                if (celery.x < 0 || celery.x > this.sys.game.config.width || celery.y < 0 || celery.y > this.sys.game.config.height) {
                    celery.setActive(false).setVisible(false);
                }
                
                // Check collision with flippy
                const flippyDistance = Phaser.Math.Distance.Between(celery.x, celery.y, this.flippy.x, this.flippy.y);
                if (flippyDistance < 60) {
                    this.endGame(); // Trigger end game
                }
            }
        });

    }

    spawnCelery() {
        const edge = Phaser.Math.Between(0, 3);
        let startX, startY;
        switch (edge) {
            case 0: // Top edge
                startX = Phaser.Math.Between(0, this.sys.game.config.width);
                startY = 0;
                break;
            case 1: // Right edge
                startX = this.sys.game.config.width;
                startY = Phaser.Math.Between(0, this.sys.game.config.height);
                break;
            case 2: // Bottom edge
                startX = Phaser.Math.Between(0, this.sys.game.config.width);
                startY = this.sys.game.config.height;
                break;
            case 3: // Left edge
                startX = 0;
                startY = Phaser.Math.Between(0, this.sys.game.config.height);
                break;
        }

        this.celeryCount += 1;

        // Create new celery projectile at chosen edge
        const celery = this.celeryProjectiles.get(startX, startY);
        if (!celery) {
            console.warn('Too much celery, can\'t spawn any more!');
            return;
        } else {
            celery.setActive(true).setVisible(true);
            // Calculate the angle to flippy
            const angle = Phaser.Math.Angle.Between(celery.x, celery.y, this.flippy.x, this.flippy.y);

            // Set the velocity to flippy
            const speed = 200;
            celery.setVelocityX(Math.cos(angle) * speed);
            celery.setVelocityY(Math.sin(angle) * speed);
            celery.setMaxVelocity(300);
        }
    }

    onCeleryCollide(celery1, celery2) {
        const distance = Phaser.Math.Distance.Between(celery1.x, celery1.y, celery2.x, celery2.y);

        if(distance < 100) {
            celery1.setVelocityX(celery1.body.velocity.x * -1.1); //reverse velocity on collide
            celery1.setVelocityY(celery1.body.velocity.y * -1.1);
            celery2.setVelocityX(celery2.body.velocity.x * -1.1);
            celery2.setVelocityY(celery2.body.velocity.y * -1.1);
        }
    }

    countTime() {
        this.timeCount += 100;
        this.scoreText.setText(`Score: ${this.timeCount}`);
    }

    resetScores() {
        this.timeCount = 0;
        this.scoreText.setText(`Score: ${this.timeCount}`);
        this.celeryCount = 0;
    }

    endGame() {
        this.scene.start('GameOverScene', { score: this.timeCount, celeryDodged: this.celeryCount, allScores: this.scoreArray });
        this.scoreArray.push(this.timeCount)
        this.resetScores()
        this.introMusic.isPlaying ? this.introMusic.stop() : this.mainMusic.stop();
        this.loserSound.play();
    }
}
