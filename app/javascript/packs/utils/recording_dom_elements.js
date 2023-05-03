// 個別でimportしたい場合はこっちを使う
export const permissionButton = document.getElementById('js-permission-button');
export const recordButton = document.getElementById('js-record-button');
export const stopButton = document.getElementById('js-stop-button');
export const playbackButton = document.getElementById('js-playback-button');
export const resultButton = document.getElementById('js-result-button');
export const retakeButton = document.getElementById('js-retake-button');
export const exampleButton = document.getElementById('js-example-button');
export const downloadLink = document.getElementById('js-download-link');
export const exampleVocalLink = document.getElementById('js-example-vocal-link');
export const audioInstruments = document.getElementById('js-audio-instruments');
export const audioOrigin = document.getElementById('js-audio-origin');
export const mixLink = document.getElementById('js-mix-link');
export const mainArea = document.getElementById('js-main-area');
export const canvas = document.getElementById('js-canvas');
export const message = document.getElementById('js-message');
export const audioPlayer = document.getElementById('js-audio-player');
export const spinner = document.getElementById('js-spinner');

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
};
