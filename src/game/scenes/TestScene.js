import Scene from '/src/engine/core/Scene';
import ImageResource from '/src/engine/resources/ImageResource';
import MatterImage from '/src/engine/objects/MatterImage';

import DroppableItemType from '/src/game/objects/DroppableItemType';
import DroppableItem from '/src/game/objects/DroppableItem';
import Health from '/src/game/objects/Health';

export default class TestScene extends Scene {
  resources = {
    boat: new ImageResource('assets/testboat.png'),
    box: new ImageResource('assets/testbox.png')
  };

  eventHandlers = {
    input: {
      pointerdown: this.onMouseDown
    }
  }

  itemCount = 0;
  roundItemCount = 0;
  health = null;

  boxes = [];

  currentItemType = null;

  nextItemTypes = [
    DroppableItemType.SHIPPING_CONTAINER,
    DroppableItemType.SAFE,
    DroppableItemType.WOODEN_CRATE,
    DroppableItemType.CARDBOARD_BOX,
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

  // Create box on mouse click
  onMouseDown(pointer) {
    if (this.roundItemCount === 5) return;

    if (this.currentItemType !== null) this.nextItemTypes.push(this.currentItemType);
    this.currentItemType = this.nextItemTypes.shift();

    const item = new DroppableItem(this.matter.world, pointer.x, pointer.y, this.currentItemType.res)
      .setScale(1, 1)
      .setDensity(this.currentItemType.density)
      .setFriction(this.currentItemType.friction)
      .setFrictionAir(this.currentItemType.frictionAir);

    this.add.existing(item);

    // Increase item count and round item count
    this.itemCount++;
    this.roundItemCount++;

    // Update boxes array
    this.boxes.push(item);
  }

  onPreload() {
    DroppableItemType.preloadAll(this);
  }

  onCreate() {
    console.log('Game.onCreate()');

    this.cameras.main.setBackgroundColor('#46bed9');

    this.health = new Health(3);
    // esimerkki this.health.on(0, kuolemafunktio)
    //this.matter.world.setBounds();
    //this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 });

    // Add boat
    const boat = new MatterImage(this.matter.world, this.screenCenter.x, 685, this.resources.boat).setScale(2, 1).setStatic(true);
    this.add.existing(boat);
  }

  onUpdate() {
    // Delete boxes that are not in the boat
    for (let i = 0; i < this.boxes.length; i++){
      if (this.boxes[i].y > 720){
        console.log('Destroy box', this.boxes[i]);
        this.boxes[i].destroy();
        this.boxes.splice(i, 1);
        this.health.decrease();
      }
    }

    // Check if there are 5 boxes
    if (this.roundItemCount === 5){
      let allBoxesStatic = true;

      // Check if all boxes are staying still
      for (const box of this.boxes){
        if (!box.hasStopped) allBoxesStatic = false;
      }

      // Make all boxes static if all are still
      if (allBoxesStatic){
        for (const box of this.boxes){
          box.setStatic(true);
          this.boxes = [];
          this.roundItemCount = 0;
        }
      }
    }
  }

  debugStrings(){
    return [
      `Item Count: ${this.itemCount}`,
      `Round Item Count: ${this.roundItemCount}`,
      `Health: ${this.health}`
    ];
  }
}

