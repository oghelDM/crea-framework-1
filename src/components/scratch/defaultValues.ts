import { ComponentBaseType, defaultComponentValues } from '../../types';

export interface ScratchType extends ComponentBaseType {
  backImageUrl: string;
  frontImageUrl: string;
  scratchImageUrl?: string;
  scratchSizeCoeff?: number;
  timeoutDuration?: number;
  cursorUrl?: string;
}

export const defaultValuesScratch: ScratchType = {
  ...defaultComponentValues,
  id: 'scratch-dm',
  onClick: () => console.log('click on scratch'),
  cursorUrl: 'https://statics.dmcdn.net/d/TESTS/components/scratch/target.png',
  timeoutDuration: 4000,
  backImageUrl: 'https://statics.dmcdn.net/d/TESTS/components/scratch/back_voda.png',
  frontImageUrl: 'https://statics.dmcdn.net/d/TESTS/components/scratch/front_voda.png',
  scratchImageUrl: 'https://statics.dmcdn.net/d/TESTS/components/scratch/scratch1.png',
  scratchSizeCoeff: 2
};
