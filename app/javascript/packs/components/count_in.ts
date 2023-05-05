import * as Tone from 'tone';

const NOTE_LIST = ['G5', 'C5', 'C5', 'C5'];
const ENVELOPE_PARAMS = {
  attack: 0.015,
  decay: 0.02,
  sustain: 0,
  release: 1,
};
const LOOP_COUNT = 1;
const BPM = 60;
const NOTE_DURATION = '32n';

export default class CountIn {
  noteList: string[];
  synth: Tone.FMSynth;
  sequence: Tone.Sequence<string>;

  constructor() {
    this.noteList = NOTE_LIST;
    this.synth = new Tone.FMSynth({
      envelope: ENVELOPE_PARAMS,
    }).toDestination();
    this.sequence = new Tone.Sequence(this.playNote.bind(this), this.noteList);
    this.sequence.loop = LOOP_COUNT;
    Tone.Transport.bpm.value = BPM;
    Tone.Transport.start();
  }

  playNote(time: Tone.Unit.Time, note: Tone.Unit.Frequency) {
    this.synth.triggerAttackRelease(note, NOTE_DURATION, time);
  }

  start() {
    this.sequence.start();
  }
}
