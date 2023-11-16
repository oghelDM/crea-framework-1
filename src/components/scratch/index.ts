import gsap from 'gsap';
import { ComponentBaseType } from '../../types';
import { cover, getClientXY, map } from '../../utils/helper';

interface ScratchType extends ComponentBaseType {
  backImageUrl: string;
  frontImageUrl: string;
  scratchImageUrl?: string;
  scratchSizeCoeff?: number;
  timeoutDuration?: number;
  cursorUrl?: string;
}

export class Scratch extends HTMLElement {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private hasUserInteracted: boolean = false;
  private isReadyToDraw: boolean = false;
  private frontImageUrl: string;
  private scratchImageUrl: string;
  private cursorOffset = { x: 0, y: 0 };
  private timeoutDuration: number;
  private scratchSizeCoeff: number;
  private imgScratch: HTMLImageElement;
  private cursorImage: HTMLImageElement;
  private timeoutId: number;
  private originalSize = { width: 1, height: 1 };

  constructor(props: ScratchType, style: any = {}) {
    super();

    this.setAttribute('id', props.id);

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', `${props.id}-canvas`);
    this.canvas.style.cursor = 'pointer';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');

    this.init(props, style);

    this.addEventListener('pointermove', (e) => this.pointerMove(e));
    this.addEventListener('click', () => props.onClick(props.redirectUrl));
    window.addEventListener('resize', () => {
      if (!this.cursorImage) {
        return;
      }
      const { width, height } = this.getBoundingClientRect();
      this.cursorOffset.x = (this.cursorImage.naturalWidth / 2 / width) * this.originalSize.width;
      this.cursorOffset.y = (this.cursorImage.naturalHeight / 2 / height) * this.originalSize.height;
    });
  }

  public init = (props: ScratchType, style: any = {}) => {
    const { debug, frontImageUrl, scratchImageUrl, timeoutDuration, cursorUrl, scratchSizeCoeff = 1 } = props;

    const actualStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: debug ? '#ff00ff77' : 'unset',
      // backgroundImage: `url(${backImageUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',

      ...style
    };

    for (const [key, value] of Object.entries(actualStyle)) {
      this.style[key] = value;
    }

    this.frontImageUrl = frontImageUrl;
    this.scratchImageUrl = scratchImageUrl;
    this.hasUserInteracted = false;
    this.timeoutDuration = timeoutDuration;
    this.scratchSizeCoeff = scratchSizeCoeff;

    if (cursorUrl) {
      this.cursorImage = new Image();
      this.cursorImage.src = cursorUrl;
      this.cursorImage.onload = () => {
        this.cursorOffset.x = this.cursorImage.naturalWidth / 2;
        this.cursorOffset.y = this.cursorImage.naturalHeight / 2;
        this.canvas.style.cursor = `url(${cursorUrl}), pointer`;
      };
    }

    this.canvas.style.opacity = '1';
    window.clearTimeout(this.timeoutId);

    if (scratchImageUrl) {
      this.imgScratch = new Image();
      this.imgScratch.src = scratchImageUrl;
    }
  };

  // called when the HTMLElement is added to the document
  connectedCallback() {
    this.onMounted();
  }

  public onMounted = () => {
    const { width, height } = this.getBoundingClientRect();
    this.canvas.width = Math.ceil(width);
    this.canvas.height = height;
    this.originalSize = { width: this.canvas.width, height: this.canvas.height };

    const imgFront = new Image();
    imgFront.src = this.frontImageUrl;
    imgFront.onload = () => {
      const {
        offsetX,
        offsetY,
        width: imageWidth,
        height: imageHeight
      } = cover(this.canvas.width, this.canvas.height, imgFront.naturalWidth, imgFront.naturalHeight);
      this.context.drawImage(imgFront, offsetX, offsetY, imageWidth, imageHeight);
      this.isReadyToDraw = true;
      // from now on, any drawing on the canvas is punch-through
      this.context.globalCompositeOperation = 'destination-out';
    };
  };

  private pointerMove = (e) => {
    e.preventDefault();
    if (!this.isReadyToDraw) {
      return;
    }
    const boundingClientRect = this.getBoundingClientRect();
    const { width, height } = boundingClientRect;
    const { x, y } = getClientXY(e, boundingClientRect);
    const xxx = map(x, 0, width, 0, this.canvas.width) + this.cursorOffset.x;
    const yyy = map(y, 0, height, 0, this.canvas.height) + this.cursorOffset.y;
    if (this.scratchImageUrl && this.imgScratch.complete) {
      const { naturalWidth, naturalHeight } = this.imgScratch;
      // default size is 10% of the smallest component dimension
      const sizeCoeff =
        (this.scratchSizeCoeff * 0.1 * Math.min(this.canvas.width, this.canvas.height)) /
        Math.max(naturalWidth, naturalHeight);
      const scratchImageWidth = naturalWidth * sizeCoeff;
      const scratchImageHeight = naturalHeight * sizeCoeff;
      this.context.save();
      this.context.translate(xxx, yyy);
      this.context.rotate(Math.random() * Math.PI * 2);
      this.context.translate(-scratchImageWidth / 2, -scratchImageHeight / 2);
      this.context.drawImage(this.imgScratch, 0, 0, scratchImageWidth, scratchImageHeight);
      this.context.restore();
    } else {
      // default diameter is 10% of the smallest component dimension
      const radius = (this.scratchSizeCoeff * 0.1 * Math.min(this.canvas.width, this.canvas.height)) / 2;
      this.context.beginPath();
      this.context.ellipse(xxx, yyy, radius, radius, 0, 0, 2 * Math.PI);
      this.context.fill();
    }

    if (!this.hasUserInteracted && this.timeoutDuration) {
      this.hasUserInteracted = true;
      this.timeoutId = window.setTimeout(() => {
        const dummy = { value: 1 };
        gsap.timeline().to(dummy, {
          value: 0,
          duration: 1,
          onUpdate: () => (this.canvas.style.opacity = `${dummy.value}`),
          onComplete: () => (this.canvas.style.cursor = 'cursor')
        });
      }, this.timeoutDuration);
    }
  };
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-scratch', Scratch);
