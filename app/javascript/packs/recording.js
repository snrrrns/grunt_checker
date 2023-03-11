import CountIn from './components/count_in'
import Message from './components/massage'
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
const jsAudioInstruments = document.getElementById('js-audio-instruments');
const jsAudioOrigin = document.getElementById('js-audio-origin');
const jsMixLink = document.getElementById('js-mix-link');
const jsCanvas = document.getElementById('js-canvas');
const jsMainArea = document.getElementById('js-main-area');
const jsSpinner = document.getElementById('js-spinner');

const message = new Message();

let audioData = [];
let bufferSize = 1024;
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
let gainValue = 0.9;
let canvasContext = null;
let drawContext = null;

function onAudioProcess(e) {
  let input = e.inputBuffer.getChannelData(0);
  let bufferData = new Float32Array(bufferSize);
  for (let i = 0; i < bufferSize; i++) {
    bufferData[i] = input[i];
  }
  audioData.push(bufferData);
}

function saveAudio() {
  exportWAV(audioData);
  jsDownloadLink.download = 'recorded.wav';
  audioContext.close().then(function() {
  });
}

function exportWAV(audioData) {
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
  jsAudioOrigin.src = url;
}

async function mixing() {
  console.log('ミックス開始');
  mixContext = new AudioContext();
  mixDestination = mixContext.createMediaStreamDestination();

  srcOrigin = mixContext.createMediaElementSource(jsAudioOrigin);
  srcInstruments = mixContext.createMediaElementSource(jsAudioInstruments);

  gainNode = mixContext.createGain();
  gainNode.gain.value = gainValue;

  srcInstruments.connect(gainNode);
  srcInstruments.connect(mixDestination);
  srcOrigin.connect(mixDestination);

  jsAudioInstruments.play();
  setTimeout(() => {
    jsAudioOrigin.play();
  }, 3750);

  mixRecorder = new MediaRecorder(mixDestination.stream);
  mixRecorder.start();

  await (() => {
    return new Promise(resolve => {
      jsAudioInstruments.addEventListener('ended', async() => {
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
    jsMixLink.href = mixUrl;
    jsMixLink.download = 'mix.webm';
  };
  mixRecorder.stop();
  srcInstruments.disconnect(gainNode);
  srcInstruments.disconnect(mixDestination);
  srcOrigin.disconnect(mixDestination);
  console.log('ミックス完了');
}

function firstXhr() {
  let xhr1 = new XMLHttpRequest();
  xhr1.open('GET', jsDownloadLink.href, true);
  xhr1.responseType = 'blob';
  xhr1.send();
  xhr1.onload = function() {
    let vocalBlob = this.response;
    secondXhr(vocalBlob);
  };
}

function secondXhr(vocalBlob) {
  let xhr2 = new XMLHttpRequest();
  xhr2.open('GET', jsMixLink.href, true);
  xhr2.responseType = 'blob';
  xhr2.send();
  xhr2.onload = function() {
    let mixBlob = this.response;
    let formData = new FormData();
    formData.append('recording_id', document.getElementById('recording_id').value);
    formData.append('vocal_data', vocalBlob, 'vocal.wav');
    formData.append('compose_song', mixBlob, 'song.webm');
    axios.post(document.getElementById('voiceform').action, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      }
    }).then(response => {
      let data = response.data;
      window.location.href = data.url;
    }).catch(error => {
      console.log(error.responce);
    });
  };
}

function visualize(stream) {
  if (!drawContext) {
    drawContext = new AudioContext();
  }

  const source = drawContext.createMediaStreamSource(stream);
  const analyser = drawContext.createAnalyser();
  const bufferLength =  analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  analyser.fftSize = 2048;
  source.connect(analyser);

  canvasContext = jsCanvas.getContext('2d');
  draw();

  function draw() {
    const WIDTH = jsCanvas.width;
    const HEIGHT = jsCanvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasContext.fillStyle = 'rgb(0, 0, 0)';
    canvasContext.strokeStyle = 'rgb(200, 200, 200)';
    canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
    canvasContext.lineWidth = 5;
    canvasContext.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT / 2;

      if (i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasContext.lineTo(jsCanvas.width, jsCanvas.height / 2);
    canvasContext.stroke();
  }
}

function canvasResize() {
  let windowInnerWidth = window.innerWidth;
  let windowInnerHeight = window.innerHeight;

  jsCanvas.setAttribute('width', windowInnerWidth);
  jsCanvas.setAttribute('height', windowInnerHeight);
}

jsPlayer.volume = 0.5;
jsPermissionButton.disabled = false;
jsRecordButton.disabled = true;
jsStopButton.disabled = true;
jsPlaybackButton.disabled = true;
jsResultButton.disabled = true;

window.addEventListener('resize', canvasResize, false);
canvasResize();

jsPermissionButton.onclick = function() {
  jsPlayer.src = '';
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
        jsPermissionButton.classList.add('d-none');
        jsRecordButton.classList.remove('d-none');

        stream = audio;
        visualize(stream);
        console.log('録音可能です');
        return stream;
      })

      .catch(function(error) {
        console.error('mediaDevide.getUserMedia() error:', error);
        return;
      });
  }

  message.standby();
  jsPermissionButton.disabled = true;
  jsRecordButton.disabled = false;
  jsStopButton.disabled = true;
  jsPlaybackButton.disabled = true;
  jsResultButton.disabled = true;
};

jsRecordButton.onclick = function() {
  jsPlayer.src = '';
  
  jsRecordButton.disabled = true;
  jsStopButton.disabled = false;
  jsPlaybackButton.disabled = true;
  jsExampleButton.disabled = true;

  message.setReady();
  const countdown = new CountIn();
  countdown.start();

  recStart = setTimeout(() => {
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
      jsStopButton.click();
    }, 5000);

    jsStopButton.addEventListener('click', () => {
      clearInterval(countDownTime);
      clearTimeout(timeout);
      clearTimeout(recStart);
      message.completeRecording();
      console.log('停止しました');
    });
  }, 2000);
};

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
};

jsPlaybackButton.onclick = function() {
  if(micBlobUrl) {
    jsPlayer.src = micBlobUrl;
    jsPlayer.onended = function() {
      jsPlayer.pause();
      jsPlayer.src = '';
    };
    jsPlayer.play();
  }
};

jsExampleButton.onclick = function() {
  jsPlayer.src = jsExampleVocalLink.href;
  jsPlayer.onended = function() {
    jsPlayer.pause();
    jsPlayer.src = '';
  };
  jsPlayer.play();
};

jsRetakeButton.onclick = function() {
  jsPlayer.src = '';
  jsRetakeButton.classList.add('d-none');
  jsResultButton.classList.add('d-none');
  jsPlaybackButton.classList.add('d-none');
  jsRecordButton.classList.remove('d-none');

  message.standby();
};

jsResultButton.onclick = function() {
  jsPlayer.src = '';

  jsPlaybackButton.disabled = true;
  jsExampleButton.disabled = true;
  jsResultButton.disabled = true;
  jsRetakeButton.disabled = true;

  jsMainArea.classList.add('d-none');
  jsSpinner.classList.remove('d-none');

  message.mixingInProgress();

  mixing().then(() => {
    message.analysisResult();
    firstXhr();
  });
};
