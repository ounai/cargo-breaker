import Particle from '/src/engine/objects/Particle';

class AnimatedParticle extends Phaser.GameObjects.Particles.Particle {
  constructor(emitter) {
    super(emitter);

    this.t = 0;
    this.i = 0;
  }

  update(delta, step, processors) {
    var result = super.update(delta, step, processors);

    this.t += delta;

    if (this.t >= anim.msPerFrame) {
      this.i++;

      if (this.i > 17) this.i = 0;

      this.frame = anim.frames[this.i].frame;

      this.t -= anim.msPerFrame;
    }

    return result;
  }
}

