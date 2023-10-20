// OPTION_SPLIT_IMPORT
import { Split } from '@/components/Split';

// OPTION_SPLIT_CODE_EXAMPLE
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
root.appendChild(split);
