import { Creative } from './creative';
import { quartileEvents } from '../constants';
import { createDiv } from '../utils/divMaker';
import { mobileCheck, pickVideo, updateDisplay } from '../utils/helper';

(window as any).getVPAIDAd = () => {
  console.log('getVPAIDAd');
  return new VPAIDVideoPlayer();
};

class VPAIDVideoPlayer {
  attributes: any = {}; // TODO: strongly type
  slot: HTMLElement;
  videoSlot: HTMLVideoElement;
  eventsCallbacks: any = {}; // TODO: strongly type
  creative: Creative;

  // TODO: clean this up
  nextQuartileIndex = 0;
  // A creativeWrapper to keep the creative content centered
  creativeWrapper = null;
  // A container dedicated to the displayed elements
  creativeContent = null;

  constructor() {
    console.log('VPAID constructor');
  }

  /**
   * Creates or updates the video slot and fills it with a supported video.
   * @private
   */
  updateVideoSlot = () => {
    console.log('updateVideoSlot: ', this.videoSlot);
    if (this.videoSlot == null) {
      this.videoSlot = document.createElement('video');
      this.log('Warning: No video element passed to ad, creating element.');
      this.slot.appendChild(this.videoSlot);
    }
    this.updateVideoPlayerSize();

    const videos = [
      {
        mimeType: 'video/mp4',
        width: 853,
        height: 480,
        url: 'https://statics.dmcdn.net/d/vpaid/split/assets/video_low.mp4'
      },
      {
        mimeType: 'video/mp4',
        width: 1280,
        height: 720,
        url: 'https://statics.dmcdn.net/d/vpaid/split/assets/video_mid.mp4'
      },
      {
        mimeType: 'video/mp4',
        width: 1920,
        height: 1080,
        url: 'https://statics.dmcdn.net/d/vpaid/split/assets/video_high.mp4'
      }
    ];

    const selectedMedia = pickVideo(videos, this.videoSlot);

    if (!selectedMedia) {
      // Unable to find a source video.
      console.error('video source was not found : check media mimetype and valid URL');
      this.callEvent('AdError');
    } else {
      this.videoSlot.setAttribute('src', selectedMedia.url);
    }
  };

  // TODO?
  updateInteractiveSlot = () => {};

  callEvent = (eventName) => {
    if (eventName in this.eventsCallbacks) {
      this.eventsCallbacks[eventName]();
    }
  };

  /**
   * Called when the ad is clicked.
   * @private
   */
  clickAd = (url = 'https://www.dailymotion.com/fr') => {
    console.log('clickAd:', url);

    if ('AdClickThru' in this.eventsCallbacks) {
      this.eventsCallbacks['AdClickThru'](url, '0', true);
    }
  };

  // clickAdCustom = (productUrl, productName, clientTracking) => {
  //   let url = productUrl;
  //   // trackPixel(clientTracking);

  //   if ('AdClickThru' in this.eventsCallbacks) {
  //     this.eventsCallbacks['AdClickThru'](url, '0', true);
  //   }
  // };

  trackPixel = (url: string) => {
    if (typeof window !== 'undefined' && window !== null) {
      const i = new Image();
      i.src = url;
    }
  };

  /**
   * Called by the video element when video metadata is loaded.
   * @private
   */
  loadedMetadata = () => {
    // The ad duration is not known until the media metadata is loaded.
    // Then, update the player with the duration change.
    this.attributes['duration'] = this.videoSlot.duration;
    this.callEvent('AdDurationChange');
  };

  /**
   * Called by the video element when the video reaches specific points during
   * playback.
   * @private
   */
  timeUpdateHandler = () => {
    if (this.nextQuartileIndex >= quartileEvents.length) {
      return;
    }
    const percentPlayed = (this.videoSlot.currentTime * 100.0) / this.videoSlot.duration;
    if (percentPlayed >= quartileEvents[this.nextQuartileIndex].value) {
      const lastQuartileEvent = quartileEvents[this.nextQuartileIndex].event;
      this.nextQuartileIndex += 1;
      this.eventsCallbacks[lastQuartileEvent] && this.eventsCallbacks[lastQuartileEvent]();
    }
    if (this.videoSlot.duration > 0) {
      this.attributes['remainingTime'] = this.videoSlot.duration - this.videoSlot.currentTime;
    }
  };

  /**
   * Helper function to update the size of the video player.
   * @private
   */
  updateVideoPlayerSize = () => {
    this.videoSlot.setAttribute('width', this.attributes['width']);
    this.videoSlot.setAttribute('height', this.attributes['height']);
  };

  /**
   * Logs events and messages.
   * @param {string} message
   */
  log = (message) => console.log(message);

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////// VPAID INTERFACE /////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  /**
   * Returns the supported VPAID version.
   * @param {string} playerVPAIDVersion
   * @return {string}
   */
  handshakeVersion = (_) => {
    console.log('test handshakeVersion');
    ('2.0');
  };

  /**
   * Initializes all attributes in the ad. The ad will not start until startAd is called.
   * @param {number} width The ad width.
   * @param {number} height The ad height.
   * @param {string} viewMode The ad view mode.
   * @param {number} desiredBitrate The chosen bitrate.
   * @param {Object} creativeData Data associated with the creative.
   * @param {Object} environmentVars Runtime variables associated with the creative like the slot and video slot.
   */
  initAd = (width, height, viewMode, desiredBitrate, creativeData, environmentVars) => {
    console.log('initAd');
    // TODO: do we need to keep this attributes Object?
    this.attributes['width'] = width;
    this.attributes['height'] = height;
    this.attributes['viewMode'] = viewMode;
    this.attributes['desiredBitrate'] = desiredBitrate;

    this.creativeWrapper = createDiv('creativeWrapper', {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      height: '100%'
    });

    this.creativeContent = createDiv('creativeContent', {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '16 / 9',
      margin: 'auto'
    });
    updateDisplay(this.creativeContent);

    // slot and videoSlot are passed as part of the environmentVars
    this.slot = environmentVars.slot;
    this.videoSlot = environmentVars.videoSlot;

    this.creativeWrapper.appendChild(this.creativeContent);
    this.slot.appendChild(this.creativeWrapper);

    this.updateVideoSlot();
    this.videoSlot.addEventListener('timeupdate', () => this.timeUpdateHandler());
    this.videoSlot.addEventListener('loadedmetadata', () => this.loadedMetadata());
    this.videoSlot.addEventListener('ended', () => this.stopAd());
    // this.slot.addEventListener('click', () => this.clickAd());

    ////////////////////////////////////////////////////////////////////
    ///////////////////// DM ad instanciation //////////////////////////
    ////////////////////////////////////////////////////////////////////
    this.creative = new Creative(this.creativeContent, { onClick: (url?: string) => this.clickAd(url) });
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    // expected VPAID callback
    this.callEvent('AdLoaded');
  };

  /**
   * Called by the wrapper to start the ad.
   */
  startAd = () => {
    this.log('Starting ad');
    this.videoSlot.play();
    // this.updateInteractiveSlot();// TODO

    this.callEvent('AdStarted');
  };

  /**
   * Called by the wrapper to stop the ad.
   */
  stopAd = () => {
    // this.log("Stopping ad");
    // Calling AdStopped immediately terminates the ad. Setting a timeout allows
    // events to go through.
    var callback = this.callEvent.bind(this);
    setTimeout(callback, 75, ['AdStopped']);
  };

  /**
   * Called when the video player changes the width/height of the container.
   * @param {number} width The new width.
   * @param {number} height A new height.
   * @param {string} viewMode A new view mode.
   */
  resizeAd = (width, height, viewMode) => {
    // this.log("resizeAd " + width + "x" + height + " " + viewMode);
    this.attributes['width'] = width;
    this.attributes['height'] = height;
    this.attributes['viewMode'] = viewMode;
    this.updateVideoPlayerSize();
    updateDisplay(this.creativeContent);
    this.callEvent('AdSizeChange');
  };

  /**
   * Pauses the ad.
   */
  pauseAd = () => {
    // this.log("pauseAd");
    this.videoSlot.pause();
    this.callEvent('AdPaused');
  };

  /**
   * Resumes the ad.
   */
  resumeAd = () => {
    // this.log("resumeAd");
    this.videoSlot.play();
    this.callEvent('AdPlaying');
  };

  /**
   * Expands the ad.
   */
  expandAd = () => {
    // this.log("expandAd");
    this.attributes['expanded'] = true;
    this.callEvent('AdExpanded');
  };

  /**
   * Collapses the ad.
   */
  collapseAd = () => (this.attributes['expanded'] = false);

  /**
   * Skips the ad.
   */
  skipAd = () => {
    var skippableState = this.attributes['skippableState'];
    if (skippableState) {
      this.callEvent('AdSkipped');
    }
  };

  /**
   * Registers a callback for an event.
   * @param {Function} callBack The callback function.
   * @param {string} eventName The callback type.
   * @param {Object} aContext The context for the callback.
   */
  subscribe = (callBack, eventName, aContext) => {
    console.log('Subscribe ' + eventName);
    const bindedCallBack = callBack.bind(aContext);
    this.eventsCallbacks[eventName] = bindedCallBack;
  };

  /**
   * Removes a callback based on the eventName.
   * @param {string} eventName The callback type.
   */
  unsubscribe = (eventName) => {
    console.log('unsubscribe ' + eventName);
    this.eventsCallbacks[eventName] = null;
  };

  /**
   * Returns whether the ad is linear.
   * @return {boolean} True if the ad is linear, False for non linear.
   */
  getAdLinear = () => this.attributes['linear'];

  // TODO: is this function necessary? Not present in VPAID documentation
  /**
   * Returns ad width.
   * @return {number} The ad width.
   */
  getAdWidth = () => this.attributes['width'];

  // TODO: is this function necessary? Not present in VPAID documentation
  /**
   * Returns ad height.
   * @return {number} The ad height.
   */
  getAdHeight = () => this.attributes['height'];

  /**
   * Returns true if the ad is expanded.
   * @return {boolean}
   */
  getAdExpanded = () => this.attributes['expanded'];

  /**
   * Returns the skippable state of the ad.
   * @return {boolean}
   */
  getAdSkippableState = () => this.attributes['skippableState'];

  /**
   * Returns the remaining ad time, in seconds.
   * @return {number} The time remaining in the ad.
   */
  getAdRemainingTime = () => this.attributes['remainingTime'];

  // TODO: put this to the actual video remaining time?
  /**
   * Returns the duration of the ad, in seconds.
   * @return {number} The duration of the ad.
   */
  getAdDuration = () => this.attributes['duration'];

  /**
   * Returns the ad volume.
   * @return {number} The volume of the ad.
   */
  getAdVolume = () => {
    // this.log("getAdVolume");
    return this.attributes['volume'];
  };

  /**
   * Sets the ad volume.
   * @param {number} value The volume in percentage.
   */
  setAdVolume = (value) => {
    // this.log("setAdVolume " + value);
    this.attributes['volume'] = value;
    this.callEvent('AdVolumeChange');
  };

  // TODO: is this function necessary? Not present in VPAID documentation
  /**
   * Returns a list of companion ads for the ad.
   * @return {string} List of companions in VAST XML.
   */
  getAdCompanions = () => this.attributes['companions'];

  // TODO: is this function necessary? Not present in VPAID documentation
  /**
   * Returns a list of icons.
   * @return {string} A list of icons.
   */
  getAdIcons = () => this.attributes['icons'];
}
