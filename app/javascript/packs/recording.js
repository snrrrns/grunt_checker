import CountIn from './components/count_in'
import Message from './components/massage'
import AudioVisualizer from "./components/audio_visualizer";
import AudioRecorder from "./components/audio_recorder";
import AudioMixer from "./components/audio_mixer";
import element from "./utils/recording_dom_elements";
import axios from 'axios';
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers['X-CSRF-TOKEN'] = document.getElementsByName('csrf-token')[0].getAttribute('content');

const message = new Message();
const audioVisualizer = new AudioVisualizer();
const audioRecorder = new AudioRecorder(audioVisualizer, message);
const audioMixer = new AudioMixer();

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
  audioRecorder.init();
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
  audioRecorder.startRecording();
};

element.stopButton.onclick = function() {
  element.stopButton.classList.add('d-none');
  element.playbackButton.classList.remove('d-none');
  element.retakeButton.classList.remove('d-none');
  element.resultButton.classList.remove('d-none');
  element.recordButton.disabled = false;
  element.stopButton.disabled = true;
  element.playbackButton.disabled = false;
  element.resultButton.disabled = false;
  element.exampleButton.disabled = false;
};

element.playbackButton.onclick = function() {
  audioRecorder.playBack();
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

  audioMixer.mixStart().then(() => {
    message.analysisResult();
    firstXhr();
  });
};
