import { message } from '../utils/recording_dom_elements';

enum MessageType {
  REQUEST_MIC_PERMISSION = 'マイクを許可してください',
  STANDBY = '録音開始を押すと始まる4カウントの後に歌ってみましょう！(最大5秒)',
  READY = 'Ready...',
  REC_START = '録音中！終了まであと5秒',
  REC_COMPLETED = '録音完了！',
  MIXING_IN_PROGRESS = '読み込み中...',
  ANALYSIS_IN_PROGRESS = '測定中...',
}

export default class Message {
  constructor() {
    message.innerHTML = MessageType.REQUEST_MIC_PERMISSION;
  }

  standby() {
    message.innerHTML = MessageType.STANDBY;
  }

  setReady() {
    message.innerHTML = MessageType.READY;
  }

  recordingStart() {
    message.innerHTML = MessageType.REC_START;
  }

  recordingInProgress(sec: number) {
    message.innerHTML = `録音中！終了まであと${sec}秒`;
  }

  completeRecording() {
    message.innerHTML = MessageType.REC_COMPLETED;
  }

  mixingInProgress() {
    message.innerHTML = MessageType.MIXING_IN_PROGRESS;
    message.classList.add('blink');
  }

  analysisResult() {
    message.innerHTML = MessageType.ANALYSIS_IN_PROGRESS;
  }
}
