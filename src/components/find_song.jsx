import Immutable from "immutable";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import Search from "../redux/search_redux";
import Song from "../redux/song_redux";

class SongFinder extends React.PureComponent {
  handleQueryChange = (event) => {
    this.props.setQuery(event.target.value);
  }

  handleSongSelect = (event) => {
    const songId = parseInt(event.currentTarget.dataset.songId, 10);
    const song = this.props.results.find(s => s.get("id") === songId);
    if (song) {
      this.props.playSong(song);
    }
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.handleSongSelect(event);
    }
  }

  render() {
    let resultList = null;

    if (!this.props.results.isEmpty()) {
      resultList = this.props.results.take(10).map(song => (
        <div className="song-result"
             role="button"
             tabIndex={0}
             key={song.get("id")}
             data-song-id={song.get("id")}
             onClick={this.handleSongSelect}
             onKeyPress={this.handleKeyPress}>
          {song.get("name")}
        </div>
      ));
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
  isFetching: PropTypes.bool.isRequired,
  playSong: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.instanceOf(Immutable.List).isRequired,
  setQuery: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(SongFinder);
