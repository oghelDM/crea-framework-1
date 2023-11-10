import * as dat from 'dat.gui';

import { Cuber } from './cuber';
import { Spritesheet } from './spritesheet';
import { CarouselBasic } from './carouselBasic';
import { CuberType } from './cuber/defaultValues';
import { SpritesheetType } from './spritesheet/defaultValues';
import { CarouselBasicType } from './carouselBasic/defaultValues';

export class Customizer {
  protected gui: any;
  protected component: CarouselBasic | Cuber | Spritesheet;
  protected props: CarouselBasicType | CuberType | SpritesheetType;
  protected styleProps: any;
  protected forceInitOnStyleUpdate: boolean = false;

  constructor(props: CarouselBasicType | CuberType | SpritesheetType, styleProps?: any) {
    this.props = { ...props };
    this.styleProps = styleProps || { width: 80, height: 80, left: 10, top: 10 };

    this.gui = new dat.GUI();
    this.gui.domElement.id = 'gui';
    const sheet = document.createElement('style');
    sheet.innerHTML = `#gui {width: 400px !important} #appId {width: calc(90% - 400px);  margin-left: 5%}`;
    document.body.appendChild(sheet);

    // use localStorage to store values
    this.gui.remember(this.styleProps);
    this.gui.remember(this.props);

    const folder1 = this.gui.addFolder('component css style');
    folder1.open();

    console.log('this.styleProps: ', this.styleProps);
    Object.keys(this.styleProps).forEach((property) =>
      folder1.add(this.styleProps, property, 0, 100).onChange((e) => this.onStyleUpdate(property, e))
    );
  }

  protected onPropsUpdate = (property: string, value: any) => {
    this.props[property] = value;
    this.component.init(this.props, this.getCssValues());
  };

  private onStyleUpdate = (property: string, value: any) => {
    this.styleProps[property] = value;
    if (this.forceInitOnStyleUpdate) {
      this.component.init(this.props, this.getCssValues());
    } else {
      for (const [key, value] of Object.entries(this.getCssValues())) {
        this.component.style[key] = value;
      }
    }
  };

  protected getCssValues = () => {
    const actualStyleProps = {};
    for (const [key, value] of Object.entries(this.styleProps)) {
      actualStyleProps[key] = `${value}%`;
    }
    return actualStyleProps;
  };
}
