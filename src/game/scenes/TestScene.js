import Scene from '/src/engine/core/Scene';
import Text from '/src/engine/objects/Text';
import ImageResource from '/src/engine/resources/ImageResource';
import Image from '/src/engine/objects/Image';
import MatterImage from '/src/engine/objects/MatterImage';
import Vector2 from '/src/engine/math/Vector2';

import DroppableItemType from '/src/game/objects/DroppableItemType';
import DroppableItem from '/src/game/objects/DroppableItem';
import Health from '../objects/Health';

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

  //variables
  itemCount = 0;
  roundItemCount = 0;
  health = null;

  //texts
  texts = {
    itemCount: null
  }

  //arrays
  boxes = [];

  currentItemType = DroppableItemType.SHIPPING_CONTAINER;

  nextItemsType = [
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

  //Create box on mouse click
  onMouseDown(pointer) {

    if(this.roundItemCount === 5) return;

    //create a box
    const box = new MatterImage(this.matter.world, pointer.x, pointer.y, this.currentItemType.res).setMass(this.currentItemType.mass);
    const drop = new DroppableItem(box);
    console.log(this.currentItemType.res);

    //increase item count and round item count
    this.itemCount++;
    this.roundItemCount++;

    //update boxes array
    this.boxes.push(drop);
  }

  onPreload() {
    DroppableItemType.preloadAll();
  }

  onCreate() {
    console.log('Game.onCreate()');

    this.cameras.main.setBackgroundColor('#46bed9');

    this.health = new Health(3);
    // esimerkki this.health.on(0, kuolemafunktio)
    //this.matter.world.setBounds();
    //this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 });

    //add boat
    const boat = new MatterImage(this.matter.world, this.screenCenter.x, 685, this.resources.boat).setScale(2, 1).setStatic(true);
    this.add.existing(boat);
  }

  onUpdate() {
    //delete boxes that are not in the boat
    for(let i = 0; i < this.boxes.length; i++){
      if(this.boxes[i].y > 720){
        console.log("Destroy box", this.boxes[i]);
        this.boxes[i].destroy();
        this.boxes.splice(i, 1);
        this.health.decrease();
      } 
    }
    
    //check if there are 5 boxes
    if (this.roundItemCount === 5){
      let allBoxesStatic = true;

      //check if all boxes are staying still
      for (const box of this.boxes){
        if (!box.hasStopped) allBoxesStatic = false;
      }

      //make all boxes static if all are still
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
    ]
  }

}

