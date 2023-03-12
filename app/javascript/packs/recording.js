import CountIn from './components/count_in'
import Message from './components/massage'
import AudioVisualizer from "./components/audio_visualizer";
import element from "./utils/recording_dom_elements";
import axios from 'axios';
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers['X-CSRF-TOKEN'] = document.getElementsByName('csrf-token')[0].getAttribute('content');

const message = new Message();
const audioVisualizer = new AudioVisualizer();

const BUFFER_SIZE = 1024;
const GAIN_VALUE = 0.9;

let audioData = [];
let stream = null;
let audioContext = null;
let audioSampleRate = null;
let micBlobUrl = null;
let scriptProcessor = null;
let mediaStreamSource = null;
let recStart = null;
let countDownTime = null;
let timeout = null;
let mixContext = null;
let mixDestination = null;
let srcInstruments = null;
let srcOrigin = null;
let mixRecorder = null;
let mixData = [];
let mixUrl = null;
let gainNode = null;


function onAudioProcess(e) {
  const input = e.inputBuffer.getChannelData(0);
  const bufferData = new Float32Array(BUFFER_SIZE);
  for (let i = 0; i < BUFFER_SIZE; i++) {
    bufferData[i] = input[i];
  }
  audioData.push(bufferData);
}

function saveAudio() {
  exportWAV(audioData);
  element.downloadLink.download = 'recorded.wav';
  audioContext.close().then(function() {
  });
}

function exportWAV(audioData) {
  const encodeWAV = (samples, sampleRate) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
      for(let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const floatTo16BitPCM = (output, offset, input) => {
      for(let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 32 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true); 
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);
    floatTo16BitPCM(view, 44, samples);
    return view;
  };

  const mergeBuffers = (audioData) => {
    let sampleLength = 0;
    for(let i = 0; i < audioData.length; i++) {
      sampleLength += audioData[i].length;
    }
    const samples = new Float32Array(sampleLength);
    let sampleIdx = 0;
    for(let i = 0; i < audioData.length; i++) {
      for(let j = 0; j < audioData[i].length; j++) {
        samples[sampleIdx] = audioData[i][j];
        sampleIdx++;
      }
    }
    return samples;
  };

  const dataview = encodeWAV(mergeBuffers(audioData), audioSampleRate);
  const audioBlob = new Blob([dataview], { type: 'audio/wav' });
  micBlobUrl = window.URL.createObjectURL(audioBlob);
  console.log(dataview);

  const myURL = window.URL || window.webkitURL;
  const url = myURL.createObjectURL(audioBlob);
  element.downloadLink.href = url;
  element.audioOrigin.src = url;
}

async function mixing() {
  console.log('ミックス開始');
  mixContext = new AudioContext();
  mixDestination = mixContext.createMediaStreamDestination();

  srcOrigin = mixContext.createMediaElementSource(element.audioOrigin);
  srcInstruments = mixContext.createMediaElementSource(element.audioInstruments);

  gainNode = mixContext.createGain();
  gainNode.gain.value = GAIN_VALUE;

  srcInstruments.connect(gainNode);
  srcInstruments.connect(mixDestination);
  srcOrigin.connect(mixDestination);

  element.audioInstruments.play();
  setTimeout(() => {
    element.audioOrigin.play();
  }, 3750);

  mixRecorder = new MediaRecorder(mixDestination.stream);
  mixRecorder.start();

  await (() => {
    return new Promise(resolve => {
      element.audioInstruments.addEventListener('ended', async() => {
        await completeMixing();
        await resolve();
      }, { once: true });
    });
  })();
}

function completeMixing() {
  mixRecorder.ondataavailable = (e) => {
    mixData = [];
    mixData.push(e.data);
    mixUrl = window.URL.createObjectURL(e.data);
    element.mixLink.href = mixUrl;
    element.mixLink.download = 'mix.webm';
  };
  mixRecorder.stop();
  srcInstruments.disconnect(gainNode);
  srcInstruments.disconnect(mixDestination);
  srcOrigin.disconnect(mixDestination);
  console.log('ミックス完了');
}

function firstXhr() {
  const xhr1 = new XMLHttpRequest();
  xhr1.open('GET', element.downloadLink.href, true);
  xhr1.responseType = 'blob';
  xhr1.send();
  xhr1.onload = function() {
    const vocalBlob = this.response;
    secondXhr(vocalBlob);
  };
}

function secondXhr(vocalBlob) {
  const xhr2 = new XMLHttpRequest();
  xhr2.open('GET', element.mixLink.href, true);
  xhr2.responseType = 'blob';
  xhr2.send();
  xhr2.onload = function() {
    const mixBlob = this.response;
    const formData = new FormData();
    formData.append('recording_id', document.getElementById('recording_id').value);
    formData.append('vocal_data', vocalBlob, 'vocal.wav');
    formData.append('compose_song', mixBlob, 'song.webm');
    axios.post(document.getElementById('voiceform').action, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      }
    }).then(response => {
      const data = response.data;
      window.location.href = data.url;
    }).catch(error => {
      console.log(error.responce);
    });
  };
}

element.audioPlayer.volume = 0.5;
element.permissionButton.disabled = false;
element.recordButton.disabled = true;
element.stopButton.disabled = true;
element.playbackButton.disabled = true;
element.resultButton.disabled = true;

window.addEventListener('resize', () => {
  audioVisualizer.resize()
}, false);
audioVisualizer.resize();

element.permissionButton.onclick = function() {
  element.audioPlayer.src = '';
  if(!stream) {
    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        echoCancellation: true,
        echoCancellationType: 'system',
        noiseSuppression: false
      }
    })
      .then(function(audio) {
        element.permissionButton.classList.add('d-none');
        element.recordButton.classList.remove('d-none');

        stream = audio;
        audioVisualizer.startVisualization(stream);
        console.log('録音可能です');
        return stream;
      })

      .catch(function(error) {
        console.error('mediaDevide.getUserMedia() error:', error);
        return;
      });
  }

  message.standby();
  element.permissionButton.disabled = true;
  element.recordButton.disabled = false;
  element.stopButton.disabled = true;
  element.playbackButton.disabled = true;
  element.resultButton.disabled = true;
};

element.recordButton.onclick = function() {
  element.audioPlayer.src = '';
  
  element.recordButton.disabled = true;
  element.stopButton.disabled = false;
  element.playbackButton.disabled = true;
  element.exampleButton.disabled = true;

  message.setReady();
  const countIn = new CountIn();
  countIn.start();

  recStart = setTimeout(() => {
    element.recordButton.classList.add('d-none');
    element.stopButton.classList.remove('d-none');

    audioData = [];
    audioContext = new AudioContext();
    audioSampleRate = audioContext.sampleRate;
    scriptProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 2, 2);
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    mediaStreamSource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(audioContext.destination);

    message.recordingStart();
    let remainingTime = 4;
    countDownTime = setInterval(() => {
      let sec = remainingTime--;
      message.recordingInProgress(sec);
      if (sec === 0) {
        clearInterval(countDownTime);
      }
    }, 1000);

    timeout = setTimeout(() => {
      element.stopButton.click();
    }, 5000);

    element.stopButton.addEventListener('click', () => {
      clearInterval(countDownTime);
      clearTimeout(timeout);
      clearTimeout(recStart);
      message.completeRecording();
      console.log('停止しました');
    });
  }, 2000);
};

element.stopButton.onclick = function() {
  element.stopButton.classList.add('d-none');
  element.playbackButton.classList.remove('d-none');
  element.retakeButton.classList.remove('d-none');
  element.resultButton.classList.remove('d-none');

  saveAudio();
  element.recordButton.disabled = false;
  element.stopButton.disabled = true;
  element.playbackButton.disabled = false;
  element.resultButton.disabled = false;
  element.exampleButton.disabled = false;
};

element.playbackButton.onclick = function() {
  if(micBlobUrl) {
    element.audioPlayer.src = micBlobUrl;
    element.audioPlayer.onended = function() {
      element.audioPlayer.pause();
      element.audioPlayer.src = '';
    };
    element.audioPlayer.play();
  }
};

element.exampleButton.onclick = function() {
  element.audioPlayer.src = element.exampleVocalLink.href;
  element.audioPlayer.onended = function() {
    element.audioPlayer.pause();
    element.audioPlayer.src = '';
  };
  element.audioPlayer.play();
};

element.retakeButton.onclick = function() {
  element.audioPlayer.src = '';
  element.retakeButton.classList.add('d-none');
  element.resultButton.classList.add('d-none');
  element.playbackButton.classList.add('d-none');
  element.recordButton.classList.remove('d-none');

  message.standby();
};

element.resultButton.onclick = function() {
  element.audioPlayer.src = '';

  element.playbackButton.disabled = true;
  element.exampleButton.disabled = true;
  element.resultButton.disabled = true;
  element.retakeButton.disabled = true;

  element.mainArea.classList.add('d-none');
  element.spinner.classList.remove('d-none');

  message.mixingInProgress();

  mixing().then(() => {
    message.analysisResult();
    firstXhr();
  });
};
