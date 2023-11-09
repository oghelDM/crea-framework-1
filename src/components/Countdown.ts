import { ComponentBaseType, HORIZONTAL_ALIGN } from '../types';
import { createDiv } from '../utils/divMaker';

interface CountdownType extends ComponentBaseType {
  date: string; // date in the format: 'Oct 21, 2023 09:00:00'
  isOverMessage?: string; // message to be displayed when the countdown is over. default is 00 00 00 00
  fontUrl?: string; // font url (.ttf) to use to display the countdown
  textAlign?: HORIZONTAL_ALIGN; // horizontal alignment of each text
  elementWidth: string; // the width of each textField element, use the same unit as the fontSize
}

export class Countdown extends HTMLElement {
  private requestFrame: number;
  private last = 0; // timestamp of the last checkUpdate() call
  private dateMilliseconds; // date in milliseconds
  private isOverMessage;
  private dayDiv: HTMLElement;
  private hourDiv: HTMLElement;
  private minDiv: HTMLElement;
  private secDiv: HTMLElement;

  constructor(props: CountdownType, style: any = {}) {
    super();

    const {
      id,
      date,
      isOverMessage,
      fontUrl,
      debug,
      onClick,
      redirectUrl,
      textAlign = HORIZONTAL_ALIGN.CENTER,
      elementWidth
    } = props;

    this.setAttribute('id', id);

    this.isOverMessage = isOverMessage;
    this.dateMilliseconds = new Date(date).getTime();

    let justifyContent = 'space-between';
    if (textAlign === HORIZONTAL_ALIGN.LEFT) {
      justifyContent = 'flex-start';
    } else if (textAlign === HORIZONTAL_ALIGN.RIGHT) {
      justifyContent = 'flex-end';
    }
    const actualStyle = {
      position: 'absolute',
      height: '3.5vi',
      lineHeight: '3.5vi',
      fontSize: '3.5vi',
      width: '100%',
      display: 'flex',
      justifyContent,
      backgroundColor: debug ? '#00ffff88' : 'unset',

      ...style
    };
    for (const [key, value] of Object.entries(actualStyle)) {
      this.style[key] = value;
    }

    [this.dayDiv, this.hourDiv, this.minDiv, this.secDiv] = new Array(4).fill(0).map((_, i) => {
      const div = createDiv(`countdown-${i}`, {
        backgroundColor: debug ? '#ffffff88' : 'unset',
        width: elementWidth,
        height: 'inherit',
        lineHeight: 'inherit',
        fontSize: 'inherit',
        textAlign: textAlign,
        cursor: 'default',
        pointerEvents: 'none',
        userSelect: 'none',
        fontFamily: 'inherit'
      });
      this.appendChild(div);
      return div;
    });

    this.style.fontFamily = 'sans-serif';
    if (fontUrl) {
      const customFont = new FontFace('customFont', `url("${fontUrl}")`);
      customFont.load().then(() => {
        (document.fonts as any).add(customFont); // TODO: we shouldn't have to cast this as any...
        document.body.classList.add('fonts-loaded');
        this.style.fontFamily = customFont.family;
      });
    }

    this.addEventListener('click', () => onClick(redirectUrl));

    this.checkUpdate();
  }

  checkUpdate = () => {
    const now = Date.now();
    if (!this.last || now - this.last >= 1000) {
      this.last = now;
      this.updateCountdown();
    }
    this.requestFrame = requestAnimationFrame(this.checkUpdate);
  };

  updateCountdown = () => {
    const delta = this.dateMilliseconds - this.last;

    if (delta < 0) {
      window.cancelAnimationFrame(this.requestFrame);
      this.innerHTML = this.isOverMessage;
      return;
    }

    const second = 1000; // number of milliseconds in a second
    const minute = second * 60; // number of milliseconds in a minute
    const hour = minute * 60; // number of milliseconds in an hour
    const day = hour * 24; // number of milliseconds in a day

    const options = { minimumIntegerDigits: 2 };
    const locales = undefined;

    const textDay = Math.floor(delta / day).toLocaleString(locales, options);
    const textHour = Math.floor((delta % day) / hour).toLocaleString(locales, options);
    const textMinute = Math.floor((delta % hour) / minute).toLocaleString(locales, options);
    const textSecond = Math.floor((delta % minute) / second).toLocaleString(locales, options);

    this.dayDiv.innerHTML = textDay;
    this.hourDiv.innerHTML = textHour;
    this.minDiv.innerHTML = textMinute;
    this.secDiv.innerHTML = textSecond;
  };
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-countdown', Countdown);
