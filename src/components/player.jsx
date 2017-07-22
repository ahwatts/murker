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
      status: "stopped",
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentSong && this.state.currentSong &&
        newProps.currentSong.get("id") !== this.state.currentSong.id) {
      this.setState({
        currentSong: newProps.currentSong.toJS(),
        status: "playing",
      }, this.playCurrentSong);
    } else if (!this.state.currentSong && newProps.currentSong) {
      this.setState({
        currentSong: newProps.currentSong.toJS(),
        status: "playing",
      }, this.playCurrentSong);
    } else if (this.state.currentSong && !newProps.currentSong) {
      this.setState({
        currentSong: null,
        status: "stopped",
      });
    }
  }

  setAudioRef = (elem) => { this.audio = elem; }

  playCurrentSong = () => {
    this.props.playSong(this.state.currentSong, this.audio);
  }

  renderButtons() {
    return (
      <span className="icon-play3"
            role="button"
            tabIndex={0}
            onClick={this.playCurrentSong} />
    );
  }

  render() {
    if (this.state.currentSong) {
      return (
        <div id="player-controls">
          <audio src={this.state.currentSong.url}
                 key={this.state.currentSong.id}
                 controls={false}
                 crossOrigin="anonymous"
                 ref={this.setAudioRef} />
          {this.renderButtons()}
          {this.state.currentSong.name}
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
