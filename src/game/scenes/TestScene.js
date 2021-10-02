import Scene from '/src/engine/core/Scene';
import Text from '/src/engine/objects/Text';
import ImageResource from '/src/engine/resources/ImageResource';
import Image from '/src/engine/objects/Image';
import MatterImage from '/src/engine/objects/MatterImage';
import Vector2 from '/src/engine/math/Vector2';

import DroppableItem from '/src/game/objects/DroppableItem';

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

  onCreate() {
    console.log('Game.onCreate()');

    this.matter.world.setBounds();
    this.matter.add.mouseSpring({ length: 1, stiffness: 0.6 });

    const background = new Image(this, 0, 0, this.resources.background).setOrigin(0, 0);
    this.add.existing(background);

    const boat = new MatterImage(this.matter.world, 450, 550, this.resources.boat).setScale(2, 1);
    this.add.existing(boat);

    const box = new MatterImage(this.matter.world, 400, 400, this.resources.box).setScale(.2, .2);
    //this.add.existing(box);

    const drop = new DroppableItem(box);

    const text = new Text(this, this.screenCenter.x, this.screenCenter.y, 'UNSTABLE', {
      fontSize: '32px'
    }).setOrigin(.5);
    this.add.existing(text);
  }

  onUpdate() {}
}

