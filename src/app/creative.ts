import { Elastic, Quad } from 'gsap';
import { HORIZONTAL_ALIGN, VERTICAL_ALIGN } from '../constants';
import { ImageDM } from '../components/image';
import { IndexManager } from '../components/indexManager';
import { CarouselBasic } from '../components/carouselBasic';

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
    const carouselBasic = new CarouselBasic(
      {
        id: 'carouselBasicDM',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1696464795756-2d92a11c504f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
            redirectUrl: 'http://www.google.com?q=0'
          },
          {
            url: 'https://images.unsplash.com/photo-1695496573688-3e0e8ac8657e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
            redirectUrl: 'http://www.google.com?q=1'
          },
          {
            url: 'https://images.unsplash.com/photo-1695456261833-3794ab617deb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0Mnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
            redirectUrl: 'http://www.google.com?q=2'
          },
          {
            url: 'https://plus.unsplash.com/premium_photo-1694670200212-3122e7c5c9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2NHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
            redirectUrl: 'http://www.google.com?q=3'
          },
          {
            url: 'https://images.unsplash.com/photo-1695878026745-1d07d1088045?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2N3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
            redirectUrl: 'http://www.google.com?q=4'
          }
        ],
        redirectUrl: '',
        startIndex: 0,
        focusedElementWidth: 40,
        unfocusedElementWidth: 21,
        focusedElementHeight: 80,
        unfocusedElementHeight: 61,
        // debug: true,
        easing: Quad.easeOut,
        // onIndexChange: (index) => console.log(`creative onIndexChange: ${index}`),
        autoPlay: true,
        onClick,
        gap: 2,
        horizontalAlign: HORIZONTAL_ALIGN.LEFT,
        verticalAlign: VERTICAL_ALIGN.CENTER,
        focusedElementOpacity: 1,
        unfocusedElementOpacity: 0.6
      },
      { width: '60%', right: '20%' }
    );
    root.appendChild(carouselBasic);
  }
}
