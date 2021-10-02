import Scene from '/src/engine/core/Scene';
import Text from '/src/engine/objects/Text';
import ImageResource from '/src/engine/resources/ImageResource';
import Image from '/src/engine/objects/Image';
import MatterImage from '/src/engine/objects/MatterImage';
import Vector2 from '/src/engine/objects/Vector2';


export default class TestScene extends Scene {

  resources = {
    background: new ImageResource('assets/testbg.png'),
    boat: new ImageResource('assets/testboat.png'),
    box: new ImageResource('assets/testbox.png')
  };

  constructor() {
    super({
      physics: {
        default: 'matter',
        matter: {
          enableSleeping: true,
          gravity: {
            y: 0
          },
          debug: {
            showBody: true,
            showStaticBody: true
          }
        }
      }
    });
  }

  onCreate() {
    console.log('Game.onCreate()');

    //setup images
    const background = new Image(this, 0, 0, this.resources.background);
    background.setOrigin(0, 0);
    this.add.existing(background);

    //images with matter
    const boat = new MatterImage(this.matter.world, 450, 550, this.resources.boat);
    boat.setScale(2, 1);
    this.add.existing(boat);

    const box = new MatterImage(this.matter.world, 400, 400, this.resources.box);
    box.setScale(0.2, 0.2);
    this.add.existing(box);

    this.add.existing(new Text(this, 50, 50, 'UNSTABLE VEIKKIS MOD'));

    //var graphics = this.add.graphics({ fillStyle:{ color: 0xaa0000 } });
    //var rect = new Phaser.Geom.Rectangle(550, 450, 350, 170);
    //graphics.fillRectShape(rect);
  }

  onUpdate() {}
}

