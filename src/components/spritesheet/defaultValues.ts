import { ComponentBaseType, defaultComponentValues } from '../../types';

export interface SpritesheetType extends ComponentBaseType {
  spriteSheetUrls: string[]; // the usrls of the spritesheet(s) to use
  frameWidth: number; // the width of each image
  frameHeight: number; // the height of each image
  nbFramesW: number; // number of images in one line of the spritesheet
  nbFrames: number; // the total number of frames
  framerate?: number; // the number of milliseconds each image is to be displayed
  isPaused?: boolean; // whether the spritesheet is paused at the beginning
  startFrame?: number; // the frame number to start the animation on
  isBackwards?: boolean; // whether the animation plays backwards
}

export const defaultValuesSpritesheet: SpritesheetType = {
  ...defaultComponentValues,
  id: 'spritesheet-dm',
  onClick: () => console.log('click on spritesheet'),

  spriteSheetUrls: ['images/bmw.png'],
  nbFrames: 35,
  frameWidth: 240,
  frameHeight: 125,
  nbFramesW: 4,
  framerate: 77,
  isPaused: false,
  startFrame: 0,
  isBackwards: false
};
