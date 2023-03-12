import { downloadLink, mixLink } from '../utils/recording_dom_elements'
import axios from 'axios';

export default class RecordingSubmitter {
  constructor() {
    axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
    axios.defaults.headers['X-CSRF-TOKEN'] = document.getElementsByName('csrf-token')[0].getAttribute('content');
  }
  submit() {
    this.firstRequest();
  }

  firstRequest() {
    const request = new XMLHttpRequest();
    request.open('GET', downloadLink.href, true);
    request.responseType = 'blob';
    request.onload = () => {
      const vocalBlob = request.response;
      this.secondRequest(vocalBlob);
    }
    request.send();
  }

  secondRequest(vocalBlob) {
    const request = new XMLHttpRequest();
    request.open('GET', mixLink.href, true);
    request.responseType = 'blob';
    request.onload = () => {
      const mixBlob = request.response;
      const formData = new FormData();
      formData.append('recording_id', document.getElementById('recording_id').value);
      formData.append('vocal_data', vocalBlob, 'vocal.wav');
      formData.append('compose_song', mixBlob, 'song.webm');
      axios.post(document.getElementById('voice-form').action, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        }
      }).then(response => {
        const data = response.data;
        window.location.href = data.url;
      }).catch(error => {
        console.log(error);
      });
    }
    request.send();
  }
}
