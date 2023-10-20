import { IndexManager, IndexManagerType } from './indexManager';

interface CuberType extends IndexManagerType {
  products: string[]; // image elements
  parent: HTMLElement; // the parent DOM element (usually the creative root), necessary to compute the faces dimensions
  perspective?: number; // 3D perspective
  faceLeft?: number; // same as the usual css left property for the focused face
  faceRight?: number; // same as the usual css right property for the focused face
  faceTop?: number; // same as the usual css top property for the focused face
  faceBottom?: number; // same as the usual css bottom property for the focused face
  perspectiveOrigin?: string; // defines the 3d transform origin perspective (eg. '50%' or '0% 50%')
}

export class Cuber extends IndexManager {
  container: HTMLElement;
  cube: HTMLElement;
  faces: HTMLElement[];
  nbImages: number;

  constructor(props: CuberType, style: any = {}) {
    super(props, style);

    const {
      id,
      debug = false,
      products,
      parent,
      perspective = 800,
      faceLeft = (100 - this.focusedElementHeight) / 2,
      faceRight,
      faceTop = (100 - this.focusedElementHeight) / 2,
      faceBottom,
      perspectiveOrigin = '50%'
    } = props;

    this.setAttribute('id', id);
    const actualStyle = {
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      opacity: 1,
      backgroundColor: debug ? '#00ff0088' : 'unset',
      overflow: 'hidden',

      ...style
    };

    for (const [key, value] of Object.entries(actualStyle)) {
      this.style[key] = value;
    }

    this.nbImages = products.length;

    // width, in pixels, of the focused face
    let faceWidthPx = (parent.getBoundingClientRect().width * this.focusedElementWidth) / 100;
    let distCenter = faceWidthPx / (2 * Math.tan(Math.PI / this.nbImages));

    // faces initialization
    const container = document.createElement('div');
    container.id = 'id-container';
    container.style.position = 'absolute';
    container.style.zIndex = '3000000';
    container.style.width = `${this.focusedElementWidth}%`;
    container.style.height = `${this.focusedElementHeight}%`;
    container.style.perspective = `${perspective}px`;
    container.style.perspectiveOrigin = perspectiveOrigin;
    container.style.alignItems = 'center';
    container.style.pointerEvents = 'none';
    if (faceRight !== undefined) {
      container.style.right = `${faceRight}%`;
    } else {
      container.style.left = `${faceLeft}%`;
    }
    if (faceBottom !== undefined) {
      container.style.bottom = `${faceBottom}%`;
    } else {
      container.style.top = `${faceTop}%`;
    }
    this.container = container;
    this.appendChild(container);

    const zout = document.createElement('div');
    zout.id = 'id-zout';
    zout.style.position = 'relative';
    zout.style.width = '100%';
    zout.style.height = '100%';
    zout.style.transform = `translateZ(${-distCenter}px)`;
    zout.style.transformStyle = 'preserve-3d';
    container.appendChild(zout);

    const cube = document.createElement('div');
    cube.id = 'id-cube';
    cube.style.position = 'relative';
    cube.style.width = '100%';
    cube.style.height = '100%';
    cube.style.transform = 'preserve-3d';
    cube.style.display = 'block';
    cube.style.transformStyle = 'preserve-3d';
    this.cube = cube;
    zout.appendChild(cube);

    this.faces = products.map((product, i) => {
      const face = document.createElement('div');
      face.id = `id-face-${i}`;
      face.style.position = 'absolute';
      face.style.backgroundColor = 'pink';
      face.style.width = '100%';
      face.style.height = '100%';
      face.style.border = '1px solid black';
      face.style.transform = `rotateY(${(i * 360) / this.nbImages}deg) translateZ(${distCenter}px)`;

      face.style.backgroundImage = `url(${product})`;
      face.style.backgroundPosition = 'center';
      face.style.backgroundRepeat = 'no-repeat';
      face.style.backgroundSize = 'cover';
      cube.appendChild(face);

      return face;
    });

    window.addEventListener('resize', () => {
      faceWidthPx = (parent.getBoundingClientRect().width * this.focusedElementWidth) / 100;
      distCenter = faceWidthPx / (2 * Math.tan(Math.PI / this.nbImages));
      zout.style.transform = `translateZ(${-distCenter}px)`;
      this.faces.forEach(
        (face, i) => (face.style.transform = `rotateY(${(i * 360) / this.nbImages}deg) translateZ(${distCenter}px)`)
      );
    });
  }

  protected update(): void {
    super.update();
    this.cube.style.transform = `rotateY(${(this.currentIndex * -360) / this.nbImages}deg)`;
  }
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-cuber', Cuber);
