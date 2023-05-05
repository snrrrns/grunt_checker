// 個別でimportしたい場合はこっちを使う
export const permissionButton = document.getElementById('js-permission-button') as HTMLButtonElement;
export const recordButton = document.getElementById('js-record-button') as HTMLButtonElement;
export const stopButton = document.getElementById('js-stop-button') as HTMLButtonElement;
export const playbackButton = document.getElementById('js-playback-button') as HTMLButtonElement;
export const resultButton = document.getElementById('js-result-button') as HTMLButtonElement;
export const retakeButton = document.getElementById('js-retake-button') as HTMLButtonElement;
export const exampleButton = document.getElementById('js-example-button') as HTMLButtonElement;
export const downloadLink = document.getElementById('js-download-link') as HTMLAnchorElement;
export const exampleVocalLink = document.getElementById('js-example-vocal-link') as HTMLAnchorElement;
export const audioInstruments = document.getElementById('js-audio-instruments') as HTMLAudioElement;
export const audioOrigin = document.getElementById('js-audio-origin') as HTMLAudioElement;
export const mixLink = document.getElementById('js-mix-link') as HTMLAnchorElement;
export const mainArea = document.getElementById('js-main-area') as HTMLDivElement;
export const canvas = document.getElementById('js-canvas') as HTMLCanvasElement;
export const message = document.getElementById('js-message') as HTMLSpanElement;
export const audioPlayer = document.getElementById('js-audio-player') as HTMLAudioElement;
export const spinner = document.getElementById('js-spinner') as HTMLDivElement;

type RecordingDomElements = {
  permissionButton: HTMLButtonElement;
  recordButton: HTMLButtonElement;
  stopButton: HTMLButtonElement;
  playbackButton: HTMLButtonElement;
  resultButton: HTMLButtonElement;
  retakeButton: HTMLButtonElement;
  exampleButton: HTMLButtonElement;
  downloadLink: HTMLAnchorElement;
  exampleVocalLink: HTMLAnchorElement;
  audioInstruments: HTMLAudioElement;
  audioOrigin: HTMLAudioElement;
  mixLink: HTMLAnchorElement;
  mainArea: HTMLDivElement;
  canvas: HTMLCanvasElement;
  message: HTMLSpanElement;
  audioPlayer: HTMLAudioElement;
  spinner: HTMLDivElement;
}

// まとめてimportしたい場合はこっちを使う
export default {
  permissionButton,
  recordButton,
  stopButton,
  playbackButton,
  resultButton,
  retakeButton,
  exampleButton,
  downloadLink,
  exampleVocalLink,
  audioInstruments,
  audioOrigin,
  mixLink,
  mainArea,
  canvas,
  message,
  audioPlayer,
  spinner,
} as RecordingDomElements;
