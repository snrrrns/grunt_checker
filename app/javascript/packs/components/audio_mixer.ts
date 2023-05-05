import { audioOrigin, audioInstruments, mixLink } from '../utils/recording_dom_elements';

const GAIN_VALUE = 0.9;
const AUDIO_ORIGIN_DELAY = 3700;

export default class AudioMixer {
  mixContext: AudioContext | null;
  mixDestination: MediaStreamAudioDestinationNode | null;
  srcInstruments: MediaElementAudioSourceNode | null;
  srcOrigin: MediaElementAudioSourceNode | null;
  mixRecorder: MediaRecorder | null;
  mixData: Blob[];
  mixUrl: string | null;
  gainNode: GainNode | null;

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
    this.gainNode.gain.value = GAIN_VALUE;
    this.srcInstruments.connect(this.gainNode);
    this.srcInstruments.connect(this.mixDestination);
    this.srcOrigin.connect(this.mixDestination);
    audioInstruments.play();
    setTimeout(() => {
      audioOrigin.play();
    }, AUDIO_ORIGIN_DELAY);
    this.mixRecorder = new MediaRecorder(this.mixDestination.stream);
    this.mixRecorder.start();
    await (() => {
      return new Promise<void>(resolve => {
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
