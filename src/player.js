const AudioContext = window.AudioContext || window.webkitAudioContext;

class Player {
  constructor(audioElement) {
    this.element = audioElement;
    const context = new AudioContext();
    const source = context.createMediaElementSource(this.element);
    const splitter = context.createChannelSplitter(source.channelCount);
    const analyzers = [];
    const merger = context.createChannelMerger(source.channelCount);

    source.connect(splitter);
    for (let i = 0; i < source.channelCount; i += 1) {
      const analyzer = context.createAnalyser();
      splitter.connect(analyzer, i);
      analyzer.connect(merger, 0, i);
      analyzers.push(analyzer);
    }
    merger.connect(context.destination);

    this.context = context;
    this.source = source;
    this.splitter = splitter;
    this.analyzers = analyzers;
    this.merger = merger;
  }

  play() {
    this.element.play();
  }

  stop() {
    this.element.stop();
  }
}

export default Player;
