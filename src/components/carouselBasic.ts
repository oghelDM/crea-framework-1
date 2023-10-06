import { HORIZONTAL_ALIGN, VERTICAL_ALIGN } from '../constants';
import { createDiv } from '../utils/divMaker';
import { keepSafe, map } from '../utils/helper';
import { IndexManager, IndexManagerType } from './indexManager';

interface imageType {
  url: string;
  redirectUrl?: string;
}

interface CarouselBasicType extends IndexManagerType {
  images: imageType[]; // image elements
  unfocusedElementWidth?: number; // the width in percent, occupied by the unfocused elements
  unfocusedElementHeight?: number; // the height in percent, occupied by the unfocused elements
  focusedElementOpacity?: number; // the focused element's opacity
  unfocusedElementOpacity?: number; // the unfocused element's opacity
  redirectUrl: string; // main url redirection
  onClick: (url?: string) => void; // onClick callback
  gap?: number; // horizontal gap between elements, in percents
  verticalAlign?: VERTICAL_ALIGN; // vertical alignmenent, top, center or bottom
  horizontalAlign?: HORIZONTAL_ALIGN; // horizontal alignmenent, left, center or right
}

export class CarouselBasic extends IndexManager {
  elements: HTMLElement[];
  gap: number;
  verticalAlign: VERTICAL_ALIGN;
  horizontalAlign: HORIZONTAL_ALIGN;
  unfocusedElementWidth: number;
  unfocusedElementHeight: number;
  focusedElementOpacity: number;
  unfocusedElementOpacity: number;

  constructor(props: CarouselBasicType, style: any = {}) {
    super(props, style);

    const {
      images = [],
      onClick,
      id,
      gap = 0,
      verticalAlign = VERTICAL_ALIGN.CENTER,
      horizontalAlign = HORIZONTAL_ALIGN.CENTER,
      focusedElementWidth,
      unfocusedElementWidth = focusedElementWidth,
      focusedElementHeight,
      unfocusedElementHeight = focusedElementHeight,
      focusedElementOpacity = 1,
      unfocusedElementOpacity = 1
    } = props;
    this.elements = images.map(({ url, redirectUrl }, index) => {
      const element = createDiv(`${id}-${index}`, {
        width: `${focusedElementWidth}%`,
        height: '144px',
        backgroundColor: '#ffffff88',
        position: 'absolute',
        backgroundSize: 'cover',
        backgroundImage: `url("${url}")`,
        border: this.debug ? '1px solid yellow' : 'unset',
        backgroundPosition: 'center'
      });
      element.addEventListener('click', () => onClick(redirectUrl));
      // position the elements behind the interactive div
      this.insertBefore(element, this.childNodes[0]);
      return element;
    });
    this.gap = gap;
    this.verticalAlign = verticalAlign;
    this.horizontalAlign = horizontalAlign;
    this.unfocusedElementWidth = unfocusedElementWidth;
    this.unfocusedElementHeight = unfocusedElementHeight;
    this.focusedElementOpacity = focusedElementOpacity;
    this.unfocusedElementOpacity = unfocusedElementOpacity;

    this.update();
  }

  protected update(): void {
    super.update();

    // first hide all the elements
    this.elements.forEach((element) => (element.style.opacity = '0'));

    const {
      currentIndex,
      focusedElementWidth,
      unfocusedElementWidth,
      focusedElementHeight,
      unfocusedElementHeight,
      focusedElementOpacity,
      unfocusedElementOpacity,
      gap
    } = this;
    // then only display and place the visible elements

    let iMin = 0;
    let iMax = this.elements.length - 1;
    let baseLeft = 0;
    switch (this.horizontalAlign) {
      case HORIZONTAL_ALIGN.LEFT:
        iMin = Math.floor(currentIndex);
        iMax = Math.ceil(currentIndex + (100 - focusedElementWidth) / (unfocusedElementWidth + gap));
        break;
      case HORIZONTAL_ALIGN.CENTER:
        baseLeft = 50 - focusedElementWidth / 2;
        iMin = Math.floor(currentIndex - (50 - focusedElementWidth / 2) / unfocusedElementWidth);
        iMax = Math.ceil(currentIndex + (50 - focusedElementWidth / 2) / unfocusedElementWidth);
        break;
      case HORIZONTAL_ALIGN.RIGHT:
        baseLeft = 100 - focusedElementWidth;
        iMin = Math.floor(currentIndex - (100 - focusedElementWidth) / unfocusedElementWidth);
        iMax = Math.ceil(currentIndex);
        break;
    }
    console.log('iMin iMax: ', iMin, iMax);
    for (let i = iMin; i <= iMax; i++) {
      const d = Math.min(Math.abs(i - currentIndex), 1);

      let left = baseLeft + (i - currentIndex) * (unfocusedElementWidth + this.gap);
      if (i > currentIndex) {
        left += map(d, 0, 1, 0, focusedElementWidth - unfocusedElementWidth);
      }
      const width = map(d, 0, 1, focusedElementWidth, unfocusedElementWidth);
      const height = map(d, 0, 1, focusedElementHeight, unfocusedElementHeight);
      const opacity = map(d, 0, 1, focusedElementOpacity, unfocusedElementOpacity);
      let top = 'unset';
      let bottom = 'unset';
      switch (this.verticalAlign) {
        case VERTICAL_ALIGN.TOP:
          top = '0';
          break;
        case VERTICAL_ALIGN.CENTER:
          top = `${50 - map(d, 0, 1, focusedElementHeight, unfocusedElementHeight) / 2}`;
          break;
        case VERTICAL_ALIGN.BOTTOM:
          bottom = '0';
          break;
      }
      const iSafe = keepSafe(i, this.elements.length);
      const element = this.elements[iSafe];
      element.style.left = `${left}%`;
      element.style.width = `${width}%`;
      element.style.height = `${height}%`;
      element.style.top = `${top}%`;
      element.style.bottom = `${bottom}%`;
      element.style.opacity = `${opacity}`;
    }
  }
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-carousel-basic', CarouselBasic);
