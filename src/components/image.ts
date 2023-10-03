export class Image extends HTMLElement {
  constructor(props) {
    console.log('Image constructor');

    super();

    if (props.id) {
      this.setAttribute('id', `${props.id}`);
    }
    this.style.display = 'block';
    // this.style.position = 'absolute';
    this.style.backgroundPosition = 'center';
    this.style.backgroundRepeat = 'no-repeat';
    // this.style.initial = 'no-repeat';
    this.style.backgroundSize = props.backgroundSize || 'contain';

    // this.img = props.img || null;
    // this.video = props.video || null;
    // this.wording = props.wording || null;
    // this.hover = props.hover || null;
    // this.isDisplayed = props.isDisplayed || null;

    this.style.width = props.width || '50%';
    this.style.height = props.height || 'auto';
    this.style.left = props.left || null;
    this.style.top = props.top || null;
    this.style.right = props.right || null;
    this.style.bottom = props.bottom || null;
    this.style.borderRadius = props.borderRadius || '0px';
    this.style.opacity = isNaN(Number(props.opacity)) ? 1 : props.opacity;
    this.style.scale = isNaN(Number(props.scale)) ? 1 : props.scale;
    this.style.rotate = props.rotate || 0;
    this.style.backgroundImage = `url("${props.url}")` || null;
    this.style.backgroundColor = props.debug ? 'rgba(255, 0, 0, .5)' : null;
    this.style.aspectRatio = props.aspectRatio || 'auto';
  }
}

// declares the new web component to allow constructor instanciation
customElements.define('dm-image', Image);
