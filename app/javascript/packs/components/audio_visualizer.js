export default class AudioVisualizer {
  constructor(domElement) {
    this.canvas = domElement;
    this.canvasContext = this.canvas.getContext('2d');
    this.drawContext = null;
    this.bufferLength = null;
    this.dataArray = null;
    this.analyser = null;
    this.inputStream = null;
  }

  startVisualization(stream) {
    this.createDrawContext(stream);
    this.drawWaveForm();
  }

  createDrawContext(stream) {
    if (!this.drawContext) {
      this.drawContext = new AudioContext();
    }

    this.inputStream = this.drawContext.createMediaStreamSource(stream);
    this.analyser = this.drawContext.createAnalyser();
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.analyser.fftSize = 2048;
    this.inputStream.connect(this.analyser);
  }

  drawWaveForm() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const sliceWidth = canvasWidth / this.bufferLength;

    requestAnimationFrame(() => this.drawWaveForm());

    this.analyser.getByteTimeDomainData(this.dataArray);

    this.canvasContext.fillStyle = 'rgb(0, 0, 0)';
    this.canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
    this.canvasContext.lineWidth = 5;
    this.canvasContext.strokeStyle = 'rgb(200, 200, 200)';
    this.canvasContext.beginPath();

    let x = 0;
    for (let i = 0; i < this.bufferLength; i++) {
      let value = this.dataArray[i] / 128.0;
      let y = value * canvasHeight / 2;

      if (i === 0) {
        this.canvasContext.moveTo(x, y);
      } else {
        this.canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.canvasContext.lineTo(canvasWidth, canvasHeight / 2);
    this.canvasContext.stroke();
  }

  resize() {
    const windowInnerWidth = window.innerWidth.toString();
    const windowInnerHeight = window.innerHeight.toString();

    this.canvas.setAttribute('width', windowInnerWidth);
    this.canvas.setAttribute('height', windowInnerHeight);
  }
}
