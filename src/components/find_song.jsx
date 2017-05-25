import Immutable from "immutable";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import FindSong from "../redux/find_song";
import Song from "../redux/song";

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

  render() {
    let resultList = null;

    if (!this.props.results.isEmpty()) {
      resultList = this.props.results.take(10).map(song => (
        <div className="song-result"
             role="button"
             tabIndex={0}
             key={song.get("id")}
             data-song-id={song.get("id")}
             onClick={this.handleSongSelect}>
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
    isFetching: FindSong.Selectors.isFetching(state),
    query: FindSong.Selectors.getQuery(state),
    results: FindSong.Selectors.getResults(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setQuery: query => dispatch(FindSong.Actions.findSongQuery(query)),
    playSong: song => dispatch(Song.Actions.setNowPlayingSong(song)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongFinder);
