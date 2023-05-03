import { audioOrigin, audioInstruments, mixLink } from '../utils/recording_dom_elements';

const GAIN_VALUE = 0.9;

export default class AudioMixer {
  constructor() {
    this.mixContext = null;
    this.mixDestination = null;
    this.srcInstruments = null;
    this.srcOrigin = null;
    this.mixRecorder = null;
    this.mixData = [];
    this.mixUrl = null;
    this.gainNode = null;
  }

  async mixStart() {
    this.mixContext = new AudioContext();
    this.mixDestination = this.mixContext.createMediaStreamDestination();
    this.srcOrigin = this.mixContext.createMediaElementSource(audioOrigin);
    this.srcInstruments = this.mixContext.createMediaElementSource(audioInstruments);
    this.gainNode = this.mixContext.createGain();
    this.gainNode.value = GAIN_VALUE;
    this.srcInstruments.connect(this.gainNode);
    this.srcInstruments.connect(this.mixDestination);
    this.srcOrigin.connect(this.mixDestination);
    audioInstruments.play();
    setTimeout(() => {
      audioOrigin.play();
    }, 3700);
    this.mixRecorder = new MediaRecorder(this.mixDestination.stream);
    this.mixRecorder.start();
    await (() => {
      return new Promise(resolve => {
        audioInstruments.addEventListener('ended', async() => {
          await this.mixComplete();
          await resolve();
        }, { once: true });
      });
    })();
  }

  mixComplete() {
    this.mixRecorder.ondataavailable = (e) => {
      this.mixData = [];
      this.mixData.push(e.data);
      this.mixUrl = window.URL.createObjectURL(e.data);
      mixLink.href = this.mixUrl;
      mixLink.download = 'mix.webm';
    };
    this.mixRecorder.stop();
    this.srcInstruments.disconnect(this.gainNode);
    this.srcInstruments.disconnect(this.mixDestination);
    this.srcOrigin.disconnect(this.mixDestination);
  }
}
