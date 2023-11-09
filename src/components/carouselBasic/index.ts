import { IndexManager } from '../indexManager';
import { createDiv } from '../../utils/divMaker';
import { keepSafe, map } from '../../utils/helper';
import { HORIZONTAL_ALIGN, VERTICAL_ALIGN } from '../../types';
import { CarouselBasicType, defaultValuesCarouselBasic } from './defaultValues';

export class CarouselBasic extends IndexManager {
  products: HTMLElement[];
  gap: number;
  verticalAlign: VERTICAL_ALIGN;
  horizontalAlign: HORIZONTAL_ALIGN;
  unfocusedElementWidth: number;
  unfocusedElementHeight: number;
  focusedElementOpacity: number;
  unfocusedElementOpacity: number;

  constructor(props: CarouselBasicType, style: any = {}) {
    super();

    this.init(props, style);
  }

  public init = (props: CarouselBasicType, style: any = {}) => {
    const actualProps = { ...defaultValuesCarouselBasic, ...props };

    super.init(actualProps, style);
    const {
      products,
      id,
      gap = 0,
      verticalAlign,
      horizontalAlign,
      focusedElementWidth,
      unfocusedElementWidth,
      focusedElementHeight,
      unfocusedElementHeight,
      focusedElementOpacity,
      unfocusedElementOpacity
    } = actualProps;

    this.products = products.map((url, index) => {
      const element = createDiv(`${id}-${index}`, {
        width: `${focusedElementWidth}%`,
        height: `${focusedElementHeight}%`,
        backgroundColor: '#ffffff88',
        position: 'absolute',
        backgroundSize: 'cover',
        backgroundImage: `url(${url})`,
        outline: this.debug ? '1px solid yellow' : 'unset',
        backgroundPosition: 'center',
        /* added to fix webkit bug jitter */
        '-webkit-backface-visibility': 'hidden',
        '-webkit-transform': 'perspective(1000px)'
      });

      // position the elements behind the interactive div
      this.insertBefore(element, this.childNodes[0]);
      return element;
    });
    this.nbProducts = products.length;
    this.gap = gap;
    this.verticalAlign = verticalAlign;
    this.horizontalAlign = horizontalAlign;
    this.unfocusedElementWidth = unfocusedElementWidth;
    this.unfocusedElementHeight = unfocusedElementHeight;
    this.focusedElementOpacity = focusedElementOpacity;
    this.unfocusedElementOpacity = unfocusedElementOpacity;

    this.update();
  };

  protected update(): void {
    super.update();

    // first hide all the elements
    this.products.forEach((element) => (element.style.opacity = '0'));

    const {
      currentIndex,
      focusedElementWidth,
      unfocusedElementWidth,
      focusedElementHeight,
      unfocusedElementHeight,
      focusedElementOpacity,
      unfocusedElementOpacity
    } = this;

    // get the indices of only the elements that need to be rendered
    const { iMin, iMax, focusPosition } = this.getiMinMax();

    for (let i = iMin; i <= iMax; i++) {
      const d = Math.min(Math.abs(i - currentIndex), 1);

      const { left, right, top, bottom } = this.getLeftRightTopBottom(focusPosition, d, i);
      const width = map(d, 0, 1, focusedElementWidth, unfocusedElementWidth);
      const height = map(d, 0, 1, focusedElementHeight, unfocusedElementHeight);
      const opacity = map(d, 0, 1, focusedElementOpacity, unfocusedElementOpacity);

      const iSafe = keepSafe(i, this.nbProducts);
      const element = this.products[iSafe];
      element.style.width = `${width}%`;
      element.style.height = `${height}%`;
      element.style.left = `${left}`;
      element.style.right = `${right}`;
      element.style.top = `${top}`;
      element.style.bottom = `${bottom}`;
      element.style.opacity = `${opacity}`;
    }
  }

  // return the indices surrounding currentIndex that need to be rendered
  // and the focusPosition, which is the left or top position of the focused element
  getiMinMax = () => {
    const {
      currentIndex,
      focusedElementWidth,
      unfocusedElementWidth,
      focusedElementHeight,
      unfocusedElementHeight,
      gap
    } = this;

    let iMin = 0;
    let iMax = 0;
    let focusPosition = 0;
    if (this.isVertical) {
      switch (this.verticalAlign) {
        case VERTICAL_ALIGN.TOP:
          iMin = Math.floor(currentIndex);
          iMax = Math.ceil(currentIndex + (100 - focusedElementHeight) / (unfocusedElementHeight + gap));
          break;
        case VERTICAL_ALIGN.CENTER:
          focusPosition = 50 - focusedElementHeight / 2;
          iMin = Math.floor(currentIndex - (50 - focusedElementHeight / 2) / unfocusedElementHeight);
          iMax = Math.ceil(currentIndex + (50 - focusedElementHeight / 2) / unfocusedElementHeight);
          break;
        case VERTICAL_ALIGN.BOTTOM:
          focusPosition = 100 - focusedElementHeight;
          iMin = Math.floor(currentIndex - (100 - focusedElementHeight) / unfocusedElementHeight);
          iMax = Math.ceil(currentIndex);
          break;
      }
    } else {
      switch (this.horizontalAlign) {
        case HORIZONTAL_ALIGN.LEFT:
          iMin = Math.floor(currentIndex);
          iMax = Math.ceil(currentIndex + (100 - focusedElementWidth) / (unfocusedElementWidth + gap));
          break;
        case HORIZONTAL_ALIGN.CENTER:
          focusPosition = 50 - focusedElementWidth / 2;
          iMin = Math.floor(currentIndex - (50 - focusedElementWidth / 2) / unfocusedElementWidth);
          iMax = Math.ceil(currentIndex + (50 - focusedElementWidth / 2) / unfocusedElementWidth);
          break;
        case HORIZONTAL_ALIGN.RIGHT:
          focusPosition = 100 - focusedElementWidth;
          iMin = Math.floor(currentIndex - (100 - focusedElementWidth) / unfocusedElementWidth);
          iMax = Math.ceil(currentIndex);
          break;
      }
    }

    return { iMin, iMax, focusPosition };
  };

  getLeftRightTopBottom = (focusPosition: number, d: number, i: number) => {
    const {
      isVertical,
      focusedElementWidth,
      unfocusedElementWidth,
      focusedElementHeight,
      unfocusedElementHeight,
      gap,
      currentIndex
    } = this;

    let position =
      focusPosition + (i - currentIndex) * ((isVertical ? unfocusedElementHeight : unfocusedElementWidth) + gap);
    if (i > currentIndex) {
      const delta = isVertical
        ? focusedElementHeight - unfocusedElementHeight
        : focusedElementWidth - unfocusedElementWidth;
      position += map(d, 0, 1, 0, delta);
    }

    let top = isVertical ? `${position}%` : 'unset';
    let bottom = 'unset';
    let left = isVertical ? 'unset' : `${position}%`;
    let right = 'unset';
    if (isVertical) {
      switch (this.horizontalAlign) {
        case HORIZONTAL_ALIGN.LEFT:
          left = '0%';
          break;
        case HORIZONTAL_ALIGN.CENTER:
          left = `${50 - map(d, 0, 1, focusedElementWidth, unfocusedElementWidth) / 2}%`;
          break;
        case HORIZONTAL_ALIGN.RIGHT:
          right = '0%';
          break;
      }
    } else {
      switch (this.verticalAlign) {
        case VERTICAL_ALIGN.TOP:
          top = '0%';
          break;
        case VERTICAL_ALIGN.CENTER:
          top = `${50 - map(d, 0, 1, focusedElementHeight, unfocusedElementHeight) / 2}%`;
          break;
        case VERTICAL_ALIGN.BOTTOM:
          bottom = '0%';
          break;
      }
    }
    return { top, bottom, left, right };
  };
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-carousel-basic', CarouselBasic);
