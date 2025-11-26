import Phaser from "phaser";
import SceneKeys from '../consts/sceneKeys'
import * as Types from "types/index"

export default class PreloaderScene extends Phaser.Scene{
    settings: Types.gameSettings = {
        hp1: 100,
        hp2: 100,
        immortality: false,
        graphic: true
    }
    constructor(){
        super('preloader');
    }
    preload(){
        // player 1 - load both appearances
        this.load.atlas('player1', 'atlases/player_3.png', 'atlases/player_3.json');
        this.load.atlas('player1_alt', 'atlases/player_3_super.png', 'atlases/player_3_super.json');
        // player 2 - load both appearances
        this.load.atlas('player2', 'atlases/player_2.png', 'atlases/player_2.json');
        this.load.atlas('player2_alt', 'atlases/player_2_super.png', 'atlases/player_2_super.json');
        this.load.json('player1_shapes', 'shapes/player1_shapes.json');
        this.load.json('player2_shapes', 'shapes/player2_shapes.json');
        this.load.json('player1_shapes_flip', 'shapes/player1_shapes_flip.json');
        this.load.json('player2_shapes_flip', 'shapes/player2_shapes_flip.json');
        // player 2
        this.load.on('complete', () => {
            this.scene.start(SceneKeys.MenuScene, this.settings);
        })
        // background
        this.load.image('background', 'other/background.png');
    }
    create(){
        this.initAnimPlayer_1();
        this.initAnimPlayer_1_alt();
        this.initAnimPlayer_2();
        this.initAnimPlayer_2_alt();
    }
    initAnimPlayer_1(){
        let frameNames: Phaser.Types.Animations.AnimationFrame[];
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'walk/front/', suffix: '.png'
        });
        this.anims.create({key: 'walkf_1', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'walk/back/', suffix: '.png'
        });
        this.anims.create({key: 'walkb_1', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'idle/air/', suffix: '.png'
        });
        this.anims.create({key: 'idlea_1', frames: frameNames, frameRate: 3, repeat: -1});
        
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'idle/ground/', suffix: '.png'
        });
        this.anims.create({key: 'idleg_1', frames: frameNames, frameRate: 3, repeat: -1});
                
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'crouch/', suffix: '.png'
        });
        this.anims.create({key: 'crouch_1', frames: frameNames, frameRate: 2});

        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'block/', suffix: '.png'
        });
        this.anims.create({key: 'block_1', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'kick/air/', suffix: '.png'
        });
        this.anims.create({key: 'kicka_1', frames: frameNames, frameRate: 15, repeat: -1});
        
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'kick/ground/', suffix: '.png'
        });
        this.anims.create({key: 'kickg_1', frames: frameNames});
        
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'knockback/', suffix: '.png'
        });
        this.anims.create({key: 'knockback_1', frames: frameNames, frameRate: 10});
        
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'punch/air/', suffix: '.png'
        });
        this.anims.create({key: 'puncha_1', frames: frameNames, frameRate: 10, repeat: -1});
                
        frameNames = this.anims.generateFrameNames('player1', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'punch/ground/', suffix: '.png'
        });
        this.anims.create({key: 'punchg_1', frames: frameNames, frameRate: 10, repeat: -1});
    }
    initAnimPlayer_1_alt(){
        // Same animations but for player1_alt atlas (player_1.png)
        let frameNames: Phaser.Types.Animations.AnimationFrame[];
        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'walk/front/', suffix: '.png'
        });
        this.anims.create({key: 'walkf_1_alt', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'walk/back/', suffix: '.png'
        });
        this.anims.create({key: 'walkb_1_alt', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'idle/air/', suffix: '.png'
        });
        this.anims.create({key: 'idlea_1_alt', frames: frameNames, frameRate: 3, repeat: -1});
        
        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'idle/ground/', suffix: '.png'
        });
        this.anims.create({key: 'idleg_1_alt', frames: frameNames, frameRate: 3, repeat: -1});
                
        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'crouch/', suffix: '.png'
        });
        this.anims.create({key: 'crouch_1_alt', frames: frameNames, frameRate: 2});

        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'block/', suffix: '.png'
        });
        this.anims.create({key: 'block_1_alt', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'kick/air/', suffix: '.png'
        });
        this.anims.create({key: 'kicka_1_alt', frames: frameNames, frameRate: 15, repeat: -1});
        
        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'kick/ground/', suffix: '.png'
        });
        this.anims.create({key: 'kickg_1_alt', frames: frameNames});
        
        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'knockback/', suffix: '.png'
        });
        this.anims.create({key: 'knockback_1_alt', frames: frameNames, frameRate: 10});
        
        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'punch/air/', suffix: '.png'
        });
        this.anims.create({key: 'puncha_1_alt', frames: frameNames, frameRate: 10, repeat: -1});
                
        frameNames = this.anims.generateFrameNames('player1_alt', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'punch/ground/', suffix: '.png'
        });
        this.anims.create({key: 'punchg_1_alt', frames: frameNames, frameRate: 10, repeat: -1});
    }
    initAnimPlayer_2(){
        let frameNames: Phaser.Types.Animations.AnimationFrame[];
        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'walk/front/', suffix: '.png'
        });
        this.anims.create({key: 'walkf_2', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'walk/back/', suffix: '.png'
        });
        this.anims.create({key: 'walkb_2', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'idle/air/', suffix: '.png'
        });
        this.anims.create({key: 'idlea_2', frames: frameNames, frameRate: 3, repeat: -1});
        
        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'idle/ground/', suffix: '.png'
        });
        this.anims.create({key: 'idleg_2', frames: frameNames, frameRate: 3, repeat: -1});
                
        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'crouch/', suffix: '.png'
        });
        this.anims.create({key: 'crouch_2', frames: frameNames, frameRate: 2});

        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'block/', suffix: '.png'
        });
        this.anims.create({key: 'block_2', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'kick/air/', suffix: '.png'
        });
        this.anims.create({key: 'kicka_2', frames: frameNames, frameRate: 15, repeat: -1});
        
        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'kick/ground/', suffix: '.png'
        });
        this.anims.create({key: 'kickg_2', frames: frameNames});
        
        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'knockback/', suffix: '.png'
        });
        this.anims.create({key: 'knockback_2', frames: frameNames, frameRate: 10});
        
        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'punch/air/', suffix: '.png'
        });
        this.anims.create({key: 'puncha_2', frames: frameNames, frameRate: 10, repeat: -1});
                
        frameNames = this.anims.generateFrameNames('player2', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'punch/ground/', suffix: '.png'
        });
        this.anims.create({key: 'punchg_2', frames: frameNames, frameRate: 10, repeat: -1});
    }
    initAnimPlayer_2_alt(){
        let frameNames: Phaser.Types.Animations.AnimationFrame[];
        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'walk/front/', suffix: '.png'
        });
        this.anims.create({key: 'walkf_2_alt', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'walk/back/', suffix: '.png'
        });
        this.anims.create({key: 'walkb_2_alt', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'idle/air/', suffix: '.png'
        });
        this.anims.create({key: 'idlea_2_alt', frames: frameNames, frameRate: 3, repeat: -1});
        
        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'idle/ground/', suffix: '.png'
        });
        this.anims.create({key: 'idleg_2_alt', frames: frameNames, frameRate: 3, repeat: -1});
                
        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'crouch/', suffix: '.png'
        });
        this.anims.create({key: 'crouch_2_alt', frames: frameNames, frameRate: 2});

        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'block/', suffix: '.png'
        });
        this.anims.create({key: 'block_2_alt', frames: frameNames});

        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 2, zeroPad: 4,
            prefix: 'kick/air/', suffix: '.png'
        });
        this.anims.create({key: 'kicka_2_alt', frames: frameNames, frameRate: 15, repeat: -1});
        
        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 1, zeroPad: 4,
            prefix: 'kick/ground/', suffix: '.png'
        });
        this.anims.create({key: 'kickg_2_alt', frames: frameNames});
        
        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'knockback/', suffix: '.png'
        });
        this.anims.create({key: 'knockback_2_alt', frames: frameNames, frameRate: 10});
        
        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'punch/air/', suffix: '.png'
        });
        this.anims.create({key: 'puncha_2_alt', frames: frameNames, frameRate: 10, repeat: -1});
                
        frameNames = this.anims.generateFrameNames('player2_alt', {
            start: 1, end: 3, zeroPad: 4,
            prefix: 'punch/ground/', suffix: '.png'
        });
        this.anims.create({key: 'punchg_2_alt', frames: frameNames, frameRate: 10, repeat: -1});
    }
}