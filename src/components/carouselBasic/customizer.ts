import * as dat from 'dat.gui';
import { CarouselBasic } from '.';
import { HORIZONTAL_ALIGN, VERTICAL_ALIGN } from '../../types';
import { CarouselBasicType, defaultValuesCarouselBasic } from './defaultValues';

export class Customizer {
  private carousel: CarouselBasic;
  props: CarouselBasicType = { ...defaultValuesCarouselBasic };
  styleProps: any = { width: 80, height: 80, left: 10, top: 10 };

  constructor(root: HTMLElement) {
    console.log('customizer cuber: ', root);

    this.carousel = new CarouselBasic(this.props, this.getCssValues());
    root.appendChild(this.carousel);

    const gui = new dat.GUI();
    gui.domElement.id = 'gui';
    const sheet = document.createElement('style');
    sheet.innerHTML = `#gui {width: 400px !important} #appId {width: calc(90% - 400px);  margin-left: 5%}`;
    document.body.appendChild(sheet);
    // use localStorage to store values
    // gui.remember(this.styleProps);
    // gui.remember(this.props);

    const folder1 = gui.addFolder('css Style');
    folder1.open();
    Object.keys(this.styleProps).forEach((property) =>
      folder1.add(this.styleProps, property, 0, 100).onChange((e) => this.onStyleUpdate(property, e))
    );

    const folder2 = gui.addFolder('carousel properties');
    folder2
      .add(this.props, 'verticalAlign', {
        top: VERTICAL_ALIGN.TOP,
        center: VERTICAL_ALIGN.CENTER,
        bottom: VERTICAL_ALIGN.BOTTOM
      })
      .onChange((v) => this.onPropsUpdate('verticalAlign', v));
    folder2
      .add(this.props, 'horizontalAlign', {
        left: HORIZONTAL_ALIGN.LEFT,
        center: HORIZONTAL_ALIGN.CENTER,
        right: HORIZONTAL_ALIGN.RIGHT
      })
      .onChange((v) => this.onPropsUpdate('verticalAlign', v));
    ['focusedElementWidth', 'unfocusedElementWidth', 'focusedElementHeight', 'unfocusedElementHeight', 'gap'].forEach(
      (property) => folder2.add(this.props, property, 0, 100).onChange((v) => this.onPropsUpdate(property, v))
    );
    ['focusedElementOpacity', 'unfocusedElementOpacity'].forEach((property) =>
      folder2.add(this.props, property, 0, 1).onChange((v) => this.onPropsUpdate(property, v))
    );
    folder2.open();
    ['debug', 'isVertical', 'isInteractive', 'autoPlay'].forEach((property) =>
      folder2.add(this.props, property).onChange((v) => this.onPropsUpdate(property, v))
    );
    folder2.add(this.props, 'speedCoefficient', 0.1, 10).onChange((v) => this.onPropsUpdate('speedCoefficient', v));

    console.log('toto: ', document.getElementsByClassName('dg main a')[0]);
    (document.getElementsByClassName('dg main a')[0] as HTMLElement).style.width = '400px';
  }

  private onPropsUpdate = (property: string, value: any) => {
    this.props[property] = value;
    this.carousel.init(this.props, this.styleProps);
    console.log('onPropsUpdate: ', this.props);
  };

  private onStyleUpdate = (property: string, value: any) => {
    this.styleProps[property] = value;
    this.carousel.init(this.props, this.getCssValues());
  };

  private getCssValues = () => {
    const actualStyleProps = {};
    for (const [key, value] of Object.entries(this.styleProps)) {
      actualStyleProps[key] = `${value}%`;
    }
    return actualStyleProps;
  };
}
