import Particle from '/src/engine/objects/Particle';

export default class AnimatedParticle extends Particle {
  t = 0;
  i = 0;

  update(delta, step, processors) {
    const result = super.update(delta, step, processors);

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

