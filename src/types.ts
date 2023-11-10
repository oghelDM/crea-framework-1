export enum VERTICAL_ALIGN {
  TOP = 'top',
  CENTER = 'center',
  BOTTOM = 'bottom'
}

export enum HORIZONTAL_ALIGN {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right'
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
