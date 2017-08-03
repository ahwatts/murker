import Immutable from "immutable";
import PropTypes from "prop-types";
import R from "ramda";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import KeyPress from "../redux/keypress_redux";
import Search from "../redux/search_redux";
import Song from "../redux/song_redux";
import Utils from "../utils";

class SongFinder extends React.PureComponent {
  componentWillReceiveProps(newProps) {
    if (!this.props.quitKeyDown && newProps.quitKeyDown) {
      this.props.history.goBack();
    }
  }

  handleQueryChange = (event) => {
    this.props.setQuery(event.target.value);
  }

  handleSongSelect = (event) => {
    const songId = parseInt(event.currentTarget.dataset.songId, 10);
    const song = this.props.results.find(s => s.get("id") === songId);
    if (song) {
      this.props.playSong(song);
      this.props.history.goBack();
    }
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.handleSongSelect(event);
    }
  }

  render() {
    const results = this.props.results.toJS();

    let resultList = null;
    if (!Utils.isBlank(results)) {
      resultList = R.pipe(
        R.take(10),
        R.map(song => (
          <div className="song-result"
               role="button"
               tabIndex={0}
               key={song.id}
               data-song-id={song.id}
               onClick={this.handleSongSelect}
               onKeyPress={this.handleKeyPress}>
            {song.name}
          </div>
        )),
      )(results);
    } else if (this.props.isFetching) {
      resultList = "... Searching ...";
    }

    return (
      <div className="modal-container">
        <div className="modal-outer-window">
          <div className="modal-inner-window">
            Search for song
            <input type="text" value={this.props.query} onChange={this.handleQueryChange} />
            {resultList}
          </div>
        </div>
      </div>
    );
  }
}

SongFinder.propTypes = {
  quitKeyDown: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  playSong: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.instanceOf(Immutable.List).isRequired,
  setQuery: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

SongFinder.defaultProps = {
  quitKeyDown: null,
};

function mapStateToProps(state) {
  return {
    quitKeyDown: KeyPress.Selectors.isKeyDown(state, "Escape"),
    isFetching: Search.Selectors.isFetching(state),
    query: Search.Selectors.getQuery(state),
    results: Search.Selectors.getResults(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setQuery: query => dispatch(Search.Actions.findSongQuery(query)),
    playSong: song => dispatch(Song.Actions.setNowPlayingSong(song)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SongFinder));
