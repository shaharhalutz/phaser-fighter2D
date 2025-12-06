import Phaser from "phaser";
import * as Types from "../../types/index"

export default class Player extends Phaser.Physics.Matter.Sprite{
    constructor(config, id: number, hp: number, immortal: boolean){
        super(config.scene.matter.world, config.x, config.y, config.texture);
		this.setTexture(config.texture)
		config.scene.add.existing(this)
        this.id = id
        this.hp = hp
        this.immortal = immortal
        // @ts-ignore
        let tempAnims = this.anims.animationManager.anims.entries;
        const getNmes = (id: number, isAlt: boolean = false) => {
            const suffix = isAlt ? `_${id}_alt` : `_${id}`;
            Object.keys(tempAnims).forEach((key) => {
                if(key.endsWith(suffix)){
                    const baseName = key.slice(0, -suffix.length);
                    this.animationNames[baseName] = key;
                }
            });
        }
        // Initialize base stats (will be set after cooldowns are defined)
        this.baseMovementSpeed = 5;
        this.baseDamage = 10;
        
        if(id === 1){
            this.useAltTexture = false;
            getNmes(id, false);
            this.shapes = {
                shapesPlayer: this.scene.cache.json.get('player1_shapes'),
                shapesPlayerFlip: this.scene.cache.json.get('player1_shapes_flip')
            }
            this.keys  = {
                left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
                jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                crouch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                punch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C),
                kick: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
                block: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G),
                switchAppearance: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
            }
            this.lastHDir = "r"
            this.switchCooldown = 0;
            this.switchKeyJustPressed = false;
        }else if(id === 2){
            this.useAltTexture = false;
            getNmes(2, false);
            this.shapes = {
                shapesPlayer: this.scene.cache.json.get('player2_shapes'),
                shapesPlayerFlip: this.scene.cache.json.get('player2_shapes_flip')
            }
            this.keys  = {
                left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
                right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
                jump: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                crouch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
                punch: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
                kick: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
                block: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
                switchAppearance: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
            }   
            this.lastHDir = "l"
            this.switchCooldown = 0;
            this.switchKeyJustPressed = false;
        }
        
        // Store base cooldown values after they're initialized
        this.basePunchCooldown = this.punchCooldown;
        this.baseKickCooldown = this.kickCooldown;
        this.baseCrouchCooldown = this.crouchCooldown;
        this.baseBlockCooldown = this.blockCooldown;
        // event emitter
        this.on('animationcomplete', (anim) => {
            if(anim.key === this.animationNames.knockback){
                this.animMove.knockback = false;
            }
            // this.scene.events.emit('animationcomplete_' + anim.key, anim);
        }, this);
    }
    immortal: boolean
    id: number
    hp: number
    dead: boolean = false
    enemy: Player
    MovementSpeed: number = 5
    // Super mode stats (base values stored)
    baseMovementSpeed: number = 5
    baseDamage: number = 10
    basePunchCooldown: number = 400
    baseKickCooldown: number = 600
    baseCrouchCooldown: number = 800
    baseBlockCooldown: number = 800
    // Super mode multipliers
    superModeDamageMultiplier: number = 1.5  // Deal 1.5x damage in super mode
    superModeSpeedMultiplier: number = 1.3   // Move 1.3x faster in super mode
    superModeDamageTakenMultiplier: number = 0.7  // Take 0.7x damage in super mode
    superModeCooldownMultiplier: number = 0.7  // 0.7x cooldowns (faster attacks) in super mode
    keys: Types.keysTypes
    recordedKeys: Types.keyBool
    jumpCooldown: number = 0
    isCrouching: boolean = false
    lastHDir: string
    lastVDir: string = "f"
    firstCrouch: boolean = true
    damageText: Phaser.GameObjects.Text
    damageTextText: string
    // cooldowns
    crouchCooldown: number = 800
    punchCooldown: number = 1000
    kickCooldown: number = 900
    blockCooldown: number = 800
    // durations
    crouchDuration: number = 200
    punchDuration: number = 250
    kickDuration: number = 200
    blockDuration: number = 100
    // colldown flags
    canPunch: boolean = true;
    canCrouch: boolean = true;
    canKick: boolean = true;
    canBlock: boolean = true;
    // action flags
    isPunch: boolean = false
    isKick: boolean = false
    isBlock: boolean = false
    ratio: number = this.width / this.height
    isAir: boolean = false
    isFalling: boolean = false
    // attack flag
    singlePunch: boolean = false;
    singleKick: boolean = false;
    animMove: Types.animMove = {
        idleA: false,
        idleG: false,
        punch: false,
        kick: false,
        block: false,
        knockback: false,
        right: false,
        left: false,
        crouch: false
    }
    animationNames: Types.animations = {
        block: "",
        crouch: "",
        idlea: "",
        idleg: "",
        kicka: "",
        kickg: "",
        knockback: "",
        puncha: "",
        punchg: "",
        walkf: "",
        walkb: ""
    }
    isIdleAir: boolean = true;
    isIdleGround: boolean = false;
    shapes: Types.shapes
    currentShape: Phaser.GameObjects.Shape
    collides: boolean
    useAltTexture: boolean = false
    switchCooldown: number = 0
    switchKeyJustPressed: boolean = false
    superModeTimer: Phaser.Time.TimerEvent | null = null
    superModeDuration: number = 30000  // 10 seconds in milliseconds
    superModeCooldownTimer: Phaser.Time.TimerEvent | null = null
    superModeCooldownDuration: number = 30000  // 30 seconds cooldown after exiting super mode
    isSuperModeOnCooldown: boolean = false
    update(isCollision: boolean){
        if(this.dead === true) return;
        this.recordKeys();
        this.handleTextureSwitch();
        this.handlePlayerMovement();
        // get collide flag
        this.collides = isCollision;
        this.setcurrentShape();
        // prevent tilting
        this.setAngularVelocity(0);
        // take key input
        this.handleKnockout();
        this.handleAnimation();
        this.handleAttack();
        this.handlePlayerDeath();
        // update switch cooldown
        if(this.switchCooldown > 0) this.switchCooldown--;
    }
    handleAttack(){
        // Calculate base damage
        let baseDamage = this.baseDamage;
        
        // Apply super mode damage multiplier if in super mode
        if(this.useAltTexture){
            baseDamage = Math.floor(baseDamage * this.superModeDamageMultiplier);
        }
        
        // Apply enemy's super mode damage reduction if enemy is in super mode
        let finalDamage = baseDamage;
        if(this.enemy.useAltTexture){
            finalDamage = Math.floor(finalDamage * this.enemy.superModeDamageTakenMultiplier);
        }
        
        // Block reduces damage to 0
        const damage = (this.immortal || this.enemy.animMove.block) ? 0 : finalDamage;
        this.damageTextText = this.enemy.animMove.block ? "BLOCK" : damage.toString();
        
        if(this.collides === true){
            if(this.animMove.punch === true && this.singlePunch === true){
                this.enemy.hp -= damage;
                this.singlePunch = false;
                if(this.id == 1){
                    // @ts-ignore
                    this.scene.Ui.hp2.decrease(damage);
                }else if(this.id === 2){
                    // @ts-ignore
                    this.scene.Ui.hp1.decrease(damage);
                }
                this.showDamage();
            }
            if(this.animMove.kick === true && this.enemy.animMove.knockback === false && this.singleKick === true){
                this.enemy.hp -= damage;
                if(this.enemy.animMove.block === false){
                    this.enemy.animMove.knockback = true;
                }
                this.singleKick = false;
                if(this.id == 1){
                    // @ts-ignore
                    this.scene.Ui.hp2.decrease(damage);
                }else if(this.id === 2){
                    // @ts-ignore
                    this.scene.Ui.hp1.decrease(damage);
                }
                this.showDamage();
            }
        }
    }
    setcurrentShape(){
        if(this.lastHDir === 'r'){
            this.currentShape = this.shapes.shapesPlayer;
        }else if(this.lastHDir === 'l'){
            this.currentShape = this.shapes.shapesPlayerFlip;
        }
    }
    handleKnockout(){
        if(this.animMove.knockback === true && this.body){
            if(this.lastHDir === "r"){
                this.setVelocityX(this.body.velocity.x - 5);
            }else if(this.lastHDir === "l"){
                this.setVelocityX(this.body.velocity.x + 5);
            }
        }
    }
    destroyKnockout(){
        this.animMove.knockback = false;
    }
    handlePlayerDeath(){
        if(this.hp <= 0){
            // Clean up super mode timer
            if(this.superModeTimer){
                this.superModeTimer.remove();
                this.superModeTimer = null;
            }
            // Clean up super mode cooldown timer
            if(this.superModeCooldownTimer){
                this.superModeCooldownTimer.remove();
                this.superModeCooldownTimer = null;
            }
            this.destroy();
            this.dead = true;
        }
    }
    recordKeys(){
        // check input
        this.recordedKeys = {
            left: this.keys.left.isDown,
            right: this.keys.right.isDown,
            jump: this.keys.jump.isDown,
            crouch: this.keys.crouch.isDown,
            punch: this.keys.punch.isDown,
            kick: this.keys.kick.isDown,
            block: this.keys.block.isDown
        };
    }
    clearSuperModeCooldown(){
        this.isSuperModeOnCooldown = false;
        if(this.superModeCooldownTimer){
            this.superModeCooldownTimer.remove();
            this.superModeCooldownTimer = null;
        }
    }
    
    exitSuperMode(){
        // Only exit if currently in super mode
        if(!this.useAltTexture) return;
        
        // Clear the super mode timer
        if(this.superModeTimer){
            this.superModeTimer.remove();
            this.superModeTimer = null;
        }
        
        // Exit super mode
        this.useAltTexture = false;
        
        // Restore base stats
        this.MovementSpeed = this.baseMovementSpeed;
        this.punchCooldown = this.basePunchCooldown;
        this.kickCooldown = this.baseKickCooldown;
        this.crouchCooldown = this.baseCrouchCooldown;
        this.blockCooldown = this.baseBlockCooldown;
        
        // Switch texture atlas back to normal
        const newTexture = `player${this.id}`;
        this.setTexture(newTexture);
        
        // Update animation names back to normal
        // @ts-ignore
        let tempAnims = this.anims.animationManager.anims.entries;
        const getNmes = (id: number, isAlt: boolean) => {
            const suffix = isAlt ? `_${id}_alt` : `_${id}`;
            Object.keys(tempAnims).forEach((key) => {
                if(key.endsWith(suffix)){
                    const baseName = key.slice(0, -suffix.length);
                    this.animationNames[baseName] = key;
                }
            });
        };
        getNmes(this.id, false);
        
        // Start 30-second cooldown before super mode can be activated again
        this.isSuperModeOnCooldown = true;
        this.superModeCooldownTimer = this.scene.time.addEvent({
            delay: this.superModeCooldownDuration,
            callback: this.clearSuperModeCooldown,
            callbackScope: this
        });
        
        // Restart current animation if one is playing
        if(this.anims && this.anims.currentAnim){
            this.handleAnimation();
        }
    }
    
    handleTextureSwitch(){
        // Both players can switch textures
        if(this.keys.switchAppearance){
            // Check if key was just pressed (not held down)
            if(Phaser.Input.Keyboard.JustDown(this.keys.switchAppearance) && this.switchCooldown <= 0){
                const wasSuperMode = this.useAltTexture;
                
                // Check if trying to enter super mode while on cooldown
                if(!wasSuperMode && this.isSuperModeOnCooldown){
                    // Super mode is on cooldown, don't allow activation
                    return;
                }

                // bla bla bla esxample
                
                this.useAltTexture = !this.useAltTexture;
                this.switchCooldown = 10; // cooldown to prevent rapid switching
            
                // Clear existing timer if switching manually
                if(this.superModeTimer){
                    this.superModeTimer.remove();
                    this.superModeTimer = null;
                }
            
                // Apply or remove super mode stats
                if(this.useAltTexture && !wasSuperMode){
                    // Entering super mode - apply multipliers
                    this.MovementSpeed = this.baseMovementSpeed * this.superModeSpeedMultiplier;
                    this.punchCooldown = Math.floor(this.basePunchCooldown * this.superModeCooldownMultiplier);
                    this.kickCooldown = Math.floor(this.baseKickCooldown * this.superModeCooldownMultiplier);
                    this.crouchCooldown = Math.floor(this.baseCrouchCooldown * this.superModeCooldownMultiplier);
                    this.blockCooldown = Math.floor(this.baseBlockCooldown * this.superModeCooldownMultiplier);
                    
                    // Start 10-second timer to auto-exit super mode
                    this.superModeTimer = this.scene.time.addEvent({
                        delay: this.superModeDuration,
                        callback: this.exitSuperMode,
                        callbackScope: this
                    });
                    
                    // Switch texture atlas to super mode
                    const newTexture = `player${this.id}_alt`;
                    this.setTexture(newTexture);
                    
                    // Update animation names for super mode
                    // @ts-ignore
                    let tempAnims = this.anims.animationManager.anims.entries;
                    const getNmes = (id: number, isAlt: boolean) => {
                        const suffix = isAlt ? `_${id}_alt` : `_${id}`;
                        Object.keys(tempAnims).forEach((key) => {
                            if(key.endsWith(suffix)){
                                const baseName = key.slice(0, -suffix.length);
                                this.animationNames[baseName] = key;
                            }
                        });
                    };
                    getNmes(this.id, true);
                    
                    // Restart current animation if one is playing
                    if(this.anims && this.anims.currentAnim){
                        this.handleAnimation();
                    }
                } else if(!this.useAltTexture && wasSuperMode){
                    // Exiting super mode manually - call exitSuperMode to handle cooldown
                    this.exitSuperMode();
                    // exitSuperMode handles texture switching and animations, so return early
                    return;
                }
            }
        }
    }
    setShape(shape: string){
        // take params beforehead
        var sx = this.x;
        var sy = this.y;
        var sav = 0;
        if('angularVelocity' in this.body) sav = this.body.angularVelocity;
        var sv = this.body.velocity;
        // set shape
        this.setBody(this.currentShape[shape]);
        // pass previous params
        this.setPosition(sx, sy);
        this.setVelocity(sv.x, sv.y);
        this.setAngularVelocity(sav);
    }
    handleAnimation(){
        // is every value false
        const doIdle = Object.values(this.animMove).every(value => !value);
        if(doIdle === true){
            if(this.isAir === true){
                this.animMove.idleA = true;
            } else if(this.isAir === false){
                this.animMove.idleG = true;
            }
        }
        // knockback (highest priority)
        if(this.animMove.knockback === true){
            this.setShape('knockback');
            this.play(this.animationNames.knockback, true);
            return; // Don't process other animations during knockback
        }
        // block
        if(this.animMove.block === true){
            this.setShape('block');
            this.play(this.animationNames.block, true);
            return; // Don't process other animations during block
        }
        // crouch
        if(this.animMove.crouch === true){
            this.setShape('crouch');
            this.play(this.animationNames.crouch, true);
            return; // Don't process other animations during crouch
        }
        // punch (prioritize over movement)
        if(this.animMove.punch === true){
            if(this.isAir === true){
                this.setShape('punch_air');
                this.play(this.animationNames.puncha, true);
            }else if(this.isAir === false){
                this.setShape('punch_ground');
                this.play(this.animationNames.punchg, true);
            }
            return; // Don't process movement during punch
        }
        // kick (prioritize over movement)
        if(this.animMove.kick === true){
            if(this.isAir === true){
                this.setShape('kick_air');
                this.play(this.animationNames.kicka, true);
            }else if(this.isAir === false){
                this.setShape('kick_ground');
                this.play(this.animationNames.kickg, true);
            }
            return; // Don't process movement during kick
        }
        // movement (only if no attack is active)
        if(this.animMove.right === true){
            // right front
            if(this.lastHDir === 'r'){
                this.setShape('walk_front');
                this.play(this.animationNames.walkf, true);
            // right back
            }else if(this.lastHDir === 'l'){
                this.setShape('walk_back');
                this.play(this.animationNames.walkb, true);
            }
            // reset
            this.setObjFalse(this.animMove);
        }else if(this.animMove.left === true){
            // left back
            if(this.lastHDir === 'r'){
                this.setShape('walk_back');
                this.play(this.animationNames.walkb, true);
            // left front
            }else if(this.lastHDir === 'l'){
                this.setShape('walk_front');
                this.play(this.animationNames.walkf, true);
            }
            // reset
            this.setObjFalse(this.animMove);
        }
        // idle
        if(this.animMove.idleA === true){
            this.setObjFalse(this.animMove);
            this.setShape('idle_air');
            this.play(this.animationNames.idlea, true);
        }
        if(this.animMove.idleG === true){
            this.setObjFalse(this.animMove);
            this.setShape('idle_ground');
            this.play(this.animationNames.idleg, true);
        }
    }
    // set properties of object to false
    setObjFalse(obj: Object): void{
        Object.keys(obj).forEach(key => {
            obj[key] = false;
        });
    }
    handlePlayerMovement(){
        // reset
        this.setVelocityX(0);
        this.setVelocityY(0);
        if(this.animMove.knockback === false){
            // move front and back
            if (this.recordedKeys.left === true){
                this.setVelocityX(-this.MovementSpeed);
                this.animMove.left = true;
            } else if (this.recordedKeys.right === true){
                this.setVelocityX(this.MovementSpeed);
                this.animMove.right = true;
            }
            // get to the air
            if(this.recordedKeys.jump === true && this.isAir === false){
                this.isAir = true;
                this.setVelocityY(-3);
                this.scene.time.addEvent({delay:5000, callback: this.setFalling, callbackScope: this});
            }
            // fly up
            if(this.recordedKeys.jump === true && this.isAir === true){
                this.setVelocityY(-3);
            }
            // fly down
            if(this.recordedKeys.crouch === true && this.isAir === true){
                this.setVelocityY(3);
            }
            // crouch
            if(this.recordedKeys.crouch === true && this.isAir === false && this.canCrouch){
                this.animMove.crouch = true;
                this.canCrouch = false;
                // set on the ground
                this.y += 15;
                this.scene.time.addEvent({delay:this.crouchDuration, callback: this.setResetMove, callbackScope: this});
                this.scene.time.addEvent({delay:this.crouchCooldown, callback: this.setCooldownCrouch, callbackScope: this});
            }
            // punch
            if(this.recordedKeys.punch === true && this.canPunch === true){
                this.animMove.punch = true;
                this.canPunch = false;
                this.singlePunch = true;
                this.scene.time.addEvent({delay:this.punchDuration, callback: this.setResetMove, callbackScope: this});
                this.scene.time.addEvent({delay:this.punchCooldown, callback: this.setCooldownPunch, callbackScope: this});
            }
            // kick
            if(this.recordedKeys.kick === true && this.canKick === true){
                this.animMove.kick = true;
                this.canKick = false;
                this.singleKick = true;
                this.scene.time.addEvent({delay:this.kickDuration, callback: this.setResetMove, callbackScope: this});
                this.scene.time.addEvent({delay:this.kickCooldown, callback: this.setCooldownKick, callbackScope: this});    
            }
            // block
            if(this.recordedKeys.block === true && this.canBlock === true){
                this.animMove.block = true;
                this.canBlock = false;
                this.scene.time.addEvent({delay:this.kickDuration, callback: this.setResetMove, callbackScope: this});
                this.scene.time.addEvent({delay:this.kickCooldown, callback: this.setCooldownBlock, callbackScope: this}); 
            }
        }
        // handle falling
        if(this.isFalling === true){
            this.setVelocityY(6);
        }
        // stop falling
        if(this.y > 176){
            this.isIdleGround = true;
            this.isFalling = false;
            this.isAir = false;
            this.isIdleAir = false;
        }
    }
    // setting action flags
    setResetMove(){
        this.setObjFalse(this.animMove);
    }
    setFalling(){   
        this.isFalling = true;
    }
    // setting actions cooldowns flags
    setCooldownPunch(){
        this.canPunch = true;
    }
    setCooldownCrouch(){
        this.canCrouch = true;
    }
    setCooldownKick(){
        this.canKick = true;
    }
    setCooldownBlock(){
        this.canBlock = true;
    }
    showDamage(){
        // last collision point
        const collisionObject = this.scene.matter.world.engine.pairs.list.slice(-1)[0].collision.supports[0];
        const xTemp = collisionObject.x - this.width/2, yTemp = collisionObject.y - this.height/2, range: number = 5;
        let x = Phaser.Math.Between(xTemp - range, xTemp + range)
        let y = Phaser.Math.Between(yTemp - range, yTemp + range)
        this.damageText = this.scene.add.text(x, y, this.damageTextText.toString(), {fontSize: '10px'})
        this.scene.time.addEvent({delay:200, callback: this.handleTextDissapear, callbackScope: this} )
    }
    handleTextDissapear(){
        this.damageText.destroy()
        this.damageText.setVisible(false)
    }
}