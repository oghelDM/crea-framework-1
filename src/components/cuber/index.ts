import { CuberType, defaultValuesCuber } from './defaultValues';
import { IndexManager } from '../indexManager';

export class Cuber extends IndexManager {
  container: HTMLElement;
  cube: HTMLElement;
  faces: HTMLElement[];
  nbImages: number;

  constructor(props: CuberType, style: any = {}) {
    super();

    this.init(props, style);
  }

  public init(props, style) {
    const actualProps = { ...defaultValuesCuber, ...props };

    super.init(actualProps, style);

    const {
      id,
      debug = false,
      products,
      parent,
      perspective,
      faceLeft,
      faceRight,
      faceTop,
      faceBottom,
      perspectiveOrigin
    } = actualProps;

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

    this.nbImages = products.length;

    // faces initialization
    const container = document.createElement('div');
    container.id = 'id-container';
    container.style.position = 'absolute';
    container.style.zIndex = '3000000';
    container.style.width = `${this.focusedElementWidth}%`;
    container.style.height = `${this.focusedElementHeight}%`;
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

    let distToCenter = this.getDistToCenter(parent);
    container.style.perspective = `${perspective * distToCenter}px`;
    console.log('distToCenter: ', distToCenter);

    const zout = document.createElement('div');
    zout.id = 'id-zout';
    zout.style.position = 'relative';
    zout.style.width = '100%';
    zout.style.height = '100%';
    zout.style.transform = `translateZ(${-distToCenter}px)`;
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
      face.style.transform = `rotate${this.isVertical ? 'X' : 'Y'}(${
        (i * 360) / this.nbImages
      }deg) translateZ(${distToCenter}px)`;

      face.style.backgroundImage = `url(${product})`;
      face.style.backgroundPosition = 'center';
      face.style.backgroundRepeat = 'no-repeat';
      face.style.backgroundSize = 'cover';
      cube.appendChild(face);

      return face;
    });

    window.addEventListener('resize', () => {
      console.log('resize');
      distToCenter = this.getDistToCenter(parent);
      container.style.perspective = `${perspective * distToCenter}px`;
      zout.style.transform = `translateZ(${-distToCenter}px)`;
      this.faces.forEach(
        (face, i) =>
          (face.style.transform = `rotate${this.isVertical ? 'X' : 'Y'}(${
            (i * 360) / this.nbImages
          }deg) translateZ(${distToCenter}px)`)
      );
    });
  }

  protected update(): void {
    super.update();
    this.cube.style.transform = this.isVertical
      ? `rotateX(${(this.currentIndex * 360) / this.nbImages}deg)`
      : `rotateY(${(this.currentIndex * -360) / this.nbImages}deg)`;
  }

  private getDistToCenter = (parent: HTMLElement) => {
    if (this.isVertical) {
      // height, in pixels, of the focused face
      const faceHeightPx =
        (parent.getBoundingClientRect().height * parseInt(this.style.height) * this.focusedElementHeight) / 100 / 100;
      return faceHeightPx / (2 * Math.tan(Math.PI / this.nbImages));
    }
    // width, in pixels, of the focused face
    const faceWidthPx =
      (parent.getBoundingClientRect().width * parseInt(this.style.width) * this.focusedElementWidth) / 100 / 100;
    return faceWidthPx / (2 * Math.tan(Math.PI / this.nbImages));
  };
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-cuber', Cuber);
