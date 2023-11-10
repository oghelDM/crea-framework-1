import { Cuber } from '.';
import { Customizer } from '../customizer';
import { CuberType, defaultValuesCuber } from './defaultValues';

export class CuberCustomizer extends Customizer {
  private perspectiveOrigin: any = { perspectiveX: 50, perspectiveY: 50 };

  constructor(root: HTMLElement) {
    super(defaultValuesCuber);

    // needed to recalculate the distToCenter value
    this.forceInitOnStyleUpdate = true;

    const folder2 = this.gui.addFolder('cuber properties');
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

    this.component = new Cuber(this.props as CuberType, this.getCssValues());
    root.appendChild(this.component);
  }

  private onPerspectiveOriginUpdate = () => {
    (
      this.props as CuberType
    ).perspectiveOrigin = `${this.perspectiveOrigin.perspectiveX}% ${this.perspectiveOrigin.perspectiveY}%`;
    this.component.init(this.props, this.getCssValues());
  };
}
