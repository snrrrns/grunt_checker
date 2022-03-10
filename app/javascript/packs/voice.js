import axios from 'axios';
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers['X-CSRF-TOKEN'] = document.getElementsByName('csrf-token')[0].getAttribute('content');

const jsPermissionButton = document.getElementById('js-permission-button');
const jsRecordButton = document.getElementById('js-record-button');
const jsStopButton = document.getElementById('js-stop-button');
const jsPlaybackButton = document.getElementById('js-playback-button');
const jsPlayer = document.getElementById('js-player');
const jsDownloadLink = document.getElementById('js-download-link');
const jsResultButton = document.getElementById('js-result-button');
const jsRetakeButton = document.getElementById('js-retake-button');
const jsExampleButton = document.getElementById('js-example-button');
const jsExampleVocalLink = document.getElementById('js-example-vocal-link');
const jsTimer = document.getElementById('js-timer');

let audioData = [];
let bufferSize = 1024;
let stream = null;
let audioContext = null;
let audioSampleRate = null;
let micBlobUrl = null;
let scriptProcessor = null;
let mediaStreamSource = null;
let timeout = null;

let stanby = function() {
  jsTimer.innerHTML = '録音開始クリックと同時に歌おう！(最大5秒)';
}

let nowRecording = function() {
  jsTimer.innerHTML = '録音中...終了まであと5秒';
}

let done = function() {
  jsTimer.innerHTML = '録音完了！';
}

let onAudioProcess = function(e) {
  let input = e.inputBuffer.getChannelData(0);
  let bufferData = new Float32Array(bufferSize);
  for (let i = 0; i < bufferSize; i++) {
    bufferData[i] = input[i];
  }
  audioData.push(bufferData)
}

let saveAudio = function() {
  exportWAV(audioData);
  jsDownloadLink.download = 'recorded.wav';
  audioContext.close().then(function() {
  })
}

let exportWAV = function(audioData) {
  let encodeWAV = function(samples, sampleRate) {
    let buffer = new ArrayBuffer(44 + samples.length * 2);
    let view = new DataView(buffer);

    let writeString = function(view, offset, string) {
      for(let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    let floatTo16BitPCM = function(output, offset, input) {
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

  let mergeBuffers = function (audioData) {
    let sampleLength = 0;
    for(let i = 0; i < audioData.length; i++) {
        sampleLength += audioData[i].length;
    }
    let samples = new Float32Array(sampleLength);
    let sampleIdx = 0;
    for(let i = 0; i < audioData.length; i++) {
        for(let j = 0; j < audioData[i].length; j++) {
            samples[sampleIdx] = audioData[i][j];
            sampleIdx++;
        }
    }
    return samples;
  };

  let dataview = encodeWAV(mergeBuffers(audioData), audioSampleRate);
  let audioBlob = new Blob([dataview], { type: 'audio/wav' });
  micBlobUrl = window.URL.createObjectURL(audioBlob);
  console.log(dataview);

  let myURL = window.URL || window.webkitURL;
  let url = myURL.createObjectURL(audioBlob);
  jsDownloadLink.href = url;
};

jsPermissionButton.disabled = false;
jsRecordButton.disabled = true;
jsStopButton.disabled = true;
jsPlaybackButton.disabled = true;
jsResultButton.disabled = true;

jsPermissionButton.onclick = function() {
  jsPlayer.src = ''
  if(!stream) {
    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    })

    .then(function(audio) {
      jsPermissionButton.classList.add('d-none');
      jsRecordButton.classList.remove('d-none');

      stream = audio;
      console.log('録音可能です');
      return stream;
    })

    .catch(function(error) {
      console.error('mediaDevide.getUserMedia() error:', error);
      return;
    })
  }

  stanby();
  jsPermissionButton.disabled = true;
  jsRecordButton.disabled = false;
  jsStopButton.disabled = true;
  jsPlaybackButton.disabled = true;
  jsResultButton.disabled = true;
}

jsRecordButton.onclick = function() {
  jsPlayer.src = ''
  jsRecordButton.classList.add('d-none');
  jsStopButton.classList.remove('d-none');

  audioData = [];
  audioContext = new AudioContext();
  audioSampleRate = audioContext.sampleRate;
  scriptProcessor = audioContext.createScriptProcessor(bufferSize, 2, 2);
  mediaStreamSource = audioContext.createMediaStreamSource(stream);
  mediaStreamSource.connect(scriptProcessor);
  scriptProcessor.onaudioprocess = onAudioProcess;
  scriptProcessor.connect(audioContext.destination);

  jsRecordButton.disabled = true;
  jsStopButton.disabled = false;
  jsPlaybackButton.disabled = true;
  jsExampleButton.disabled = true;

  nowRecording();
  let sec = 4;
  let countDownTime = setInterval(() => {
    let remainingTime = sec--;
    let string = `録音中...終了まであと${remainingTime}秒`;
    jsTimer.innerHTML = string;
    if (sec === 0) {
      clearInterval(countDownTime);
    }
  }, 1000);

  timeout = setTimeout(() => {
    jsStopButton.click();
  }, 5000);

  jsStopButton.addEventListener('click', () => {
    clearInterval(countDownTime);
    clearTimeout(timeout);
    done();
    console.log('停止しました');
  });
}

jsStopButton.onclick = function() {
  jsStopButton.classList.add('d-none');
  jsPlaybackButton.classList.remove('d-none');
  jsRetakeButton.classList.remove('d-none');
  jsResultButton.classList.remove('d-none');

  saveAudio();
  jsRecordButton.disabled = false;
  jsStopButton.disabled = true;
  jsPlaybackButton.disabled = false;
  jsResultButton.disabled = false;
  jsExampleButton.disabled = false;
}

jsPlaybackButton.onclick = function() {
  if(micBlobUrl) {
    jsPlayer.src = micBlobUrl;
    jsPlayer.onended = function() {
      jsPlayer.pause();
      jsPlayer.src = '';
    }
    jsPlayer.play();
  }
}

jsExampleButton.onclick = function() {
  jsPlayer.src = jsExampleVocalLink.href;
  jsPlayer.onended = function() {
    jsPlayer.pause();
    jsPlayer.src = ''
  }
  jsPlayer.play();
}

jsRetakeButton.onclick = function() {
  jsPlayer.src = '';
  jsRetakeButton.classList.add('d-none');
  jsResultButton.classList.add('d-none');
  jsPlaybackButton.classList.add('d-none');
  jsRecordButton.classList.remove('d-none');

  stanby();
}

jsResultButton.onclick = function() {
  jsPlayer.src = '';
  jsResultButton.disabled = true;
  jsRetakeButton.disabled = true;

  let xhr = new XMLHttpRequest();
  xhr.open('GET', document.getElementById('js-download-link').href, true);
  xhr.responseType = 'blob';
  xhr.send();
  xhr.onload = function() {
    let myBlob = this.response;
    let formData = new FormData();
    formData.append('recording_id', document.getElementById('recording_id').value)
    formData.append('vocal_data', myBlob, 'vocal.wav');
    axios.post(document.getElementById('voiceform').action, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      }
    }).then(response => {
        let data = response.data
        window.location.href = data.url
    }).catch(error => {
        console.log(error.response)
    })
  } 
}
