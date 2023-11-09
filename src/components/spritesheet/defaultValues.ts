import { ComponentBaseType, defaultComponentValues } from '../../types';

export const CANVAS_W = 2048; // the maximum width and height of the spritesheet

export interface SpritesheetType extends ComponentBaseType {
  spriteSheetUrls: string[]; // the url(s) of the spritesheet(s) to use
  frameWidth: number; // the width of each image
  frameHeight: number; // the height of each image
  nbFrames: number; // the total number of frames
  framerate?: number; // the number of milliseconds each image is to be displayed
  isPaused?: boolean; // whether the spritesheet is paused at the beginning
  startFrame?: number; // the frame number to start the animation on
  isBackwards?: boolean; // whether the animation plays backwards
  isLoop?: boolean; // whether the animation loops
}

export const defaultValuesSpritesheet: SpritesheetType = {
  ...defaultComponentValues,
  id: 'spritesheet-dm',
  onClick: () => console.log('click on spritesheet'),

  spriteSheetUrls: [
    'https://statics.dmcdn.net/d/TESTS/components/assets/sprite_bmw_0.png',
    'https://statics.dmcdn.net/d/TESTS/components/assets/sprite_bmw_1.png'
  ],
  nbFrames: 35,
  frameWidth: 509,
  frameHeight: 265,
  framerate: 70,
  isPaused: false,
  startFrame: 0,
  isBackwards: false,
  isLoop: true
};
