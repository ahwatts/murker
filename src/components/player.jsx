import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import Song from "../redux/song";

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSong: null,
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentSong && this.state.currentSong &&
        newProps.currentSong.get("id") !== this.state.currentSong.get("id")) {
      this.setState({
        currentSong: newProps.currentSong,
      });
    } else if (!this.state.currentSong && newProps.currentSong) {
      this.setState({
        currentSong: newProps.currentSong,
      });
    } else if (this.state.currentSong && !newProps.currentSong) {
      this.setState({
        currentSong: null,
      });
    }
  }

  playCurrentSong = () => {
    console.log(this.state.currentSong);
    this.props.playSong(this.state.currentSong);
  }

  render() {
    if (this.state.currentSong) {
      return (
        <div id="player-controls">
          <span className="icon-play3"
                role="button"
                tabIndex={0}
                onClick={this.playCurrentSong} />
          {this.state.currentSong.get("name")}
        </div>
      );
    }

    return null;
  }
}

Player.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
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
    playSong: song => dispatch(Song.Actions.playSong(song.get("url"))),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
