import { gsap, Power1 } from 'gsap';
import { getClientXY } from '../utils/helper';
import { createDiv } from '../utils/divMaker';
import { ComponentBaseType } from '../types';

export interface IndexManagerType extends ComponentBaseType {
  focusedElementWidth: number; // the width in percent, occupied by the focused element
  focusedElementHeight: number; // the height in percent, occupied by the focused element
  startIndex?: number;
  onIndexChange?: (index: number) => void; // callback used when the currentIndex is updated
  easing?: gsap.EaseFunction;
  interactive?: boolean;
  autoPlay?: boolean;
  speedCoefficient?: number;
  isVertical?: boolean; // whether the user interaction should be vertical or not
  onClick: (url: string) => void;
}

export class IndexManager extends HTMLElement {
  mouseXorY: number;
  isMouseDown: boolean = false;
  mouseHasMoved: boolean = false;
  previousIndex: number;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  easing: gsap.EaseFunction;
  speedCoefficient: number;
  debug: boolean;
  debugCurrentIndexDiv: HTMLElement;
  debugElementDiv: HTMLElement;
  focusedElementWidth: number;
  focusedElementHeight: number;
  isVertical: boolean;
  onClick: (url: string) => void;
  redirectUrl: string;

  private autoPlayTimeoutId: number;
  private autoPlayIntervalId: number;

  constructor(
    {
      id,
      startIndex = 0,
      onIndexChange = (_: number) => {},
      easing = Power1.easeOut,
      interactive = true,
      speedCoefficient = 1,
      autoPlay = false,
      debug = false,
      focusedElementWidth,
      focusedElementHeight,
      isVertical = false,
      onClick,
      redirectUrl
    }: IndexManagerType,
    style: any = {}
  ) {
    super();

    this.setAttribute('id', id);
    this.previousIndex = startIndex;
    this.currentIndex = startIndex;
    this.onIndexChange = onIndexChange;
    this.easing = easing;
    this.speedCoefficient = speedCoefficient;
    this.debug = debug;
    this.focusedElementWidth = focusedElementWidth;
    this.focusedElementHeight = focusedElementHeight;
    this.isVertical = isVertical;
    this.onClick = onClick;
    this.redirectUrl = redirectUrl;

    const actualStyle = {
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 1,
      backgroundColor: debug ? '#00ff0088' : 'unset',
      overflow: 'hidden',

      ...style
    };

    for (const [key, value] of Object.entries(actualStyle)) {
      this.style[key] = value;
    }

    if (interactive) {
      this.setUpPointerEvents(id);
    }

    if (autoPlay) {
      this.startAutoPlay();
    }

    if (debug) {
      this.debugElementDiv = createDiv('debugElementDiv', {
        width: `${focusedElementWidth}%`,
        height: '100px',
        backgroundColor: 'red',
        opacity: 0.8,
        position: 'absolute',
        bottom: '0',
        pointerEvents: 'none'
      });
      this.appendChild(this.debugElementDiv);
      this.debugCurrentIndexDiv = createDiv('currIdx', {
        backgroundColor: '#ffffff88',
        position: 'absolute',
        pointerEvents: 'none',
        padding: '2px 8px',
        fontFamily: 'monospace',
        fontSize: '18px'
      });
      this.appendChild(this.debugCurrentIndexDiv);
    }
  }

  private setUpPointerEvents = (id: string): void => {
    const interactionDiv = createDiv(`${id}-interaction`, {
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: this.debug ? '#0000ffaa' : 'unset'
    });
    this.appendChild(interactionDiv);

    interactionDiv.addEventListener('pointerdown', (e: PointerEvent) => this.onMouseDown(e));
    interactionDiv.addEventListener('pointermove', (e: PointerEvent) => this.onMouseMove(e));
    interactionDiv.addEventListener('pointerup', () => this.onMouseUp());
    interactionDiv.addEventListener('pointerout', () => this.onMouseUp());
    interactionDiv.addEventListener('pointerleave', () => this.onMouseUp());
  };

  protected update(): void {
    this.onIndexChange(this.currentIndex);
    if (this.debug) {
      this.debugCurrentIndexDiv.innerText = this.currentIndex.toFixed(2);
      this.debugElementDiv.style.left = `${-1 * this.currentIndex * this.focusedElementWidth}%`;
    }
  }

  private onMouseDown = (e: PointerEvent): void => {
    if (this.autoPlayTimeoutId || this.autoPlayIntervalId) {
      window.clearTimeout(this.autoPlayTimeoutId);
      window.clearInterval(this.autoPlayIntervalId);
      this.autoPlayTimeoutId = undefined;
      this.autoPlayIntervalId = undefined;
    }

    this.previousIndex = this.currentIndex;
    this.isMouseDown = true;
    this.mouseHasMoved = false;
    gsap.killTweensOf(this);
    const clientXY = getClientXY(e);
    this.mouseXorY = clientXY[this.isVertical ? 'y' : 'x'];
  };

  private onMouseMove = (e: PointerEvent): void => {
    if (!this.isMouseDown) {
      return;
    }
    this.mouseHasMoved = true;
    this.previousIndex = this.currentIndex;

    const clientXY = getClientXY(e);
    const mouseXorY = clientXY[this.isVertical ? 'y' : 'x'];

    const delta = this.mouseXorY - mouseXorY;
    const focusedElementSizeInPixels =
      (this.getBoundingClientRect()[this.isVertical ? 'height' : 'width'] *
        this[this.isVertical ? 'focusedElementHeight' : 'focusedElementWidth']) /
      100;
    this.currentIndex += delta / focusedElementSizeInPixels;

    this.mouseXorY = mouseXorY;
    this.update();
  };

  private onMouseUp = (): void => {
    if (!this.isMouseDown) {
      return;
    }
    this.isMouseDown = false;
    if (!this.mouseHasMoved) {
      this.onClick(this.redirectUrl);
      return;
    }
    const dx = (this.currentIndex - this.previousIndex) * 3;
    const targetIndex = Math.round(this.currentIndex + dx);
    this.goToIndex(targetIndex);
  };

  private goToIndex = (targetIndex: number): void => {
    const duration = (0.1 + Math.abs(targetIndex - this.currentIndex) * 0.2) * this.speedCoefficient;
    gsap.killTweensOf(this);
    gsap.timeline().to(this, {
      currentIndex: targetIndex,
      duration,
      ease: this.easing,
      onUpdate: () => this.update()
    });
  };

  public moveIndexBy = (deltaIndex: number): void => {
    this.goToIndex(Math.round(this.currentIndex + deltaIndex));
  };

  public startAutoPlay = (delay: number = 3, frequency: number = 1.5, deltaIndex: number = 1): void => {
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
