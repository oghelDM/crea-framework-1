import { ComponentBaseType } from '../types';

interface CountdownType extends ComponentBaseType {
  date: string; // date in the format: 'Oct 21, 2023 09:00:00'
  isOverMessage?: string; // message to be displayed when the countdown is over. default is 00 00 00 00
  fontUrl?: string; // font url (.ttf) to use to display the countdown
  separator?: string; // character to separate the countdown numbers. default is ␣ (space)
}

export class Countdown extends HTMLElement {
  private requestFrame: number;
  private last = 0; // timestamp of the last checkUpdate() call
  private dateMilliseconds; // date in milliseconds
  private isOverMessage;
  private separator;

  constructor(props: CountdownType, style: any = {}) {
    super();

    const { id, date, isOverMessage, fontUrl, debug, onClick, redirectUrl, separator = ' ' } = props;

    this.separator = separator;
    this.isOverMessage = isOverMessage;
    this.dateMilliseconds = new Date(date).getTime();

    this.setAttribute('id', id);
    const actualStyle = {
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '3.5vi',
      lineHeight: '3.5vi',
      fontSize: '3.5vi',
      opacity: 1,
      backgroundColor: debug ? '#00ffff88' : 'unset',
      textAlign: 'center',
      cursor: 'default',
      whiteSpace: 'pre', // preserve multiple spaces if needed

      ...style
    };
    for (const [key, value] of Object.entries(actualStyle)) {
      this.style[key] = value;
    }

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

    this.innerHTML = `${textDay}${this.separator}${textHour}${this.separator}${textMinute}${this.separator}${textSecond}`;
  };
}

// declare the new web component to allow constructor instanciation
customElements.define('dm-countdown', Countdown);
