import * as Tone from 'tone';

export default class CountIn {
  constructor() {
    this.noteList = ['G5', 'C5', 'C5', 'C5'];
    this.synth = new Tone.FMSynth({
      envelope: {
        attack: 0.015,
        decay: 0.02,
        sustain: 0,
        release: 1
      }
    }).toDestination();
    this.sequence = new Tone.Sequence(this.playNote.bind(this), this.noteList);
    this.sequence.loop = 1;
    Tone.Transport.bpm.value = 60;
    Tone.Transport.start();
  }

  playNote(time, note) {
    this.synth.triggerAttackRelease(note, '32n', time);
  }

  start() {
    this.sequence.start();
  }
}
