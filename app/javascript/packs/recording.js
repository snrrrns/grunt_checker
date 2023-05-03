import CountIn from './components/count_in';
import Message from './components/massage';
import AudioVisualizer from './components/audio_visualizer';
import AudioRecorder from './components/audio_recorder';
import AudioMixer from './components/audio_mixer';
import RecordingSubmitter from './components/recording_submitter';
import element from './utils/recording_dom_elements';

const message = new Message();
const audioVisualizer = new AudioVisualizer();
const audioRecorder = new AudioRecorder(audioVisualizer, message);
const audioMixer = new AudioMixer();
const recordingSubmitter = new RecordingSubmitter();

element.audioPlayer.volume = 0.5;
element.permissionButton.disabled = false;
element.recordButton.disabled = true;
element.stopButton.disabled = true;
element.playbackButton.disabled = true;
element.resultButton.disabled = true;

window.addEventListener('resize', () => {
  audioVisualizer.resize();
}, false);
audioVisualizer.resize();

element.permissionButton.addEventListener('click', () => {
  element.permissionButton.disabled = true;
  element.recordButton.disabled = false;
  element.stopButton.disabled = true;
  element.playbackButton.disabled = true;
  element.resultButton.disabled = true;
  audioRecorder.init();
  message.standby();
});

element.recordButton.addEventListener('click', () => {
  element.audioPlayer.src = '';
  element.recordButton.classList.add('d-none');
  element.stopButton.classList.remove('d-none');
  element.recordButton.disabled = true;
  element.stopButton.disabled = false;
  element.playbackButton.disabled = true;
  element.exampleButton.disabled = true;
  message.setReady();
  const countIn = new CountIn();
  countIn.start();
  audioRecorder.startRecording();
});

element.stopButton.addEventListener('click', () => {
  element.stopButton.classList.add('d-none');
  element.playbackButton.classList.remove('d-none');
  element.retakeButton.classList.remove('d-none');
  element.resultButton.classList.remove('d-none');
  element.recordButton.disabled = false;
  element.stopButton.disabled = true;
  element.playbackButton.disabled = false;
  element.resultButton.disabled = false;
  element.exampleButton.disabled = false;
  audioRecorder.stopRecording();
});

element.playbackButton.addEventListener('click', () => {
  audioRecorder.playBack();
});

element.exampleButton.addEventListener('click', () => {
  element.audioPlayer.src = element.exampleVocalLink.href;
  element.audioPlayer.onended = () => {
    element.audioPlayer.pause();
    element.audioPlayer.src = '';
  };
  element.audioPlayer.play();
});

element.retakeButton.addEventListener('click', () => {
  element.audioPlayer.src = '';
  element.retakeButton.classList.add('d-none');
  element.resultButton.classList.add('d-none');
  element.playbackButton.classList.add('d-none');
  element.recordButton.classList.remove('d-none');
  message.standby();
});

element.resultButton.addEventListener('click', async () => {
  element.audioPlayer.src = '';
  element.playbackButton.disabled = true;
  element.exampleButton.disabled = true;
  element.resultButton.disabled = true;
  element.retakeButton.disabled = true;
  element.mainArea.classList.add('d-none');
  element.spinner.classList.remove('d-none');
  message.mixingInProgress();
  await audioMixer.mixStart();
  message.analysisResult();
  recordingSubmitter.submit();
});
