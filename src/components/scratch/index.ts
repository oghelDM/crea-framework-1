import gsap from 'gsap';
import { cover, getClientXY, map } from '../../utils/helper';
import { ScratchType, defaultValuesScratch } from './defaultValues';

export class Scratch extends HTMLElement {
  private props: ScratchType;
  private styleProps: any;

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private hasUserInteracted: boolean = false;
  private isReadyToDraw: boolean = false;
  private cursorOffset = { x: 0, y: 0 }; // the offset that depends on the custom cursor and the resize
  private imgFront: HTMLImageElement; // the image drawn on the canvas, that is to be scratched away
  private imgScratch: HTMLImageElement; // the image used to draw on the scratch canvas
  private cursorImage: HTMLImageElement; // the image used as a cursor
  private timeoutId: number;
  private originalSize = { width: 1, height: 1 }; // original canvas size, used to resize properly

  constructor(props: ScratchType, styleProps: any = {}) {
    super();

    this.props = { ...defaultValuesScratch, ...props };
    this.styleProps = { ...styleProps };

    const { id, onClick, redirectUrl, frontImageUrl } = this.props;

    this.setAttribute('id', id);

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', `${id}-canvas`);
    this.canvas.style.cursor = 'pointer';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');

    this.imgFront = new Image();
    this.imgFront.src = frontImageUrl;

    this.addEventListener('pointermove', (e) => this.pointerMove(e));
    this.addEventListener('click', () => onClick(redirectUrl));
    window.addEventListener('resize', () => {
      if (!this.cursorImage) {
        return;
      }
      const { width, height } = this.getBoundingClientRect();
      this.cursorOffset.x = (this.cursorImage.naturalWidth / 2 / width) * this.originalSize.width;
      this.cursorOffset.y = (this.cursorImage.naturalHeight / 2 / height) * this.originalSize.height;
    });
  }

  public init = (props?: ScratchType, styleProps?: any) => {
    this.props = { ...this.props, ...(props || {}) };

    const { debug, scratchImageUrl, backImageUrl, cursorUrl } = this.props;

    this.styleProps = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: debug ? '#ff00ff77' : 'unset',
      backgroundImage: `url(${backImageUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',

      ...(styleProps || {})
    };

    for (const [key, value] of Object.entries(this.styleProps)) {
      this.style[key] = value;
    }

    this.hasUserInteracted = false;

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

    const { width, height } = this.getBoundingClientRect();
    this.canvas.width = Math.ceil(width);
    this.canvas.height = height;
    this.originalSize = { width: this.canvas.width, height: this.canvas.height };

    if (this.imgFront.complete) {
      this.drawFrontImageOnCanvas();
    } else {
      this.imgFront.onload = () => this.drawFrontImageOnCanvas();
    }
  };

  drawFrontImageOnCanvas = () => {
    const {
      offsetX,
      offsetY,
      width: imageWidth,
      height: imageHeight
    } = cover(this.canvas.width, this.canvas.height, this.imgFront.naturalWidth, this.imgFront.naturalHeight);
    this.context.globalCompositeOperation = 'source-over';
    this.context.drawImage(this.imgFront, offsetX, offsetY, imageWidth, imageHeight);
    this.isReadyToDraw = true;
    // from now on, any drawing on the canvas is punch-through
    this.context.globalCompositeOperation = 'destination-out';
  };

  // called when the HTMLElement is added to the document
  connectedCallback() {
    this.init();
  }

  private pointerMove = (e) => {
    e.preventDefault();
    if (!this.isReadyToDraw) {
      return;
    }
    const { scratchImageUrl, scratchSizeCoeff, cursorAutoRotate, timeoutDuration } = this.props;
    const boundingClientRect = this.getBoundingClientRect();
    const { width, height } = boundingClientRect;
    const { x, y } = getClientXY(e, boundingClientRect);
    const xxx = map(x, 0, width, 0, this.canvas.width) + this.cursorOffset.x;
    const yyy = map(y, 0, height, 0, this.canvas.height) + this.cursorOffset.y;
    if (scratchImageUrl && this.imgScratch.complete) {
      const { naturalWidth, naturalHeight } = this.imgScratch;
      // default size is 10% of the smallest component dimension
      const sizeCoeff =
        (scratchSizeCoeff * 0.1 * Math.min(this.canvas.width, this.canvas.height)) /
        Math.max(naturalWidth, naturalHeight);
      const scratchImageWidth = naturalWidth * sizeCoeff;
      const scratchImageHeight = naturalHeight * sizeCoeff;
      this.context.save();
      this.context.translate(xxx, yyy);
      if (cursorAutoRotate) {
        this.context.rotate(Math.random() * Math.PI * 2);
      }
      this.context.translate(-scratchImageWidth / 2, -scratchImageHeight / 2);
      this.context.drawImage(this.imgScratch, 0, 0, scratchImageWidth, scratchImageHeight);
      this.context.restore();
    } else {
      // default diameter is 10% of the smallest component dimension
      const radius = (scratchSizeCoeff * 0.1 * Math.min(this.canvas.width, this.canvas.height)) / 2;
      this.context.beginPath();
      this.context.ellipse(xxx, yyy, radius, radius, 0, 0, 2 * Math.PI);
      this.context.fill();
    }

    if (!this.hasUserInteracted && timeoutDuration) {
      this.hasUserInteracted = true;
      this.timeoutId = window.setTimeout(() => {
        const dummy = { value: 1 };
        gsap.timeline().to(dummy, {
          value: 0,
          duration: 1,
          onUpdate: () => (this.canvas.style.opacity = `${dummy.value}`),
          onComplete: () => (this.canvas.style.cursor = 'cursor')
        });
      }, timeoutDuration);
    }
  };
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-scratch', Scratch);
