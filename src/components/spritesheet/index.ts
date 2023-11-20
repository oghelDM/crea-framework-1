import { SpritesheetType, defaultValuesSpritesheet } from './defaultValues';

export class Spritesheet extends HTMLElement {
  private props: SpritesheetType;

  private requestId: number; // requestAnimationFrame id
  private last: number; //the last time the frame was updated
  private currFrame: number; // the currently displayed frame number

  constructor(props: SpritesheetType, styleProps: any = {}) {
    super();

    this.init({ ...defaultValuesSpritesheet, ...props }, styleProps);
  }

  public init(props: SpritesheetType, styleProps: any) {
    this.props = { ...this.props, ...props };

    const { id, debug, onClick, redirectUrl, spriteWidth, spriteHeight, nbFramesW, nbFramesH, startFrame, isPaused } =
      this.props;

    this.currFrame = startFrame;
    this.last = Date.now();

    this.setAttribute('id', id);
    const actualStyle = {
      position: 'absolute',
      width: styleProps.width ? styleProps.width : 'unset',
      height: styleProps.height ? styleProps.height : 'unset',
      aspectRatio: `${spriteWidth / nbFramesW} / ${spriteHeight / nbFramesH}`,
      backgroundColor: debug ? '#ff00ff88' : 'unset',
      backgroundSize: `${nbFramesW * 100}%`,
      backgroundPosition: '0 0',
      backgroundRepeat: 'no-repeat',

      ...styleProps
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
    if (!this.last || now - this.last >= this.props.framerate) {
      this.last = now;
      this.update();
    }
    this.requestId = requestAnimationFrame(this.checkUpdate);
  };

  private update = () => {
    this.updateBg();
    const { currFrame } = this;
    const { nbFrames, isBackwards, isLoop } = this.props;
    const newFrame = (currFrame + (isBackwards ? -1 : 1) + nbFrames) % nbFrames;
    if (isLoop || Math.abs(newFrame - currFrame) === 1) {
      this.currFrame = newFrame;
    }
  };

  private updateBg = () => {
    const { currFrame } = this;
    const { nbFramesW, nbFramesH, spriteSheetUrls } = this.props;
    const nbFramesPerSpritesheet = nbFramesW * nbFramesH;
    const spritesheetIndex = Math.floor(currFrame / nbFramesPerSpritesheet);
    this.style.backgroundImage = `url(${spriteSheetUrls[spritesheetIndex]})`;
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
