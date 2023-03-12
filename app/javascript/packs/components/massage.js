import { message } from '../utils/recording_dom_elements'

export default class Message {
  constructor() {
    message.innerHTML = 'マイクを許可してください'
  }

  standby() {
    message.innerHTML = '録音開始を押すと始まる4カウントの後に歌ってみましょう！(最大5秒)';
  }

  setReady() {
    message.innerHTML = 'Ready...';
  }

  recordingStart() {
    message.innerHTML = `録音中！終了まであと5秒`
  }

  recordingInProgress(sec) {
    message.innerHTML = `録音中！終了まであと${sec}秒`;
  }

  completeRecording() {
    message.innerHTML = '録音完了！'
  }

  mixingInProgress() {
    message.innerHTML = '読み込み中...';
    message.classList.add('blink');
  }

  analysisResult() {
    message.innerHTML = '測定中...'
  }
}
