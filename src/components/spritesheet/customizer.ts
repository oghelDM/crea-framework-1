import * as dat from 'dat.gui';
import { Spritesheet } from '.';
import { SpritesheetType, defaultValuesSpritesheet } from './defaultValues';

export class SpritesheetCustomizer {
  private spritesheet: Spritesheet;
  private props: SpritesheetType = { ...defaultValuesSpritesheet };
  private styleProps: any = { width: 80, left: 10, top: 10 };

  constructor(root: HTMLElement) {
    console.log('customizer spritesheet: ', root);

    const gui = new dat.GUI();
    gui.domElement.id = 'gui';
    const sheet = document.createElement('style');
    sheet.innerHTML = `#gui {width: 300px !important} #appId {width: calc(90% - 300px);  margin-left: 5%}`;
    document.body.appendChild(sheet);
    // use localStorage to store values
    gui.useLocalStorage = true;
    gui.remember(this.styleProps);
    gui.remember(this.props);

    const folder1 = gui.addFolder('component css style');
    folder1.open();
    Object.keys(this.styleProps).forEach((property) =>
      folder1.add(this.styleProps, property, 0, 100).onChange((e) => this.onStyleUpdate(property, e))
    );

    const folder2 = gui.addFolder('spritesheet properties');
    folder2.open();
    folder2
      .add(this.props, 'framerate', 1, 500)
      .step(1)
      .onChange((v) => (this.spritesheet.framerate = v));
    folder2
      .add(this.props, 'startFrame', 0, this.props.nbFrames - 1)
      .step(1)
      .onChange((v) => this.onPropsUpdate('startFrame', v));
    ['isPaused', 'isBackwards', 'isLoop'].forEach((property) =>
      folder2.add(this.props, property).onChange((v) => this.onPropsUpdate(property, v))
    );

    const folder3 = gui.addFolder('spritesheet public methods');
    folder3.open();
    folder3.add({ start: () => this.spritesheet.start() }, 'start');
    folder3.add({ stop: () => this.spritesheet.stop() }, 'stop');
    folder3.add({ init: () => this.spritesheet.init(this.props, this.getCssValues()) }, 'init');

    this.spritesheet = new Spritesheet(this.props, this.getCssValues());
    root.appendChild(this.spritesheet);
  }

  private onPropsUpdate = (property: string, value: any) => {
    this.props[property] = value;
    this.spritesheet.init(this.props, this.getCssValues());
  };

  private onStyleUpdate = (property: string, value: any) => {
    this.styleProps[property] = value;
    for (const [key, value] of Object.entries(this.getCssValues())) {
      this.spritesheet.style[key] = value;
    }
  };

  private getCssValues = () => {
    const actualStyleProps = {};
    for (const [key, value] of Object.entries(this.styleProps)) {
      actualStyleProps[key] = `${value}%`;
    }
    return actualStyleProps;
  };
}
