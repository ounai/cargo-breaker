import ImageResource from '/src/engine/resources/ImageResource';
import JSONResource from '/src/engine/resources/JSONResource';

import Scene from '/src/engine/core/Scene';
import Image from '/src/engine/objects/Image';
import MatterImage from '/src/engine/objects/MatterImage';

import DroppableItemType from '/src/game/objects/DroppableItemType';
import DroppableItem from '/src/game/objects/DroppableItem';
import Health from '/src/game/objects/Health';
import ScoreText from '/src/game/objects/ScoreText';

export default class TestScene extends Scene {
  resources = {
    boat: new ImageResource('assets/boat.png'),
    boatData: new JSONResource('assets/boat.json'),
    background: new ImageResource('assets/background.png')
  };

  eventHandlers = {
    input: {
      pointerdown: this.onMouseDown
    }
  }

  itemsPerRound = 3;

  itemCount = 0;
  roundItemCount = 0;
  currentTowerHeight = 0;
  lastTowerHeight = null;

  scoreText = null;
  boat = null;
  health = null;
  items = [];

  currentItemType = null;

  nextItemTypes = [
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
    DroppableItemType.WIDE_PLANK
  ];

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
            showBody: true,
            showStaticBody: true
          }
        }
      }
    });
  }

  // Create item on mouse click
  onMouseDown(pointer) {
    if (this.roundItemCount === this.itemsPerRound) return;

    if (this.currentItemType !== null) this.nextItemTypes.push(this.currentItemType);
    this.currentItemType = this.nextItemTypes.shift();

    const itemPosition = this.viewportToWorld(pointer.x, pointer.y);
    const item = new DroppableItem(this.currentItemType, this.matter.world, itemPosition.x, itemPosition.y, this.currentItemType.res);
    this.add.existing(item);

    // Increase item count and round item count
    this.itemCount++;
    this.roundItemCount++;

    // Update items array
    this.items.push(item);
  }

  shouldRoundEnd() {
    // Check if there are itemsPerRound items
    if (this.roundItemCount === this.itemsPerRound) {
      let allItemsStatic = true;

      // Check if all items are staying still
      for (const item of this.items) {
        if (!item.hasStopped) allItemsStatic = false;
      }

      return allItemsStatic;
    }

    return false;
  }

  moveCamera() {
    const y = Math.min(this.cameraCenter.y, this.cameraOrigin.y - this.currentTowerHeight + 400);
    const diff = Math.abs(this.cameraCenter.y - y);
    const timeMs = 8 * Math.floor(diff);

    this.cameras.main.pan(this.cameraCenter.x, y, timeMs, 'Sine.easeInOut');
  }

  newRound() {
    for (const item of this.items) {
      item.setStatic(true);
      item.setTint(0x7878ff);

      this.currentTowerHeight = Math.max(this.currentTowerHeight, 720 - item.y);
      this.scoreText.updateScore(Math.floor(Math.max(this.currentTowerHeight, 720 - item.y)) / 50);
    }

    this.items = [];
    this.roundItemCount = 0;

    if (this.lastTowerHeight === null) this.lastTowerHeight = this.currentTowerHeight;
    else if (this.lastTowerHeight < this.currentTowerHeight - 100) {
      this.moveCamera();

      this.lastTowerHeight = this.currentTowerHeight;
    }
  }

  onPreload() {
    DroppableItemType.preloadAll(this);
  }

  onCreate() {
    this.debug('Game.onCreate()');

    this.cameras.main.setBackgroundColor('#000000');

    const backgroundImage = new Image(this, 0, 720, this.res.background);
    backgroundImage.setOrigin(.5, 1).setScale(5.4, 6);
    this.add.existing(backgroundImage);

    this.health = new Health(3);
    // esimerkki this.health.on(0, kuolemafunktio)

    // Das Boot
    this.boat = new MatterImage(this.matter.world, this.screenCenter.x, 700, this.resources.boat, 0, {
      shape: this.cache.json.get(this.res.boatData).boat
    }).setStatic(true).setScale(3, 3).setDepth(1);

    this.add.existing(this.boat);

    this.scoreText = new ScoreText(this);
  }

  onUpdate() {
    for (let i = 0; i < this.items.length; i++) {
      // Delete items that are not in the boat
      if (this.items[i].y > this.cameras.main.worldView.bottom) {
        this.items[i].destroy();
        this.items.splice(i, 1);
        this.health.decrease();

        continue;
      }

      // Update item
      this.items[i].onUpdate(this.boat.x);
    }

    if (this.shouldRoundEnd()) this.newRound();
  }

  debugStrings(){
    return [
      `Item Count: ${this.itemCount}`,
      `Round Item Count: ${this.roundItemCount}`,
      `Health: ${this.health}`,
      `Tower height: ${this.currentTowerHeight} px`
    ];
  }
}

