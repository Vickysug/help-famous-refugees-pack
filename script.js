class Example extends Phaser.Scene {
    constructor() {
        super();
        this.bottleSprite = null;
        this.bottleFrame = null;
        this.monkeySprites = [];
        this.firstSound = null;
        this.secondSound = null;
        this.hasStarted = false;
        this.startText = null;
        this.instructionText = null;
        this.thirstyMonkey = null;
        this.previousThirstyMonkey = null;
        this.percentageText = null;
        this.percentageBackground = null;
        this.thirstyText = null;
        this.thirstyTextBackground = null;
        this.percentage = 0;
        this.banditYokaiSprite = null;
        this.banditSpawnTimer = null;
        this.banditFrame = null;
        this.banditSpeed = 20; // Added banditSpeed variable
        this.levelScoreText = null;
        this.score = 0;
        this.scoreText = null;
        this.gameOver = false;
    }

    preload() {
        this.load.image('background', 'https://play.rosebud.ai/assets/create a dark colour background of a warzone with solders.png?7bSk');
        this.load.image('bottle', 'https://play.rosebud.ai/assets/case.png?5fYH');
        this.load.image('monkey1', 'https://play.rosebud.ai/assets/bob.m.png?eI0q');
        this.load.image('monkey2', 'https://play.rosebud.ai/assets/freddie.m.png?RQXD');
        this.load.image('monkey3', 'https://play.rosebud.ai/assets/Rita.O.png?mNMa');
        this.load.image('monkey4', 'https://play.rosebud.ai/assets/Ocean Vuong.png?PdAl');
        this.load.image('monkey5', 'https://play.rosebud.ai/assets/knann.png?BLBw');
        this.load.image('monkey6', 'https://play.rosebud.ai/assets/mika.png?1TmG');
        this.load.image('monkey7', 'https://play.rosebud.ai/assets/wyclef.j.png?wo3L');
        this.load.image('monkey8', 'https://play.rosebud.ai/assets/Michaela DePrince.png?FUKx');
        this.load.image('banditYokai', 'https://play.rosebud.ai/assets/soldier.png?nuXg');

        this.load.audio('firstSound', 'https://play.rosebud.ai/assets/take-sip-129735.mp3?4Yhw');
        this.load.audio('secondSound', 'https://play.rosebud.ai/assets/take-sip-129735.mp3?4Yhw');
    }

    create() {
        let bg = this.add.image(0, -50, 'background').setOrigin(0, 0);
        bg.x -= 125;
        bg.displayWidth += 125;
        let graphics = this.add.graphics({
            fillStyle: {
                color: 0x000000,
                alpha: 0.5
            }
        });
        graphics.fillRect(0, 0, this.sys.game.config.width, 100); // replace 100 with the height of your text box
        let margin = this.sys.game.config.height * 0.18;
        let imageWidth = this.textures.get('monkey1').getSourceImage().width * 0.18;
        let spacing = (this.sys.game.config.width - 4 * imageWidth) / 5;
        let totalWidth = 4 * imageWidth + 3 * spacing;
        let firstX = (this.sys.game.config.width - totalWidth) / 2 + imageWidth / 2;
        for (let i = 0; i < 4; i++) {
            this.monkeySprites.push(this.add.image(firstX + i * (imageWidth + spacing), margin, 'monkey' + (i + 1)).setOrigin(0.5, 0).setScale(0.18));
            this.monkeySprites.push(this.add.image(firstX + i * (imageWidth + spacing), this.sys.game.config.height - margin, 'monkey' + (i + 5)).setOrigin(0.5, 1).setScale(0.18));
        }

        this.bottleSprite = this.add.sprite(this.textures.get('bottle').getSourceImage().width * 0.1, this.textures.get('bottle').getSourceImage().height * 0.1, 'bottle').setScale(0.2).setOrigin(0.5, 1).setDepth(1);
        this.bottleSprite.setVisible(false);
        this.cursors = this.input.keyboard.createCursorKeys();

        let instructionStyle = {
            fontSize: '24px',
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'Arial Black',
            color: '#FFFFFF'
        };
        this.instructionText = this.add.text(this.sys.game.config.width / 2, 30, "Help the famous refugees pack and leave.", instructionStyle).setOrigin(0.5, 0.5);
        let bottomGraphics = this.add.graphics({
            fillStyle: {
                color: 0x000000,
                alpha: 0.5
            }
        });
        bottomGraphics.fillRect(0, this.sys.game.config.height - 100, this.sys.game.config.width, 100); // replace 100 with the height of your text box
        let controlInstructionsText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 70, "Arrow keys to move & fill cases.\nDont't let the soldier catch you!", instructionStyle).setOrigin(0.5, 0.5);

        let style = {
            fontSize: '32px',
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        };
        this.startText = this.add.text(this.sys.game.config.width / 2, 70, "Press ENTER to start.", style).setOrigin(0.5, 0.5);

        this.input.keyboard.once('keydown-ENTER', function() {
            graphics.clear(); // clear the graphics or destroy it
            this.startText.destroy();
            controlInstructionsText.destroy(); // Destroy control instructions text
            bottomGraphics.destroy(); // Destroy bottom graphics (instructions box)
            this.instructionText.destroy();
            this.bottleSprite.setVisible(true);
            this.bottleSprite.x = this.textures.get('bottle').getSourceImage().width * 0.1;
            this.bottleSprite.y = this.textures.get('bottle').getSourceImage().height * 0.1;

            // Create a semi-transparent blue frame for the bottle sprite
            let bottleBounds = this.bottleSprite.getBounds();
            this.bottleFrame = this.add.rectangle(bottleBounds.x + bottleBounds.width / 2, bottleBounds.y + bottleBounds.height / 2, bottleBounds.width, bottleBounds.height, 0x0000ff, 0).setOrigin(0.5, 0.5).setStrokeStyle(2, 0x0000ff, 0.5);

            this.startGameSequence();
            this.banditSpawnTimer = this.time.addEvent({
                delay: 3000,
                callback: this.spawnBanditYokai,
                callbackScope: this
            });
        }, this);

        this.firstSound = this.sound.add('firstSound');
        this.secondSound = this.sound.add('secondSound');

        this.firstSound.setVolume(0.17);
        this.secondSound.setVolume(0.17);

        this.firstSound.on('complete', function() {
            this.secondSound.play();
        }, this);

        this.secondSound.on('complete', function() {
            this.firstSound.play();
        }, this);

        this.firstSound.play();

        // Create the level/score text after the game starts
    }
    dimScreenAndShowScore() {
        let dimGraphics = this.add.graphics({
            fillStyle: {
                color: 0x000000,
                alpha: 0.75
            }
        });
        dimGraphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);
        // Hide things that aren't needed on the game over screen.
        this.bottleSprite.setVisible(false);
        this.banditYokaiSprite.setVisible(false);
        this.percentageText.setVisible(false);
        this.scoreText.setVisible(false);
        this.bottleFrame.setVisible(false);
        this.banditFrame.setVisible(false);
        this.thirstyText.setVisible(false);
        this.thirstyTextBackground.setVisible(false);
        this.percentageBackground.setVisible(false);
        let scoreStyle = {
            fontSize: '64px',
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        };
        let finalScoreText = `Final score: ${this.score} \nRefresh page to reset.`;
        this.add.text(this.sys.game.config.width / 2, 0, finalScoreText, scoreStyle).setOrigin(0.5, 0);
    }
    startGameSequence() {}

    spawnBanditYokai() {
        let bottlePosition = this.bottleSprite;
        let farthestPoint = this.getFarthestPointFromBottle(bottlePosition);
        let banditScale = 0.1; // Half the size of the bottle sprite (0.2)

        // Check if the farthest point is within the game bounds
        let gameWidth = this.sys.game.config.width;
        let gameHeight = this.sys.game.config.height;
        let banditWidth = this.textures.get('banditYokai').getSourceImage().width * banditScale;
        let banditHeight = this.textures.get('banditYokai').getSourceImage().height * banditScale;

        // Adjust the farthest point if it would cause the bandit yokai to be clipped
        if (farthestPoint.x + banditWidth / 2 > gameWidth) {
            farthestPoint.x = gameWidth - banditWidth / 2;
        } else if (farthestPoint.x - banditWidth / 2 < 0) {
            farthestPoint.x = banditWidth / 2;
        }

        if (farthestPoint.y + banditHeight / 2 > gameHeight) {
            farthestPoint.y = gameHeight - banditHeight / 2;
        } else if (farthestPoint.y - banditHeight / 2 < 0) {
            farthestPoint.y = banditHeight / 2;
        }

        this.banditYokaiSprite = this.physics.add.sprite(farthestPoint.x, farthestPoint.y, 'banditYokai').setScale(banditScale * 1.25); // Made the Yokai 25% larger
        this.banditYokaiSprite.setCollideWorldBounds(true);

        // Create a semi-transparent red frame for the bandit yokai sprite
        let banditBounds = this.banditYokaiSprite.getBounds();
        this.banditFrame = this.add.rectangle(banditBounds.x + banditBounds.width / 2, banditBounds.y + banditBounds.height / 2, banditBounds.width, banditBounds.height, 0xff0000, 0).setOrigin(0.5, 0.5).setStrokeStyle(2, 0xff0000, 0.5);
    }

    getFarthestPointFromBottle(bottlePosition) {
        let gameWidth = this.sys.game.config.width;
        let gameHeight = this.sys.game.config.height;
        let farthestPoint = new Phaser.Math.Vector2();
        if (bottlePosition.x <= gameWidth / 2) {
            farthestPoint.x = gameWidth;
        } else {
            farthestPoint.x = 0;
        }
        if (bottlePosition.y <= gameHeight / 2) {
            farthestPoint.y = gameHeight;
        } else {
            farthestPoint.y = 0;
        }
        return farthestPoint;
    }

    startGameSequence() {
        this.hasStarted = true;

        let availableMonkeys = this.monkeySprites.filter(monkey => monkey !== this.previousThirstyMonkey);
        this.thirstyMonkey = Phaser.Utils.Array.GetRandom(availableMonkeys);

        let message = "Fill my case!";
        let style = {
            
            fontSize: '22px',
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'Arial Black',
            color: '#ffffff',
          
        };
        let textMeasure = this.add.text(0, 0, message, style);
        let textWidth = textMeasure.width;
        let textHeight = textMeasure.height;
        textMeasure.destroy();

        let textY = (this.thirstyMonkey.originY === 0 ? this.thirstyMonkey.y + this.thirstyMonkey.displayHeight : this.thirstyMonkey.y) - textHeight / 2;

        let rect = this.add.rectangle(this.thirstyMonkey.x, textY, textWidth + 10, textHeight + 10, 0x000000).setDepth(0);
        rect.alpha = 0.5;
        rect.setOrigin(0.5, 0.5);

        this.thirstyText = this.add.text(this.thirstyMonkey.x, textY, message, style).setOrigin(0.5, 0.5).setDepth(0);
        this.thirstyText.setColor('#ffffff');
        this.thirstyTextBackground = rect;

        let percentageStyle = {
            fontSize: '32px',
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }; // Light pink color
        let monkeyY = this.thirstyMonkey.originY === 0 ? this.thirstyMonkey.y + this.thirstyMonkey.displayHeight * 0.15 : this.thirstyMonkey.y - this.thirstyMonkey.displayHeight * 0.85;
        this.percentageText = this.add.text(this.thirstyMonkey.x, monkeyY, "", percentageStyle).setOrigin(0.5, 0.5);
        this.percentageText.setDepth(2); // Set depth higher than the bottle sprite
        this.percentageText.setVisible(false);

        let boxWidth = this.percentageText.width + 100;
        let boxHeight = this.percentageText.height + 20;
        this.percentageBackground = this.add.rectangle(this.thirstyMonkey.x, monkeyY, boxWidth, boxHeight, 0x000000, 0.5).setOrigin(0.5, 0.5).setDepth(1); // Set depth lower than the percentage text
        this.percentageBackground.setVisible(false);

        // Create the level/score text after the game starts
        let levelScoreStyle = {
            fontSize: '32px',
            align: 'center',
            fontWeight: 'bold',
            fontFamily: 'Arial Black',
            color: '#FFFFFF'
        };
        if (this.scoreText == null) {
            this.levelScoreBackground = this.add.graphics({
                fillStyle: {
                    color: 0x000000,
                    alpha: 0.5
                }
            });
            this.scoreText = this.add.text(this.sys.game.config.width / 2, 20, `CASES PACKED / SCORE: ${this.score}`, levelScoreStyle).setOrigin(0.5, 0.5);
            let scoreBounds = this.scoreText.getBounds();
            this.levelScoreBackground.fillRect(scoreBounds.x - 10, scoreBounds.y - 10, scoreBounds.width + 20, scoreBounds.height + 20);
        } else {
            this.scoreText.setText(`CASES PACKED / SCORE: ${this.score}`);
            let scoreBounds = this.scoreText.getBounds();
            this.levelScoreBackground.clear();
            this.levelScoreBackground.fillRect(scoreBounds.x - 10, scoreBounds.y - 10, scoreBounds.width + 20, scoreBounds.height + 20);
        }
    }

    update() {
        if (!this.gameOver && this.cursors.left.isDown && this.bottleSprite.x - this.textures.get('bottle').getSourceImage().width * 0.1 > 0) {
            this.bottleSprite.x -= 5; // Change the value to adjust the speed
        }
        if (!this.gameOver && this.cursors.right.isDown && this.bottleSprite.x + this.textures.get('bottle').getSourceImage().width * 0.1 < this.sys.game.config.width) {
            this.bottleSprite.x += 5; // Change the value to adjust the speed
        }
        if (!this.gameOver && this.cursors.up.isDown && this.bottleSprite.y - this.textures.get('bottle').getSourceImage().height * 0.1 > 0) {
            this.bottleSprite.y -= 5; // Change the value to adjust the speed
        }
        if (!this.gameOver && this.cursors.down.isDown && this.bottleSprite.y + this.bottleSprite.height * this.bottleSprite.scaleY * (1 - this.bottleSprite.originY) < this.sys.game.config.height) {
            this.bottleSprite.y += 5; // Change the value to adjust the speed
        }

        // Update the bottle frame position and size
        if (this.bottleFrame) {
            let bottleBounds = this.bottleSprite.getBounds();
            this.bottleFrame.setPosition(bottleBounds.x + bottleBounds.width / 2, bottleBounds.y + bottleBounds.height / 2);
            this.bottleFrame.setSize(bottleBounds.width, bottleBounds.height);
        }

        // Update the bandit yokai frame position and size
        if (this.banditYokaiSprite && this.banditFrame) {
            let banditBounds = this.banditYokaiSprite.getBounds();
            this.banditFrame.setPosition(banditBounds.x + banditBounds.width / 2, banditBounds.y + banditBounds.height / 2);
            this.banditFrame.setSize(banditBounds.width, banditBounds.height);
        }

        if (this.banditYokaiSprite && !this.gameOver) {
            if (!this.gameOver) {
                this.physics.moveToObject(this.banditYokaiSprite, this.bottleSprite, this.banditSpeed); // The last parameter is the speed at which the Yokai should move towards the bottle.
            }
            let banditBounds = this.banditYokaiSprite.getBounds();
            let bottleBounds = this.bottleSprite.getBounds();
            if (Phaser.Geom.Rectangle.Intersection(banditBounds, bottleBounds).width > 0) {
                this.gameOver = true;
                this.dimScreenAndShowScore();
                return;
            }
        }
        if (this.hasStarted) {
            let bottleBottomTip = new Phaser.Geom.Point(this.bottleSprite.x, this.bottleSprite.y + this.bottleSprite.height * this.bottleSprite.scale * (1 - this.bottleSprite.originY));
            if (this.percentage < 100 && this.thirstyMonkey.getBounds().contains(bottleBottomTip.x, bottleBottomTip.y)) {
                this.percentage += 0.1 * 4.25;
                this.percentageText.setText(Math.floor(this.percentage) + "%");
                let monkeyY = this.thirstyMonkey.originY === 0 ? this.thirstyMonkey.y + this.thirstyMonkey.displayHeight * 0.15 : this.thirstyMonkey.y - this.thirstyMonkey.displayHeight * 0.85;
                this.percentageText.setY(monkeyY);
                this.percentageBackground.setY(monkeyY);
                if (!this.percentageText.visible) {
                    this.percentageText.setVisible(true);
                    this.percentageBackground.setVisible(true);
                }
            }
            if (this.percentage >= 100) {
                this.percentageText.destroy();
                this.percentageBackground.destroy();
                this.thirstyText.destroy();
                this.thirstyTextBackground.destroy();
                this.previousThirstyMonkey = this.thirstyMonkey;
                this.score++; // Increment the score
                this.banditSpeed += 6; // Increase the bandit's speed
                this.scoreText.setText(`CASES PACKED / SCORE: ${this.score}`); // Update the level/score text
                this.percentage = 0;
                this.startGameSequence();
            }
        }
    }
}

const container = document.getElementById('renderDiv');
const config = {
    type: Phaser.AUTO,
    parent: 'renderDiv',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            }
        }
    },
    scene: Example
};

window.phaserGame = new Phaser.Game(config);