import { ComponentBaseType } from '../types';
import { getClientXY } from '../utils/helper';
import { createDiv } from '../utils/divMaker';

interface SplitType extends ComponentBaseType {
  leftImageUrl: string;
  rightImageUrl: string;
  originalPosition?: number;
}

export class Split extends HTMLElement {
  constructor(props: SplitType, style: any = {}) {
    super();

    const { id, leftImageUrl, rightImageUrl, debug = false, originalPosition = 50, redirectUrl, onClick } = props;

    this.setAttribute('id', id);
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

    const [_, divLeft] = [rightImageUrl, leftImageUrl].map((_, i) => {
      const div = createDiv(`split-${i === 0 ? 'left' : 'right'}`, {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff88',
        position: 'absolute',
        backgroundSize: 'cover',
        backgroundImage: `url(https://statics.dmcdn.net/d/vpaid/split/assets/bg_${i + 1}.png)`,
        backgroundPosition: 'left center'
        // /* added to fix webkit bug jitter */
        // '-webkit-backface-visibility': 'hidden',
        // '-webkit-transform': 'perspective(1000px)'
      });
      this.appendChild(div);
      return div;
    });
    divLeft.style.width = `${originalPosition}%`;

    // handle width in pixels
    const handleWidth = 44;
    const handle = createDiv('split-handle', {
      position: 'absolute',
      top: '0%',
      width: `${handleWidth}px`, // max is 76px
      height: '100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundImage: `url("https://statics.dmcdn.net/d/vpaid/split/assets/split.png")`
    });
    handle.style.left = `calc(${originalPosition}% - ${handleWidth / 2}px)`;
    this.appendChild(handle);

    this.addEventListener('pointermove', (e) => {
      e.stopImmediatePropagation();
      const x = getClientXY(e, this.getBoundingClientRect()).x;
      handle.style.left = `${x - handleWidth / 2}px`;
      divLeft.style.width = getClientXY(e, this.getBoundingClientRect()).x + 'px';
    });

    this.addEventListener('click', () => onClick(redirectUrl));
  }
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-split', Split);
