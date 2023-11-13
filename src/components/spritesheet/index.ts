import { SpritesheetType, defaultValuesSpritesheet } from './defaultValues';

export class Spritesheet extends HTMLElement {
  public framerate: number; // the number of milliseconds each frame is to be displayed
  public isBackwards: boolean; // whether the animation plays backwards
  public isLoop: boolean; // whether the animation plays backwards

  private requestId: number; // requestAnimationFrame id
  private last: number; //the last time the frame was updated
  private currFrame: number; // the currently displayed frame number
  private nbFrames: number; // total number of frames
  private nbFramesW: number; // the max number of frames in one line of the spritesheet
  private nbFramesH: number; // the max number of frames in one column of the spritesheet
  private spriteSheetUrls: string[];

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
      spriteWidth,
      spriteHeight,
      nbFramesW,
      nbFramesH,
      startFrame,
      framerate,
      nbFrames,
      spriteSheetUrls,
      isBackwards,
      isPaused,
      isLoop
    } = actualProps;

    this.currFrame = startFrame;
    this.nbFrames = nbFrames;
    this.last = Date.now();
    this.framerate = framerate;
    this.isBackwards = isBackwards;
    this.isLoop = isLoop;
    this.nbFramesW = nbFramesW;
    this.nbFramesH = nbFramesH;
    this.spriteSheetUrls = spriteSheetUrls;

    this.setAttribute('id', id);
    const actualStyle = {
      position: 'absolute',
      width: style.width ? style.width : 'unset',
      height: style.height ? style.height : 'unset',
      aspectRatio: `${spriteWidth / nbFramesW} / ${spriteHeight / nbFramesH}`,
      backgroundColor: debug ? '#ff00ff88' : 'unset',
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

    this.stop();
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
    const newFrame = (currFrame + (isBackwards ? -1 : 1) + nbFrames) % nbFrames;
    if (this.isLoop || Math.abs(newFrame - currFrame) === 1) {
      this.currFrame = newFrame;
    }
  };

  private updateBg = () => {
    const { currFrame, nbFramesW, nbFramesH } = this;
    const nbFramesPerSpritesheet = nbFramesW * nbFramesH;
    const spritesheetIndex = Math.floor(currFrame / nbFramesPerSpritesheet);
    this.style.backgroundImage = `url(${this.spriteSheetUrls[spritesheetIndex]})`;
    const i = (currFrame % nbFramesPerSpritesheet) % nbFramesW;
    const j = Math.floor((currFrame % nbFramesPerSpritesheet) / nbFramesW);
    this.style.backgroundPosition = `${(i * 100) / (nbFramesW - 1)}% ${(j * 100) / (nbFramesH - 1)}%`;
  };

  public start = () => {
    if (this.requestId !== undefined) {
      return; // spritesheet is already playing
    }
    this.last = undefined; // start right away
    this.checkUpdate();
  };

  public stop = () => {
    window.cancelAnimationFrame(this.requestId);
    this.requestId = undefined;
  };
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-spritesheet', Spritesheet);
