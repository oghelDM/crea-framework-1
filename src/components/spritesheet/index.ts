import { SpritesheetType, defaultValuesSpritesheet } from './defaultValues';

export class Spritesheet extends HTMLElement {
  public framerate: number; // the number of milliseconds each frame is to be displayed
  public isBackwards: boolean; // whether the animation plays backwards

  private requestId: number; // requestAnimationFrame id
  private last: number; //the last time the frame was updated
  private currFrame: number; // the currently displayed frame number
  private nbFrames: number; // total number of frames
  private nbFramesW: number; // the max number of frames in one line of the spritesheet
  private nbFramesH: number; // the max number of frames in one column of the spritesheet

  constructor(props: SpritesheetType, style: any = {}) {
    super();

    this.init(props, style);
  }

  public init(props, style) {
    const actualProps: SpritesheetType = {
      ...defaultValuesSpritesheet,
      ...props
    };
    const {
      id,
      debug,
      onClick,
      redirectUrl,
      frameWidth,
      frameHeight,
      startFrame,
      framerate,
      nbFrames,
      spriteSheetUrls,
      nbFramesW,
      isBackwards,
      isPaused
    } = actualProps;

    this.currFrame = startFrame;
    this.nbFrames = nbFrames;
    this.last = Date.now();
    this.framerate = framerate;
    this.isBackwards = isBackwards;
    this.nbFramesW = nbFramesW;
    this.nbFramesH = Math.ceil(nbFrames / nbFramesW);

    this.setAttribute('id', id);
    const actualStyle = {
      position: 'absolute',
      width: style.width ? style.width : 'unset',
      height: style.height ? style.height : 'unset',
      aspectRatio: `${frameWidth} / ${frameHeight}`,
      backgroundColor: debug ? '#ff00ff88' : 'unset',
      backgroundImage: `url(${spriteSheetUrls[0]})`,
      backgroundSize: `${this.nbFramesW * 100}%`,
      backgroundPosition: '0 0',
      backgroundRepeat: 'no-repeat',

      ...style
    };
    for (const [key, value] of Object.entries(actualStyle)) {
      this.style[key] = value;
    }
    this.updateBg();

    this.addEventListener('click', () => onClick(redirectUrl)); // TODO: check it is not triggered several times

    window.cancelAnimationFrame(this.requestId);
    if (!isPaused) {
      this.checkUpdate();
    }
  }

  private checkUpdate = () => {
    const now = Date.now();
    if (!this.last || now - this.last >= this.framerate) {
      this.last = now;
      this.update();
    }
    this.requestId = requestAnimationFrame(this.checkUpdate);
  };

  private update = () => {
    this.updateBg();
    const { currFrame, nbFrames, isBackwards } = this;
    this.currFrame = (currFrame + (isBackwards ? -1 : 1) + nbFrames) % nbFrames;
  };

  private updateBg = () => {
    const { currFrame, nbFramesW: nbImagesW, nbFramesH: nbImagesH } = this;
    const i = currFrame % nbImagesW;
    const j = Math.floor(currFrame / nbImagesW);
    this.style.backgroundPosition = `${(i * 100) / (nbImagesW - 1)}% ${(j * 100) / (nbImagesH - 1)}%`;
  };

  public start = () => {
    window.cancelAnimationFrame(this.requestId);
    this.last = undefined; // start right away
    this.checkUpdate();
  };

  public stop = () => window.cancelAnimationFrame(this.requestId);
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-spritesheet', Spritesheet);
