/* eslint jsx-a11y/media-has-caption: off */

import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import Song from "../redux/song_redux";

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSong: null,
      // status: "stopped",
    };
  }

  componentWillReceiveProps(newProps) {
    const { currentSong: newCurrentSong } = newProps;
    const { currentSong: oldCurrentSong } = this.state;
    if (newCurrentSong && oldCurrentSong
      && newCurrentSong.get("id") !== oldCurrentSong.id) {
      this.setState({
        currentSong: newProps.currentSong.toJS(),
        // status: "playing",
      }, this.playCurrentSong);
    } else if (!oldCurrentSong && newCurrentSong) {
      this.setState({
        currentSong: newCurrentSong.toJS(),
        // status: "playing",
      }, this.playCurrentSong);
    } else if (oldCurrentSong && !newCurrentSong) {
      this.setState({
        currentSong: null,
        // status: "stopped",
      });
    }
  }

  setAudioRef = (elem) => { this.audio = elem; }

  playCurrentSong = () => {
    const { playSong } = this.props;
    const { currentSong } = this.state;
    playSong(currentSong, this.audio);
  }

  handleKeyPress = ({ key }) => {
    if (key === " ") {
      this.playCurrentSong();
    }
  }

  renderButtons() {
    return (
      <span className="icon-play3"
            aria-label="Play"
            role="button"
            tabIndex={0}
            onClick={this.playCurrentSong}
            onKeyPress={this.handleKeyPress} />
    );
  }

  render() {
    const { currentSong } = this.state;
    if (currentSong) {
      return (
        <div id="player-controls">
          <audio src={currentSong.url}
                 key={currentSong.id}
                 controls={false}
                 crossOrigin="anonymous"
                 ref={this.setAudioRef} />
          {this.renderButtons()}
          {currentSong.name}
        </div>
      );
    }

    return null;
  }
}

Player.propTypes = {
  currentSong: PropTypes.shape({
    name: PropTypes.string,
  }),
  playSong: PropTypes.func.isRequired,
};

Player.defaultProps = {
  currentSong: null,
};

function mapStateToProps(state) {
  return {
    currentSong: Song.Selectors.getNowPlayingSong(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    playSong: (song, audio) => dispatch(Song.Actions.playSong(song, audio)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
