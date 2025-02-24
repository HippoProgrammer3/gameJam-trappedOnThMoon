class ActionKind {
    static Walking: number
    private ___Walking_is_set: boolean
    private ___Walking: number
    get Walking(): number {
        return this.___Walking_is_set ? this.___Walking : ActionKind.Walking
    }
    set Walking(value: number) {
        this.___Walking_is_set = true
        this.___Walking = value
    }
    
    static Idle: number
    private ___Idle_is_set: boolean
    private ___Idle: number
    get Idle(): number {
        return this.___Idle_is_set ? this.___Idle : ActionKind.Idle
    }
    set Idle(value: number) {
        this.___Idle_is_set = true
        this.___Idle = value
    }
    
    static Jumping: number
    private ___Jumping_is_set: boolean
    private ___Jumping: number
    get Jumping(): number {
        return this.___Jumping_is_set ? this.___Jumping : ActionKind.Jumping
    }
    set Jumping(value: number) {
        this.___Jumping_is_set = true
        this.___Jumping = value
    }
    
    public static __initActionKind() {
        ActionKind.Walking = 0
        ActionKind.Idle = 1
        ActionKind.Jumping = 2
    }
    
}

ActionKind.__initActionKind()

namespace SpriteKind {
    export const Structure = SpriteKind.create()
    export const textSprites = SpriteKind.create()
    export const Woodythings = SpriteKind.create()
    export const Upgrade_menu = SpriteKind.create()
    export const aboveEnemy = SpriteKind.create()
    export const explodingProjectile = SpriteKind.create()
    export const Interaction_sprite = SpriteKind.create()
    export const other = SpriteKind.create()
    export const damageIndicator = SpriteKind.create()
    export const gunBullets = SpriteKind.create()
    export const airstrikeMissile = SpriteKind.create()
    export const fire = SpriteKind.create()
}

namespace StatusBarKind {
    export const ammo = StatusBarKind.create()
}

function nearestEnemy() {
    
    nearestLengthAway = 9999999
    for (let value of sprites.allOfKind(SpriteKind.aboveEnemy)) {
        if (nearestLengthAway > spriteutils.distanceBetween(Player_character, value)) {
            nearestLengthAway = spriteutils.distanceBetween(Player_character, value)
            nearestSprite = value
        }
        
    }
}

function enemyBehaviour() {
    for (let value2 of sprites.allOfKind(SpriteKind.aboveEnemy)) {
        if (statusbars.getStatusBarAttachedTo(StatusBarKind.Health, value2).value < 1) {
            sprites.destroy(statusbars.getStatusBarAttachedTo(StatusBarKind.Health, value2))
            sprites.destroy(value2)
            
        } else {
            if (spriteutils.distanceBetween(Player_character, value2) < 100) {
                sprites.setDataBoolean(value2, "canSeePlayer", true)
                
            } else if (spriteutils.distanceBetween(Player_character, value2) > 100) {
                sprites.setDataBoolean(value2, "canSeePlayer", false)
                
            }
            
            if (sprites.readDataBoolean(value2, "canSeePlayer")) {
                enemyShoot(sprites.readDataImage(value2, "projectile"), value2, Player_character, 50)
                if (spriteutils.distanceBetween(Player_character, value2) < 50) {
                    value2.setVelocity(0, -10)
                    
                } else {
                    spriteutils.setVelocityAtAngle(value2, spriteutils.angleFrom(value2, Player_character), 15)
                    
                }
                
            } else {
                value2.vx = 15
                
            }
            
        }
        
    }
}

controller.up.onEvent(ControllerButtonEvent.Pressed, function on_up_pressed() {
    
    if (!inInventory && Player_character.isHittingTile(CollisionDirection.Bottom) && !(energyStatusBar.value < 5)) {
        Player_character.vy = -50
        jump = true
        energyStatusBar.value += 0 - 50 / Energy_capacity
    } else {
        
    }
    
    Mine(2, miningEfficiency)
})
scene.onHitWall(SpriteKind.Player, function on_hit_wall(sprite: Sprite, location: tiles.Location) {
    
    jump = false
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function on_b_pressed() {
    if (Player_character.overlapsWith(Base)) {
        gotoBase(true)
    } else if (In_Base) {
        gotoBase(false)
    }
    
})
sprites.onOverlap(SpriteKind.airstrikeMissile, SpriteKind.aboveEnemy, function on_on_overlap(sprite2: Sprite, otherSprite: Sprite) {
    sprites.destroy(sprite2)
    statusbars.getStatusBarAttachedTo(StatusBarKind.Health, otherSprite).value += randint(-80, -120)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.explodingProjectile, function on_on_overlap2(sprite3: Sprite, otherSprite2: Sprite) {
    
    sprites.destroy(otherSprite2)
    playerOnFire = true
    healthChange(-10)
})
function BlockBreak(col: number, row: number, block: number, miningSpeed: number) {
    
    isMining = true
    breakingTileSprite.setFlag(SpriteFlag.Invisible, false)
    energyStatusBar.value += 0 - 50 / Energy_capacity
    tiles.placeOnTile(breakingTileSprite, tiles.getTileLocation(col, row))
    breakingTileSprite.setImage(img`
        . . f . . . . f . . . . f . . . 
                . . f . . . . f . . . f f . . . 
                . . f . . . . f . . . f . . . . 
                . . . . . . f . . . . . . . . . 
                f f . . . . . . . . . . f f f . 
                . f f . . . . . . . . . . . f f 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                f f f f . . . . . . . . . f f f 
                . . . . . . . . . . . . . . . . 
                . . . f . . . . . . . . . . . . 
                . . f f . . . . f . . . . . . . 
                . f f . . f . . . f . . . f . . 
                . f . . . f . . . f f . . f f . 
                f . . . . f . . . . f . . . f f
    `)
    pause(miningSpeed)
    breakingTileSprite.setImage(img`
        . . f . . . . f . . . . f . . . 
                . . f . . . . f . . . f f . . . 
                . . f . . . . f . . . f . . . . 
                . . . f f . f . . f f . . . . . 
                f f . . . . f . . f . f f f f . 
                . f f f . . f . . . f . . . f f 
                . . . . f . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                f f f f f f . . . . f f f f f f 
                . . . . . . . . . . . . . . . . 
                . . . f f f . f . . . . f f . . 
                . . f f . . f f f . . . . f . . 
                . f f . . f . . . f . . . f . . 
                . f . . . f . . . f f . . f f . 
                f . . . . f . . . . f . . . f f
    `)
    pause(miningSpeed)
    breakingTileSprite.setImage(img`
        . . f . . . . f . . . . f . . . 
                . . f . . . . f . . . f f . . . 
                . . f . . . . f . . . f . . . . 
                . . . f f . f . . f f . . . . . 
                f f . . . . f . . f . f f f f . 
                . f f f . . f . . . f . f . f f 
                . . . . f . f f . f f . f . . . 
                . . . . . f . . . f . . f . . . 
                . . . . . . f . f . . . . . . . 
                f f f f f f . f . f f f f f f f 
                . . . . . . . f . . . . . . . . 
                . . . f f f . f . f f f f f . . 
                . . f f . . f f f . . . . f . . 
                . f f . . f . . . f . . . f . . 
                . f . . . f . . . f f . . f f . 
                f . . . . f . . . . f . . . f f
    `)
    pause(miningSpeed)
    tiles.setTileAt(tiles.getTileLocation(col, row), assets.tile`
            myTile8
        `)
    breakingTileSprite.setFlag(SpriteFlag.Invisible, true)
    tiles.setWallAt(tiles.getTileLocation(col, row), false)
    showTiles(col, row)
    isMining = false
    brokenBlocks.push(tiles.getTileLocation(col, row))
}

function gotoBase(goto: boolean) {
    
    if (goto) {
        Gravity = 0
        In_Base = goto
        saveTilemap()
        tiles.setCurrentTilemap(tilemap`
            Inside Base
        `)
        scene.setBackgroundImage(img`
            ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
                        ................................................................................................................................................................
        `)
        tiles.placeOnTile(Player_character, tiles.getTileLocation(3, 26))
        previousTilemap = 0
        Player_character.setVelocity(0, 0)
        controller.moveSprite(Player_character, 50, 50)
        sprites.destroyAllSpritesOfKind(SpriteKind.Woodythings)
        hud(false)
    } else {
        Gravity = 0.8
        In_Base = goto
        tiles.setCurrentTilemap(tilemap`
            Planet part 1
        `)
        loadTilemap()
        GROWTrees()
        hideTiles()
        scene.setBackgroundImage(img`
            ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffcffffffffffcffffffffffffffffffffffffffffcffffffffffcffffffffffffffffffffffffffffcffffffffffcffffffffffffffffffffffffffffcffffffffffcffffffffffffffffffffff
                        ffffffffffffffffcbcffffffffffffffffffffcffffffffffffffffcbcffffffffffffffffffffcffffffffffffffffcbcffffffffffffffffffffcffffffffffffffffcbcffffffffffffffffffffc
                        fffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffff
                        fffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcffffffffffff
                        fff3fffffffffffffffffffffbbbfffffffffffffff3fffffffffffffffffffffbbbfffffffffffffff3fffffffffffffffffffffbbbfffffffffffffff3fffffffffffffffffffffbbbffffffffffff
                        ffb3bffffffffffffffffffffcbcffffffffffffffb3bffffffffffffffffffffcbcffffffffffffffb3bffffffffffffffffffffcbcffffffffffffffb3bffffffffffffffffffffcbcffffffffffff
                        f33333ffffffffffffccfffffffffffffffffffff33333ffffffffffffccfffffffffffffffffffff33333ffffffffffffccfffffffffffffffffffff33333ffffffffffffccffffffffffffffffffff
                        ff3b3fffffffffffffccffffffffffffffffffffff3b3fffffffffffffccffffffffffffffffffffff3b3fffffffffffffccffffffffffffffffffffff3b3fffffffffffffccffffffffffffffffffff
                        ffbfbfffffffffffffffffffffffffffffcfffffffbfbfffffffffffffffffffffffffffffcfffffffbfbfffffffffffffffffffffffffffffcfffffffbfbfffffffffffffffffffffffffffffcfffff
                        fffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcffff
                        fffffffffffcffffffffffffffffffffffcffffffffffffffffcffffffffffffffffffffffcffffffffffffffffcffffffffffffffffffffffcffffffffffffffffcffffffffffffffffffffffcfffff
                        ffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffff
                        fffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        fcfffffffffffffffffffffffffcfffffffffffffcfffffffffffffffffffffffffcfffffffffffffcfffffffffffffffffffffffffcfffffffffffffcfffffffffffffffffffffffffcffffffffffff
                        fffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
                        ffffffccfffffcffffffffffffffffffffffffffffffffccfffffcffffffffffffffffffffffffffffffffccfffffcffffffffffffffffffffffffffffffffccfffffcffffffffffffffffffffffffff
                        ffffffccfffffffffffffcccccccccccffffffffffffffccfffffffffffffcccccccccccffffffffffffffccfffffffffffffcccccccccccffffffffffffffccfffffffffffffcccccccccccffffffff
                        ffffffffffffffffccccccccccccccccccccffffffffffffffffffffccccccccccccccccccccffffffffffffffffffffccccccccccccccccccccffffffffffffffffffffccccccccccccccccccccffff
                        fffffffffffffccccccccccccccccccccccccccffffffffffffffccccccccccccccccccccccccccffffffffffffffccccccccccccccccccccccccccffffffffffffffccccccccccccccccccccccccccf
                        ccfffffffffcccccccccccccccccccccccccccccccfffffffffcccccccccccccccccccccccccccccccfffffffffcccccccccccccccccccccccccccccccfffffffffccccccccccccccccccccccccccccc
                        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
                        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
                        bbbbbbbbbbbbccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccbbbbbbbb
                        bbbbbbbbbbbbbbbbbccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccbbbbbbbbbbbbb
                        bbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbb
                        bbbbbbbbb3333333bbbbbbbbb33cbbbbbbbbbbbbbbbbbbbbb3333333bbbbbbbbb33cbbbbbbbbbbbbbbbbbbbbb3333333bbbbbbbbb33cbbbbbbbbbbbbbbbbbbbbb3333333bbbbbbbbb33cbbbbbbbbbbbb
                        bbbbbbb33cccccbb33bbbbbbbccbbccbbbbbbbbbbbbbbbb33cccccbb33bbbbbbbccbbccbbbbbbbbbbbbbbbb33cccccbb33bbbbbbbccbbccbbbbbbbbbbbbbbbb33cccccbb33bbbbbbbccbbccbbbbbbbbb
                        bbbbbbbcccbbbbbcccbbbbbbbbccccbbbbbbbbbbbbbbbbbcccbbbbbcccbbbbbbbbccccbbbbbbbbbbbbbbbbbcccbbbbbcccbbbbbbbbccccbbbbbbbbbbbbbbbbbcccbbbbbcccbbbbbbbbccccbbbbbbbbbb
                        3bbbbbbbcccccccccbbbbbbbbbbbbbbb333333333bbbbbbbcccccccccbbbbbbbbbbbbbbb333333333bbbbbbbcccccccccbbbbbbbbbbbbbbb333333333bbbbbbbcccccccccbbbbbbbbbbbbbbb33333333
                        333bbbbbbbcccccbbbbbbbbbbbbbbb333ccbbbbb333bbbbbbbcccccbbbbbbbbbbbbbbb333ccbbbbb333bbbbbbbcccccbbbbbbbbbbbbbbb333ccbbbbb333bbbbbbbcccccbbbbbbbbbbbbbbb333ccbbbbb
                        cc3bbbbbbbbbbbbbbbbbbbbbbbbbbb3cccbbbccccc3bbbbbbbbbbbbbbbbbbbbbbbbbbb3cccbbbccccc3bbbbbbbbbbbbbbbbbbbbbbbbbbb3cccbbbccccc3bbbbbbbbbbbbbbbbbbbbbbbbbbb3cccbbbccc
                        cccbbbbbbbbbbbb333bbbbbb3bbbbbcccbbbbbcccccbbbbbbbbbbbb333bbbbbb3bbbbbcccbbbbbcccccbbbbbbbbbbbb333bbbbbb3bbbbbcccbbbbbcccccbbbbbbbbbbbb333bbbbbb3bbbbbcccbbbbbcc
                        cccbbbbbbbbbbbb333bbbbbbbbbbbbcccccccccccccbbbbbbbbbbbb333bbbbbbbbbbbbcccccccccccccbbbbbbbbbbbb333bbbbbbbbbbbbcccccccccccccbbbbbbbbbbbb333bbbbbbbbbbbbcccccccccc
                        cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccc
                        bbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
                        bbb333333bbb33ddddddddddddddddd33bbbbbbbbbb333333bbb33ddddddddddddddddd33bbbbbbbbbb333333bbb33ddddddddddddddddd33bbbbbbbbbb333333bbb33ddddddddddddddddd33bbbbbbb
                        bbb33333ddddddddddddddddddddddddddddd3bbbbb33333ddddddddddddddddddddddddddddd3bbbbb33333ddddddddddddddddddddddddddddd3bbbbb33333ddddddddddddddddddddddddddddd3bb
                        dddddddddddddddddddddddddddddddd33333ddddddddddddddddddddddddddddddddddd33333ddddddddddddddddddddddddddddddddddd33333ddddddddddddddddddddddddddddddddddd33333ddd
                        dddddddddddddd3333333333ddddddd33dddd33ddddddddddddddd3333333333ddddddd33dddd33ddddddddddddddd3333333333ddddddd33dddd33ddddddddddddddd3333333333ddddddd33dddd33d
                        dddddddddddd333ddddddddd33dddddbbbbbbbbddddddddddddd333ddddddddd33dddddbbbbbbbbddddddddddddd333ddddddddd33dddddbbbbbbbbddddddddddddd333ddddddddd33dddddbbbbbbbbd
                        ddddddddddd333d3bbbbbbbbd33dddddbbbbbbddddddddddddd333d3bbbbbbbbd33dddddbbbbbbddddddddddddd333d3bbbbbbbbd33dddddbbbbbbddddddddddddd333d3bbbbbbbbd33dddddbbbbbbdd
                        ddddddddddd33bbbbbbbbbbbb33dddddddddddddddddddddddd33bbbbbbbbbbbb33dddddddddddddddddddddddd33bbbbbbbbbbbb33dddddddddddddddddddddddd33bbbbbbbbbbbb33ddddddddddddd
                        ddddddddddddbbbbbbbbbbbbbbddddddddddddddddddddddddddbbbbbbbbbbbbbbddddddddddddddddddddddddddbbbbbbbbbbbbbbddddddddddddddddddddddddddbbbbbbbbbbbbbbdddddddddddddd
                        ddddddddddddd3bbbbbbbbbb3dddddddddddddddddddddddddddd3bbbbbbbbbb3dddddddddddddddddddddddddddd3bbbbbbbbbb3dddddddddddddddddddddddddddd3bbbbbbbbbb3ddddddddddddddd
                        d333333ddddddddd333333ddddddddddddddddddd333333ddddddddd333333ddddddddddddddddddd333333ddddddddd333333ddddddddddddddddddd333333ddddddddd333333dddddddddddddddddd
                        333333333dddddddddddddddddddddddddddddd3333333333dddddddddddddddddddddddddddddd3333333333dddddddddddddddddddddddddddddd3333333333dddddddddddddddddddddddddddddd3
                        33333333dddddddddddddddddddddddddddddddd33333333dddddddddddddddddddddddddddddddd33333333dddddddddddddddddddddddddddddddd33333333dddddddddddddddddddddddddddddddd
                        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        dddddddddddddddddddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333d
                        33ddddddddddddddddddddd333dddddddddddd3333ddddddddddddddddddddd333dddddddddddd3333ddddddddddddddddddddd333dddddddddddd3333ddddddddddddddddddddd333dddddddddddd33
                        d333ddddddddddddddddd333ddddddddddddddddd333ddddddddddddddddd333ddddddddddddddddd333ddddddddddddddddd333ddddddddddddddddd333ddddddddddddddddd333dddddddddddddddd
                        ddd33ddddddddddddddd33dddd3bbbbbbbbbbb3dddd33ddddddddddddddd33dddd3bbbbbbbbbbb3dddd33ddddddddddddddd33dddd3bbbbbbbbbbb3dddd33ddddddddddddddd33dddd3bbbbbbbbbbb3d
                        b3dd3ddddddddddddddd3dd3bbbbbbbbbbbbbbbbb3dd3ddddddddddddddd3dd3bbbbbbbbbbbbbbbbb3dd3ddddddddddddddd3dd3bbbbbbbbbbbbbbbbb3dd3ddddddddddddddd3dd3bbbbbbbbbbbbbbbb
                        bb333ddddddddddddddd33bbbbbbbbbbbbbbbbbbbb333ddddddddddddddd33bbbbbbbbbbbbbbbbbbbb333ddddddddddddddd33bbbbbbbbbbbbbbbbbbbb333ddddddddddddddd33bbbbbbbbbbbbbbbbbb
                        bbb3dddddddddddddddd3bbbbbbbbbbbbbbbbbbbbbb3dddddddddddddddd3bbbbbbbbbbbbbbbbbbbbbb3dddddddddddddddd3bbbbbbbbbbbbbbbbbbbbbb3dddddddddddddddd3bbbbbbbbbbbbbbbbbbb
                        b3ddddddddddddddddddd3bbbbbbbbbbbbbbbbbbb3ddddddddddddddddddd3bbbbbbbbbbbbbbbbbbb3ddddddddddddddddddd3bbbbbbbbbbbbbbbbbbb3ddddddddddddddddddd3bbbbbbbbbbbbbbbbbb
                        dddddddddddddddddddddddd3bbbbbbbbbbbbb33dddddddddddddddddddddddd3bbbbbbbbbbbbb33dddddddddddddddddddddddd3bbbbbbbbbbbbb33dddddddddddddddddddddddd3bbbbbbbbbbbbb33
                        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
                        dddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333ddddddddddddddddd
                        dddddd333333333333333333333ddddddddddddddddddd333333333333333333333ddddddddddddddddddd333333333333333333333ddddddddddddddddddd333333333333333333333ddddddddddddd
                        dddd3333333333333333ddd3333333dddddddddddddd3333333333333333ddd3333333dddddddddddddd3333333333333333ddd3333333dddddddddddddd3333333333333333ddd3333333dddddddddd
                        dd3333333333333333333dddddd333333ddddddddd3333333333333333333dddddd333333ddddddddd3333333333333333333dddddd333333ddddddddd3333333333333333333dddddd333333ddddddd
                        3333333333333333333333ddddddddddddddd3333333333333333333333333ddddddddddddddd3333333333333333333333333ddddddddddddddd3333333333333333333333333ddddddddddddddd333
                        33333333333333333333333333dddddddd33333333333333333333333333333333dddddddd33333333333333333333333333333333dddddddd33333333333333333333333333333333dddddddd333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
                        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        `)
        tiles.placeOnTile(Player_character, tiles.getTileLocation(52, 13))
        controller.moveSprite(Player_character, 50, 0)
        for (let value22 of minedLocations) {
            showTiles(value22.column, value22.row)
        }
        In_upgrade_menu = 0
        hud(true)
        Player_character.setImage(img`
            ................
                        .......11.......
                        ......1ff1......
                        .....1ffff1.....
                        .....1ffff1.....
                        ......1ff1......
                        .......11.......
                        ...1111111111...
                        ..111111111111..
                        ..11.111111.11..
                        ..11.1ffff1.11..
                        ..11.1f29f1.11..
                        ..11.1ffff1.11..
                        ..ff.111111.ff..
                        .....11..11.....
                        .....11..11.....
                        .....11..11.....
                        .....11..11.....
                        ....111..111....
                        ....fff..fff....
        `)
    }
    
}

function loadTilemap() {
    for (let value3 of minedLocations) {
        tiles.setTileAt(value3, assets.tile`
            myTile8
        `)
        tiles.setWallAt(value3, false)
    }
    for (let value4 of coalLocations) {
        tiles.setTileAt(value4, assets.tile`
            Coal
        `)
    }
    for (let value5 of ironLocations) {
        tiles.setTileAt(value5, assets.tile`
            Iron
        `)
    }
    for (let value6 of copperLocations) {
        tiles.setTileAt(value6, assets.tile`
            Copper
        `)
    }
    for (let value7 of dirtLocations) {
        tiles.setTileAt(value7, assets.tile`
            myTile3
        `)
    }
    for (let value8 of stoneLocations) {
        tiles.setTileAt(value8, assets.tile`
            Stone
        `)
    }
}

function makeWeaponToolbar(make: boolean) {
    
    if (make) {
        toolbar = Inventory.create_toolbar([gun, airstrike, flamethrower], 3)
        toolbar.setPosition(106, 106)
        toolbar.setFlag(SpriteFlag.RelativeToCamera, true)
    } else {
        
    }
    
}

function GROWTrees() {
    
    for (let value13 of tiles.getTilesByType(assets.tile`
        myTile25
    `)) {
        Tree = sprites.create(img`
                ...........66...........
                            ..........6776..........
                            ..........6776..........
                            .........877778.........
                            ........86777768........
                            .......6777777776.......
                            ......677677776776......
                            ......866777777668......
                            .....86677677677668.....
                            ....8668866766888668....
                            ....8888668886686888....
                            .....86868868868668.....
                            ....866888668888868.....
                            ....8688886888888888....
                            ....8886688888866888....
                            ....8676888868886768....
                            ...87778868678688776....
                            ..8777767767787767778...
                            .877767777777677776778..
                            .8866777777777777776778.
                            .8667776776767776777688.
                            ..887766768668776667668.
                            ..8688668886688686688668
                            .86688688686866888688888
                            8668868866888866888868..
                            88886686688888868688668.
                            .8688888888888888668868.
                            .8878888868868878868788.
                            .87768776788778777667788
                            877677767787776767776778
                            88877787766777777877788.
                            ..88886786777667768888..
                            .....86887786668868.....
                            ......8886888668888.....
                            .........88ee88.........
                            .........feeeef.........
                            .........feeeef.........
                            ........feeefeef........
                            ........fefeffef........
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
                            ........................
            `, SpriteKind.Woodythings)
        Tree_spawn_x = value13.column
        Tree_spawn_y = value13.row
        tiles.placeOnTile(Tree, tiles.getTileLocation(Tree_spawn_x, Tree_spawn_y))
        tiles.setTileAt(value13, assets.tile`
            transparency16
        `)
    }
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function on_a_pressed() {
    
    if (In_Base && tiles.tileAtLocationEquals(Player_character.tilemapLocation(), assets.tile`
            myTile16
        `) && In_upgrade_menu == 0) {
        Player_character.setImage(img`
            . . . . . . f f . . . . . . . . 
                        . . . . . f 1 1 f . . . . . . . 
                        . . . . . f 1 1 f . . . . . . . 
                        . . . . . f 1 1 f . . . . . . . 
                        . . . . . f 1 1 f . . . . . . . 
                        . f f f . f 1 1 f . . . . . . . 
                        . f 1 1 f f 1 1 f f f . . . . . 
                        . f 1 1 1 f 1 1 1 1 f f f f . . 
                        . . f 1 1 f 1 1 1 1 1 1 1 f f f 
                        . . . f 1 1 1 1 1 1 1 1 1 1 1 f 
                        . . . f 1 1 1 1 1 1 1 1 1 1 1 f 
                        . . . . f 1 1 1 1 1 1 1 1 1 f . 
                        . . . . f 1 1 1 1 1 1 1 1 1 f . 
                        . . . . . f 1 1 1 1 1 1 1 f . . 
                        . . . . . f 1 1 1 1 1 1 1 f . . 
                        . . . . . . f f f f f f f . . .
        `)
        Gravity = 0
        tiles.setCurrentTilemap(tilemap`
            Upgrades
        `)
        tiles.placeOnTile(Player_character, tiles.getTileLocation(7, 3))
        Player_character.setVelocity(0, 0)
        controller.moveSprite(Player_character, 50, 50)
        In_upgrade_menu = 1
        Spawn_menu_upgrades_text()
    } else if (In_Base && In_upgrade_menu == 1) {
        I_just_wanted_to_shrink_the_upgrade_menu_section()
    } else {
        
    }
    
})
controller.player2.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function on_player2_button_a_pressed() {
    if (!inInventory) {
        activateInventory(true)
    } else {
        activateInventory(false)
    }
    
})
controller.player2.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function on_player2_button_down_pressed() {
    shoot(2)
})
function Ores() {
    
    for (let value9 of tiles.getTilesByType(assets.tile`
        myTile5
    `)) {
        tempOreRandomizer = randint(1, 10)
        if (tempOreRandomizer > 5) {
            if (randint(0, 1) == 0) {
                tiles.setTileAt(value9, assets.tile`
                    Stone
                `)
            } else {
                tiles.setTileAt(value9, assets.tile`
                    Stone
                `)
            }
            
        } else {
            tiles.setTileAt(value9, assets.tile`
                myTile3
            `)
        }
        
    }
    for (let value10 of tiles.getTilesByType(assets.tile`
        myTile6
    `)) {
        tempOreRandomizer = randint(1, 200)
        if (tempOreRandomizer < 6) {
            tiles.setTileAt(value10, assets.tile`
                Coal
            `)
        } else if (tempOreRandomizer < 10) {
            tiles.setTileAt(value10, assets.tile`
                Copper
            `)
        } else if (tempOreRandomizer < 13) {
            tiles.setTileAt(value10, assets.tile`
                Iron
            `)
        } else {
            tiles.setTileAt(value10, assets.tile`
                Stone
            `)
        }
        
    }
    for (let value11 of tiles.getTilesByType(assets.tile`
        myTile7
    `)) {
        tempOreRandomizer = randint(1, 300)
        if (tempOreRandomizer < 6) {
            tiles.setTileAt(value11, assets.tile`
                Coal
            `)
        } else if (tempOreRandomizer < 10) {
            tiles.setTileAt(value11, assets.tile`
                Copper
            `)
        } else if (tempOreRandomizer < 13) {
            tiles.setTileAt(value11, assets.tile`
                Iron
            `)
        } else if (tempOreRandomizer < 16) {
            tiles.setTileAt(value11, assets.tile`
                myTile28
            `)
        } else if (tempOreRandomizer < 19) {
            tiles.setTileAt(value11, assets.tile`
                myTile13
            `)
        } else if (tempOreRandomizer < 21) {
            tiles.setTileAt(value11, assets.tile`
                myTile12
            `)
        } else {
            tiles.setTileAt(value11, assets.tile`
                Stone
            `)
        }
        
        startingSaveTilemap()
    }
}

sprites.onOverlap(SpriteKind.fire, SpriteKind.aboveEnemy, function on_on_overlap3(sprite4: Sprite, otherSprite3: Sprite) {
    sprites.destroy(sprite4)
    statusbars.getStatusBarAttachedTo(StatusBarKind.Health, otherSprite3).value += randint(-5, -15)
})
function Mine(direction_down__1_up__2_left__3_right__4: number, cooldown: number) {
    
    if (!isMining && !(energyStatusBar.value < 5)) {
        if (direction_down__1_up__2_left__3_right__4 == 1) {
            if (Player_character.tileKindAt(TileDirection.Bottom, assets.tile`
                Stone
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                addToInventory(1)
            }
            
            if (Player_character.tileKindAt(TileDirection.Bottom, assets.tile`
                myTile
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                Type_of_block_being_mined = 0
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Bottom, assets.tile`
                myTile0
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Bottom, assets.tile`
                myTile1
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 2, cooldown)
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Bottom, assets.tile`
                myTile3
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Bottom, assets.tile`
                Coal
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(3)
            }
            
            if (Player_character.tileKindAt(TileDirection.Bottom, assets.tile`
                Iron
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(4)
            }
            
            if (Player_character.tileKindAt(TileDirection.Bottom, assets.tile`
                Copper
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(5)
            }
            
        } else if (direction_down__1_up__2_left__3_right__4 == 3) {
            if (Player_character.tileKindAt(TileDirection.Left, assets.tile`
                Stone
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 6, cooldown)
                Type_of_block_being_mined = 6
                addToInventory(1)
            }
            
            if (Player_character.tileKindAt(TileDirection.Left, assets.tile`
                myTile
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                Type_of_block_being_mined = 0
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Left, assets.tile`
                myTile0
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                Type_of_block_being_mined = 1
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Left, assets.tile`
                myTile1
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 2, cooldown)
                Type_of_block_being_mined = 2
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Left, assets.tile`
                myTile3
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                Type_of_block_being_mined = 5
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Left, assets.tile`
                Coal
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(3)
            }
            
            if (Player_character.tileKindAt(TileDirection.Left, assets.tile`
                Iron
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(4)
            }
            
            if (Player_character.tileKindAt(TileDirection.Left, assets.tile`
                Copper
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Left).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(5)
            }
            
        } else if (direction_down__1_up__2_left__3_right__4 == 4) {
            if (Player_character.tileKindAt(TileDirection.Right, assets.tile`
                Stone
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                Type_of_block_being_mined = 6
                addToInventory(1)
            }
            
            if (Player_character.tileKindAt(TileDirection.Right, assets.tile`
                myTile
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                Type_of_block_being_mined = 0
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Right, assets.tile`
                myTile0
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                Type_of_block_being_mined = 1
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Right, assets.tile`
                myTile1
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 2, cooldown)
                Type_of_block_being_mined = 2
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Right, assets.tile`
                myTile3
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                Type_of_block_being_mined = 5
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Right, assets.tile`
                Coal
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(3)
            }
            
            if (Player_character.tileKindAt(TileDirection.Right, assets.tile`
                Iron
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(4)
            }
            
            if (Player_character.tileKindAt(TileDirection.Bottom, assets.tile`
                Copper
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Right).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(5)
            }
            
        } else if (direction_down__1_up__2_left__3_right__4 == 2) {
            if (Player_character.tileKindAt(TileDirection.Top, assets.tile`
                Stone
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                addToInventory(1)
            }
            
            if (Player_character.tileKindAt(TileDirection.Top, assets.tile`
                myTile
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                Type_of_block_being_mined = 0
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Top, assets.tile`
                myTile0
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                Type_of_block_being_mined = 1
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Top, assets.tile`
                myTile1
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 2, cooldown)
                Type_of_block_being_mined = 2
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Top, assets.tile`
                myTile3
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                Type_of_block_being_mined = 5
                addToInventory(0)
            }
            
            if (Player_character.tileKindAt(TileDirection.Top, assets.tile`
                Coal
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(3)
            }
            
            if (Player_character.tileKindAt(TileDirection.Top, assets.tile`
                Iron
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(4)
            }
            
            if (Player_character.tileKindAt(TileDirection.Bottom, assets.tile`
                Copper
            `)) {
                whereToBreakCol = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).column
                whereToBreakRow = Player_character.tilemapLocation().getNeighboringLocation(CollisionDirection.Top).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(5)
            }
            
        } else {
            
        }
        
    }
    
}

controller.left.onEvent(ControllerButtonEvent.Pressed, function on_left_pressed() {
    if (inInventory) {
        inventory.change_number(InventoryNumberAttribute.SelectedIndex, -1)
    } else {
        Mine(3, miningEfficiency)
    }
    
})
function saveTilemap() {
    
    minedLocations = tiles.getTilesByType(assets.tile`
        myTile8
    `)
    coalLocations = tiles.getTilesByType(assets.tile`
        Coal
    `)
    ironLocations = tiles.getTilesByType(assets.tile`
        Iron
    `)
    copperLocations = tiles.getTilesByType(assets.tile`
        Copper
    `)
    dirtLocations = tiles.getTilesByType(assets.tile`
        myTile3
    `)
    stoneLocations = tiles.getTilesByType(assets.tile`
        Stone
    `)
}

function HUDAmmo() {
    
    if (gunAmmo) {
        gunAmmo.setFlag(SpriteFlag.Invisible, true)
    }
    
    if (airstrikeCooldown) {
        airstrikeCooldown.setFlag(SpriteFlag.Invisible, true)
    }
    
    if (flamethrowerCooldown) {
        flamethrowerCooldown.setFlag(SpriteFlag.Invisible, true)
    }
    
    if (weapon == "gun") {
        if (gunAmmo) {
            gunAmmo.setFlag(SpriteFlag.Invisible, false)
        } else {
            gunAmmo = statusbars.create(4, 60, StatusBarKind.ammo)
        }
        
        gunAmmo.setPosition(145, 91)
        gunAmmo.setColor(4, 2)
    } else if (weapon == "airstrike") {
        if (airstrikeCooldown) {
            airstrikeCooldown.setFlag(SpriteFlag.Invisible, false)
        } else {
            airstrikeCooldown = statusbars.create(4, 60, StatusBarKind.ammo)
        }
        
        airstrikeCooldown.setPosition(145, 91)
        airstrikeCooldown.setColor(9, 6)
        airstrikeCooldown.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
    } else if (weapon == "flamethrower") {
        if (flamethrowerCooldown) {
            flamethrowerCooldown.setFlag(SpriteFlag.Invisible, false)
        } else {
            flamethrowerCooldown = statusbars.create(4, 60, StatusBarKind.ammo)
        }
        
        flamethrowerCooldown.setPosition(145, 91)
        flamethrowerCooldown.setColor(5, 4)
        flamethrowerCooldown.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
    }
    
}

controller.player2.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function on_player2_button_up_pressed() {
    shoot(1)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function on_right_pressed() {
    if (inInventory) {
        inventory.change_number(InventoryNumberAttribute.SelectedIndex, 1)
    } else {
        Mine(4, miningEfficiency)
    }
    
})
controller.player2.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function on_player2_button_right_pressed() {
    shoot(4)
})
function spawnEnemies() {
    
    for (let value12 of tiles.getTilesByType(assets.tile`
        myTile27
    `)) {
        flyingEnemies = sprites.create(img`
                d.......................
                            dd..........cc..........
                            dbd.........ccc.........
                            bddd....ccc.ccccccc.....
                            dddbd...ccccc555555cc...
                            ddbddd..ccb5555555555c..
                            dbdddbcc.b55555ff15555c.
                            bdddbdccb5555555ff55555c
                            ....ddcb555555555555d55c
                            d...cdb555555555bb55555c
                            dd..ccb555ddd5555b13bbc.
                            ddb.ccd55ddddd555b3335c.
                            dbdd.cdd5ddddddd55b335c.
                            bddbddddddb555bbbd555c..
                            ddbdddddddbb55555bccc...
                            dbdddbddddddcc555bcc....
                            bdddbdddddddddcccbcccc..
                            dddbdddddddd55dbbbc55c..
                            ddbddddddddd555dccc5c...
                            .cbddddbbbbdd5d555cc....
                            ..cbdddbbbbbdd5555......
                            ...cccbbbbbbd5555c......
                            .....cccccccc555c.......
                            .............ccc........
            `, SpriteKind.aboveEnemy)
        flyingEnemiesStatusBar = statusbars.create(20, 4, StatusBarKind.Health)
        flyingEnemiesStatusBar.attachToSprite(flyingEnemies)
        tiles.placeOnTile(flyingEnemies, value12)
        animation.runImageAnimation(flyingEnemies, assets.animation`
                flyingMonsterRight
            `, 500, true)
        sprites.setDataBoolean(flyingEnemies, "canSeePlayer", false)
        sprites.setDataImageValue(flyingEnemies, "projectile", assets.image`
                projectile
            `)
        sprites.setDataNumber(flyingEnemies, "maxHealth", 50)
        sprites.setDataNumber(flyingEnemies, "health", 0)
        sprites.setDataNumber(flyingEnemies, "statusBarWidth", 20)
        sprites.setDataNumber(flyingEnemies, "shotCooldown", 0)
        flyingEnemies.setFlag(SpriteFlag.AutoDestroy, false)
        if (value12.row < 24) {
            tiles.setTileAt(value12, assets.tile`
                transparency16
            `)
        } else {
            tiles.setTileAt(value12, assets.tile`
                myTile8
            `)
        }
        
        statusbars.getStatusBarAttachedTo(StatusBarKind.Health, flyingEnemies).value = (sprites.readDataNumber(flyingEnemies, "maxHealth") + sprites.readDataNumber(flyingEnemies, "health")) * sprites.readDataNumber(flyingEnemies, "statusBarWidth")
        characterAnimations.loopFrames(flyingEnemies, assets.animation`
                flyingMonsterRight
            `, 500, characterAnimations.rule(Predicate.MovingRight))
        characterAnimations.loopFrames(flyingEnemies, assets.animation`
                flyingMonsterLeft
            `, 500, characterAnimations.rule(Predicate.FacingLeft))
    }
}

function shoot(direction1up2down3left4right: number) {
    
    if (!inInventory && !In_Base) {
        if (weapon == "gun") {
            if (canShoot && !(gunAmmo.value < 1)) {
                canShoot = false
                gunAmmo.value += -10
                if (direction1up2down3left4right == 1) {
                    //  this is the broken part of #24
                    gunBullet = sprites.createProjectileFromSprite(img`
                            . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . f f . . . . . . . 
                                                    . . . . . . . f f . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . .
                        `, Player_character, 0, -100)
                    gunBullet.setKind(SpriteKind.gunBullets)
                } else if (direction1up2down3left4right == 2) {
                    gunBullet = sprites.createProjectileFromSprite(img`
                            . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . f f . . . . . . . 
                                                    . . . . . . . f f . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . .
                        `, Player_character, 0, 100)
                    gunBullet.setKind(SpriteKind.gunBullets)
                } else if (direction1up2down3left4right == 3) {
                    gunBullet = sprites.createProjectileFromSprite(img`
                            . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . f f . . . . . . . 
                                                    . . . . . . . f f . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . .
                        `, Player_character, -100, 0)
                    gunBullet.setKind(SpriteKind.gunBullets)
                } else if (direction1up2down3left4right == 4) {
                    gunBullet = sprites.createProjectileFromSprite(img`
                            . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . f f . . . . . . . 
                                                    . . . . . . . f f . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . . 
                                                    . . . . . . . . . . . . . . . .
                        `, Player_character, 100, 0)
                    gunBullet.setKind(SpriteKind.gunBullets)
                }
                
                pause(500)
                canShoot = true
            }
            
        } else if (weapon == "airstrike") {
            if (airstrikeCooldown.value > 99) {
                airstrikeFunction()
            }
            
        } else if (!usingFlamethrower && !(flamethrowerCooldown.value < 5)) {
            usingFlamethrower = true
            flamethrowerCooldown.value += -60
            nearestEnemy()
            for (let index = 0; index < 60; index++) {
                if (randint(0, 2) == 0) {
                    flame = sprites.createProjectileFromSprite(img`
                                . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . 4 . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . .
                            `, Player_character, 0, 0)
                    flame.setKind(SpriteKind.fire)
                    flame.lifespan = 1500
                } else {
                    flame = sprites.createProjectileFromSprite(img`
                                . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . 2 . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . . 
                                                            . . . . . . . . . . . . . . . .
                            `, Player_character, 0, 0)
                    flame.setKind(SpriteKind.fire)
                    flame.lifespan = 1500
                }
                
                spriteutils.setVelocityAtAngle(flame, spriteutils.angleFrom(missile, nearestSprite) + randint(-10, 10), randint(40, 60))
            }
            usingFlamethrower = false
        }
        
    }
    
}

function showTiles(col2: number, row2: number) {
    tileUtil.coverTile(tiles.getTileLocation(col2 - 1, row2), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2 + 1, row2), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2, row2 + 1), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2, row2 - 1), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2 - 1, row2 - 1), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2 - -1, row2 - 1), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2 - -1, row2 - -1), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2 - 1, row2 - -1), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2 - 2, row2), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2 + 2, row2), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2, row2 + 2), assets.tile`
            transparency16
        `)
    tileUtil.coverTile(tiles.getTileLocation(col2, row2 - 2), assets.tile`
            transparency16
        `)
}

function airstrikeFunction() {
    
    nearestEnemy()
    missile = sprites.create(scaling.rot(assets.image`
                    gun
                `, spriteutils.radiansToDegrees(spriteutils.angleFrom(missile, nearestSprite))), SpriteKind.airstrikeMissile)
    missile.setFlag(SpriteFlag.AutoDestroy, false)
    missile.lifespan = 5000
    tiles.placeOnTile(missile, Base.tilemapLocation())
    spriteutils.setVelocityAtAngle(missile, spriteutils.angleFrom(missile, nearestSprite), 100)
    airstrikeCooldown.value += -90
}

function hud(add: boolean) {
    
    if (add) {
        if (!_1stTimeHud) {
            healthStatusBar = statusbars.create(50, 6, StatusBarKind.Health)
            healthStatusBar.setPosition(41, 110)
            energyStatusBar = statusbars.create(50, 3, StatusBarKind.Energy)
            energyStatusBar.setColor(9, 8)
            energyStatusBar.setPosition(41, 105)
            pumpingHeart = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                                    . . f f f f f f . f f f f f f . 
                                    . f f 3 3 3 3 f f f 3 3 3 3 f f 
                                    . f 3 3 3 3 3 3 f 3 3 3 3 3 3 f 
                                    . f 3 3 3 3 3 3 3 3 1 1 1 3 3 f 
                                    . f 3 3 3 3 3 3 3 3 1 1 1 3 3 f 
                                    . f 3 3 3 3 3 b b b 1 1 1 3 3 f 
                                    . f 3 3 3 3 b b b b b 3 3 3 3 f 
                                    . f f 3 3 b b b b b b b 3 3 f f 
                                    . . f f 3 b b b b b b b 3 f f . 
                                    . . . f f b b b b b b b f f . . 
                                    . . . . f f b b b b b f f . . . 
                                    . . . . . f f b b b f f . . . . 
                                    . . . . . . f f b f f . . . . . 
                                    . . . . . . . f f f . . . . . . 
                                    . . . . . . . . . . . . . . . .
                `, SpriteKind.other)
            pumpingHeart.setPosition(6, 109)
            animation.runImageAnimation(pumpingHeart, [img`
                        . . . . . . . . . . . . . . . . 
                                        . . f f f f f f . f f f f f f . 
                                        . f f 3 3 3 3 f f f 3 3 3 3 f f 
                                        . f 3 3 3 3 3 3 f 3 3 3 3 3 3 f 
                                        . f 3 3 3 3 3 3 3 3 1 1 1 3 3 f 
                                        . f 3 3 3 3 3 3 3 3 1 1 1 3 3 f 
                                        . f 3 3 3 3 3 b b b 1 1 1 3 3 f 
                                        . f 3 3 3 3 b b b b b 3 3 3 3 f 
                                        . f f 3 3 b b b b b b b 3 3 f f 
                                        . . f f 3 b b b b b b b 3 f f . 
                                        . . . f f b b b b b b b f f . . 
                                        . . . . f f b b b b b f f . . . 
                                        . . . . . f f b b b f f . . . . 
                                        . . . . . . f f b f f . . . . . 
                                        . . . . . . . f f f . . . . . . 
                                        . . . . . . . . . . . . . . . .
                    `, img`
                        . . . . . . . . . . . . . . . . 
                                        . . . . . . . . . . . . . . . . 
                                        . . . . . . . . . . . . . . . . 
                                        . . . f f f f f . f f f f f . . 
                                        . . f f 3 3 3 f f f 3 3 3 f . . 
                                        . . f 3 3 3 3 3 f 3 3 3 3 3 . . 
                                        . . f 3 3 3 3 3 3 3 1 1 3 3 . . 
                                        . . f 3 3 3 3 b b b 1 1 3 3 . . 
                                        . . f 3 3 3 b b b b 3 3 3 3 . . 
                                        . . f f 3 3 b b b b b 3 3 f . . 
                                        . . . f f 3 b b b b b 3 f f . . 
                                        . . . . . f b b b b f f . . . . 
                                        . . . . . . f b b b f . . . . . 
                                        . . . . . . f f b f . . . . . . 
                                        . . . . . . . . . . . . . . . . 
                                        . . . . . . . . . . . . . . . .
                    `, img`
                        . . . . . . . . . . . . . . . . 
                                        . . . . . . . . . . . . . . . . 
                                        . . . . . . . . . . . . . . . . 
                                        . . . . . . . . . . . . . . . . 
                                        . . . . . . . . . . . . . . . . 
                                        . . . . . f f f . f f f . . . . 
                                        . . . . f 3 3 3 f 3 3 3 f . . . 
                                        . . . . f 3 3 3 3 3 1 3 f . . . 
                                        . . . . f 3 3 3 3 3 3 3 f . . . 
                                        . . . . . f 3 b b b 3 f . . . . 
                                        . . . . . f f b b b f f . . . . 
                                        . . . . . . f f b f f . . . . . 
                                        . . . . . . . f f f . . . . . . 
                                        . . . . . . . . . . . . . . . . 
                                        . . . . . . . . . . . . . . . . 
                                        . . . . . . . . . . . . . . . .
                    `], 200, true)
            _1stTimeHud = true
            pumpingHeart.setFlag(SpriteFlag.RelativeToCamera, true)
            healthStatusBar.setFlag(SpriteFlag.RelativeToCamera, true)
            energyStatusBar.setFlag(SpriteFlag.RelativeToCamera, true)
            healthStatusBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
            energyStatusBar.setStatusBarFlag(StatusBarFlag.SmoothTransition, true)
        } else {
            healthStatusBar.setFlag(SpriteFlag.Invisible, false)
            pumpingHeart.setFlag(SpriteFlag.Invisible, false)
            energyStatusBar.setFlag(SpriteFlag.Invisible, false)
        }
        
    } else {
        healthStatusBar.setFlag(SpriteFlag.Invisible, true)
        pumpingHeart.setFlag(SpriteFlag.Invisible, true)
        energyStatusBar.setFlag(SpriteFlag.Invisible, true)
    }
    
}

function Spawn_menu_upgrades_text() {
    
    Upgrade_menu_text = sprites.create(img`
            ................................................................................
                    ...ff.....ff....................................................................
                    ...ff.....ff............f...ff..ff..............................................
                    ...ff....f.f...fffff....ff..f.....ffff.................fff......................
                    ...f.f...f.f.....f......ff..f.....ff.....ff..f.......fff........................
                    ...f.f..f..f.....f......ff..f......f.....ff..f......ff..........................
                    ...f.ff.f..f.....f......ff..f......f.....ff..f.....ff...........................
                    ...f..fff..f.....f......fff.f......f.....fff.f.....f............................
                    ...f.......f......f.....f.f.f......f.....f.f.f.....f............................
                    ..ff.......f...ffff.....f.f.f......f.....f.f.f....f......fffff..................
                    ..f........f.....ffff...f.f.f......f.....f.f.f....f..........f..................
                    ..f........f........f...f.fff..fff.f.....f..ff....f..........f..................
                    ..f........f...............f.....ffff....f..ff....ff........ff..................
                    ...........f........................ff......ff.....f.......ff...................
                    .............................................f......ff....ff....................
                    ......................................................fffff.....................
                    ........fff.....................................................................
                    .......ff.ff....fff.....fffffff.....ff..........................................
                    ......f........f...ff...f...........fffffff.....fff.............................
                    .....ff........f....ff...f..........f.....ff....f.ff............................
                    .....f.........f.....f...f..........f...........f..ff...........................
                    .....f.........f.....f...ffffffff..f............f...ff..........................
                    .....f.........ff...ff...f.........f............f....f..........................
                    ......ff.......ffffff....f.........fffffff......f....ff.........................
                    .......ff......f.........f.........f.....f......f.....f.........................
                    ........fff....f.........f.........f............f.....f.........................
                    ..........ff...f.........f.........f............f.....f.........................
                    ...........f...f.........fffffff...f............f....ff.........................
                    .....fffffff...f...................fffffff......f....f..........................
                    ........................................ff......f..fff..........................
                    ................................................ffff............................
                    ................................................................................
        `, SpriteKind.Upgrade_menu)
    tiles.placeOnTile(Upgrade_menu_text, tiles.getTileLocation(2, 1))
    Upgrade_menu_text = sprites.create(img`
            ................................................................................
                    ................................f...fffff.......................................
                    ....f...........f...f......ffffff...f....f.....fffff............................
                    ....ffffffff....f...f......f........f....f.....f..........f.....................
                    ....f..........fff..f......f........ff...f....ff...........ff..f................
                    ....f..........f.f..f......f........ffffff....f.............f.ff................
                    ....f..........f..f.f......f...ff...f..f......f..............ff.................
                    ....ff.........f..f.f......fffff....f...f.....f....ffff......f..................
                    ....ffffff.....f...ff......f........ff..ff....f......f......ff..................
                    ....f..........f...f.f....ff.........f...ff....f.....f......f...................
                    ....f..........f...fff....f..........f....ff...ff...f......ff...................
                    ....f..........f....ff....fffffff....f..........fffff.....ff....................
                    ....f..........f..................................ff......f.....................
                    ....fffffff.....................................................................
                    ................................................................................
                    .......................................................f........................
                    ...........fff...............ffff.....f................fff......................
                    ..........ff..........ff.....f..ff...ff.......ff.........ffff........f..........
                    .........ff...........ff.....f...f...ff......ff..........f..f........f..........
                    ........ff...........f.f.....f..ff..f..f....f............f...ffffff...f..ff.....
                    ........f...........ff.f.....ffff...f..f....f............f..ff..f......f.f......
                    ........f...........f..f.....f......f..f....f............f......f......ff.......
                    .......f...........ff..f....ff......ffff....f............f.....f.......f........
                    .......f...........fffff....f......f...f....f............f.....f......f.........
                    .......f...........f...f....f......f...f....f............f.....f.....f..........
                    .......f..........f....f....f......f...f....f.....f......f.....f....f...........
                    .......f..........f....f....f.....ff...f....fffffff....f.f.....f...ff...........
                    .......ff........f.....f....f..........f................ffff...f...f............
                    ........fff.....ff..............................................................
                    ..........ffff..................................................................
                    ................................................................................
                    ................................................................................
        `, SpriteKind.Upgrade_menu)
    tiles.placeOnTile(Upgrade_menu_text, tiles.getTileLocation(2, 5))
    Upgrade_menu_text = sprites.create(img`
            ................................................................................
                    ...ffffffffff...................................................................
                    ...f............................................................................
                    ...f.............................................f..............................
                    ...f...............f.........f.fffff.....ffff....ff.............................
                    ..ff...............f.....ff..f...........f........ff.....f......................
                    ..f................ff....f...ff.........f..........ff....f......................
                    ..f.......f........ff....f....f........ff............f..f.......................
                    ..fffffffff........fff...f....f........f..............fff.......................
                    ..f................f.f...f....ffffff...f....fff........f........................
                    ..f................f.ff..f....f.......ff.....ff.......ff........................
                    ..f................f..f..f....f.......f......f........f.........................
                    ..f................f..f..f....f....f..ff....ff........f.........................
                    ..f................f...f.f....ffffff...ffffff........ff.........................
                    .f.................f...fff......................................................
                    .ff.........f......f....ff......................................................
                    ..fffffffffff......f............................................................
                    ................................................................................
                    ..............fff...........ff...f.....f......................................f.
                    .....ffff....f..fffff......f.....f.....f......ff......fffff..............ffffff.
                    .....f..ff....f...........ff.....f.....f......f.f.....f...f..............f......
                    .....f...ff...f...........f.......f....f......f.f.....f...f.......f......f......
                    .....f....f...f..........f........f....f.....ff.f.....ff..f......f.......f......
                    .....ff...f...ffffff.....f........fffffff....ffff.....fffff.....f..f....f.......
                    .....ffffff...f..........f........f....f.....f..ff....f.ff.....f...ffff.ffffff..
                    .....f.f......f..........f........f....f....ff..f.....f..ff....f.....f..f.......
                    .....f.ff.....f..........f........f....f....f...ff.....f..f....ff...ff..ff......
                    .....f..f.....ff.........f........f....f....f....f.....f..ff....fffff....f...ff.
                    .....f...f......ffffff....f.......f....ff...f....ff....f...ff............f.fff..
                    .........ff...............ff......f...............f.........f............ff.....
                    ..........f................ffff.................................................
                    ................................................................................
        `, SpriteKind.Upgrade_menu)
    tiles.placeOnTile(Upgrade_menu_text, tiles.getTileLocation(2, 9))
    if (Mining_speed == 500) {
        Mining_speed_lvl_text = sprites.create(img`
                ................................................
                            ..f.............................................
                            ..f......f.........f.............ffff...........
                            ..f......ff.....f.ff............fff.ff..........
                            ..f.......f.....f.f............ff....ff.........
                            ..f.......f.....f.f............f......ff........
                            ..f.......f....ff.f............f.......f........
                            ..f.......ff..ff..f...........f........f........
                            ..f........f..f...f...........f........f........
                            ..f........f.ff...f...........f........f........
                            ..f........f.f....f...........f........f........
                            ..f........fff....f...........f........f........
                            ..fff......ff.....f............f.......f........
                            ....ffff...ff.....fffff........ff.....f.........
                            ................................ff...ff.........
                            .................................fffff..........
            `, SpriteKind.Upgrade_menu)
        tiles.placeOnTile(Mining_speed_lvl_text, tiles.getTileLocation(4, 3))
    } else if (Mining_speed == 480) {
        Mining_speed_lvl_text = sprites.create(img`
                ................................................
                            ..f.............................................
                            ..f......f.........f............................
                            ..f......ff.....f.ff............................
                            ..f.......f.....f.f..............ff.............
                            ..f.......f.....f.f............ffff.............
                            ..f.......f....ff.f...............f.............
                            ..f.......ff..ff..f...............f.............
                            ..f........f..f...f...............f.............
                            ..f........f.ff...f...............f.............
                            ..f........f.f....f...............f.............
                            ..f........fff....f...............f.............
                            ..fff......ff.....f...............f.............
                            ....ffff...ff.....fffff...........f.............
                            ..............................ffffffff..........
                            ................................................
            `, SpriteKind.Upgrade_menu)
        tiles.placeOnTile(Upgrade_menu_text, tiles.getTileLocation(2, 2))
    } else if (Mining_speed == 460) {
        Mining_speed_lvl_text = sprites.create(img`
                ................................................
                            ..f.............................................
                            ..f......f.........f.........fffff..............
                            ..f......ff.....f.ff.......ff....ff.............
                            ..f.......f.....f.f.......f.......f.............
                            ..f.......f.....f.f...............f.............
                            ..f.......f....ff.f...............f.............
                            ..f.......ff..ff..f...............f.............
                            ..f........f..f...f..............ff.............
                            ..f........f.ff...f..............f..............
                            ..f........f.f....f.............f...............
                            ..f........fff....f...........ff................
                            ..fff......ff.....f.........fff.................
                            ....ffff...ff.....fffff...fffffffff.............
                            ................................................
                            ................................................
            `, SpriteKind.Upgrade_menu)
        tiles.placeOnTile(Upgrade_menu_text, tiles.getTileLocation(2, 2))
    } else if (Mining_speed == 440) {
        Mining_speed_lvl_text = sprites.create(img`
                ................................................
                            ..f.............................................
                            ..f......f.........f..........ff................
                            ..f......ff.....f.ff.......fff..ff..............
                            ..f.......f.....f.f..............f..............
                            ..f.......f.....f.f.............ff..............
                            ..f.......f....ff.f...........fff...............
                            ..f.......ff..ff..f..........ffff...............
                            ..f........f..f...f.............fff.............
                            ..f........f.ff...f...............f.............
                            ..f........f.f....f................f............
                            ..f........fff....f................f............
                            ..fff......ff.....f..........ffffff.............
                            ....ffff...ff.....fffff.........................
                            ................................................
                            ................................................
            `, SpriteKind.Upgrade_menu)
        tiles.placeOnTile(Upgrade_menu_text, tiles.getTileLocation(2, 2))
    } else if (Mining_speed == 420) {
        Mining_speed_lvl_text = sprites.create(img`
                ................................................
                            ..f.............................................
                            ..f......f.........f.........f..................
                            ..f......ff.....f.ff.........f..................
                            ..f.......f.....f.f.........f...................
                            ..f.......f.....f.f.........f...................
                            ..f.......f....ff.f.........f...................
                            ..f.......ff..ff..f.........f...................
                            ..f........f..f...f.........f....f..............
                            ..f........f.ff...f.........f....f..............
                            ..f........f.f....f.........ffffffffff..........
                            ..f........fff....f..............f..............
                            ..fff......ff.....f..............f..............
                            ....ffff...ff.....fffff..........f..............
                            .................................f..............
                            ................................................
            `, SpriteKind.Upgrade_menu)
        tiles.placeOnTile(Upgrade_menu_text, tiles.getTileLocation(2, 2))
    } else if (Mining_speed == 400) {
        Mining_speed_lvl_text = sprites.create(img`
                ................................................
                            ..f.............................................
                            ..f......f.........f............................
                            ..f......ff.....f.ff............................
                            ..f.......f.....f.f.............................
                            ..f.......f.....f.f...........fffff.............
                            ..f.......f....ff.f...........f.................
                            ..f.......ff..ff..f...........f.................
                            ..f........f..f...f...........f.................
                            ..f........f.ff...f...........fffff.............
                            ..f........f.f....f...............f.............
                            ..f........fff....f...............f.............
                            ..fff......ff.....f...............f.............
                            ....ffff...ff.....fffff.......fffff.............
                            ................................................
                            ................................................
            `, SpriteKind.Upgrade_menu)
        tiles.placeOnTile(Upgrade_menu_text, tiles.getTileLocation(2, 2))
    }
    
    for (let index2 = 0; index2 < 4; index2++) {
        if (index2 == 0) {
            Menu_interaction_sprite_0 = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . .
                `, SpriteKind.Interaction_sprite)
            tiles.placeOnTile(Menu_interaction_sprite_0, tiles.getTileLocation(2, 3))
        } else if (index2 == 1) {
            Menu_interaction_sprite_1 = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . .
                `, SpriteKind.Interaction_sprite)
            tiles.placeOnTile(Menu_interaction_sprite_1, tiles.getTileLocation(2, 7))
        } else if (index2 == 2) {
            Menu_interaction_sprite_2 = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . .
                `, SpriteKind.Interaction_sprite)
            tiles.placeOnTile(Menu_interaction_sprite_2, tiles.getTileLocation(2, 11))
        } else if (index2 == 3) {
            Menu_interaction_sprite_3 = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . . 
                                    . . . . . . . . . . . . . . . .
                `, SpriteKind.Interaction_sprite)
            tiles.placeOnTile(Menu_interaction_sprite_3, tiles.getTileLocation(2, 15))
        }
        
    }
}

function addToInventory(thing: number) {
    
    if (thing == 0) {
        dirtQuantity += 1
    } else if (thing == 1) {
        stoneQuantity += 1
    } else if (thing == 3) {
        coalQuantity += 1
    } else if (thing == 4) {
        ironQuantity += 1
    } else if (thing == 5) {
        copperQuantity += 1
    }
    
}

controller.down.onEvent(ControllerButtonEvent.Pressed, function on_down_pressed() {
    if (!inInventory && Player_character.isHittingTile(CollisionDirection.Bottom)) {
        Mine(1, miningEfficiency)
    }
    
})
function I_just_wanted_to_shrink_the_upgrade_menu_section() {
    
    if (Player_character.overlapsWith(Menu_interaction_sprite_0)) {
        if (Mining_speed == 500) {
            Mining_speed = 480
            Mining_speed_lvl_text.setImage(img`
                ................................................
                                ..f.............................................
                                ..f......f.........f............................
                                ..f......ff.....f.ff............................
                                ..f.......f.....f.f..............ff.............
                                ..f.......f.....f.f............ffff.............
                                ..f.......f....ff.f...............f.............
                                ..f.......ff..ff..f...............f.............
                                ..f........f..f...f...............f.............
                                ..f........f.ff...f...............f.............
                                ..f........f.f....f...............f.............
                                ..f........fff....f...............f.............
                                ..fff......ff.....f...............f.............
                                ....ffff...ff.....fffff...........f.............
                                ..............................ffffffff..........
                                ................................................
            `)
        } else if (Mining_speed == 480) {
            Mining_speed = 460
            Mining_speed_lvl_text.setImage(img`
                ................................................
                                ..f.............................................
                                ..f......f.........f.........fffff..............
                                ..f......ff.....f.ff.......ff....ff.............
                                ..f.......f.....f.f.......f.......f.............
                                ..f.......f.....f.f...............f.............
                                ..f.......f....ff.f...............f.............
                                ..f.......ff..ff..f...............f.............
                                ..f........f..f...f..............ff.............
                                ..f........f.ff...f..............f..............
                                ..f........f.f....f.............f...............
                                ..f........fff....f...........ff................
                                ..fff......ff.....f.........fff.................
                                ....ffff...ff.....fffff...fffffffff.............
                                ................................................
                                ................................................
            `)
        } else if (Mining_speed == 460) {
            Mining_speed = 440
            Mining_speed_lvl_text.setImage(img`
                ................................................
                                ..f.............................................
                                ..f......f.........f..........ff................
                                ..f......ff.....f.ff.......fff..ff..............
                                ..f.......f.....f.f..............f..............
                                ..f.......f.....f.f.............ff..............
                                ..f.......f....ff.f...........fff...............
                                ..f.......ff..ff..f..........ffff...............
                                ..f........f..f...f.............fff.............
                                ..f........f.ff...f...............f.............
                                ..f........f.f....f................f............
                                ..f........fff....f................f............
                                ..fff......ff.....f..........ffffff.............
                                ....ffff...ff.....fffff.........................
                                ................................................
                                ................................................
            `)
        } else if (Mining_speed == 440) {
            Mining_speed = 420
            Mining_speed_lvl_text.setImage(img`
                ................................................
                                ..f.............................................
                                ..f......f.........f.........f..................
                                ..f......ff.....f.ff.........f..................
                                ..f.......f.....f.f.........f...................
                                ..f.......f.....f.f.........f...................
                                ..f.......f....ff.f.........f...................
                                ..f.......ff..ff..f.........f...................
                                ..f........f..f...f.........f....f..............
                                ..f........f.ff...f.........f....f..............
                                ..f........f.f....f.........ffffffffff..........
                                ..f........fff....f..............f..............
                                ..fff......ff.....f..............f..............
                                ....ffff...ff.....fffff..........f..............
                                .................................f..............
                                ................................................
            `)
        } else if (Mining_speed == 420) {
            Mining_speed = 400
            Mining_speed_lvl_text.setImage(img`
                ................................................
                                ..f.............................................
                                ..f......f.........f............................
                                ..f......ff.....f.ff............................
                                ..f.......f.....f.f.............................
                                ..f.......f.....f.f...........fffff.............
                                ..f.......f....ff.f...........f.................
                                ..f.......ff..ff..f...........f.................
                                ..f........f..f...f...........f.................
                                ..f........f.ff...f...........fffff.............
                                ..f........f.f....f...............f.............
                                ..f........fff....f...............f.............
                                ..fff......ff.....f...............f.............
                                ....ffff...ff.....fffff.......fffff.............
                                ................................................
                                ................................................
            `)
        }
        
    } else if (Player_character.overlapsWith(Menu_interaction_sprite_1)) {
        if ((0 as any) == (0 as any)) {
            Energy_capacity = 0
        } else if ((0 as any) == (0 as any)) {
            
        } else if ((0 as any) == (0 as any)) {
            
        } else if ((0 as any) == (0 as any)) {
            
        } else if ((0 as any) == (0 as any)) {
            
        }
        
    } else if (Player_character.overlapsWith(Menu_interaction_sprite_2)) {
        if ((0 as any) == (0 as any)) {
            Energy_recharge_rate = 0
        } else if ((0 as any) == (0 as any)) {
            
        } else if ((0 as any) == (0 as any)) {
            
        } else if ((0 as any) == (0 as any)) {
            
        } else if ((0 as any) == (0 as any)) {
            
        }
        
    } else if (Player_character.overlapsWith(Menu_interaction_sprite_3)) {
        if (true) {
            
        } else if (false) {
            
        } else if (false) {
            
        } else if (false) {
            
        } else if (false) {
            
        }
        
    }
    
    sprites.destroyAllSpritesOfKind(SpriteKind.Upgrade_menu)
    sprites.destroyAllSpritesOfKind(SpriteKind.Interaction_sprite)
    Spawn_menu_upgrades_text()
}

controller.player2.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function on_player2_button_left_pressed() {
    shoot(3)
})
function createInventory() {
    
    inventory = Inventory.create_inventory(list2, 999)
    dirt.set_text(ItemTextAttribute.Tooltip, convertToText(dirtQuantity))
    coal.set_text(ItemTextAttribute.Tooltip, convertToText(coalQuantity))
    iron.set_text(ItemTextAttribute.Tooltip, convertToText(ironQuantity))
    stone.set_text(ItemTextAttribute.Tooltip, convertToText(stoneQuantity))
    copper.set_text(ItemTextAttribute.Tooltip, convertToText(copperQuantity))
}

controller.player3.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function on_player3_button_down_pressed() {
    
    if (toolbar.get_number(ToolbarNumberAttribute.SelectedIndex) == 0) {
        toolbar.set_number(ToolbarNumberAttribute.SelectedIndex, 2)
    } else {
        toolbar.change_number(ToolbarNumberAttribute.SelectedIndex, -1)
    }
    
    if (toolbar.get_number(ToolbarNumberAttribute.SelectedIndex) == 0) {
        weapon = "gun"
    } else if (toolbar.get_number(ToolbarNumberAttribute.SelectedIndex) == 1) {
        weapon = "airstrike"
    } else {
        weapon = "flamethrower"
    }
    
    HUDAmmo()
})
function hideTiles() {
    tileUtil.coverAllTiles(assets.tile`
            myTile3
        `, assets.tile`
            myTile26
        `)
    tileUtil.coverAllTiles(assets.tile`
            Stone
        `, assets.tile`
            myTile26
        `)
    tileUtil.coverAllTiles(assets.tile`
            Coal
        `, assets.tile`
            myTile26
        `)
    tileUtil.coverAllTiles(assets.tile`
            Copper
        `, assets.tile`
            myTile26
        `)
    tileUtil.coverAllTiles(assets.tile`
            Iron
        `, assets.tile`
            myTile26
        `)
}

function healthChange(damage: number) {
    
    healthStatusBar.value += damage
    if (damage < 0) {
        damageMarker = textsprite.create(convertToText(damage * -1), 0, 2)
        damageMarker.setKind(SpriteKind.damageIndicator)
        damageMarker.lifespan = 500
        damageMarker.setPosition(randint(11, 51), randint(96, 100))
        damageMarker.setFlag(SpriteFlag.RelativeToCamera, true)
    } else {
        damageMarker = textsprite.create(convertToText(damage), 0, 7)
        damageMarker.setKind(SpriteKind.damageIndicator)
        damageMarker.lifespan = 500
        damageMarker.setPosition(randint(11, 51), randint(96, 100))
        damageMarker.setFlag(SpriteFlag.RelativeToCamera, true)
    }
    
}

function activateInventory(goingIn: boolean) {
    
    if (goingIn) {
        controller.moveSprite(Player_character, 0, 0)
        createInventory()
        inventory.setStayInScreen(true)
        tiles.placeOnTile(inventory, Player_character.tilemapLocation())
        inInventory = true
    } else {
        sprites.destroy(inventory)
        inInventory = false
        controller.moveSprite(Player_character, 50, 0)
    }
    
}

sprites.onOverlap(SpriteKind.aboveEnemy, SpriteKind.gunBullets, function on_on_overlap4(sprite5: Sprite, otherSprite4: Sprite) {
    sprites.destroy(otherSprite4)
    statusbars.getStatusBarAttachedTo(StatusBarKind.Health, sprite5).value += randint(-5, -15)
})
function enemyShoot(projectile: Image, spriteFrom: Sprite, spriteTo: Sprite, speed: number) {
    if (sprites.readDataNumber(spriteFrom, "shotCooldown") == 0) {
        sprites.setDataNumber(spriteFrom, "shotCooldown", 200)
        
        shot = sprites.createProjectileFromSprite(projectile, spriteFrom, 0, 0)
        spriteutils.setVelocityAtAngle(shot, spriteutils.angleFrom(spriteFrom, spriteTo), speed)
        shot.setKind(SpriteKind.explodingProjectile)
    }
    
}

function respawnAtBase() {
    
    game.splash("You Died", "Tut tut tut")
    inventoryContents = 0
    stoneQuantity = 0
    ironQuantity = 0
    dirtQuantity = 0
    coalQuantity = 0
    copperQuantity = 0
    Mining_speed = 500
    Energy_capacity = 10
    Energy_recharge_rate = 1000
    tiles.placeOnTile(Player_character, tiles.getTileLocation(47, 13))
    healthStatusBar.value = 100
}

function startingSaveTilemap() {
    
    startMinedLocations = tiles.getTilesByType(assets.tile`
        myTile8
    `)
    startCoalLocations = tiles.getTilesByType(assets.tile`
        Coal
    `)
    startIronLocations = tiles.getTilesByType(assets.tile`
        Iron
    `)
    startCopperLocations = tiles.getTilesByType(assets.tile`
        Copper
    `)
    startDirtLocations = tiles.getTilesByType(assets.tile`
        myTile3
    `)
    startStoneLocations = tiles.getTilesByType(assets.tile`
        Stone
    `)
}

controller.player3.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function on_player3_button_up_pressed() {
    
    if (toolbar.get_number(ToolbarNumberAttribute.SelectedIndex) == 2) {
        toolbar.set_number(ToolbarNumberAttribute.SelectedIndex, 0)
    } else {
        toolbar.change_number(ToolbarNumberAttribute.SelectedIndex, 1)
    }
    
    if (toolbar.get_number(ToolbarNumberAttribute.SelectedIndex) == 0) {
        weapon = "gun"
    } else if (toolbar.get_number(ToolbarNumberAttribute.SelectedIndex) == 1) {
        weapon = "airstrike"
    } else {
        weapon = "flamethrower"
    }
    
    HUDAmmo()
})
let enemyShotCooldown = false
let startStoneLocations : tiles.Location[] = []
let startDirtLocations : tiles.Location[] = []
let startCopperLocations : tiles.Location[] = []
let startIronLocations : tiles.Location[] = []
let startCoalLocations : tiles.Location[] = []
let startMinedLocations : tiles.Location[] = []
let shot : Sprite = null
let damageMarker : TextSprite = null
let copperQuantity = 0
let Menu_interaction_sprite_3 : Sprite = null
let Menu_interaction_sprite_2 : Sprite = null
let Menu_interaction_sprite_1 : Sprite = null
let Menu_interaction_sprite_0 : Sprite = null
let Mining_speed_lvl_text : Sprite = null
let Upgrade_menu_text : Sprite = null
let pumpingHeart : Sprite = null
let healthStatusBar : StatusBarSprite = null
let missile : Sprite = null
let flame : Sprite = null
let gunBullet : Sprite = null
let flyingEnemiesStatusBar : StatusBarSprite = null
let flyingEnemies : Sprite = null
let flamethrowerCooldown : StatusBarSprite = null
let airstrikeCooldown : StatusBarSprite = null
let gunAmmo : StatusBarSprite = null
let inventory : Inventory.Inventory = null
let Type_of_block_being_mined = 0
let whereToBreakRow = 0
let whereToBreakCol = 0
let tempOreRandomizer = 0
let Tree_spawn_y = 0
let Tree_spawn_x = 0
let Tree : Sprite = null
let toolbar : Inventory.Toolbar = null
let stoneLocations : tiles.Location[] = []
let dirtLocations : tiles.Location[] = []
let copperLocations : tiles.Location[] = []
let ironLocations : tiles.Location[] = []
let coalLocations : tiles.Location[] = []
let minedLocations : tiles.Location[] = []
let previousTilemap = 0
let playerOnFire = false
let energyStatusBar : StatusBarSprite = null
let nearestSprite : Sprite = null
let nearestLengthAway = 0
let weapon = ""
let isMining = false
let brokenBlocks : tiles.Location[] = []
let usingFlamethrower = false
let canShoot = false
let list2 : Inventory.Item[] = []
let _1stTimeHud = false
let flamethrower : Inventory.Item = null
let airstrike : Inventory.Item = null
let gun : Inventory.Item = null
let copper : Inventory.Item = null
let iron : Inventory.Item = null
let stone : Inventory.Item = null
let coal : Inventory.Item = null
let dirt : Inventory.Item = null
let Energy_recharge_rate = 0
let Energy_capacity = 0
let Mining_speed = 0
let In_upgrade_menu = 0
let coalQuantity = 0
let dirtQuantity = 0
let ironQuantity = 0
let stoneQuantity = 0
let inventoryContents = 0
let miningEfficiency = 0
let inInventory = false
let jump = false
let Gravity = 0
let Player_character : Sprite = null
let Base : Sprite = null
let breakingTileSprite : Sprite = null
let In_Base = false
stats.turnStats(true)
scene.setBackgroundImage(img`
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffcffffffffffcffffffffffffffffffffffffffffcffffffffffcffffffffffffffffffffffffffffcffffffffffcffffffffffffffffffffffffffffcffffffffffcffffffffffffffffffffff
        ffffffffffffffffcbcffffffffffffffffffffcffffffffffffffffcbcffffffffffffffffffffcffffffffffffffffcbcffffffffffffffffffffcffffffffffffffffcbcffffffffffffffffffffc
        fffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffff
        fffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcffffffffffff
        fff3fffffffffffffffffffffbbbfffffffffffffff3fffffffffffffffffffffbbbfffffffffffffff3fffffffffffffffffffffbbbfffffffffffffff3fffffffffffffffffffffbbbffffffffffff
        ffb3bffffffffffffffffffffcbcffffffffffffffb3bffffffffffffffffffffcbcffffffffffffffb3bffffffffffffffffffffcbcffffffffffffffb3bffffffffffffffffffffcbcffffffffffff
        f33333ffffffffffffccfffffffffffffffffffff33333ffffffffffffccfffffffffffffffffffff33333ffffffffffffccfffffffffffffffffffff33333ffffffffffffccffffffffffffffffffff
        ff3b3fffffffffffffccffffffffffffffffffffff3b3fffffffffffffccffffffffffffffffffffff3b3fffffffffffffccffffffffffffffffffffff3b3fffffffffffffccffffffffffffffffffff
        ffbfbfffffffffffffffffffffffffffffcfffffffbfbfffffffffffffffffffffffffffffcfffffffbfbfffffffffffffffffffffffffffffcfffffffbfbfffffffffffffffffffffffffffffcfffff
        fffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcffff
        fffffffffffcffffffffffffffffffffffcffffffffffffffffcffffffffffffffffffffffcffffffffffffffffcffffffffffffffffffffffcffffffffffffffffcffffffffffffffffffffffcfffff
        ffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffffffffffffffcbcfffffffffffffffffffffffffff
        fffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        fcfffffffffffffffffffffffffcfffffffffffffcfffffffffffffffffffffffffcfffffffffffffcfffffffffffffffffffffffffcfffffffffffffcfffffffffffffffffffffffffcffffffffffff
        fffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffffffffffffffffffffffffffffffffffffffcfffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        ffffffccfffffcffffffffffffffffffffffffffffffffccfffffcffffffffffffffffffffffffffffffffccfffffcffffffffffffffffffffffffffffffffccfffffcffffffffffffffffffffffffff
        ffffffccfffffffffffffcccccccccccffffffffffffffccfffffffffffffcccccccccccffffffffffffffccfffffffffffffcccccccccccffffffffffffffccfffffffffffffcccccccccccffffffff
        ffffffffffffffffccccccccccccccccccccffffffffffffffffffffccccccccccccccccccccffffffffffffffffffffccccccccccccccccccccffffffffffffffffffffccccccccccccccccccccffff
        fffffffffffffccccccccccccccccccccccccccffffffffffffffccccccccccccccccccccccccccffffffffffffffccccccccccccccccccccccccccffffffffffffffccccccccccccccccccccccccccf
        ccfffffffffcccccccccccccccccccccccccccccccfffffffffcccccccccccccccccccccccccccccccfffffffffcccccccccccccccccccccccccccccccfffffffffccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
        bbbbbbbbbbbbccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccbbbbbbbb
        bbbbbbbbbbbbbbbbbccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccbbbbbbbbbbbbb
        bbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbb
        bbbbbbbbb3333333bbbbbbbbb33cbbbbbbbbbbbbbbbbbbbbb3333333bbbbbbbbb33cbbbbbbbbbbbbbbbbbbbbb3333333bbbbbbbbb33cbbbbbbbbbbbbbbbbbbbbb3333333bbbbbbbbb33cbbbbbbbbbbbb
        bbbbbbb33cccccbb33bbbbbbbccbbccbbbbbbbbbbbbbbbb33cccccbb33bbbbbbbccbbccbbbbbbbbbbbbbbbb33cccccbb33bbbbbbbccbbccbbbbbbbbbbbbbbbb33cccccbb33bbbbbbbccbbccbbbbbbbbb
        bbbbbbbcccbbbbbcccbbbbbbbbccccbbbbbbbbbbbbbbbbbcccbbbbbcccbbbbbbbbccccbbbbbbbbbbbbbbbbbcccbbbbbcccbbbbbbbbccccbbbbbbbbbbbbbbbbbcccbbbbbcccbbbbbbbbccccbbbbbbbbbb
        3bbbbbbbcccccccccbbbbbbbbbbbbbbb333333333bbbbbbbcccccccccbbbbbbbbbbbbbbb333333333bbbbbbbcccccccccbbbbbbbbbbbbbbb333333333bbbbbbbcccccccccbbbbbbbbbbbbbbb33333333
        333bbbbbbbcccccbbbbbbbbbbbbbbb333ccbbbbb333bbbbbbbcccccbbbbbbbbbbbbbbb333ccbbbbb333bbbbbbbcccccbbbbbbbbbbbbbbb333ccbbbbb333bbbbbbbcccccbbbbbbbbbbbbbbb333ccbbbbb
        cc3bbbbbbbbbbbbbbbbbbbbbbbbbbb3cccbbbccccc3bbbbbbbbbbbbbbbbbbbbbbbbbbb3cccbbbccccc3bbbbbbbbbbbbbbbbbbbbbbbbbbb3cccbbbccccc3bbbbbbbbbbbbbbbbbbbbbbbbbbb3cccbbbccc
        cccbbbbbbbbbbbb333bbbbbb3bbbbbcccbbbbbcccccbbbbbbbbbbbb333bbbbbb3bbbbbcccbbbbbcccccbbbbbbbbbbbb333bbbbbb3bbbbbcccbbbbbcccccbbbbbbbbbbbb333bbbbbb3bbbbbcccbbbbbcc
        cccbbbbbbbbbbbb333bbbbbbbbbbbbcccccccccccccbbbbbbbbbbbb333bbbbbbbbbbbbcccccccccccccbbbbbbbbbbbb333bbbbbbbbbbbbcccccccccccccbbbbbbbbbbbb333bbbbbbbbbbbbcccccccccc
        cbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccc
        bbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb3333bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        bbb333333bbb33ddddddddddddddddd33bbbbbbbbbb333333bbb33ddddddddddddddddd33bbbbbbbbbb333333bbb33ddddddddddddddddd33bbbbbbbbbb333333bbb33ddddddddddddddddd33bbbbbbb
        bbb33333ddddddddddddddddddddddddddddd3bbbbb33333ddddddddddddddddddddddddddddd3bbbbb33333ddddddddddddddddddddddddddddd3bbbbb33333ddddddddddddddddddddddddddddd3bb
        dddddddddddddddddddddddddddddddd33333ddddddddddddddddddddddddddddddddddd33333ddddddddddddddddddddddddddddddddddd33333ddddddddddddddddddddddddddddddddddd33333ddd
        dddddddddddddd3333333333ddddddd33dddd33ddddddddddddddd3333333333ddddddd33dddd33ddddddddddddddd3333333333ddddddd33dddd33ddddddddddddddd3333333333ddddddd33dddd33d
        dddddddddddd333ddddddddd33dddddbbbbbbbbddddddddddddd333ddddddddd33dddddbbbbbbbbddddddddddddd333ddddddddd33dddddbbbbbbbbddddddddddddd333ddddddddd33dddddbbbbbbbbd
        ddddddddddd333d3bbbbbbbbd33dddddbbbbbbddddddddddddd333d3bbbbbbbbd33dddddbbbbbbddddddddddddd333d3bbbbbbbbd33dddddbbbbbbddddddddddddd333d3bbbbbbbbd33dddddbbbbbbdd
        ddddddddddd33bbbbbbbbbbbb33dddddddddddddddddddddddd33bbbbbbbbbbbb33dddddddddddddddddddddddd33bbbbbbbbbbbb33dddddddddddddddddddddddd33bbbbbbbbbbbb33ddddddddddddd
        ddddddddddddbbbbbbbbbbbbbbddddddddddddddddddddddddddbbbbbbbbbbbbbbddddddddddddddddddddddddddbbbbbbbbbbbbbbddddddddddddddddddddddddddbbbbbbbbbbbbbbdddddddddddddd
        ddddddddddddd3bbbbbbbbbb3dddddddddddddddddddddddddddd3bbbbbbbbbb3dddddddddddddddddddddddddddd3bbbbbbbbbb3dddddddddddddddddddddddddddd3bbbbbbbbbb3ddddddddddddddd
        d333333ddddddddd333333ddddddddddddddddddd333333ddddddddd333333ddddddddddddddddddd333333ddddddddd333333ddddddddddddddddddd333333ddddddddd333333dddddddddddddddddd
        333333333dddddddddddddddddddddddddddddd3333333333dddddddddddddddddddddddddddddd3333333333dddddddddddddddddddddddddddddd3333333333dddddddddddddddddddddddddddddd3
        33333333dddddddddddddddddddddddddddddddd33333333dddddddddddddddddddddddddddddddd33333333dddddddddddddddddddddddddddddddd33333333dddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333d
        33ddddddddddddddddddddd333dddddddddddd3333ddddddddddddddddddddd333dddddddddddd3333ddddddddddddddddddddd333dddddddddddd3333ddddddddddddddddddddd333dddddddddddd33
        d333ddddddddddddddddd333ddddddddddddddddd333ddddddddddddddddd333ddddddddddddddddd333ddddddddddddddddd333ddddddddddddddddd333ddddddddddddddddd333dddddddddddddddd
        ddd33ddddddddddddddd33dddd3bbbbbbbbbbb3dddd33ddddddddddddddd33dddd3bbbbbbbbbbb3dddd33ddddddddddddddd33dddd3bbbbbbbbbbb3dddd33ddddddddddddddd33dddd3bbbbbbbbbbb3d
        b3dd3ddddddddddddddd3dd3bbbbbbbbbbbbbbbbb3dd3ddddddddddddddd3dd3bbbbbbbbbbbbbbbbb3dd3ddddddddddddddd3dd3bbbbbbbbbbbbbbbbb3dd3ddddddddddddddd3dd3bbbbbbbbbbbbbbbb
        bb333ddddddddddddddd33bbbbbbbbbbbbbbbbbbbb333ddddddddddddddd33bbbbbbbbbbbbbbbbbbbb333ddddddddddddddd33bbbbbbbbbbbbbbbbbbbb333ddddddddddddddd33bbbbbbbbbbbbbbbbbb
        bbb3dddddddddddddddd3bbbbbbbbbbbbbbbbbbbbbb3dddddddddddddddd3bbbbbbbbbbbbbbbbbbbbbb3dddddddddddddddd3bbbbbbbbbbbbbbbbbbbbbb3dddddddddddddddd3bbbbbbbbbbbbbbbbbbb
        b3ddddddddddddddddddd3bbbbbbbbbbbbbbbbbbb3ddddddddddddddddddd3bbbbbbbbbbbbbbbbbbb3ddddddddddddddddddd3bbbbbbbbbbbbbbbbbbb3ddddddddddddddddddd3bbbbbbbbbbbbbbbbbb
        dddddddddddddddddddddddd3bbbbbbbbbbbbb33dddddddddddddddddddddddd3bbbbbbbbbbbbb33dddddddddddddddddddddddd3bbbbbbbbbbbbb33dddddddddddddddddddddddd3bbbbbbbbbbbbb33
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
        dddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333ddddddddddddddddddddddddddd3333333333333ddddddddddddddddd
        dddddd333333333333333333333ddddddddddddddddddd333333333333333333333ddddddddddddddddddd333333333333333333333ddddddddddddddddddd333333333333333333333ddddddddddddd
        dddd3333333333333333ddd3333333dddddddddddddd3333333333333333ddd3333333dddddddddddddd3333333333333333ddd3333333dddddddddddddd3333333333333333ddd3333333dddddddddd
        dd3333333333333333333dddddd333333ddddddddd3333333333333333333dddddd333333ddddddddd3333333333333333333dddddd333333ddddddddd3333333333333333333dddddd333333ddddddd
        3333333333333333333333ddddddddddddddd3333333333333333333333333ddddddddddddddd3333333333333333333333333ddddddddddddddd3333333333333333333333333ddddddddddddddd333
        33333333333333333333333333dddddddd33333333333333333333333333333333dddddddd33333333333333333333333333333333dddddddd33333333333333333333333333333333dddddddd333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
`)
tiles.setCurrentTilemap(tilemap`
    Planet part 1
`)
In_Base = false
breakingTileSprite = sprites.create(img`
        . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . .
    `, SpriteKind.other)
breakingTileSprite.setFlag(SpriteFlag.AutoDestroy, false)
breakingTileSprite.setFlag(SpriteFlag.Invisible, true)
Base = sprites.create(img`
        ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ..................................................................fffffffff.....................
            ................................................................ff888888888ff...................
            ...............................................................f8888888888888f..................
            ..............................................................f888888888888888f.................
            .............................................................f88888888888888888f................
            ............................................................f8888888888888888888f...............
            ............................................................f8888888888888888888f...............
            ...........................................................f888888888888888888888f..............
            ...........................................................f888888888888888888888f..............
            ...........................................................f888888888888888888888f..............
            ...........................................................f888888888888888888888f..............
            ...........................................................f888888888888888888888f..............
            ...........................................................f888888888888888888888f..............
            ...........................................................f888888888888888888888f..............
            ......ffffffffffffffffffffffffffffffffffffffffffffffffffffff888888888888888888888fffffff........
            ......f1111111111111111111111111111111111111111111111111111f888888888888888888888f11111f........
            ......f11111111111111111111111111111111111111111111111111111f8888888888888888888f111111f........
            ......f11111111111111111111111111111111111111111111111111111f8888888888888888888f111111f........
            ......f111111111111111111111111111111111111111111111111111111f88888888888888888f1111111f........
            ......f1111111111111111111111111111111111111111111111111111111f888888888888888f11111111f........
            ......f11111111111111111111fffffffff111111111111111111111111111f8888888888888f111111111f........
            ......f111111111111111111ff888888888ff11111111111111111111111111ff888888888ff1111111111f........
            ......f11111111111111111f8888888888888f111111111111111111111111111fffffffff111111111111f........
            ...fffffff1111111111111f888888888888888f11111111111111111111111111111111111111111111111f........
            ..f8888888f11111111111f88888888888888888f1111111111111111111111111111111111111111111111f........
            .f888888888f111111111f8888888888888888888f111111111111111111111111111111111111111111111f........
            .f888888888f111111111f8888888888888888888f111111111111111111111111111111ffffffffffffff1f........
            .f888888888f11111111f888888888888888888888f11111111111111111111111111111f111111111111f1f........
            .f888888888f11111111f888888888888888888888f11111111111111111111111111111f11aaa1221111f1f........
            .f888888888f11111111f888888888888888888888f11111111111111111111111111111f11aaa1221661f1f........
            .f888888888f11111111f888888888888888888888f11111111111111111111111111111f11aaa1111661f1f........
            .f888888888f11111111f888888888888888888888f1111111ffffffffffffffff111111f111111111111f1f........
            ..f8888888f111111111f888888888888888888888f1111111fddddddddddddddf111111ffffffffffffff1f........
            ...fffffff1111111111f888888888888888888888f1111111fddddddddddddddf111111111111111111111f........
            ......f1111111111111f888888888888888888888f1111111fddddddddddddddf111111111111111111111f........
            ......f1111111111111f888888888888888888888f1111111fddddddddddddddf111111111111111111111f........
            ......f11111111111111f8888888888888888888f11111111fddddddddddddddf111111111111111111111f........
            ......f11111111111111f8888888888888888888f11111111fddddddddddddddf111111111111111fffffff........
            ......f111111111111111f88888888888888888f111111111fddddddddddddddf1111111111111ff8888888ff......
            ......f1111111111111111f888888888888888f1111111111fddddddddddddddf111111111111f88888888888f.....
            ......f11111111111111111f8888888888888f11111111111fddddddddddddddf111111111111f88888888888f.....
            ......f1111111fffffff1111ff888888888ff111111111111fddddddddddddddf11111111111f8888888888888f....
            ......f111111f1111111f11111fffffffff11111111111111fddddddddddddddf11111111111f8888888888888f....
            ......f11111f111111111f111111111111111111111111111fddddddddddddddf11111111111f8888888888888f....
            ......f1111f112221aaa11f11111111111111111111111111fddddddddddddddf11111111111f8888888888888f....
            ......f1111f112221aaa11f11111111111111111111111111fddddddddddddddf11111111111f8888888888888f....
            ......f1111f112221aaa11f11111111111111111111111111fddddddddddddddf11111111111f8888888888888f....
            ......f1111f11111111111f11111111111111111111111111fddddddddddddddf11111111111f8888888888888f....
            ......f1111f11888141511f11111111111111111111111111fddddddddddddddf111111111111f88888888888f.....
            ......f1111f11888111111f11111111111111111111111111fddddddddddddddf111111111111f88888888888f.....
            ......f1111f11888121711f11111111111111111111111111fddddddddddddddf1111111111111ff8888888ff......
            ......f11111f111111111f111111111111111111111111111fddddddddddddddf111111111111111fffffff........
            ......f111111f1111111f1111111111111111111111111111fddddddddddddddf111111111111111111111f........
            ......f1111111fffffff11111111111111111111111111111fddddddddddddddf111111111111111111111f........
            ......f1111111111111111111111111111111111111111111fddddddddddddddf111111111111111111111f........
            ......ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff........
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
            ................................................................................................
    `, SpriteKind.Structure)
Player_character = sprites.create(img`
        ................
            .......11.......
            ......1ff1......
            .....1ffff1.....
            .....1ffff1.....
            ......1ff1......
            .......11.......
            ...1111111111...
            ..111111111111..
            ..11.111111.11..
            ..11.1ffff1.11..
            ..11.1f29f1.11..
            ..11.1ffff1.11..
            ..ff.111111.ff..
            .....11..11.....
            .....11..11.....
            .....11..11.....
            .....11..11.....
            ....111..111....
            ....fff..fff....
    `, SpriteKind.Player)
let textSprite = sprites.create(img`
        . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . .
    `, SpriteKind.textSprites)
Gravity = 0.5
jump = false
let gto_base_said = false
inInventory = false
miningEfficiency = 100
inventoryContents = 0
stoneQuantity = 0
ironQuantity = 0
dirtQuantity = 0
coalQuantity = 0
In_upgrade_menu = 0
Mining_speed = 500
Energy_capacity = 10
Energy_recharge_rate = 1000
dirt = Inventory.create_item("Dirt", assets.image`
        coal2Art
    `, "Dug up from the ground")
coal = Inventory.create_item("Coal", img`
        b b b b b b b b b b b b b b b b 
            b b b b b b b b b b b b b b b b 
            b b b b f f f b b b b b b b b b 
            b b b b f f f b b b b b b b b b 
            b b b b f f f b b b b b b b b b 
            b b b b b b b b b b f f f f b b 
            b b b b b b b b b b f f f f b b 
            b b b b b b f f b b f f f f b b 
            b b b b b b f f b b f f f f b b 
            b b b b b b f f b b f f f f b b 
            b b b b b b b b b b b b b b b b 
            b b f f f b b b b b b b b b b b 
            b b f f f b b b b b f f f f b b 
            b b b b b b b b b b f f f f b b 
            b b b b b b b b b b f f f f b b 
            b b b b b b b b b b b b b b b b
    `, "Dug up from the ground")
stone = Inventory.create_item("Stone", assets.tile`
        Stone
    `, "Dug up from the ground")
iron = Inventory.create_item("iron", assets.tile`
        Iron
    `, "Dug up from the ground")
copper = Inventory.create_item("copper", assets.tile`
        Copper
    `, "Dug up from the ground")
gun = Inventory.create_item("Gun", assets.image`
    rocket
`, "Goes Kaboom")
airstrike = Inventory.create_item("Airstrike", assets.image`
    gun
`, "Goes Kaboom")
flamethrower = Inventory.create_item("Flamethrower", img`
        . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . 2 
            . . . . . . . . . . . . . 2 2 2 
            . . . . . . . . . . . . 4 4 4 2 
            e e b b b b b b b b b b 5 5 4 2 
            e e b b b b b b b b b b 5 5 4 2 
            e e . f . . . . . . . . 4 4 4 2 
            e e f f . . . . . . . . . 2 2 2 
            . . . . . . . . . . . . . . . 2 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . .
    `, "Goes Kaboom")
_1stTimeHud = false
list2 = [dirt, stone, coal, iron, copper]
canShoot = true
usingFlamethrower = false
brokenBlocks = []
isMining = false
scene.cameraFollowSprite(Player_character)
tiles.placeOnTile(Base, tiles.getTileLocation(51, 12))
tiles.placeOnTile(Player_character, tiles.getTileLocation(47, 13))
controller.moveSprite(Player_character, 50, 0)
weapon = "gun"
Ores()
Keybinds.setSimulatorKeymap(Keybinds.PlayerNumber.TWO, Keybinds.CustomKey.UP, Keybinds.CustomKey.DOWN, Keybinds.CustomKey.LEFT, Keybinds.CustomKey.RIGHT, Keybinds.CustomKey.I, Keybinds.CustomKey.ZERO)
Keybinds.setSimulatorKeymap(Keybinds.PlayerNumber.THREE, Keybinds.CustomKey.E, Keybinds.CustomKey.Q, Keybinds.CustomKey.K, Keybinds.CustomKey.K, Keybinds.CustomKey.K, Keybinds.CustomKey.K)
activateInventory(true)
activateInventory(false)
GROWTrees()
hideTiles()
spawnEnemies()
hud(true)
for (let value14 of tiles.getTilesByType(assets.tile`
    myTile8
`)) {
    showTiles(value14.column, value14.row)
}
makeWeaponToolbar(true)
HUDAmmo()
game.onUpdate(function on_on_update() {
    if (toolbar) {
        if (!In_Base || !inInventory) {
            toolbar.update()
        }
        
    }
    
})
game.onUpdate(function on_on_update2() {
    if (Player_character) {
        Player_character.vy += Gravity
    }
    
})
forever(function on_forever() {
    if (healthStatusBar) {
        if (healthStatusBar.value < 1) {
            respawnAtBase()
        }
        
    }
    
})
forever(function on_forever2() {
    if (energyStatusBar && Energy_recharge_rate) {
        if (energyStatusBar.value < 100) {
            energyStatusBar.value += 50 / Energy_capacity / 1.75
            pause(Energy_recharge_rate)
        }
        
    }
    
})
forever(function on_forever3() {
    
    if (Player_character) {
        if (playerOnFire) {
            Player_character.startEffect(effects.fire)
            for (let index22 = 0; index22 < 7; index22++) {
                pause(50)
                healthChange(randint(-1, -4))
            }
            playerOnFire = false
            effects.clearParticles(Player_character)
        }
        
    }
    
})
forever(function on_forever4() {
    enemyBehaviour()
})
forever(function on_forever5() {
    if (healthStatusBar) {
        if (healthStatusBar.value < 100) {
            healthChange(randint(4, 10))
            pause(1000)
        }
        
    }
    
})
forever(function on_forever6() {
    if (toolbar) {
        if (airstrikeCooldown) {
            airstrikeCooldown.value += 5
        }
        
        if (gunAmmo) {
            gunAmmo.value += 5
        }
        
        if (flamethrowerCooldown) {
            flamethrowerCooldown.value += 4
        }
        
        pause(500)
    }
    
})
forever(function on_forever7() {
    for (let value15 of sprites.allOfKind(SpriteKind.aboveEnemy)) {
        if (statusbars.getStatusBarAttachedTo(StatusBarKind.Health, value15).value < 1) {
            sprites.destroy(statusbars.getStatusBarAttachedTo(StatusBarKind.Health, value15))
            sprites.destroy(value15)
        }
        
    }
})
forever(function on_forever8() {
    // healthChange(-1)
    //  a forever loop for testing death errors
    
})
forever(function on_forever9() {
    for (let value16 of sprites.allOfKind(SpriteKind.aboveEnemy)) {
        if (sprites.readDataNumber(value16, "shotCooldown") > 0) {
            sprites.setDataNumber(value16, "shotCooldown", sprites.readDataNumber(value16, "shotCooldown") - 1)
        }
        
    }
    pause(1)
})
