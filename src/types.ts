export enum VERTICAL_ALIGN {
  TOP = 'TOP',
  CENTER = 'CENTER',
  BOTTOM = 'BOTTOM'
}

export enum HORIZONTAL_ALIGN {
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT'
}

export interface ComponentBaseType {
  id: string; // div id
  debug?: boolean;
  redirectUrl?: string; // main url redirection
  onClick: (url?: string) => void; // onClick callback
}

export const defaultComponentValues: ComponentBaseType = {
  id: 'default-component-id',
  debug: true,
  redirectUrl: 'https://www.dailymotion.com',
  onClick: (url?: string) => console.log('click to url: ', url)
};
