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

  render() {
    if (this.state.currentSong) {
      return (
        <div id="player-controls">
          <span className="icon-play3" />
          {this.state.currentSong.get("name")}
        </div>
      );
    }

    return null;
  }
}

function mapStateToProps(state) {
  return {
    currentSong: Song.Selectors.getNowPlayingSong(state),
  };
}

function mapDispatchToProps(/* dispatch */) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
