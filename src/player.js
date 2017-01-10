const AudioContext = window.AudioContext || window.webkitAudioContext;

class Player {
  constructor(audioElement) {
    this.element = audioElement;
    this.element.crossOrigin = "anonymous";

    this.context = new AudioContext();
    this.source = this.context.createMediaElementSource(this.element);

    this.splitter = this.context.createChannelSplitter();
    this.merger = this.context.createChannelMerger();
    this.analyzers = [];

    this.source.connect(this.splitter);
    for (let i = 0; i < this.source.channelCount; i += 1) {
      this.analyzers[i] = this.context.createAnalyser();
      this.analyzers[i].fftSize = 2048;
      this.analyzers[i].smoothingTimeConstant = 0.8;
      this.splitter.connect(this.analyzers[i], i);
      this.analyzers[i].connect(this.merger, 0, i);
    }

    this.merger.connect(this.context.destination);
  }

  play() {
    this.element.play();
  }

  stop() {
    this.element.stop();
  }
}

export default Player;
