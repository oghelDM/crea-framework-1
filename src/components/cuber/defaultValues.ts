import { HORIZONTAL_ALIGN, VERTICAL_ALIGN } from '../../types';
import { IndexManagerType, defaultPropsIndexManager } from '../indexManager';

export interface CuberType extends IndexManagerType {
  products: string[]; // image elements
  parent: HTMLElement; // the parent DOM element (usually the creative root), necessary to compute the faces dimensions
  faceLeft?: number; // same as the usual css left property for the focused face
  faceRight?: number; // same as the usual css right property for the focused face
  faceTop?: number; // same as the usual css top property for the focused face
  faceBottom?: number; // same as the usual css bottom property for the focused face
  perspective?: number; // 3D perspective
  perspectiveOrigin?: string; // defines the 3d transform origin perspective (eg. '50%' or '0% 50%')
}

export const defaultValuesCuber: CuberType = {
  ...defaultPropsIndexManager,
  id: 'cuber-dm',
  onClick: () => console.log('click on cuber'),

  products: [
    'https://images.unsplash.com/photo-1696464795756-2d92a11c504f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1695496573688-3e0e8ac8657e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1695456261833-3794ab617deb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0Mnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    'https://plus.unsplash.com/premium_photo-1694670200212-3122e7c5c9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2NHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1695878026745-1d07d1088045?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2N3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60'
  ],
  faceLeft: (100 - defaultPropsIndexManager.focusedElementWidth) / 2,
  faceTop: (100 - defaultPropsIndexManager.focusedElementHeight) / 2,
  faceRight: undefined,
  faceBottom: undefined,
  parent: document.getElementById('appId'),
  perspective: 6,
  perspectiveOrigin: '50% 50%'
};
