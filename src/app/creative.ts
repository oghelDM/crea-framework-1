import { Image } from '../components/image';

export class Creative {
  root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;

    const image = new Image({
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      url:
        'https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=60 100w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=60 200w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=60 300w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60 400w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60 500w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=60 600w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=700&q=60 700w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60 800w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60 900w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=60 1000w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=60 1200w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=60 1400w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=60 1600w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=60 1800w, https://images.unsplash.com/photo-1695575161610-7aeb03933996?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=60 2000w'
    });
    root.appendChild(image);
  }
}
