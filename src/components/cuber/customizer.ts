import * as dat from 'dat.gui';
import { Cuber } from '.';
import { CuberType, defaultValuesCuber } from './defaultValues';

export class CuberCustomizer {
  private cuber: Cuber;
  private props: CuberType = { ...defaultValuesCuber };
  private styleProps: any = { width: 80, height: 80, left: 10, top: 10 };
  private perspectiveOrigin: any = { perspectiveX: 50, perspectiveY: 50 };

  constructor(root: HTMLElement) {
    console.log('customizer cuber: ', root);

    const gui = new dat.GUI();
    gui.domElement.id = 'gui';
    const sheet = document.createElement('style');
    sheet.innerHTML = `#gui {width: 400px !important} #appId {width: calc(90% - 400px);  margin-left: 5%}`;
    document.body.appendChild(sheet);
    // use localStorage to store values
    // gui.remember(this.styleProps);
    // gui.remember(this.props);

    const folder1 = gui.addFolder('component css style');
    folder1.open();
    Object.keys(this.styleProps).forEach((property) =>
      folder1.add(this.styleProps, property, 0, 100).onChange((e) => this.onStyleUpdate(property, e))
    );

    const folder2 = gui.addFolder('cuber properties');
    folder2.open();
    ['focusedElementWidth', 'focusedElementHeight', 'faceLeft', 'faceTop'].forEach((property) =>
      folder2.add(this.props, property, 0, 100).onChange((v) => this.onPropsUpdate(property, v))
    );
    ['debug', 'isVertical', 'isInteractive', 'autoPlay'].forEach((property) =>
      folder2.add(this.props, property).onChange((v) => this.onPropsUpdate(property, v))
    );
    folder2.add(this.props, 'perspective', 0.1, 100).onChange((v) => this.onPropsUpdate('perspective', v));
    folder2.add(this.perspectiveOrigin, 'perspectiveX', -200, 200).onChange(() => this.onPerspectiveOriginUpdate());
    folder2.add(this.perspectiveOrigin, 'perspectiveY', -200, 200).onChange(() => this.onPerspectiveOriginUpdate());

    (document.getElementsByClassName('dg main a')[0] as HTMLElement).style.width = '400px';

    this.props.parent = root;
    this.cuber = new Cuber(this.props, this.getCssValues());
    root.appendChild(this.cuber);
  }

  private onPropsUpdate = (property: string, value: any) => {
    this.props[property] = value;
    this.cuber.init(this.props, this.getCssValues());
  };

  private onStyleUpdate = (property: string, value: any) => {
    this.styleProps[property] = value;
    this.cuber.init(this.props, this.getCssValues());
  };

  private onPerspectiveOriginUpdate = () => {
    this.props.perspectiveOrigin = `${this.perspectiveOrigin.perspectiveX}% ${this.perspectiveOrigin.perspectiveY}%`;
    this.cuber.init(this.props, this.getCssValues());
  };

  private getCssValues = () => {
    const actualStyleProps = {};
    for (const [key, value] of Object.entries(this.styleProps)) {
      actualStyleProps[key] = `${value}%`;
    }
    return actualStyleProps;
  };
}
