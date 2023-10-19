import { Elastic, Quad } from 'gsap';
import { Split } from '../components/Split';
import { ImageDM } from '../components/image';
import { Countdown } from '../components/Countdown';
import { IndexManager } from '../components/indexManager';
import { CarouselBasic } from '../components/carouselBasic';
import { HORIZONTAL_ALIGN, VERTICAL_ALIGN } from '../types';
import { Defonce } from '../effects/defonce';
import { Cuber } from '../components/cuber';

interface CreativeProps {
  onClick: (url?: string) => void;
}

export class Creative {
  root: HTMLElement;

  constructor(root: HTMLElement, { onClick }: CreativeProps) {
    this.root = root;

    // Image component
    // for (let i = 0; i < 3; i++) {
    //   const w = 100 * Math.random();
    //   const h = 100 * Math.random();
    //   const l = (100 - w) * Math.random();
    //   const t = (100 - h) * Math.random();
    //   const image = new ImageDM('bg', {
    //     width: `${w}%`,
    //     height: `${h}%`,
    //     border: '2px dashed red',
    //     left: `${l}%`,
    //     top: `${t}%`,
    //     backgroundSize: 'cover',
    //     url: 'https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=60 100w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=60 200w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=60 300w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60 400w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60 500w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=60 600w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=60 700w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60 800w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60 900w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=60 1000w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=60 1200w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=60 1400w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=60 1600w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=60 1800w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=60 2000w'
    //   });
    //   root.appendChild(image);
    // }

    // IndexManager component
    // const idxMgr = new IndexManager({
    //   id: 'idxMngrDM',
    //   startIndex: 0,
    //   focusedElementWidth: 22,
    //   focusedElementHeight: 22,
    //   debug: true,
    //   easing: Elastic.easeOut,
    //   onIndexChange: (index) => console.log(index)
    //   // autoPlay: true
    // });
    // root.appendChild(idxMgr);

    // CarouselBasic component
    // const carouselBasic = new CarouselBasic(
    //   {
    //     id: 'carouselBasicDM',
    //     products: [
    //       'https://images.unsplash.com/photo-1696464795756-2d92a11c504f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    //       'https://images.unsplash.com/photo-1695496573688-3e0e8ac8657e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    //       'https://images.unsplash.com/photo-1695456261833-3794ab617deb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0Mnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    //       'https://plus.unsplash.com/premium_photo-1694670200212-3122e7c5c9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2NHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    //       'https://images.unsplash.com/photo-1695878026745-1d07d1088045?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2N3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
    //     ],
    //     startIndex: 0,
    //     focusedElementWidth: 40,
    //     unfocusedElementWidth: 21,
    //     focusedElementHeight: 80,
    //     unfocusedElementHeight: 61,
    //     debug: true,
    //     easing: Quad.easeOut,
    //     // onIndexChange: (index) => console.log(`creative onIndexChange: ${index}`),
    //     autoPlay: true,
    //     onClick,
    //     gap: 2,
    //     horizontalAlign: HORIZONTAL_ALIGN.CENTER,
    //     verticalAlign: VERTICAL_ALIGN.CENTER,
    //     focusedElementOpacity: 1,
    //     unfocusedElementOpacity: 0.6
    //     // isVertical: true
    //   },
    //   { width: '60%', right: '20%' }
    // );
    // root.appendChild(carouselBasic);

    // Split component
    const split = new Split(
      {
        id: 'idxMngrDM',
        leftImageUrl:
          'https://images.unsplash.com/photo-1695605118408-b31785f23152?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        rightImageUrl:
          'https://images.unsplash.com/photo-1693711836001-99859bb7185a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3NXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
        debug: true,
        originalPosition: 33,
        onClick
      },
      { width: '44%', left: '42%', height: '90%', top: '5%', fontSize: '6.5vi', lineHeight: 1.1, color: '#ffffff' }
    );
    // root.appendChild(split);

    // Countdown component
    const countdown = new Countdown(
      {
        id: 'countdownDM',
        debug: true,
        date: 'Oct 31, 2023 09:00:00',
        isOverMessage: 'in your cinemas',
        onClick,
        gap: 22,
        fontUrl:
          'https://statics.dmcdn.net/d/PRODUCTION/2023/Entertainement_DisneyPlus_Miraculous_0923_Skins_Split_x_3_and_Countdown/assets/V2/ImpasseBold.ttf'
      },
      { left: '3%', width: '70%', bottom: '0%' }
    );
    // root.appendChild(countdown);

    // Cuber component
    const cuber = new Cuber(
      {
        id: 'cuberDM',
        // debug: true,
        products: [
          'https://images.unsplash.com/photo-1696464795756-2d92a11c504f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1695496573688-3e0e8ac8657e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1695456261833-3794ab617deb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0Mnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
          'https://plus.unsplash.com/premium_photo-1694670200212-3122e7c5c9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2NHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1695878026745-1d07d1088045?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2N3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
        ],
        focusedElementWidth: 40,
        focusedElementHeight: 80,
        faceWidth: 50,
        faceHeight: 30,
        faceLeft: 25,
        faceBottom: 10,
        onClick: () => console.log('cuber click'),
        parent: root
      },
      {
        backgroundImage:
          'url(https://statics.dmcdn.net/d/PRODUCTION/2023/Auto_Renault_1023_campaign_Skin_Carousel_interactive/assets/product_1.png)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }
    );
    root.appendChild(cuber);

    // Defonce effect
    const defonce = new Defonce({
      targetElement: cuber,
      // debug: true,
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
  }
}
