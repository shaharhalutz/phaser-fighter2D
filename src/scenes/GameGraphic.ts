import Phaser from "phaser";
import SceneKeys from "~/consts/sceneKeys";
import * as Types from "~/types/index";
import Player from "~/objects/sprite/player"
import UIScene from "./UIScene";

export default class GameGraphic extends Phaser.Scene{
    constructor(){
        super({
            key: SceneKeys.GameGraphic,
            physics: {
                default: 'matter',
                matter: { gravity: { y: 9000 }, debug: false }
            }
        });
    }
    init(settings: Types.gameSettings){
        this.settings = settings
    }
    player1: Player;
    player2: Player;
    settings: Types.gameSettings;
    collides: boolean = false;
    camera: globalThis.Phaser.Cameras.Scene2D.Camera;
    cameraX: number = 0;
    mid: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    FOLLOW_LERP_X = 0.05;
    FOLLOW_LERP_Y = 0.05;
    ZOOM_MIN = 0.8;
    ZOOM_MAX = 1.2;
    ZOOM_LERP = 0.05;
    gameWidth: number = 922;
    gameHeight: number = 213;
    purpleOverlay: Phaser.GameObjects.Rectangle;
    superModeActiveCount: number = 0; // Track how many players are in super mode
    create(){
        this.matter.world.setGravity(0, 1);
        this.player1 = new Player(
            {
                scene: this,
                x: (this.gameWidth/2) - 100,
                y: 170,
                texture: 'player1',
            },
            1, 
            this.settings.hp1, 
            this.settings.immortality
        ).setOrigin(0.5);
        this.player2 = new Player(
            {
                scene: this,
                x: (this.gameWidth/2) + 100,
                y: 170,
                texture: 'player2'
            }, 
            2, 
            this.settings.hp2, 
            this.settings.immortality
        ).setOrigin(0.5);
        this.player1.enemy = this.player2;
        this.player2.enemy = this.player1;
        this.matter.world.setBounds(0, 0, this.gameWidth, this.gameHeight-5);
        // players collision detection
        this.matter.world.on("collisionstart", event => {
            event.pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                const coll1 = bodyA.gameObject instanceof Player;
                const coll2 = bodyB.gameObject instanceof Player;
                if(coll1 && coll2){
                    this.collides = true;
                }
            });
        });
        // background
        this.add.image(0, 0, 'background').setOrigin(0).setDepth(-1);
        // purple overlay for super mode (initially hidden)
        this.purpleOverlay = this.add.rectangle(
            this.gameWidth / 2, 
            this.gameHeight / 2, 
            this.gameWidth, 
            this.gameHeight, 
            0x8B00FF, // Purple color
            0.3 // 30% opacity
        ).setDepth(-0.5).setVisible(false);
        // camera
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, this.gameWidth, this.gameHeight);
        this.camera.startFollow(this.mid, false, this.FOLLOW_LERP_X, this.FOLLOW_LERP_Y);
        // UI
        // @ts-ignore
        this.Ui = this.game.scene.add(SceneKeys.UIScene, UIScene, true, { x: 100, y: 100 });
    }
    update(time: number, delta: number): void {
        this.handleCamera();
        this.player1.update(this.collides);
        this.player2.update(this.collides);
        this.handlePlayersDir();
        // reset
        this.collides = false;
    }
    handleCamera(){
        if(this.player1.body && this.player2.body){
            this.mid.copy(this.player1).lerp(this.player2, 0.5);
            var dist = Phaser.Math.Distance.BetweenPoints(
                this.player1.body.position,
                this.player2.body.position
            );
            var min = Math.min(this.scale.width, this.scale.height) / 1.5;
            this.camera.setZoom(
                Phaser.Math.Linear(
                    this.camera.zoom,
                    Phaser.Math.Clamp(min / dist, this.ZOOM_MIN, this.ZOOM_MAX),
                    this.ZOOM_LERP
                )
            );
        }   
    }
    handlePlayersDir(){
        if(this.player1.body && this.player2.body){
            if(this.player1.x > this.player2.x){
                this.player1.flipX = true;
                this.player2.flipX = false;
                this.player1.lastHDir = "l"
                this.player2.lastHDir = "r"
            }else{
                this.player1.flipX = false;
                this.player2.flipX = true;
                this.player1.lastHDir = "r"
                this.player2.lastHDir = "l"
            }
        }
    }
    onSuperModeEnter(){
        this.superModeActiveCount++;
        if(this.superModeActiveCount > 0){
            this.purpleOverlay.setVisible(true);
        }
    }
    onSuperModeExit(){
        this.superModeActiveCount--;
        if(this.superModeActiveCount <= 0){
            this.superModeActiveCount = 0; // Ensure it doesn't go negative
            this.purpleOverlay.setVisible(false);
        }
    }
}
