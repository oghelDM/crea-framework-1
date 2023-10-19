import gsap from 'gsap';
import { ComponentBaseType } from '../types';

interface DefonceType extends ComponentBaseType {
  maskUrl: string;
}

export class Defonce extends HTMLElement {
  toto: number = 0;
  maskUrl: string;

  constructor(props: DefonceType, style: any = {}) {
    super();

    const { id, debug, maskUrl } = props;

    this.setAttribute('id', id);
    const actualStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: debug ? '#ffff0088' : 'unset',

      maskImage: `url(${maskUrl})`,
      webkitMaskImage: `url(${maskUrl})`,
      maskSize: `${this.toto}%`,
      webkitMaskSize: `${this.toto}%`,
      maskRepeat: 'no-repeat',
      webkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      webkitMaskPosition: 'center',
      webkitMaskComposite: 'add',
      maskComposite: 'add',

      ...style
    };
    for (const [key, value] of Object.entries(actualStyle)) {
      this.style[key] = value;
    }

    this.maskUrl = maskUrl;
    this.scaleTo(200);
  }

  scaleTo = (to) => {
    gsap.timeline().to(this, {
      toto: to,
      duration: 3,
      delay: 3,
      // ease: this.easing,
      onUpdate: () => {
        this.style.maskSize = `${this.toto}%`;
        this.style.webkitMaskSize = `${this.toto}%`;
        const q = `rgba(0,0,0,${(this.toto - 100) / 100})`;
        // allows a smooth fade-in of the whole div
        if (this.toto > 100) {
          this.style.maskImage = `url(${this.maskUrl}), linear-gradient(${q} 0%, ${q} 100%)`;
          this.style.webkitMaskImage = `url(${this.maskUrl}), linear-gradient(${q} 0%, ${q} 100%)`;
        }
      }
    });
  };
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-test', Defonce);
