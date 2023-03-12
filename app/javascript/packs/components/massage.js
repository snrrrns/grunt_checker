export default class Message {
  constructor(domElement) {
    this.message = domElement;
    this.message.innerHTML = 'マイクを許可してください'
  }

  standby() {
    this.message.innerHTML = '録音開始を押すと始まる4カウントの後に歌ってみましょう！(最大5秒)';
  }

  setReady() {
    this.message.innerHTML = 'Ready...';
  }

  recordingStart() {
    this.message.innerHTML = `録音中！終了まであと5秒`
  }

  recordingInProgress(sec) {
    this.message.innerHTML = `録音中！終了まであと${sec}秒`;
  }

  completeRecording() {
    this.message.innerHTML = '録音完了！'
  }

  mixingInProgress() {
    this.message.innerHTML = '読み込み中...';
    this.message.classList.add('blink');
  }

  analysisResult() {
    this.message.innerHTML = '測定中...'
  }
}
