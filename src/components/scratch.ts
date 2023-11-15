import gsap from 'gsap';
import { ComponentBaseType } from '../types';
import { cover, getClientXY, map } from '../utils/helper';

interface ScratchType extends ComponentBaseType {
  backImageUrl: string;
  frontImageUrl: string;
  radius?: number;
  timeoutDuration?: number;
  cursorUrl?: string;
}

export class Scratch extends HTMLElement {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private hasUserInteracted: boolean = false;
  private isReadyToDraw: boolean = false;
  private frontImageUrl: string;

  constructor(props: ScratchType, style: any = {}) {
    super();

    const {
      id,
      debug,
      onClick,
      redirectUrl,
      backImageUrl,
      frontImageUrl,
      radius = 20,
      timeoutDuration,
      cursorUrl
    } = props;

    this.setAttribute('id', id);

    const actualStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: debug ? '#ff00ff77' : 'unset',
      backgroundImage: `url(${backImageUrl})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',

      ...style
    };
    for (const [key, value] of Object.entries(actualStyle)) {
      this.style[key] = value;
    }

    this.frontImageUrl = frontImageUrl;

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', `${id}-canvas`);
    this.canvas.style.cursor = `pointer`;

    this.context = this.canvas.getContext('2d');

    const cursorOffset = { x: 0, y: 0 };
    if (cursorUrl) {
      const cursorImage = new Image();
      cursorImage.src = cursorUrl;
      cursorImage.onload = () => {
        cursorOffset.x = cursorImage.naturalWidth / 2;
        cursorOffset.y = cursorImage.naturalHeight / 2;
        this.canvas.style.cursor = `url(${cursorUrl}), pointer`;
      };
    }

    this.appendChild(this.canvas);

    this.addEventListener('click', () => onClick(redirectUrl));

    this.addEventListener(
      'pointermove',
      (e) => {
        e.preventDefault();
        if (!this.isReadyToDraw) {
          return;
        }
        const boundingClientRect = this.getBoundingClientRect();
        const { width, height } = boundingClientRect;
        const { x, y } = getClientXY(e, boundingClientRect);
        const xxx = map(x, 0, width, 0, this.canvas.width) + cursorOffset.x;
        const yyy = map(y, 0, height, 0, this.canvas.height) + cursorOffset.y;
        this.context.beginPath();
        this.context.ellipse(xxx, yyy, radius, radius, 0, 0, 2 * Math.PI);
        this.context.fill();

        if (!this.hasUserInteracted && timeoutDuration) {
          this.hasUserInteracted = true;
          setTimeout(() => {
            const dummy = { value: 1 };
            gsap.timeline().to(dummy, {
              value: 0,
              duration: 1,
              onUpdate: () => (this.canvas.style.opacity = `${dummy.value}`),
              onComplete: () => (this.canvas.style.cursor = 'cursor')
            });
          }, timeoutDuration);
        }
      },
      false
    );
    window.addEventListener('resize', () => {
      const { width, height } = this.getBoundingClientRect();
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
    });
  }

  // called when the HTMLElement is added to the document
  connectedCallback() {
    const { width, height } = this.getBoundingClientRect();
    this.canvas.width = Math.ceil(width);
    this.canvas.height = height;

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
  }
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-scratch', Scratch);
