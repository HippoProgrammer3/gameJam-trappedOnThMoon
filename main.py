class ActionKind(Enum):
    Walking = 0
    Idle = 1
    Jumping = 2
@namespace
class SpriteKind:
    Structure = SpriteKind.create()
    textSprites = SpriteKind.create()
    Woodythings = SpriteKind.create()
    Upgrade_menu = SpriteKind.create()
    aboveEnemy = SpriteKind.create()
    explodingProjectile = SpriteKind.create()
    Interaction_sprite = SpriteKind.create()
    other = SpriteKind.create()
    damageIndicator = SpriteKind.create()
    gunBullets = SpriteKind.create()
    airstrikeMissile = SpriteKind.create()
    fire = SpriteKind.create()
@namespace
class StatusBarKind:
    ammo = StatusBarKind.create()
def nearestEnemy():
    global nearestLengthAway, nearestSprite
    nearestLengthAway = 9999999
    for value in sprites.all_of_kind(SpriteKind.aboveEnemy):
        if nearestLengthAway > spriteutils.distance_between(Player_character, value):
            nearestLengthAway = spriteutils.distance_between(Player_character, value)
            nearestSprite = value
def enemyBehaviour():
    for value2 in sprites.all_of_kind(SpriteKind.aboveEnemy):
        if statusbars.get_status_bar_attached_to(StatusBarKind.health, value2).value < 1:
            sprites.destroy(statusbars.get_status_bar_attached_to(StatusBarKind.health, value2))
            sprites.destroy(value2)
            pass
        else:
            if spriteutils.distance_between(Player_character, value2) < 100:
                sprites.set_data_boolean(value2, "canSeePlayer", True)
                pass
            elif spriteutils.distance_between(Player_character, value2) > 100:
                sprites.set_data_boolean(value2, "canSeePlayer", False)
                pass
            if sprites.read_data_boolean(value2, "canSeePlayer"):
                enemyShoot(sprites.read_data_image(value2, "projectile"),value2,Player_character,50)
                if spriteutils.distance_between(Player_character, value2) < 50:
                    value2.set_velocity(0, -10)
                    pass
                else:
                    spriteutils.set_velocity_at_angle(value2, spriteutils.angle_from(value2, Player_character), 15)
                    pass
            else:
                value2.vx = 15
                pass
def on_up_pressed():
    global jump
    if not (inInventory) and Player_character.is_hitting_tile(CollisionDirection.BOTTOM) and not (energyStatusBar.value < 5):
        Player_character.vy = -50
        jump = True
        energyStatusBar.value += 0 - 50 / Energy_capacity
    else:
        pass
    Mine(2, miningEfficiency)
controller.up.on_event(ControllerButtonEvent.PRESSED, on_up_pressed)

def on_hit_wall(sprite, location):
    global jump
    jump = False
scene.on_hit_wall(SpriteKind.player, on_hit_wall)

def on_b_pressed():
    if Player_character.overlaps_with(Base):
        gotoBase(True)
    elif In_Base:
        gotoBase(False)
controller.B.on_event(ControllerButtonEvent.PRESSED, on_b_pressed)

def on_on_overlap(sprite2, otherSprite):
    sprites.destroy(sprite2)
    statusbars.get_status_bar_attached_to(StatusBarKind.health, otherSprite).value += randint(-80, -120)
sprites.on_overlap(SpriteKind.airstrikeMissile,
    SpriteKind.aboveEnemy,
    on_on_overlap)

def on_on_overlap2(sprite3, otherSprite2):
    global playerOnFire
    sprites.destroy(otherSprite2)
    playerOnFire = True
    healthChange(-10)
sprites.on_overlap(SpriteKind.player,
    SpriteKind.explodingProjectile,
    on_on_overlap2)

def BlockBreak(col: number, row: number, block: number, miningSpeed: number):
    global isMining
    isMining = True
    breakingTileSprite.set_flag(SpriteFlag.INVISIBLE, False)
    energyStatusBar.value += 0 - 50 / Energy_capacity
    tiles.place_on_tile(breakingTileSprite, tiles.get_tile_location(col, row))
    breakingTileSprite.set_image(img("""
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
    """))
    pause(miningSpeed)
    breakingTileSprite.set_image(img("""
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
    """))
    pause(miningSpeed)
    breakingTileSprite.set_image(img("""
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
    """))
    pause(miningSpeed)
    tiles.set_tile_at(tiles.get_tile_location(col, row),
        assets.tile("""
            myTile8
        """))
    breakingTileSprite.set_flag(SpriteFlag.INVISIBLE, True)
    tiles.set_wall_at(tiles.get_tile_location(col, row), False)
    showTiles(col, row)
    isMining = False
    brokenBlocks.append(tiles.get_tile_location(col, row))
def gotoBase(goto: bool):
    global Gravity, In_Base, previousTilemap, In_upgrade_menu
    if goto:
        Gravity = 0
        In_Base = goto
        saveTilemap()
        tiles.set_current_tilemap(tilemap("""
            Inside Base
        """))
        scene.set_background_image(img("""
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
        """))
        tiles.place_on_tile(Player_character, tiles.get_tile_location(3, 26))
        previousTilemap = 0
        Player_character.set_velocity(0, 0)
        controller.move_sprite(Player_character, 50, 50)
        sprites.destroy_all_sprites_of_kind(SpriteKind.Woodythings)
        hud(False)
    else:
        Gravity = 0.8
        In_Base = goto
        tiles.set_current_tilemap(tilemap("""
            Planet part 1
        """))
        loadTilemap()
        GROWTrees()
        hideTiles()
        scene.set_background_image(img("""
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
        """))
        tiles.place_on_tile(Player_character, tiles.get_tile_location(52, 13))
        controller.move_sprite(Player_character, 50, 0)
        for value22 in minedLocations:
            showTiles(value22.column, value22.row)
        In_upgrade_menu = 0
        hud(True)
        Player_character.set_image(img("""
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
        """))
def loadTilemap():
    for value3 in minedLocations:
        tiles.set_tile_at(value3, assets.tile("""
            myTile8
        """))
        tiles.set_wall_at(value3, False)
    for value4 in coalLocations:
        tiles.set_tile_at(value4, assets.tile("""
            Coal
        """))
    for value5 in ironLocations:
        tiles.set_tile_at(value5, assets.tile("""
            Iron
        """))
    for value6 in copperLocations:
        tiles.set_tile_at(value6, assets.tile("""
            Copper
        """))
    for value7 in dirtLocations:
        tiles.set_tile_at(value7, assets.tile("""
            myTile3
        """))
    for value8 in stoneLocations:
        tiles.set_tile_at(value8, assets.tile("""
            Stone
        """))
def makeWeaponToolbar(make: bool):
    global toolbar
    if make:
        toolbar = Inventory.create_toolbar([gun, airstrike, flamethrower], 3)
        toolbar.set_position(106, 106)
        toolbar.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
    else:
        pass
def GROWTrees():
    global Tree, Tree_spawn_x, Tree_spawn_y
    for value13 in tiles.get_tiles_by_type(assets.tile("""
        myTile25
    """)):
        Tree = sprites.create(img("""
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
            """),
            SpriteKind.Woodythings)
        Tree_spawn_x = value13.column
        Tree_spawn_y = value13.row
        tiles.place_on_tile(Tree, tiles.get_tile_location(Tree_spawn_x, Tree_spawn_y))
        tiles.set_tile_at(value13, assets.tile("""
            transparency16
        """))

def on_a_pressed():
    global Gravity, In_upgrade_menu
    if In_Base and tiles.tile_at_location_equals(Player_character.tilemap_location(),
        assets.tile("""
            myTile16
        """)) and In_upgrade_menu == 0:
        Player_character.set_image(img("""
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
        """))
        Gravity = 0
        tiles.set_current_tilemap(tilemap("""
            Upgrades
        """))
        tiles.place_on_tile(Player_character, tiles.get_tile_location(7, 3))
        Player_character.set_velocity(0, 0)
        controller.move_sprite(Player_character, 50, 50)
        In_upgrade_menu = 1
        Spawn_menu_upgrades_text()
    elif In_Base and In_upgrade_menu == 1:
        I_just_wanted_to_shrink_the_upgrade_menu_section()
    else:
        pass
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

def on_player2_button_a_pressed():
    if not (inInventory):
        activateInventory(True)
    else:
        activateInventory(False)
controller.player2.on_button_event(ControllerButton.A,
    ControllerButtonEvent.PRESSED,
    on_player2_button_a_pressed)

def on_player2_button_down_pressed():
    shoot(2)
controller.player2.on_button_event(ControllerButton.DOWN,
    ControllerButtonEvent.PRESSED,
    on_player2_button_down_pressed)

def Ores():
    global tempOreRandomizer
    for value9 in tiles.get_tiles_by_type(assets.tile("""
        myTile5
    """)):
        tempOreRandomizer = randint(1, 10)
        if tempOreRandomizer > 5:
            if randint(0, 1) == 0:
                tiles.set_tile_at(value9, assets.tile("""
                    Stone
                """))
            else:
                tiles.set_tile_at(value9, assets.tile("""
                    Stone
                """))
        else:
            tiles.set_tile_at(value9, assets.tile("""
                myTile3
            """))
    for value10 in tiles.get_tiles_by_type(assets.tile("""
        myTile6
    """)):
        tempOreRandomizer = randint(1, 200)
        if tempOreRandomizer < 6:
            tiles.set_tile_at(value10, assets.tile("""
                Coal
            """))
        elif tempOreRandomizer < 10:
            tiles.set_tile_at(value10, assets.tile("""
                Copper
            """))
        elif tempOreRandomizer < 13:
            tiles.set_tile_at(value10, assets.tile("""
                Iron
            """))
        else:
            tiles.set_tile_at(value10, assets.tile("""
                Stone
            """))
    for value11 in tiles.get_tiles_by_type(assets.tile("""
        myTile7
    """)):
        tempOreRandomizer = randint(1, 300)
        if tempOreRandomizer < 6:
            tiles.set_tile_at(value11, assets.tile("""
                Coal
            """))
        elif tempOreRandomizer < 10:
            tiles.set_tile_at(value11, assets.tile("""
                Copper
            """))
        elif tempOreRandomizer < 13:
            tiles.set_tile_at(value11, assets.tile("""
                Iron
            """))
        elif tempOreRandomizer < 16:
            tiles.set_tile_at(value11, assets.tile("""
                myTile28
            """))
        elif tempOreRandomizer < 19:
            tiles.set_tile_at(value11, assets.tile("""
                myTile13
            """))
        elif tempOreRandomizer < 21:
            tiles.set_tile_at(value11, assets.tile("""
                myTile12
            """))
        else:
            tiles.set_tile_at(value11, assets.tile("""
                Stone
            """))
        startingSaveTilemap()

def on_on_overlap3(sprite4, otherSprite3):
    sprites.destroy(sprite4)
    statusbars.get_status_bar_attached_to(StatusBarKind.health, otherSprite3).value += randint(0, -5)
sprites.on_overlap(SpriteKind.fire, SpriteKind.aboveEnemy, on_on_overlap3)

def Mine(direction_down__1_up__2_left__3_right__4: number, cooldown: number):
    global whereToBreakCol, whereToBreakRow, Type_of_block_being_mined
    if not (isMining) and not (energyStatusBar.value < 5):
        if direction_down__1_up__2_left__3_right__4 == 1:
            if Player_character.tile_kind_at(TileDirection.BOTTOM, assets.tile("""
                Stone
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                addToInventory(1)
            if Player_character.tile_kind_at(TileDirection.BOTTOM, assets.tile("""
                myTile
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                Type_of_block_being_mined = 0
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.BOTTOM, assets.tile("""
                myTile0
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.BOTTOM, assets.tile("""
                myTile1
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 2, cooldown)
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.BOTTOM, assets.tile("""
                myTile3
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.BOTTOM, assets.tile("""
                Coal
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(3)
            if Player_character.tile_kind_at(TileDirection.BOTTOM, assets.tile("""
                Iron
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(4)
            if Player_character.tile_kind_at(TileDirection.BOTTOM, assets.tile("""
                Copper
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.BOTTOM).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(5)
        elif direction_down__1_up__2_left__3_right__4 == 3:
            if Player_character.tile_kind_at(TileDirection.LEFT, assets.tile("""
                Stone
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 6, cooldown)
                Type_of_block_being_mined = 6
                addToInventory(1)
            if Player_character.tile_kind_at(TileDirection.LEFT, assets.tile("""
                myTile
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                Type_of_block_being_mined = 0
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.LEFT, assets.tile("""
                myTile0
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                Type_of_block_being_mined = 1
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.LEFT, assets.tile("""
                myTile1
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 2, cooldown)
                Type_of_block_being_mined = 2
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.LEFT, assets.tile("""
                myTile3
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                Type_of_block_being_mined = 5
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.LEFT, assets.tile("""
                Coal
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(3)
            if Player_character.tile_kind_at(TileDirection.LEFT, assets.tile("""
                Iron
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(4)
            if Player_character.tile_kind_at(TileDirection.LEFT, assets.tile("""
                Copper
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.LEFT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(5)
        elif direction_down__1_up__2_left__3_right__4 == 4:
            if Player_character.tile_kind_at(TileDirection.RIGHT, assets.tile("""
                Stone
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                Type_of_block_being_mined = 6
                addToInventory(1)
            if Player_character.tile_kind_at(TileDirection.RIGHT, assets.tile("""
                myTile
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                Type_of_block_being_mined = 0
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.RIGHT, assets.tile("""
                myTile0
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                Type_of_block_being_mined = 1
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.RIGHT, assets.tile("""
                myTile1
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 2, cooldown)
                Type_of_block_being_mined = 2
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.RIGHT, assets.tile("""
                myTile3
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                Type_of_block_being_mined = 5
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.RIGHT, assets.tile("""
                Coal
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(3)
            if Player_character.tile_kind_at(TileDirection.RIGHT, assets.tile("""
                Iron
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(4)
            if Player_character.tile_kind_at(TileDirection.BOTTOM, assets.tile("""
                Copper
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.RIGHT).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(5)
        elif direction_down__1_up__2_left__3_right__4 == 2:
            if Player_character.tile_kind_at(TileDirection.TOP, assets.tile("""
                Stone
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                addToInventory(1)
            if Player_character.tile_kind_at(TileDirection.TOP, assets.tile("""
                myTile
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 0, cooldown)
                Type_of_block_being_mined = 0
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.TOP, assets.tile("""
                myTile0
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 1, cooldown)
                Type_of_block_being_mined = 1
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.TOP, assets.tile("""
                myTile1
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 2, cooldown)
                Type_of_block_being_mined = 2
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.TOP, assets.tile("""
                myTile3
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                Type_of_block_being_mined = 5
                addToInventory(0)
            if Player_character.tile_kind_at(TileDirection.TOP, assets.tile("""
                Coal
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(3)
            if Player_character.tile_kind_at(TileDirection.TOP, assets.tile("""
                Iron
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(4)
            if Player_character.tile_kind_at(TileDirection.BOTTOM, assets.tile("""
                Copper
            """)):
                whereToBreakCol = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).column
                whereToBreakRow = Player_character.tilemap_location().get_neighboring_location(CollisionDirection.TOP).row
                BlockBreak(whereToBreakCol, whereToBreakRow, 5, cooldown)
                addToInventory(5)
        else:
            pass

def on_left_pressed():
    if inInventory:
        inventory.change_number(InventoryNumberAttribute.SELECTED_INDEX, -1)
    else:
        Mine(3, miningEfficiency)
controller.left.on_event(ControllerButtonEvent.PRESSED, on_left_pressed)

def saveTilemap():
    global minedLocations, coalLocations, ironLocations, copperLocations, dirtLocations, stoneLocations
    minedLocations = tiles.get_tiles_by_type(assets.tile("""
        myTile8
    """))
    coalLocations = tiles.get_tiles_by_type(assets.tile("""
        Coal
    """))
    ironLocations = tiles.get_tiles_by_type(assets.tile("""
        Iron
    """))
    copperLocations = tiles.get_tiles_by_type(assets.tile("""
        Copper
    """))
    dirtLocations = tiles.get_tiles_by_type(assets.tile("""
        myTile3
    """))
    stoneLocations = tiles.get_tiles_by_type(assets.tile("""
        Stone
    """))
def HUDAmmo():
    global gunAmmo, airstrikeCooldown, flamethrowerCooldown
    if gunAmmo:
        gunAmmo.set_flag(SpriteFlag.INVISIBLE, True)
    if airstrikeCooldown:
        airstrikeCooldown.set_flag(SpriteFlag.INVISIBLE, True)
    if flamethrowerCooldown:
        flamethrowerCooldown.set_flag(SpriteFlag.INVISIBLE, True)
    if weapon == "gun":
        if gunAmmo:
            gunAmmo.set_flag(SpriteFlag.INVISIBLE, False)
        else:
            gunAmmo = statusbars.create(4, 60, StatusBarKind.ammo)
        gunAmmo.set_position(145, 91)
        gunAmmo.set_color(4, 2)
    elif weapon == "airstrike":
        if airstrikeCooldown:
            airstrikeCooldown.set_flag(SpriteFlag.INVISIBLE, False)
        else:
            airstrikeCooldown = statusbars.create(4, 60, StatusBarKind.ammo)
        airstrikeCooldown.set_position(145, 91)
        airstrikeCooldown.set_color(9, 6)
        airstrikeCooldown.set_status_bar_flag(StatusBarFlag.SMOOTH_TRANSITION, True)
    elif weapon == "flamethrower":
        if flamethrowerCooldown:
            flamethrowerCooldown.set_flag(SpriteFlag.INVISIBLE, False)
        else:
            flamethrowerCooldown = statusbars.create(4, 60, StatusBarKind.ammo)
        flamethrowerCooldown.set_position(145, 91)
        flamethrowerCooldown.set_color(5, 4)
        flamethrowerCooldown.set_status_bar_flag(StatusBarFlag.SMOOTH_TRANSITION, True)

def on_player2_button_up_pressed():
    shoot(1)
controller.player2.on_button_event(ControllerButton.UP,
    ControllerButtonEvent.PRESSED,
    on_player2_button_up_pressed)

def on_right_pressed():
    if inInventory:
        inventory.change_number(InventoryNumberAttribute.SELECTED_INDEX, 1)
    else:
        Mine(4, miningEfficiency)
controller.right.on_event(ControllerButtonEvent.PRESSED, on_right_pressed)

def on_player2_button_right_pressed():
    shoot(4)
controller.player2.on_button_event(ControllerButton.RIGHT,
    ControllerButtonEvent.PRESSED,
    on_player2_button_right_pressed)

def spawnEnemies():
    global flyingEnemies, flyingEnemiesStatusBar
    for value12 in tiles.get_tiles_by_type(assets.tile("""
        myTile27
    """)):
        flyingEnemies = sprites.create(img("""
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
            """),
            SpriteKind.aboveEnemy)
        flyingEnemiesStatusBar = statusbars.create(20, 4, StatusBarKind.health)
        flyingEnemiesStatusBar.attach_to_sprite(flyingEnemies)
        tiles.place_on_tile(flyingEnemies, value12)
        animation.run_image_animation(flyingEnemies,
            assets.animation("""
                flyingMonsterRight
            """),
            500,
            True)
        sprites.set_data_boolean(flyingEnemies, "canSeePlayer", False)
        sprites.set_data_image_value(flyingEnemies,
            "projectile",
            assets.image("""
                projectile
            """))
        sprites.set_data_number(flyingEnemies, "maxHealth", 50)
        sprites.set_data_number(flyingEnemies, "health", 0)
        sprites.set_data_number(flyingEnemies, "statusBarWidth", 20)
        sprites.set_data_number(flyingEnemies, "shotCooldown", 0)
        flyingEnemies.set_flag(SpriteFlag.AUTO_DESTROY, False)
        if value12.row < 24:
            tiles.set_tile_at(value12, assets.tile("""
                transparency16
            """))
        else:
            tiles.set_tile_at(value12, assets.tile("""
                myTile8
            """))
        statusbars.get_status_bar_attached_to(StatusBarKind.health, flyingEnemies).value = (sprites.read_data_number(flyingEnemies, "maxHealth") + sprites.read_data_number(flyingEnemies, "health")) * sprites.read_data_number(flyingEnemies, "statusBarWidth")
        characterAnimations.loop_frames(flyingEnemies,
            assets.animation("""
                flyingMonsterRight
            """),
            500,
            characterAnimations.rule(Predicate.MOVING_RIGHT))
        characterAnimations.loop_frames(flyingEnemies,
            assets.animation("""
                flyingMonsterLeft
            """),
            500,
            characterAnimations.rule(Predicate.FACING_LEFT))
def shoot(direction1up2down3left4right: number):
    global canShoot, gunBullet, usingFlamethrower, flame
    if not (inInventory) and not (In_Base):
        if weapon == "gun":
            if canShoot and not (gunAmmo.value < 1):
                canShoot = False
                gunAmmo.value += -10
                if direction1up2down3left4right == 1:
                    gunBullet = sprites.create_projectile_from_sprite(img("""
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
                        """),
                        Player_character,
                        0,
                        -100)
                    gunBullet.set_kind(SpriteKind.gunBullets)
                elif direction1up2down3left4right == 2:
                    gunBullet = sprites.create_projectile_from_sprite(img("""
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
                        """),
                        Player_character,
                        0,
                        100)
                    gunBullet.set_kind(SpriteKind.gunBullets)
                elif direction1up2down3left4right == 3:
                    gunBullet = sprites.create_projectile_from_sprite(img("""
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
                        """),
                        Player_character,
                        -100,
                        0)
                    gunBullet.set_kind(SpriteKind.gunBullets)
                elif direction1up2down3left4right == 4:
                    gunBullet = sprites.create_projectile_from_sprite(img("""
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
                        """),
                        Player_character,
                        100,
                        0)
                    gunBullet.set_kind(SpriteKind.gunBullets)
                pause(500)
                canShoot = True
        elif weapon == "airstrike":
            if airstrikeCooldown.value > 99:
                airstrikeFunction()
        else:
            if not (usingFlamethrower) and not (flamethrowerCooldown.value < 5):
                usingFlamethrower = True
                flamethrowerCooldown.value += -60
                nearestEnemy()
                for index in range(101):
                    if randint(0, 2) == 0:
                        flame = sprites.create_projectile_from_sprite(img("""
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
                            """),
                            Player_character,
                            0,
                            0)
                        flame.set_kind(SpriteKind.fire)
                        flame.lifespan = 1500
                    else:
                        flame = sprites.create_projectile_from_sprite(img("""
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
                            """),
                            Player_character,
                            0,
                            0)
                        flame.set_kind(SpriteKind.fire)
                        flame.lifespan = 1500
                    spriteutils.set_velocity_at_angle(flame,
                        spriteutils.angle_from(missile, nearestSprite) + randint(-10, 10),
                        randint(40, 60))
                usingFlamethrower = False
def showTiles(col2: number, row2: number):
    tileUtil.cover_tile(tiles.get_tile_location(col2 - 1, row2),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2 + 1, row2),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2, row2 + 1),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2, row2 - 1),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2 - 1, row2 - 1),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2 - -1, row2 - 1),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2 - -1, row2 - -1),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2 - 1, row2 - -1),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2 - 2, row2),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2 + 2, row2),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2, row2 + 2),
        assets.tile("""
            transparency16
        """))
    tileUtil.cover_tile(tiles.get_tile_location(col2, row2 - 2),
        assets.tile("""
            transparency16
        """))
def airstrikeFunction():
    global missile
    nearestEnemy()
    missile = sprites.create(assets.image("""
        gun
    """), SpriteKind.airstrikeMissile)
    missile.set_image(scaling.rot(assets.image("""
                gun
            """).clone(),
            spriteutils.angle_from(missile, nearestSprite)))
    missile.set_flag(SpriteFlag.AUTO_DESTROY, False)
    missile.lifespan = 5000
    tiles.place_on_tile(missile, Base.tilemap_location())
    spriteutils.set_velocity_at_angle(missile, spriteutils.angle_from(missile, nearestSprite), 100)
    airstrikeCooldown.value += -90
def hud(add: bool):
    global healthStatusBar, energyStatusBar, pumpingHeart, _1stTimeHud
    if add:
        if not (_1stTimeHud):
            healthStatusBar = statusbars.create(50, 6, StatusBarKind.health)
            healthStatusBar.set_position(41, 110)
            energyStatusBar = statusbars.create(50, 3, StatusBarKind.energy)
            energyStatusBar.set_color(9, 8)
            energyStatusBar.set_position(41, 105)
            pumpingHeart = sprites.create(img("""
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
                """),
                SpriteKind.other)
            pumpingHeart.set_position(6, 109)
            animation.run_image_animation(pumpingHeart,
                [img("""
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
                    """),
                    img("""
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
                    """),
                    img("""
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
                    """)],
                200,
                True)
            _1stTimeHud = True
            pumpingHeart.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
            healthStatusBar.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
            energyStatusBar.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
            healthStatusBar.set_status_bar_flag(StatusBarFlag.SMOOTH_TRANSITION, True)
            energyStatusBar.set_status_bar_flag(StatusBarFlag.SMOOTH_TRANSITION, True)
        else:
            healthStatusBar.set_flag(SpriteFlag.INVISIBLE, False)
            pumpingHeart.set_flag(SpriteFlag.INVISIBLE, False)
            energyStatusBar.set_flag(SpriteFlag.INVISIBLE, False)
    else:
        healthStatusBar.set_flag(SpriteFlag.INVISIBLE, True)
        pumpingHeart.set_flag(SpriteFlag.INVISIBLE, True)
        energyStatusBar.set_flag(SpriteFlag.INVISIBLE, True)
def Spawn_menu_upgrades_text():
    global Upgrade_menu_text, Mining_speed_lvl_text, Menu_interaction_sprite_0, Menu_interaction_sprite_1, Menu_interaction_sprite_2, Menu_interaction_sprite_3
    Upgrade_menu_text = sprites.create(img("""
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
        """),
        SpriteKind.Upgrade_menu)
    tiles.place_on_tile(Upgrade_menu_text, tiles.get_tile_location(2, 1))
    Upgrade_menu_text = sprites.create(img("""
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
        """),
        SpriteKind.Upgrade_menu)
    tiles.place_on_tile(Upgrade_menu_text, tiles.get_tile_location(2, 5))
    Upgrade_menu_text = sprites.create(img("""
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
        """),
        SpriteKind.Upgrade_menu)
    tiles.place_on_tile(Upgrade_menu_text, tiles.get_tile_location(2, 9))
    if Mining_speed == 500:
        Mining_speed_lvl_text = sprites.create(img("""
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
            """),
            SpriteKind.Upgrade_menu)
        tiles.place_on_tile(Mining_speed_lvl_text, tiles.get_tile_location(4, 3))
    elif Mining_speed == 480:
        Mining_speed_lvl_text = sprites.create(img("""
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
            """),
            SpriteKind.Upgrade_menu)
        tiles.place_on_tile(Upgrade_menu_text, tiles.get_tile_location(2, 2))
    elif Mining_speed == 460:
        Mining_speed_lvl_text = sprites.create(img("""
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
            """),
            SpriteKind.Upgrade_menu)
        tiles.place_on_tile(Upgrade_menu_text, tiles.get_tile_location(2, 2))
    elif Mining_speed == 440:
        Mining_speed_lvl_text = sprites.create(img("""
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
            """),
            SpriteKind.Upgrade_menu)
        tiles.place_on_tile(Upgrade_menu_text, tiles.get_tile_location(2, 2))
    elif Mining_speed == 420:
        Mining_speed_lvl_text = sprites.create(img("""
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
            """),
            SpriteKind.Upgrade_menu)
        tiles.place_on_tile(Upgrade_menu_text, tiles.get_tile_location(2, 2))
    elif Mining_speed == 400:
        Mining_speed_lvl_text = sprites.create(img("""
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
            """),
            SpriteKind.Upgrade_menu)
        tiles.place_on_tile(Upgrade_menu_text, tiles.get_tile_location(2, 2))
    for index2 in range(4):
        if index2 == 0:
            Menu_interaction_sprite_0 = sprites.create(img("""
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
                """),
                SpriteKind.Interaction_sprite)
            tiles.place_on_tile(Menu_interaction_sprite_0, tiles.get_tile_location(2, 3))
        elif index2 == 1:
            Menu_interaction_sprite_1 = sprites.create(img("""
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
                """),
                SpriteKind.Interaction_sprite)
            tiles.place_on_tile(Menu_interaction_sprite_1, tiles.get_tile_location(2, 7))
        elif index2 == 2:
            Menu_interaction_sprite_2 = sprites.create(img("""
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
                """),
                SpriteKind.Interaction_sprite)
            tiles.place_on_tile(Menu_interaction_sprite_2, tiles.get_tile_location(2, 11))
        elif index2 == 3:
            Menu_interaction_sprite_3 = sprites.create(img("""
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
                """),
                SpriteKind.Interaction_sprite)
            tiles.place_on_tile(Menu_interaction_sprite_3, tiles.get_tile_location(2, 15))
def addToInventory(thing: number):
    global dirtQuantity, stoneQuantity, coalQuantity, ironQuantity, copperQuantity
    if thing == 0:
        dirtQuantity += 1
    elif thing == 1:
        stoneQuantity += 1
    elif thing == 3:
        coalQuantity += 1
    elif thing == 4:
        ironQuantity += 1
    elif thing == 5:
        copperQuantity += 1

def on_down_pressed():
    if not (inInventory) and Player_character.is_hitting_tile(CollisionDirection.BOTTOM):
        Mine(1, miningEfficiency)
controller.down.on_event(ControllerButtonEvent.PRESSED, on_down_pressed)

def I_just_wanted_to_shrink_the_upgrade_menu_section():
    global Mining_speed, Energy_capacity, Energy_recharge_rate
    if Player_character.overlaps_with(Menu_interaction_sprite_0):
        if Mining_speed == 500:
            Mining_speed = 480
            Mining_speed_lvl_text.set_image(img("""
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
            """))
        elif Mining_speed == 480:
            Mining_speed = 460
            Mining_speed_lvl_text.set_image(img("""
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
            """))
        elif Mining_speed == 460:
            Mining_speed = 440
            Mining_speed_lvl_text.set_image(img("""
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
            """))
        elif Mining_speed == 440:
            Mining_speed = 420
            Mining_speed_lvl_text.set_image(img("""
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
            """))
        elif Mining_speed == 420:
            Mining_speed = 400
            Mining_speed_lvl_text.set_image(img("""
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
            """))
    elif Player_character.overlaps_with(Menu_interaction_sprite_1):
        if 0 == 0:
            Energy_capacity = 0
        elif 0 == 0:
            pass
        elif 0 == 0:
            pass
        elif 0 == 0:
            pass
        elif 0 == 0:
            pass
    elif Player_character.overlaps_with(Menu_interaction_sprite_2):
        if 0 == 0:
            Energy_recharge_rate = 0
        elif 0 == 0:
            pass
        elif 0 == 0:
            pass
        elif 0 == 0:
            pass
        elif 0 == 0:
            pass
    elif Player_character.overlaps_with(Menu_interaction_sprite_3):
        if True:
            pass
        elif False:
            pass
        elif False:
            pass
        elif False:
            pass
        elif False:
            pass
    sprites.destroy_all_sprites_of_kind(SpriteKind.Upgrade_menu)
    sprites.destroy_all_sprites_of_kind(SpriteKind.Interaction_sprite)
    Spawn_menu_upgrades_text()

def on_player2_button_left_pressed():
    shoot(3)
controller.player2.on_button_event(ControllerButton.LEFT,
    ControllerButtonEvent.PRESSED,
    on_player2_button_left_pressed)

def createInventory():
    global inventory
    inventory = Inventory.create_inventory(list2, 999)
    dirt.set_text(ItemTextAttribute.TOOLTIP, convert_to_text(dirtQuantity))
    coal.set_text(ItemTextAttribute.TOOLTIP, convert_to_text(coalQuantity))
    iron.set_text(ItemTextAttribute.TOOLTIP, convert_to_text(ironQuantity))
    stone.set_text(ItemTextAttribute.TOOLTIP, convert_to_text(stoneQuantity))
    copper.set_text(ItemTextAttribute.TOOLTIP, convert_to_text(copperQuantity))

def on_player3_button_down_pressed():
    global weapon
    if toolbar.get_number(ToolbarNumberAttribute.SELECTED_INDEX) == 0:
        toolbar.set_number(ToolbarNumberAttribute.SELECTED_INDEX, 2)
    else:
        toolbar.change_number(ToolbarNumberAttribute.SELECTED_INDEX, -1)
    if toolbar.get_number(ToolbarNumberAttribute.SELECTED_INDEX) == 0:
        weapon = "gun"
    elif toolbar.get_number(ToolbarNumberAttribute.SELECTED_INDEX) == 1:
        weapon = "airstrike"
    else:
        weapon = "flamethrower"
    HUDAmmo()
controller.player3.on_button_event(ControllerButton.DOWN,
    ControllerButtonEvent.PRESSED,
    on_player3_button_down_pressed)

def hideTiles():
    tileUtil.cover_all_tiles(assets.tile("""
            myTile3
        """),
        assets.tile("""
            myTile26
        """))
    tileUtil.cover_all_tiles(assets.tile("""
            Stone
        """),
        assets.tile("""
            myTile26
        """))
    tileUtil.cover_all_tiles(assets.tile("""
            Coal
        """),
        assets.tile("""
            myTile26
        """))
    tileUtil.cover_all_tiles(assets.tile("""
            Copper
        """),
        assets.tile("""
            myTile26
        """))
    tileUtil.cover_all_tiles(assets.tile("""
            Iron
        """),
        assets.tile("""
            myTile26
        """))
def healthChange(damage: number):
    global damageMarker
    healthStatusBar.value += damage
    if damage < 0:
        damageMarker = textsprite.create(convert_to_text(damage * -1), 0, 2)
        damageMarker.set_kind(SpriteKind.damageIndicator)
        damageMarker.lifespan = 500
        damageMarker.set_position(randint(11, 51), randint(96, 100))
        damageMarker.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
    else:
        damageMarker = textsprite.create(convert_to_text(damage), 0, 7)
        damageMarker.set_kind(SpriteKind.damageIndicator)
        damageMarker.lifespan = 500
        damageMarker.set_position(randint(11, 51), randint(96, 100))
        damageMarker.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
def activateInventory(goingIn: bool):
    global inInventory
    if goingIn:
        controller.move_sprite(Player_character, 0, 0)
        createInventory()
        inventory.set_stay_in_screen(True)
        tiles.place_on_tile(inventory, Player_character.tilemap_location())
        inInventory = True
    else:
        sprites.destroy(inventory)
        inInventory = False
        controller.move_sprite(Player_character, 50, 0)

def on_on_overlap4(sprite5, otherSprite4):
    sprites.destroy(otherSprite4)
    statusbars.get_status_bar_attached_to(StatusBarKind.health, sprite5).value += randint(-5, -15)
sprites.on_overlap(SpriteKind.aboveEnemy, SpriteKind.gunBullets, on_on_overlap4)

def enemyShoot(projectile: Image, spriteFrom: Sprite, spriteTo: Sprite, speed: number):
    if sprites.read_data_number(spriteFrom, "shotCooldown")==0:
        sprites.set_data_number(spriteFrom, "shotCooldown",200)
        global shot
        shot = sprites.create_projectile_from_sprite(projectile, spriteFrom, 0, 0)
        spriteutils.set_velocity_at_angle(shot, spriteutils.angle_from(spriteFrom, spriteTo), speed)
        shot.set_kind(SpriteKind.explodingProjectile)

def respawnAtBase():
    global inventoryContents, stoneQuantity, ironQuantity, dirtQuantity, coalQuantity, copperQuantity, Mining_speed, Energy_capacity, Energy_recharge_rate
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
    tiles.place_on_tile(Player_character, tiles.get_tile_location(47, 13))
    healthStatusBar.value = 100
def startingSaveTilemap():
    global startMinedLocations, startCoalLocations, startIronLocations, startCopperLocations, startDirtLocations, startStoneLocations
    startMinedLocations = tiles.get_tiles_by_type(assets.tile("""
        myTile8
    """))
    startCoalLocations = tiles.get_tiles_by_type(assets.tile("""
        Coal
    """))
    startIronLocations = tiles.get_tiles_by_type(assets.tile("""
        Iron
    """))
    startCopperLocations = tiles.get_tiles_by_type(assets.tile("""
        Copper
    """))
    startDirtLocations = tiles.get_tiles_by_type(assets.tile("""
        myTile3
    """))
    startStoneLocations = tiles.get_tiles_by_type(assets.tile("""
        Stone
    """))

def on_player3_button_up_pressed():
    global weapon
    if toolbar.get_number(ToolbarNumberAttribute.SELECTED_INDEX) == 2:
        toolbar.set_number(ToolbarNumberAttribute.SELECTED_INDEX, 0)
    else:
        toolbar.change_number(ToolbarNumberAttribute.SELECTED_INDEX, 1)
    if toolbar.get_number(ToolbarNumberAttribute.SELECTED_INDEX) == 0:
        weapon = "gun"
    elif toolbar.get_number(ToolbarNumberAttribute.SELECTED_INDEX) == 1:
        weapon = "airstrike"
    else:
        weapon = "flamethrower"
    HUDAmmo()
controller.player3.on_button_event(ControllerButton.UP,
    ControllerButtonEvent.PRESSED,
    on_player3_button_up_pressed)

enemyShotCooldown:bool = False
startStoneLocations: List[tiles.Location] = []
startDirtLocations: List[tiles.Location] = []
startCopperLocations: List[tiles.Location] = []
startIronLocations: List[tiles.Location] = []
startCoalLocations: List[tiles.Location] = []
startMinedLocations: List[tiles.Location] = []
shot: Sprite = None
damageMarker: TextSprite = None
copperQuantity = 0
Menu_interaction_sprite_3: Sprite = None
Menu_interaction_sprite_2: Sprite = None
Menu_interaction_sprite_1: Sprite = None
Menu_interaction_sprite_0: Sprite = None
Mining_speed_lvl_text: Sprite = None
Upgrade_menu_text: Sprite = None
pumpingHeart: Sprite = None
healthStatusBar: StatusBarSprite = None
missile: Sprite = None
flame: Sprite = None
gunBullet: Sprite = None
flyingEnemiesStatusBar: StatusBarSprite = None
flyingEnemies: Sprite = None
flamethrowerCooldown: StatusBarSprite = None
airstrikeCooldown: StatusBarSprite = None
gunAmmo: StatusBarSprite = None
inventory: Inventory.Inventory = None
Type_of_block_being_mined = 0
whereToBreakRow = 0
whereToBreakCol = 0
tempOreRandomizer = 0
Tree_spawn_y = 0
Tree_spawn_x = 0
Tree: Sprite = None
toolbar: Inventory.Toolbar = None
stoneLocations: List[tiles.Location] = []
dirtLocations: List[tiles.Location] = []
copperLocations: List[tiles.Location] = []
ironLocations: List[tiles.Location] = []
coalLocations: List[tiles.Location] = []
minedLocations: List[tiles.Location] = []
previousTilemap = 0
playerOnFire = False
energyStatusBar: StatusBarSprite = None
nearestSprite: Sprite = None
nearestLengthAway = 0
weapon = ""
isMining = False
brokenBlocks: List[tiles.Location] = []
usingFlamethrower = False
canShoot = False
list2: List[Inventory.Item] = []
_1stTimeHud = False
flamethrower: Inventory.Item = None
airstrike: Inventory.Item = None
gun: Inventory.Item = None
copper: Inventory.Item = None
iron: Inventory.Item = None
stone: Inventory.Item = None
coal: Inventory.Item = None
dirt: Inventory.Item = None
Energy_recharge_rate = 0
Energy_capacity = 0
Mining_speed = 0
In_upgrade_menu = 0
coalQuantity = 0
dirtQuantity = 0
ironQuantity = 0
stoneQuantity = 0
inventoryContents = 0
miningEfficiency = 0
inInventory = False
jump = False
Gravity = 0
Player_character: Sprite = None
Base: Sprite = None
breakingTileSprite: Sprite = None
In_Base = False
stats.turn_stats(True)
scene.set_background_image(img("""
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
"""))
tiles.set_current_tilemap(tilemap("""
    Planet part 1
"""))
In_Base = False
breakingTileSprite = sprites.create(img("""
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
    """),
    SpriteKind.other)
breakingTileSprite.set_flag(SpriteFlag.AUTO_DESTROY, False)
breakingTileSprite.set_flag(SpriteFlag.INVISIBLE, True)
Base = sprites.create(img("""
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
    """),
    SpriteKind.Structure)
Player_character = sprites.create(img("""
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
    """),
    SpriteKind.player)
textSprite = sprites.create(img("""
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
    """),
    SpriteKind.textSprites)
Gravity = 0.5
jump = False
gto_base_said = False
inInventory = False
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
dirt = Inventory.create_item("Dirt",
    assets.image("""
        coal2Art
    """),
    "Dug up from the ground")
coal = Inventory.create_item("Coal",
    img("""
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
    """),
    "Dug up from the ground")
stone = Inventory.create_item("Stone",
    assets.tile("""
        Stone
    """),
    "Dug up from the ground")
iron = Inventory.create_item("iron",
    assets.tile("""
        Iron
    """),
    "Dug up from the ground")
copper = Inventory.create_item("copper",
    assets.tile("""
        Copper
    """),
    "Dug up from the ground")
gun = Inventory.create_item("Gun", assets.image("""
    rocket
"""), "Goes Kaboom")
airstrike = Inventory.create_item("Airstrike", assets.image("""
    gun
"""), "Goes Kaboom")
flamethrower = Inventory.create_item("Flamethrower",
    img("""
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
    """),
    "Goes Kaboom")
_1stTimeHud = False
list2 = [dirt, stone, coal, iron, copper]
canShoot = True
usingFlamethrower = False
brokenBlocks = []
isMining = False
scene.camera_follow_sprite(Player_character)
tiles.place_on_tile(Base, tiles.get_tile_location(51, 12))
tiles.place_on_tile(Player_character, tiles.get_tile_location(47, 13))
controller.move_sprite(Player_character, 50, 0)
weapon = "gun"
Ores()
Keybinds.set_simulator_keymap(Keybinds.PlayerNumber.TWO,
    Keybinds.CustomKey.UP,
    Keybinds.CustomKey.DOWN,
    Keybinds.CustomKey.LEFT,
    Keybinds.CustomKey.RIGHT,
    Keybinds.CustomKey.I,
    Keybinds.CustomKey.ZERO)
Keybinds.set_simulator_keymap(Keybinds.PlayerNumber.THREE,
    Keybinds.CustomKey.E,
    Keybinds.CustomKey.Q,
    Keybinds.CustomKey.UP,
    Keybinds.CustomKey.UP,
    Keybinds.CustomKey.UP,
    Keybinds.CustomKey.UP)
activateInventory(True)
activateInventory(False)
GROWTrees()
hideTiles()
spawnEnemies()
hud(True)
for value14 in tiles.get_tiles_by_type(assets.tile("""
    myTile8
""")):
    showTiles(value14.column, value14.row)
makeWeaponToolbar(True)
HUDAmmo()

def on_on_update():
    if toolbar:
        if not (In_Base) or not (inInventory):
            toolbar.update()
game.on_update(on_on_update)

def on_on_update2():
    if Player_character:
        Player_character.vy += Gravity
game.on_update(on_on_update2)

def on_forever():
    if healthStatusBar:
        if healthStatusBar.value < 1:
            respawnAtBase()
forever(on_forever)

def on_forever2():
    if energyStatusBar and Energy_recharge_rate:
        if energyStatusBar.value < 100:
            energyStatusBar.value += 50 / Energy_capacity / 1.75
            pause(Energy_recharge_rate)
forever(on_forever2)

def on_forever3():
    global playerOnFire
    if Player_character:
        if playerOnFire:
            Player_character.start_effect(effects.fire)
            for index22 in range(7):
                pause(50)
                healthChange(randint(-1, -4))
            playerOnFire = False
            effects.clear_particles(Player_character)
forever(on_forever3)

def on_forever4():
    enemyBehaviour()
forever(on_forever4)

def on_forever5():
    if healthStatusBar:
        if healthStatusBar.value < 100:
            healthChange(randint(4, 10))
            pause(1000)
forever(on_forever5)

def on_forever6():
    if toolbar:
        if airstrikeCooldown:
            airstrikeCooldown.value += 5
        if gunAmmo:
            gunAmmo.value += 5
        if flamethrowerCooldown:
            flamethrowerCooldown.value += 4
        pause(500)
forever(on_forever6)

def on_forever7():
    for value15 in sprites.all_of_kind(SpriteKind.aboveEnemy):
        if statusbars.get_status_bar_attached_to(StatusBarKind.health, value15).value < 1:
            sprites.destroy(statusbars.get_status_bar_attached_to(StatusBarKind.health, value15))
            sprites.destroy(value15)
forever(on_forever7)

def on_forever8():
    #healthChange(-1)
    # a forever loop for testing death errors
    pass
forever(on_forever8)

def on_forever9():
    for value16 in sprites.all_of_kind(SpriteKind.aboveEnemy):
        if sprites.read_data_number(value16,"shotCooldown") > 0:
            sprites.set_data_number(value16,"shotCooldown",sprites.read_data_number(value16,"shotCooldown")-1)
    pause(1)
forever(on_forever9)