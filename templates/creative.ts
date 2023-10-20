import { VPAIDVideoPlayer } from "@app";

// OPTION_SPLIT_IMPORT
// OPTION_COUNTDOWN_IMPORT
// OPTION_CAROUSEL_IMPORT
// OPTION_CUBER_IMPORT
// OPTION_DEFONCE_IMPORT
import { CreativeHandler, CreativeProps } from '@/types';

(window as any).getVPAIDAd = () => {
  return new VPAIDVideoPlayer(creative);
};

const creative: CreativeHandler = (root: HTMLElement, { onClick }: CreativeProps) => {
  // OPTION_SPLIT_CODE_EXAMPLE
  // OPTION_COUNTDOWN_CODE_EXAMPLE
  // OPTION_CAROUSEL_CODE_EXAMPLE

  // OPTION_CUBER_CODE_EXAMPLE
  // OPTION_DEFONCE_CODE_EXAMPLE

  const displacementMap = document.querySelector('feDisplacementMap') as SVGFEDisplacementMapElement;
  const filterImage = document.querySelector('feimage') as SVGFEImageElement;
  console.log('filter: ', displacementMap);
  const map = (v, a1, b1, a2, b2) => a2 + ((b2 - a2) * (v - a1)) / (b1 - a1);

  window.addEventListener('mousemove', ({ screenX, screenY }) => {
    const { innerWidth } = window;
    const { width, height } = root.getBoundingClientRect(); // container width and height in pixels
    console.log(screenX, screenY, `${map(screenX, 0, innerWidth, 0, 200)}`);
    // displacementMap.scale.baseVal = map(screenX, 0, innerWidth, 200, 0);
    displacementMap.setAttribute('scale', `${map(screenX, 0, innerWidth, 200, 0)}`); //'200'); //
    const filterWidth = map(screenX, 0, innerWidth, width, 4 * width);
    const filterHeight = map(screenX, 0, innerWidth, height, 4 * height);
    filterImage.setAttribute('width', `${filterWidth}px`);
    filterImage.setAttribute('height', `${filterHeight}px`);
    filterImage.setAttribute('x', `${width / 2 - filterWidth / 2}px`);
    filterImage.setAttribute('y', `${height / 2 - filterHeight / 2}px`);
  });
}
