import Phaser from '/src/lib/phaser';

import ImageResource from '/src/engine/resources/ImageResource';
import JSONResource from '/src/engine/resources/JSONResource';

import Scene from '/src/engine/core/Scene';
import Image from '/src/engine/objects/Image';
import MatterImage from '/src/engine/objects/MatterImage';
import Sprite from '/src/engine/objects/Sprite';
import SpriteSheetResource from '/src/engine/resources/SpriteSheetResource';
import Vector2 from '/src/engine/math/Vector2';
import Polygon from '/src/engine/objects/Polygon';
import Line from '/src/engine/objects/Line';
import Text from '/src/engine/objects/Text';
import Particle from '/src/engine/objects/Particle';
import Rectangle from '/src/engine/objects/Rectangle';

import config from '/src/config';

import DroppableItemType from '/src/game/objects/DroppableItemType';
import DroppableItem from '/src/game/objects/DroppableItem';
import Health from '/src/game/objects/Health';
import ScoreText from '/src/game/objects/ScoreText';
import NextItem from '/src/game/objects/NextItem';

export default class TestScene extends Scene {
  resources = {
    shapes: new JSONResource('assets/jsons/shapes.json'),
    boat: new ImageResource('assets/static_props/boat.png'),
    background: new ImageResource('assets/backgrounds/Background_Wide_V2.png'),
    platform: new ImageResource('assets/player/platform.png'),
    conveyor: new ImageResource('assets/player/ConveyorBelt.png'),
    boss: new ImageResource('assets/player/boss.png'),
    speechBubble: new ImageResource('assets/player/sbubble.png'),
    mutes1: new ImageResource('assets/headphones/mutes1.png'),
    //mutes2: new ImageResource('assets/headphones/mutes2.png'),
    player: new SpriteSheetResource('assets/player/Worker-Bot-Seperated.png', {
      frameWidth: 64,
      frameHeight: 48
    }),
    playerLegs: new SpriteSheetResource('assets/player/Worker-Bot-Seperated.png', {
      frameWidth: 64,
      frameHeight: 48
    }),
    playerTorso: new SpriteSheetResource('assets/player/Worker_bot_sprites.png', {
      frameWidth: 64,
      frameHeight: 48
    }),
    explosion: new SpriteSheetResource('assets/player/Explosion.png', {
      frameWidth: 32,
      frameHeight: 32
    })
  };

  eventHandlers = {
    input: {
      pointerdown: this.onMouseDown,
      pointerup: this.onMouseUp
    }
  }

  cutSceneAnimation = true;
  soundsMuted = false;

  onRestart() {
    this.chargeFactor = 500;
    this.minCharge = .2;
    this.maxCharge = 5;
    this.aimLineCount = 5;
    this.hitSoundInterval = 1000;
    this.upcomingSpace = 10;
    this.smokeDensity = 1000;
    this.conveyorBeltY = 320;
    this.conveyorBeltEndX = 200;

    this.boatVelocity = -.2;
    this.boatX = 1150;

    this.itemCount = 0;
    this.roundItemCount = 0;
    this.currentTowerHeight = 0;

    this.lastTowerHeight = null;
    this.chargeStartTime = null;
    this.itemInPlayerHand = null;
    this.upcomingText = null;
    this.scoreText = null;
    this.boat = null;
    this.health = null;
    this.items = [];
    this.player = null;
    this.staticItems = [];
    this.followItem = null;
    this.lastHitSoundTime = null;
    this.finalScore = null;
    this.nextItem = null;
    this.boss = null;
    this.speechBubble = null;
    this.bossLine1 = null;
    this.bossLine2 = null
    this.missedText = null;

    this.charge = null;
    this.angle = null;
    this.aimLines = [];

    this.canSpawnItem = false;
    this.demolish = false;
    this.stopCharge = false;
    this.gameOver = false;
    this.firstItemPickedUp = false;

    this.currentItemType = null;
    this.nextItemTypes = [];

    //this.music.stop();
  }

  getRandomItemType() {
    const itemTypes = [
      // Set 1
      DroppableItemType.CARDBOARD_BOX,
      DroppableItemType.SHIPPING_CONTAINER,
      DroppableItemType.SAFE,
      DroppableItemType.WOODEN_CRATE,
      DroppableItemType.GRASS_BLOCK,
      DroppableItemType.ROTARY_PHONE,
      DroppableItemType.GIFT_BOX,
      DroppableItemType.CRT_SCREEN,
      DroppableItemType.WASHING_MACHINE,
      DroppableItemType.WIDE_PAINTING,
      DroppableItemType.WIDE_PLANK,

      // Set 2
      DroppableItemType.MUIKKU,
      DroppableItemType.FELIX,
      DroppableItemType.TRIANGLE,
      DroppableItemType.GRAMOPHONE,
      DroppableItemType.LONG_CONTAINER,
      DroppableItemType.BOMB,
      DroppableItemType.BOTTLE,
      DroppableItemType.BRIEFCASE,
      DroppableItemType.AKIMBO_CONTAINER
    ].filter(itemType => (
      (itemType.minHeight === null || itemType.minHeight < this.currentTowerHeight)
      && (itemType.maxHeight === null || itemTypes.maxHeight > this.currentTowerHeight)
    ));

    const n = Math.floor(Math.random() * itemTypes.length);

    return itemTypes[n];
  }

  constructor() {
    super({
      physics: {
        default: 'matter',
        matter: {
          enableSleeping: true,
          gravity: {
            y: 1
          },
          debug: {
            showBody: config.debug,
            showStaticBody: config.debug
          }
        }
      }
    });
  }

  get shapes() {
    return this.cache.json.get(this.res.shapes);
  }

  doDemolish() {
    this.demolish = true;

    // Move all current items over to static items
    this.staticItems.push(...this.items);

    // Remove score text
    this.finalScore = this.scoreText.score ?? 0;
    this.scoreText.destroy();
    this.scoreText = null;

    // Remove upcoming items
    this.upcomingItem1.destroy();
    this.upcomingItem1 = null;
    this.upcomingItem2.destroy();
    this.upcomingItem2 = null;
    this.upcomingItem3.destroy();
    this.upcomingItem3 = null;

    // Remove upcoming text
    this.upcomingText.destroy();
    this.upcomingText = null;

    // Remove missed text
    this.missedText.destroy();
    this.missedText = null;

    if (this.itemInPlayerHand !== null) this.itemInPlayerHand.destroy();

    const time = Math.floor(Math.abs(this.cameraPosition.y * 1.5)) + 1000;

    this.debug('Start demolish, time:', time);

    this.panToBoat(time, this.cameraOrigin.y);

    let panFinished = false;

    setTimeout(() => panFinished = true, time);

    const demolishInterval = setInterval(() => {
      this.debug('Demolish interval!');

      const { y, height } = this.cameras.main.worldView;

      if (y === 0 && panFinished) {
        clearInterval(demolishInterval);

        this.boatVelocity = .2;
      }

      for (const item of this.staticItems) {
        if (item.scene && item.y < y + height) {
          if (item.isStatic()) {
            item.demolish = true;

            item.setStatic(false).applyForce(new Vector2(Phaser.Math.FloatBetween(-.1, .1), item.y / 100000));
          }
        }
      }
    }, 500);
  }

  onItemStop() {
    if (!config.itemRain && (this.roundItemCount > 0 || this.roundItemCount < config.itemsPerRound)) {
      setTimeout(() => {
        this.followItem = null;

        this.panToPlayer(() =>{
          this.player.anims.play('pickup_item_torso', true);
          this.playerLegs.anims.play('pickup_item_legs', true);
        });
      }, 500);
    }
  }

  spawnItem(screenX, screenY) {
    this.currentItemType = this.nextItemTypes.shift();

    const itemPosition = this.viewportToWorld(screenX, screenY), opt = {};

    if (this.shapes[this.currentItemType.name]) opt.shape = this.shapes[this.currentItemType.name];

    const item = new DroppableItem(this.currentItemType, this.matter.world, itemPosition.x, itemPosition.y, this.currentItemType.res, 0, opt);

    this.add.existing(item);
    this.items.push(item);

    // Increase item count and round item count
    this.itemCount++;
    this.roundItemCount++;

    this.canSpawnItem = false;

    if (config.spawnClick) {
      this.followItem = item;

      item.onStop(this.onItemStop.bind(this));
    }
  }

  throwItem() {
    setTimeout(() => this.player.setFrame(12), 250);

    this.throwSound.play();

    const velocityVector = new Vector2(
      Math.sin(this.player.rotation) * this.charge,
      -Math.cos(this.player.rotation) * this.charge
    );

    const onCollide = collision => {
      if (!this.demolish && collision.collision.depth > 1) {
        if (
          this.lastHitSoundTime === null
          || this.time.now > this.lastHitSoundTime + this.hitSoundInterval
          || collision.collision.depth > 5
        ) {
          this.hitSound.play();
          this.lastHitSoundTime = this.time.now;
        }
      }
    };

    const item = this.itemInPlayerHand
      .setStatic(false)
      .applyForce(velocityVector)
      .setOnCollide(onCollide.bind(this))
      .onStop(this.onItemStop.bind(this));

    this.items.push(item);

    this.followItem = item;

    // Increase item count and round item count
    this.itemCount++;
    this.roundItemCount++;

    // Get new current item type from the start of next items array
    this.currentItemType = this.nextItemTypes.shift();
    this.nextItem = new NextItem(this.currentItemType);

    this.conveyorBeltItem = new Image(this, 0, this.conveyorBeltY, this.nextItem.itemType.res).setOrigin(1, 1).setScale(this.nextItem.scale).setScrollFactor(1, 0);
    this.add.existing(this.conveyorBeltItem);

    //this.conveyorSound.play();

    this.canSpawnItem = false;
    this.itemInPlayerHand = null;
  }

  // Create item on mouse click
  onMouseDown({ x, y }) {
    if (this.canSpawnItem) {
      this.cutSceneAnimation = false;

      if (config.spawnClick) this.spawnItem(x, y);
      else if (this.roundItemCount !== config.itemsPerRound) this.chargeStartTime = this.time.now;
    }
  }

  onMouseUp(pointer) {
    if (pointer.x > 1280 - 32 && pointer.y > 0 && pointer.x < 1280 && pointer.y < 32) {
      this.soundsMuted = !this.soundsMuted;
      this.setVolumes();
    }

    if (this.gameOver) return this.restart();

    if (this.stopCharge || this.charge < this.minCharge) {
      this.charge = null;
      this.stopCharge = false;
      this.chargeStartTime = null;

      return;
    }

    if (this.canSpawnItem && this.chargeStartTime !== null) {
      this.debug('Liftoff! Charge time:', this.charge);

      this.chargeStartTime = null;

      // Spawn item at player position
      if (this.canSpawnItem) this.throwItem();
    }

    this.charge = null;

    if (this.aimLines.length > 0) {
      for (const aimLine of this.aimLines) aimLine.destroy();

      this.aimLines = [];
    }
  }

  shouldRoundEnd() {
    // Check if there are itemsPerRound items
    if (this.roundItemCount === config.itemsPerRound) {
      let allItemsStatic = true;

      // Check if all items have stopped moving
      for (const item of this.items) {
        if (!item.hasStopped) allItemsStatic = false;
      }

      return allItemsStatic;
    }

    return false;
  }

  moveCamera() {
    const y = Math.min(this.cameraCenter.y, this.cameraOrigin.y - this.currentTowerHeight + 300);
    const diff = Math.abs(this.cameraCenter.y - y);
    const timeMs = 8 * Math.floor(diff);

    this.debug('Moving camera, demolish:', this.demolish, 'time:', timeMs);

    this.followItem = null;

    if (!this.demolish) {
      this.cameras.main.pan(this.cameraCenter.x, y, timeMs, 'Sine.easeInOut');

      if (!config.itemRain) {
        setTimeout(() => this.panToPlayer(() => this.player.anims.play('pickup_item_torso', true)), timeMs + 100);
      }
    }
  }

  newRound() {
    this.debug('New round! Demolish:', this.demolish);
    let score = 0;

    for (const item of this.items) {
      item.setStatic(true);
      //item.setTint(0x7878ff);
      item.setTint(0x787878);

      score = Math.floor(Math.max(this.currentTowerHeight, 720 - item.y)) / 50;

      this.currentTowerHeight = Math.max(this.currentTowerHeight, 720 - item.y);
      this.staticItems.push(item);
    }

    this.scoreText.updateScore(score);

    this.items = [];
    this.roundItemCount = 0;

    if (this.lastTowerHeight === null || this.lastTowerHeight < this.currentTowerHeight - 100) {
      if (!this.demolish) this.moveCamera();

      this.lastTowerHeight = this.currentTowerHeight;
    } else if (!config.itemRain) {
      this.panToPlayer(() => {
        this.player.anims.play('pickup_item_torso', true);
        this.playerLegs.anims.play('pickup_item_legs', true);
      });
    }
  }

  createPlayer() {
    const playerX = 280, playerY = 300;

    // Image and sprite setup
    const platform = new Image(this, playerX, playerY + 60, this.res.platform).setOrigin(.5, 1).setScale(1.5, 1.5).setScrollFactor(1, 0).setDepth(1);
    const conveyor = new Image(this, playerX - 280, playerY, this.res.conveyor).setOrigin(0, 0).setScale(1.75, 1.75).setScrollFactor(1, 0).setDepth(1);

    this.add.existing(platform);
    this.add.existing(conveyor);

    this.player = new Sprite(this, playerX, playerY + 12, this.res.player)
      .setScale(1.5, 1.5)
      .setOrigin(.5, .75)
      .setScrollFactor(1, 0)
      .setDepth(1);

    this.add.existing(this.player);

    this.playerLegs = new Sprite(this, playerX, playerY, this.res.player)
      .setScale(1.5, 1.5)
      .setOrigin(.5, .5)
      .setDepth(.5)
      .setScrollFactor(1, 0);

    this.add.existing(this.playerLegs);

    // Animations setup
    this.anims.create({
      key: 'pickup_item_legs',
      frames: this.anims.generateFrameNumbers(this.res.player, { start: 0, end: 4 }),
      frameRate: 10,
      repeat: 0
    });

    this.pickupAnimation = this.anims.create({
      key: 'pickup_item_torso',
      frames: this.anims.generateFrameNumbers(this.res.player, { start: 12, end: 15 }),
      frameRate: 10,
      repeat: 0
    });

    this.explosion = this.anims.create({
      key: 'explosion_smoke',
      frames: this.anims.generateFrameNumbers(this.res.explosion, { start: 0, end: 6 }),
      frameRate: 10,
      repeat: 0
    });

    this.playerLegs.on('animationcomplete', animation => {
      if (animation.key === 'pickup_item_legs') {
        this.playerLegs.setFrame(0);
      }
    });

    this.player.on('animationcomplete', animation => {
      if (animation.key === 'pickup_item_torso') {
        if (this.itemInPlayerHand === null && !this.demolish) {
          // Update next items textures
          let upcomingX = this.upcomingItem1.x;

          this.upcomingItem1.setTexture(this.nextItemTypes[0].res);

          upcomingX += this.upcomingItem1.width + this.upcomingSpace;

          this.upcomingItem2.setTexture(this.nextItemTypes[1].res);
          this.upcomingItem2.x = upcomingX;

          upcomingX += this.upcomingItem2.width + this.upcomingSpace;

          this.upcomingItem3.setTexture(this.nextItemTypes[2].res);
          this.upcomingItem3.x = upcomingX;

          this.canSpawnItem = true;

          if (!config.spawnClick) {
            const { x, y } = this.worldToViewport(this.player.x, this.player.y);

            let opt;

            if (this.shapes[this.nextItem.itemType.name]) opt = { shape: this.shapes[this.nextItem.itemType.name] };
            this.itemInPlayerHand = this.nextItem.createItem(this, x, y, opt).setStatic(true).setDepth(2);

            this.conveyorBeltItem.destroy();
            this.conveyorBeltItem = null;
            this.nextItem = null;

            this.add.existing(this.itemInPlayerHand);
          }
        }
      }
    });
  }

  setVolumes() {
    this.hitSound.setVolume(this.soundsMuted ? 0 : .4);
    this.throwSound.setVolume(this.soundsMuted ? 0 : .4);
    this.missedSound.setVolume(this.soundsMuted ? 0 : .4);
    this.conveyorSound.setVolume(this.soundsMuted ? 0 : .4);
    this.music.setVolume(this.soundsMuted ? 0 : .2);
  };

  updatePlayer(delta) {
    const rotationFactor = 200;

    if (this.canSpawnItem) {
      const playerAngle = Math.atan2(this.input.mousePointer.x - this.player.x, -(this.input.mousePointer.y - this.player.y));
      const angle = Math.max(Math.min(playerAngle, Math.PI / 2), 0);

      if (angle > this.player.rotation) this.player.rotation = Math.min(angle, this.player.rotation + delta / rotationFactor);
      if (angle < this.player.rotation) this.player.rotation = Math.max(angle, this.player.rotation - delta / rotationFactor);

      // Match item in hand to player
      if (this.itemInPlayerHand !== null) {
        const { x: playerWorldX, y: playerWorldY } = this.viewportToWorld(this.player.x, this.player.y);

        const offset = this.player.height * this.player.scaleY / 2 + this.itemInPlayerHand.height * this.itemInPlayerHand.scaleY / 2 + 10;

        this.itemInPlayerHand.x = playerWorldX + Math.sin(this.player.rotation) * offset;
        this.itemInPlayerHand.y = playerWorldY - Math.cos(this.player.rotation) * offset;

        this.itemInPlayerHand.setRotation(this.player.rotation);
      }
    } else {
      if (this.player.rotation > 0) this.player.rotation -= delta / rotationFactor;
      if (this.player.rotation < 0) this.player.rotation = 0;
    }
  }

  panToBoat(time = 1000, y = null, ease = 'Sine.easeInOut') {
    this.debug('Pan: BOAT, y:', y);

    if (y === null) y = this.cameraCenter.y;

    const boatStartX = -this.boat.width * this.boat.scaleX - 80;
    const boatEndX = boatStartX + this.boat.width * this.boat.scaleX;

    this.followItem = null;
    this.cameras.main.pan(this.boat.x, y, time, ease);
  }

  panToPlayer(callback, ease = 'Sine.easeInOut') {
    this.debug('Pan: PLAYER');

    const time = this.cameras.main.scrollX;

    this.cameras.main.pan(this.cameraOrigin.x, this.screenCenter.y, time, ease);

    this.followItem = null;
    if (typeof callback === 'function') setTimeout(callback, time);
  }

  updateNextItemTypes() {
    while (this.nextItemTypes.length < 10) {
      this.nextItemTypes.push(this.getRandomItemType());
    }
  }

  startCutscene() {
    this.boss = new Image(this, 1600, 532, this.res.boss).setScale(2, 2).setOrigin(.5, 1);
    this.add.existing(this.boss);
  }

  onPreload() {
    DroppableItemType.preloadAll(this);

    // Audio setup
    this.load.audio('box_hit', [
      'assets/audio/default_hit.ogg',
      'assets/audio/default_hit.mp3'
    ]);

    this.load.audio('throw', [
      'assets/audio/default_throw.ogg',
      'assets/audio/default_throw.mp3'
    ]);

    this.load.audio('music', [
      'assets/audio/music.ogg',
      'assets/audio/music.mp3'
    ]);

    this.load.audio('missed', [
      'assets/audio/missed.ogg',
      'assets/audio/missed.mp3'
    ]);

    this.load.audio('conveyor', [
      'assets/audio/conveyor_fast.ogg',
      'assets/audio/conveyor_fast.mp3'
    ]);
  }

  onCreate() {
    this.debug('Game.onCreate()');

    this.updateNextItemTypes();
    this.nextItem = new NextItem(this.getRandomItemType());

    this.startCutscene();

    this.conveyorBeltItem = new Image(this, 0, this.conveyorBeltY, this.nextItem.itemType.res).setOrigin(1, 1).setScale(this.nextItem.scale).setScrollFactor(1, 0);
    this.add.existing(this.conveyorBeltItem);

    this.cameras.main.setBackgroundColor('#000000');

    const bgX = 1100, bgScale = 6;
    const bgImage = new Image(this, bgX, 720, this.res.background).setOrigin(.4, 1).setScale(bgScale, bgScale).setDepth(-10);

    this.add.existing(bgImage);
    this.add.existing(new Image(this, bgX + bgImage.width * bgScale, 720, this.res.background).setOrigin(.4, 1).setScale(bgScale, bgScale).setDepth(-10));

    if (!config.itemRain) this.createPlayer();

    this.health = new Health(config.health);
    this.health.on(0, () => {
      this.doDemolish();
      this.missedSound.play();
    });

    // Das Boot
    this.boat = new MatterImage(this.matter.world, this.boatX, 680, this.resources.boat, 0, {
      shape: this.shapes.boat
    }).setStatic(true).setScale(4, 4).setDepth(5);

    this.add.existing(this.boat);

    this.scoreText = new ScoreText(this);

    let upcomingX = 16, upcomingY = 16;

    this.upcomingText = new Text(this, upcomingX, upcomingY + 4, 'Next:', {
      fontSize: 20,
      fontFamily: 'Roundabout'
    }).setScrollFactor(0).setDepth(100);
    this.add.existing(this.upcomingText);

    this.missedText = new Text(this, upcomingX, upcomingY + 60, 'Miss: 0/3', {
      fontSize: 20,
      fontFamily: 'Roundabout'
    }).setScrollFactor(0).setDepth(100);
    this.add.existing(this.missedText);

    upcomingX += 54;

    // Next items
    this.upcomingItem1 = new Image(this, upcomingX, upcomingY, this.nextItemTypes[0].res).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.add.existing(this.upcomingItem1);

    upcomingX += this.upcomingItem1.width + this.upcomingSpace;

    this.upcomingItem2 = new Image(this, upcomingX, upcomingY, this.nextItemTypes[1].res).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.add.existing(this.upcomingItem2);

    upcomingX += this.upcomingItem2.width + this.upcomingSpace;

    this.upcomingItem3 = new Image(this, upcomingX, upcomingY, this.nextItemTypes[2].res).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.add.existing(this.upcomingItem3);

    // Audio
    this.hitSound = this.sound.add('box_hit');
    this.throwSound = this.sound.add('throw');
    this.missedSound = this.sound.add('missed');
    this.conveyorSound = this.sound.add('conveyor');
    this.music = this.sound.add('music');

    this.setVolumes(false);

    this.music.play({ loop: true });

    if (config.itemRain) {
      setInterval(() => {
        if (!this.demolish && this.roundItemCount < config.itemsPerRound) {
          this.spawnItem(Phaser.Math.FloatBetween(200, 1280 - 200), 0, false);
        }
      }, 100);
    }

    // Mute icon
    const muteIcon = new Image(this, 1280, 0, this.res.mutes1).setScrollFactor(0).setScale(.5, .5).setOrigin(1, 0).setDepth(100);
    this.add.existing(muteIcon);
  }

  onUpdate(time, delta) {
    this.updateNextItemTypes();

    if (this.cutSceneAnimation === true) {
      if (this.boss.x > 1000 && this.boss !== null) {
        this.boss.x -= .2 * delta;
      } else if (this.boss.x <= 1000 && this.boss !== null && this.speechBubble === null) {
        const offset = 50;

        this.speechBubble = new Image(this, 1084, 350 - offset, this.res.speechBubble).setScale(2.4, 1.5);

        //this.bossLine1 = new Text(this, 1010, 250, 'Get to work \nyou rusty\npiece of\ngarbage!\nDo you\nwant to\nget fired\non your\nfirst day,\nhuh?', {
        this.bossLine1 = new Text(this, 1000, 250 - offset, 'Get to work\nalready!!!\n\n\nJust click\nand drag,\nanyone could\ndo it!', {
          color: '#000000',
          fontSize: '14px',
          fontFamily: 'Lazytown'
        });

        this.bossLine2 = new Text(this, 1000, 390 - offset, '...can\'t believe\nI\'m paying robo-\nminimum wage\nfor this...', {
          color: '#000000',
          fontSize: '10px',
          fontFamily: 'Lazytown'
        });

        this.add.existing(this.speechBubble);
        this.add.existing(this.bossLine1);
        this.add.existing(this.bossLine2);
      }
    } else if (this.cutSceneAnimation === false) {
      if (this.boss !== null) {
        this.boss.x += .2 * delta;

        if (this.boss.x > 2000) {
          this.boss.destroy();
          this.boss = null;
        }
      }

      if (this.speechBubble !== null) {
        this.speechBubble.destroy();
        this.speechBubble = null;
      }

      if (this.bossLine1 !== null) {
        this.bossLine1.destroy();
        this.bossLine1 = null;
      }

      if (this.bossLine2 !== null) {
        this.bossLine2.destroy();
        this.bossLine2 = null;
      }
    }

    if (this.boatVelocity !== 0) {
      if (this.boatVelocity < 0 && (config.skipBoatArriving || this.boat.x < this.boatX)) {
        this.boat.x = this.boatX;
        this.boatVelocity = 0;

        if (config.itemRain) this.panToBoat(0);
        else this.player.setFrame(12);

        this.boat.x += delta * this.boatVelocity;
      } else if (this.boatVelocity > 0 && this.demolish) {
        this.boat.x -= delta * this.boatVelocity;

        // Move items along with the boat
        for (const item of this.staticItems) {
          if (item.scene) {
            item.x -= delta * this.boatVelocity;

            item.applyForce(new Vector2(0, 0));
          }
        }

        if (this.boat.x < -this.boat.width && !this.gameOver) {
          this.debug('Game over!');

          this.gameOver = true;

          const gameOverText = new Text(this, this.screenCenter.x, this.screenCenter.y - 50, 'GAME OVER', {
            fontSize: 100,
            fontFamily: 'Roundabout'
          }).setOrigin(.5, .5);

          const finalScoreText = new Text(this, this.screenCenter.x, this.screenCenter.y + 35, `Final Score: ${this.finalScore} m`, {
            fontSize: 60,
            fontFamily: 'Roundabout'
          }).setOrigin(.5, .5);

          const clickToRestartText = new Text(this, this.screenCenter.x, this.screenCenter.y + 100, '(click to play again!)', {
            fontSize: 40,
            fontFamily: 'Roundabout'
          }).setOrigin(.5, .5);

          const maxWidth = Math.max(gameOverText.width, finalScoreText.width, clickToRestartText.width);
          const totalHeight = gameOverText.height + finalScoreText.height +  clickToRestartText.height;

          const margin = 10;

          const gameOverRect = new Rectangle(
            this,
            this.screenCenter.x,
            this.screenCenter.y + 10,
            maxWidth + margin * 2,
            totalHeight + margin * 2,
            0x333333,
            .5
          );

          this.add.existing(gameOverRect);
          this.add.existing(gameOverText);
          this.add.existing(finalScoreText);
          this.add.existing(clickToRestartText);
        }
      }
    }

    for (let i = 0; i < this.items.length; i++) {
      const itemDimension = Math.max(this.items[i].height * this.items[i].scaleY, this.items[i].width * this.items[i].scaleX);

      // Delete items that are not in the boat
      if (
        this.items[i].y - itemDimension > this.cameras.main.worldView.bottom
        || this.items[i].x > this.boat.x + 1500
      ) {
        this.items[i].destroy();
        this.items.splice(i, 1);
        this.health.decrease();

        if (!this.demolish) this.missedSound.play();

        // Smoke particles
        let particles = this.add.particles(this.res.explosion);

        const explosion = this.explosion;

        let emitter = particles.createEmitter({
          x: this.player.x,
          y: this.player.y,
          frame: 0,
          quantity: 1,
          frequency: this.smokeDensity,
          angle: { min: 0, max: 30 },
          speed: 0,
          gravityY: -100,
          lifespan: { min: 1000, max: 2000 },
          particleClass: class AnimatedParticle extends Particle {
            constructor(emitter) {
              super(emitter);

              this.t = 0;
              this.i = 0;
            }

            update(delta, step, processors) {
              const result = super.update(delta, step, processors);

              this.t += delta;

              if (this.t >= explosion.msPerFrame) {
                this.i++;

                if (this.i >= explosion.frames.length) this.i = 0;

                this.frame = explosion.frames[this.i].frame;

                this.t -= explosion.msPerFrame;
              }

              return result;
            }
          }
        });
        emitter.setScrollFactor(1, 0);

        this.smokeDensity -= 300

        continue;
      }

      // Update item
      this.items[i].onUpdate(this.boat.x);
    }

    if (!this.demolish) {
      if (this.shouldRoundEnd()) this.newRound();

      if (!config.itemRain) this.updatePlayer(delta);
    }

    if (this.canSpawnItem && this.chargeStartTime !== null) {
      this.charge = (this.time.now - this.chargeStartTime) / this.chargeFactor;

      // Stop at max charge
      if (this.charge > this.maxCharge) this.stopCharge = true;
    }

    if (this.followItem) {
      if (this.followItem.scene) {
        if (this.cameras.main.midPoint.x < this.followItem.x && this.cameras.main.midPoint.x < this.boat.x + 60) {
          this.cameras.main.scrollX += delta;
        }

        /*
        if (this.cameras.main.midPoint.y < this.followItem.y && this.cameras.main.midPoint.y < this.cameraOrigin.y) {
          this.cameras.main.scrollY += delta;
        }
        */
      } else {
        this.followItem = null;
      }
    }

    if (this.charge !== null) {
      const positionCount = this.aimLineCount * 2;
      const timeFactor = 2;
      const gravity = 1;
      //const lineColor = 0x3333ff;
      const lineColor = 0xffffff;
      const angle = this.player.rotation - Math.PI / 2;
      const velocity = 520 * this.charge / this.itemInPlayerHand.itemType.mass;

      if (this.aimLines.length > 0) {
        for (const aimLine of this.aimLines) aimLine.destroy();

        this.aimLines = [];
      }

      if (!this.stopCharge && this.charge > this.minCharge) {
        const points = [];

        for (let i = 0; i < positionCount; i += 2) {
          const xy = time => [
            velocity * time * Math.cos(angle),
            velocity * time * Math.sin(angle) + (gravity * time * time) / 2,
          ];

          const [x1, y1] = xy(timeFactor * i);
          const [x2, y2] = xy(timeFactor * (i + 1));

          const aimLine = new Line(this, this.itemInPlayerHand.x, this.itemInPlayerHand.y, x1, y1, x2, y2, lineColor);

          aimLine.setDepth(-1).setOrigin(0, 0).setLineWidth(6).setAlpha(.75);

          this.aimLines.push(aimLine);
          this.add.existing(aimLine);
        }
      }
    }

    for (let i = 0; i < this.staticItems.length; i++) {
      if (!this.staticItems[i].scene) {
        this.debug('Destroying item with no scene:', this.staticItems[i]);

        this.staticItems.splice(i, 1);
      }
    }

    if (this.conveyorBeltItem !== null && this.conveyorBeltItem.x < this.conveyorBeltEndX) {
      this.conveyorBeltItem.x = Math.min(this.conveyorBeltItem.x + delta, this.conveyorBeltEndX);
    } else if (!this.firstItemPickedUp) {
      this.player.anims.play('pickup_item_torso', true);
      this.playerLegs.anims.play('pickup_item_legs', true);

      this.firstItemPickedUp = true;
    }

    if (this.missedText !== null) {
      this.missedText.setText(`Missed ${config.health - this.health} / ${config.health}`);
    }
  }

  debugStrings() {
    if (!config.debugTexts) return [];

    return [
      `Item Count: ${this.itemCount}`,
      `Round Item Count: ${this.roundItemCount}`,
      `Health: ${this.health}`,
      `Tower height: ${Math.floor(this.currentTowerHeight)} px`,
      `Missed: ${config.health - this.health} / ${config.health}`
    ];
  }
}

