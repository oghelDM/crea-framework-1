import { VPAIDVideoPlayer } from "@app";
import { Defonce } from '@/effects/defonce';
import { Cuber } from '@/components/cuber';
import { CreativeHandler, CreativeProps } from "@/types";

(window as any).getVPAIDAd = () => {
  return new VPAIDVideoPlayer(creative);
};

const creative: CreativeHandler = (root: HTMLElement, { onClick }: CreativeProps) => {
    // Cuber component
    const cuber = new Cuber(
      {
        id: 'cuberDM',
        products: [
          'https://images.unsplash.com/photo-1696464795756-2d92a11c504f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1695496573688-3e0e8ac8657e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1695456261833-3794ab617deb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0Mnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
          'https://plus.unsplash.com/premium_photo-1694670200212-3122e7c5c9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2NHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1695878026745-1d07d1088045?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2N3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
        ],
        focusedElementWidth: 40,
        focusedElementHeight: 80,
        faceLeft: 30,
        faceBottom: 10,
        onClick: () => console.log('cuber click'),
        parent: root
      }
    );
    root.appendChild(cuber);

    // Defonce effect
    const defonce = new Defonce({
      targetElement: cuber,
      maskUrl: 'images/chanel.svg'
    });

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
};