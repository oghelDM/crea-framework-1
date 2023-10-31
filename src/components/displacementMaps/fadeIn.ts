import { map } from '../../utils/helper';
import { ComponentBaseType } from '../../types';
import { displacementImage, image, svgContent } from './fadeInSVG';

interface FadeInType extends ComponentBaseType {
  parent: HTMLElement;
  displacementMapUrl?: string;
  imageUrl: string;
}

export class FadeIn extends HTMLElement {
  constructor(props: FadeInType, style: any = {}) {
    super();

    const { id, displacementMapUrl = displacementImage, imageUrl, parent, debug, onClick } = props;

    this.setAttribute('id', id);
    const actualStyle = {
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: debug ? '#00ff0088' : 'unset',
      overflow: 'hidden',

      ...style
    };

    for (const [key, value] of Object.entries(actualStyle)) {
      this.style[key] = value;
    }

    const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    svg2.setAttribute('id', 'svg-displacement-map');
    svg2.setAttribute('data-run', 'paused');
    svg2.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg2.setAttribute('width', '100%');
    svg2.setAttribute('height', '100%');
    svg2.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    // svg2.setAttribute('viewBox', '0 0 600 600');
    svg2.innerHTML = svgContent.replace(displacementImage, displacementMapUrl).replace(image, imageUrl);
    svg2.style.position = 'absolute';
    svg2.style.width = '100%';
    svg2.style.height = '100%';
    svg2.style.left = '0';
    svg2.style.top = '0';

    this.appendChild(svg2);

    let x = 0;
    const displacementMap = svg2.querySelector('feDisplacementMap') as SVGFEDisplacementMapElement;
    const filterImage = svg2.querySelector('feImage') as SVGFEImageElement;
    let { width, height } = parent.getBoundingClientRect(); // container width and height in pixels

    parent.addEventListener('pointermove', (e) => updateWarping(e.offsetX));
    window.addEventListener('resize', () => {
      const parentBoundingRect = parent.getBoundingClientRect();
      width = parentBoundingRect.width;
      height = parentBoundingRect.height;
      updateWarping(x);
    });

    const updateWarping = (mouseX) => {
      x = mouseX;
      displacementMap.setAttribute('scale', `${map(mouseX, 0, width, 300, 0)}`);
      const filterWidth = map(mouseX, 0, width, 1 * width, 3 * width);
      const filterHeight = map(mouseX, 0, width, 1 * height, 3 * height);
      filterImage.setAttribute('width', `${filterWidth}px`);
      filterImage.setAttribute('height', `${filterHeight}px`);
      filterImage.setAttribute('x', `${width / 2 - filterWidth / 2}px`);
      filterImage.setAttribute('y', `${height / 2 - filterHeight / 2}px`);
    };

    updateWarping(0);

    this.addEventListener('click', () => onClick());
  }
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-fade-in', FadeIn);
