import { gsap, Power1 } from 'gsap';
import { getClientXY } from '../utils/helper';
import { createDiv } from '../utils/divMaker';

interface IndexManagerType {
  id: string;
  focusedElementWidth: number; // the width in percent, occupied by the focused element
  startIndex?: number;
  onIndexChange?: (index: number) => void; // callback used when the currentIndex is updated
  easing?: gsap.EaseFunction;
  interactive?: boolean;
  autoPlay?: boolean;
  speedCoefficient?: number;
  debug?: boolean;
}

export class IndexManager extends HTMLElement {
  mouseX: number;
  mouseY: number;
  focusedElementWidth: number;
  isMouseDown: boolean = false;
  previousIndex: number;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  easing: gsap.EaseFunction;
  speedCoefficient: number;
  debug: boolean;
  debugDiv: HTMLElement;

  private autoPlayTimeoutId: number;
  private autoPlayIntervalId: number;

  constructor(
    {
      id,
      focusedElementWidth,
      startIndex = 0,
      onIndexChange = (_: number) => {},
      easing = Power1.easeOut,
      interactive = true,
      speedCoefficient = 1,
      autoPlay = false,
      debug = false
    }: IndexManagerType,
    style: any = {}
  ) {
    super();

    this.setAttribute('id', id);
    this.previousIndex = startIndex;
    this.currentIndex = startIndex;
    this.focusedElementWidth = focusedElementWidth;
    this.onIndexChange = onIndexChange;
    this.easing = easing;
    this.speedCoefficient = speedCoefficient;
    this.debug = debug;

    const actualStyle = {
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 1,
      scale: 1,
      backgroundColor: debug ? '#00ff00aa' : 'unset',

      ...style
    };

    for (const [key, value] of Object.entries(actualStyle)) {
      this.style[key] = value;
    }

    if (interactive) {
      this.setUpPointerEvents();
    }

    if (autoPlay) {
      this.startAutoPlay();
    }
    if (debug) {
      this.debugDiv = createDiv('currIdx', {
        backgroundColor: '#ffffff88',
        position: 'absolute',
        pointerEvents: 'none',
        padding: '2px 8px',
        fontFamily: 'monospace',
        fontSize: '18px'
      });
      this.appendChild(this.debugDiv);
    }
    this.update();
  }

  setUpPointerEvents = () => {
    this.addEventListener('pointerdown', (e: PointerEvent) => this.onMouseDown(e));
    this.addEventListener('pointermove', (e: PointerEvent) => this.onMouseMove(e));
    this.addEventListener('pointerup', () => this.onMouseUp());
    this.addEventListener('pointerout', () => this.onMouseUp());
    this.addEventListener('pointerleave', () => this.onMouseUp());
  };

  update = () => {
    this.onIndexChange(this.currentIndex);
    if (this.debug) {
      this.debugDiv.innerText = this.currentIndex.toFixed(2);
    }
  };

  onMouseDown = (e: PointerEvent) => {
    if (this.autoPlayTimeoutId || this.autoPlayIntervalId) {
      window.clearTimeout(this.autoPlayTimeoutId);
      window.clearInterval(this.autoPlayIntervalId);
      this.autoPlayTimeoutId = undefined;
      this.autoPlayIntervalId = undefined;
    }

    this.isMouseDown = true;
    gsap.killTweensOf(this);
    const clientXY = getClientXY(e);
    this.mouseX = clientXY.x;
    this.mouseY = clientXY.y;
  };

  onMouseMove = (e: PointerEvent) => {
    if (!this.isMouseDown) {
      return;
    }
    this.previousIndex = this.currentIndex;

    const clientXY = getClientXY(e);
    const mouseX = clientXY.x;
    const mouseY = clientXY.y;

    const dx = mouseX - this.mouseX;

    const focusedElementWidthPixels = (this.getBoundingClientRect().width * this.focusedElementWidth) / 100;
    this.currentIndex += dx / focusedElementWidthPixels;

    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.update();
  };

  onMouseUp = () => {
    console.log('onMouseUp');
    if (!this.isMouseDown) {
      return;
    }
    this.isMouseDown = false;
    const dx = (this.currentIndex - this.previousIndex) * 10;
    const targetIndex = Math.round(this.currentIndex + dx); //dx > 0 ? Math.ceil(this.currentIndex + dx) : Math.floor(this.currentIndex + dx);
    this.goToIndex(targetIndex);
  };

  goToIndex = (targetIndex: number) => {
    const duration = (0.1 + Math.abs(targetIndex - this.currentIndex) * 0.2) * this.speedCoefficient;
    gsap.killTweensOf(this);
    gsap.timeline().to(this, {
      currentIndex: targetIndex,
      duration,
      ease: this.easing,
      onUpdate: () => this.update()
    });
  };

  startAutoPlay = (delay: number = 3, frequency: number = 1.5, deltaIndex: number = 1) => {
    this.autoPlayTimeoutId = window.setTimeout(() => {
      this.autoPlayIntervalId = window.setInterval(
        () => this.goToIndex(Math.round(this.currentIndex + deltaIndex)),
        frequency * 1000
      );
    }, delay);
  };
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-index-manager', IndexManager);
