let game;
let platforms;
let player;
let cursors;
let platformCount = 0;
let emitter;
let particles;
let gameOptions = {
    width: 480,
    height: 640,
    gravity: 800
};
class JumpScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JumpScene' })
    };
    preload() {
        this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Jump/platform.png');
        this.load.image('stripe', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Jump/stripe.png');
        this.load.spritesheet("codey", "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Jump/codey.png", {
            frameWidth: 72,
            frameHeight: 90
        });
    };
    create() {
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0xdadaff, 0x6cfafa, 0xfccaff, 0xdadaff, 1);
        graphics.fillRect(0, 0, gameOptions.width, gameOptions.height);
        particles = this.add.particles('stripe');
        this.physics.world.setBounds(0, 0, 480, 640);
        platforms = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        });
        for (let i = 0; i < 8; i++) {
            let randomX = Math.floor(Math.random() * 400) + 24;
            platforms.create(randomX, i * 80, 'platform').setScale(.5);
        };
        player = this.physics.add.sprite(100, 450, 'codey').setScale(.5);
        player.setBounce(1);
        player.setCollideWorldBounds(true);
        player.body.checkCollision.up = false;
        player.body.checkCollision.left = false;
        player.body.checkCollision.right = false;
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('codey', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        this.physics.add.collider(player, platforms);
        cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
        player.anims.play('jump', true);
        if (cursors.left.isDown) {
            player.setVelocityX(-240);
            player.flipX = true;
        } else if (cursors.right.isDown) {
            player.setVelocityX(240);
            player.flipX = false;
        } else {
            player.setVelocityX(0);
        };
        if (player.body.touching.down) {
            this.cameras.main.shake(100, .004);
            player.setVelocityY(-500);
        };
        if (platformCount > 10 && !emitter) {
            emitter = particles.createEmitter({
                x: { min: 0, max: gameOptions.width },
                y: gameOptions.height + 10,
                lifespan: 2500,
                speedY: { min: -300, max: -500 },
                scale: .5,
                quantity: 5,
                blendMode: 'ADD'
            });
        };
        if (player.body.y < gameOptions.height / 2) {
            platforms.children.iterate(updateY, this);
        };
    };
}
let config = {
    type: Phaser.AUTO,
    width: gameOptions.width,
    height: gameOptions.height,
    backgroundColor: '#4599ff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: gameOptions.gravity },
        }
    },
    scene: JumpScene,
};
game = new Phaser.Game(config);
function updateY(platform) {
    let delta = Math.floor(gameOptions.height / 2) - player.y;
    if (delta > 0) {
        platform.y += delta / 30;
    };
    if (platform.y > 640) {
        platform.y = -platform.height;
        platform.x = Math.floor(Math.random() * 400) + 24;
        platformCount += 1;
    };
};