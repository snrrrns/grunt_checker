import { audioPlayer, permissionButton, recordButton, stopButton, downloadLink, audioOrigin } from "../utils/recording_dom_elements";

const BUFFER_SIZE = 1024;

export default class AudioRecorder {
  constructor(audioVisualizer, message) {
    this.audioData = [];
    this.stream = null;
    this.audioContext = null;
    this.audioSampleRate = null;
    this.micBlobUrl = null;
    this.scriptProcessor = null;
    this.mediaStreamSource = null;
    this.recStart = null;
    this.countdownTime = null;
    this.timeout = null;
    this.audioVisualizer = audioVisualizer;
    this.message = message;
  }

  init() {
    audioPlayer.src = '';
    this.message.standby();
    if (!this.stream) {
      navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          echoCancellationType: 'system',
          noiseSuppression: false,
        }
      })
        .then((audio) => {
          permissionButton.classList.add('d-none');
          recordButton.classList.remove('d-none');
          this.stream = audio;
          this.audioVisualizer.startVisualization(this.stream);
          return this.stream;
        })
        .catch((error) => {
          console.error('mediaDevices.getUserMedia() error:', error);
        });
    }
  }

  startRecording() {
    this.recStart = setTimeout(() => {
      this.audioData = [];
      this.audioContext = new AudioContext();
      this.audioSampleRate = this.audioContext.sampleRate;
      this.scriptProcessor = this.audioContext.createScriptProcessor(BUFFER_SIZE, 2, 2);
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(this.stream);
      this.mediaStreamSource.connect(this.scriptProcessor);
      this.scriptProcessor.onaudioprocess = this.onAudioProcess.bind(this);
      this.scriptProcessor.connect(this.audioContext.destination);
      this.message.recordingStart();
      let remainingTime = 4;
      this.countdownTime = setInterval(() => {
        let sec = remainingTime--;
        this.message.recordingInProgress(sec);
        if (sec === 0) {
          clearInterval(this.countdownTime);
        }
      }, 1000);
      this.timeout = setTimeout(() => {
        stopButton.click();
      }, 5000);
    }, 2000);
  }

  onAudioProcess(e) {
    const input = e.inputBuffer.getChannelData(0);
    const bufferData = new Float32Array(BUFFER_SIZE);
    for (let i = 0; i < BUFFER_SIZE; i++) {
      bufferData[i] = input[i];
    }
    this.audioData.push(bufferData);
  }

  stopRecording() {
    clearInterval(this.countdownTime);
    clearTimeout(this.timeout);
    clearTimeout(this.recStart);
    this.saveAudio(this.audioData);
    this.message.completeRecording();
  }

  saveAudio(audioData) {
    this.exportWav(audioData);
    downloadLink.download = 'recorded.wav';
    this.audioContext.close().then(function() {
    });
  }

  exportWav(audioData) {
    const dataView = this.encodeWav(this.mergeBuffers(audioData), this.audioSampleRate);
    const audioBlob = new Blob([dataView], { type: 'audio/wav' });
    this.micBlobUrl = window.URL.createObjectURL(audioBlob);
    const myUrl = window.URL || window.webkitURL;
    const url = myUrl.createObjectURL(audioBlob);
    downloadLink.href = url;
    audioOrigin.src = url;

  }

  encodeWav(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const dataView = new DataView(buffer);
    const writeStringToDataView = (dataView, offset, formatStr) => {
      for (let i = 0; i < formatStr.length; i++) {
        dataView.setUint8(offset + i, formatStr.charCodeAt(i));
      }
    };
    const floatTo16BitPCM = (pcm16BitData, offset, samples) => {
      for (let i = 0; i < samples.length; i++, offset += 2) {
        let sample = Math.max(-1, Math.min(1, samples[i]));
        pcm16BitData.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      }
    };
    writeStringToDataView(dataView, 0, 'RIFF');
    dataView.setUint32(4, 32 + samples.length * 2, true);
    writeStringToDataView(dataView, 8, 'WAVE');
    writeStringToDataView(dataView, 12, 'fmt ');
    dataView.setUint32(16, 16, true);
    dataView.setUint16(20, 1, true);
    dataView.setUint16(22, 1, true);
    dataView.setUint32(24, sampleRate, true);
    dataView.setUint32(28, sampleRate * 2, true);
    dataView.setUint16(32, 2, true);
    dataView.setUint16(34, 16, true);
    writeStringToDataView(dataView, 36, 'data');
    dataView.setUint32(40, samples.length * 2, true);
    floatTo16BitPCM(dataView, 44, samples);
    return dataView;
  }

  mergeBuffers(audioData) {
    let sampleLength = 0;
    let sampleIdx = 0;
    for (let i = 0; i < audioData.length; i++) {
      sampleLength += audioData[i].length;
    }
    const samples = new Float32Array(sampleLength);
    for (let i = 0; i < audioData.length; i++) {
      for (let j = 0; j < audioData[i].length; j++) {
        samples[sampleIdx] = audioData[i][j];
        sampleIdx++;
      }
    }
    return samples
  };

  playBack() {
    if (this.micBlobUrl) {
      audioPlayer.src = this.micBlobUrl;
      audioPlayer.onended = () => {
        audioPlayer.pause();
        audioPlayer.src = '';
      };
      audioPlayer.play();
    }
  }
}
