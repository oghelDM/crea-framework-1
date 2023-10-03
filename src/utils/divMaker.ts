export const createDiv = (id: string, style: any): HTMLElement => {
  console.log('createDiv: ', id);
  const div = document.createElement('div');
  div.id = id;
  for (const [key, value] of Object.entries(style)) {
    div.style[key] = value;
  }

  return div;
};
