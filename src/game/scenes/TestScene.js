import Scene from '/src/engine/core/Scene';
import Text from '/src/engine/objects/Text';
import ImageResource from '/src/engine/resources/ImageResource';
import Image from '/src/engine/objects/Image';
import MatterImage from '/src/engine/objects/MatterImage';
import Vector2 from '/src/engine/math/Vector2';

import DroppableItem from '/src/game/objects/DroppableItem';

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

  //texts
  texts = {
    itemCount: null
  }

  //arrays
  boxes = [];

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

  //return item count
  getScoreText(){
    return `Item Count: ${this.itemCount}`;
  }

  getRoundItemCount(){
    return `Round Item Count: ${this.roundItemCount}`;
  }

  //Create box on mouse click
  onMouseDown(pointer) {

    if(this.boxes.length === 5) return;

    //create a box
    const box = new MatterImage(this.matter.world, pointer.x, pointer.y, this.resources.box).setScale(.2, .2);
    const drop = new DroppableItem(box);

    //increase item count and round item count
    this.itemCount++;
    this.roundItemCount++;

    //update text
    this.texts.itemCount.setText(this.getScoreText());
    this.texts.roundItemCount.setText(this.getRoundItemCount());

    //update boxes array
    this.boxes.push(drop);
  }

  onCreate() {
    console.log('Game.onCreate()');

    this.cameras.main.setBackgroundColor('#46bed9');

    //this.matter.world.setBounds();
    //this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 });

    //add boat
    const boat = new MatterImage(this.matter.world, 450, 550, this.resources.boat).setScale(2, 1).setStatic(true);
    this.add.existing(boat);

    //add item count txt
    this.texts.itemCount = new Text(this, this.screenCenter.x, this.screenCenter.y, this.getScoreText(), {
      fontSize: '32px'
    }).setOrigin(.5);
    this.add.existing(this.texts.itemCount);
    
    //add round item txt
    this.texts.roundItemCount = new Text(this, this.screenCenter.x, this.screenCenter.y + 40, this.getRoundItemCount(), {
      fontSize: '32px'
    }).setOrigin(.5);
    this.add.existing(this.texts.roundItemCount);  
  }

  onUpdate() {
    //delete boxes that are not in the boat

    for(let i = 0; i < this.boxes.length; i++){
      if(this.boxes[i].y > 600){
        console.log("Destroy box", this.boxes[i]);
        this.boxes[i].destroy();
        this.boxes.splice(i, 1);
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
}

