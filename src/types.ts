export enum VERTICAL_ALIGN {
  TOP,
  CENTER,
  BOTTOM
}

export enum HORIZONTAL_ALIGN {
  LEFT,
  CENTER,
  RIGHT
}

export interface ComponentBaseType {
  id: string; // div id
  debug?: boolean;
  redirectUrl?: string; // main url redirection
  onClick: (url?: string) => void; // onClick callback
}

export interface CreativeProps {
  onClick: (url?: string) => void;
}

export type CreativeHandler = (root: HTMLElement, { onClick }: CreativeProps) => void
