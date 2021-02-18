import Immutable from "immutable";
import PropTypes from "prop-types";
import * as R from "ramda";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import KeyPress from "../redux/keypress_redux";
import Search from "../redux/search_redux";
import Song from "../redux/song_redux";
import { isBlank } from "../utils";

class SongFinder extends React.PureComponent {
  componentDidUpdate(oldProps) {
    const { quitKeyDown: newQuitKeyDown, history } = this.props;
    const { quitKeyDown: oldQuitKeyDown } = oldProps;
    if (!oldQuitKeyDown && newQuitKeyDown) {
      history.goBack();
    }
  }

  handleQueryChange = (event) => {
    const { setQuery } = this.props;
    setQuery(event.target.value);
  }

  handleSongSelect = (event) => {
    const { results, playSong, history } = this.props;
    const songId = parseInt(event.currentTarget.dataset.songId, 10);
    const song = results.find((s) => s.get("id") === songId);
    if (song) {
      playSong(song);
      history.goBack();
    }
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.handleSongSelect(event);
    }
  }

  render() {
    const { results, isFetching, query } = this.props;

    let resultList = null;
    if (!isBlank(results)) {
      resultList = R.pipe(
        R.take(10),
        R.map((song) => (
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
      )(results.toJS());
    } else if (isFetching) {
      resultList = "... Searching ...";
    }

    return (
      <div className="modal-container">
        <div className="modal-outer-window">
          <div className="modal-inner-window">
            Search for song
            <input type="text" value={query} onChange={this.handleQueryChange} />
            {resultList}
          </div>
        </div>
      </div>
    );
  }
}

SongFinder.propTypes = {
  history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isFetching: PropTypes.bool.isRequired,
  playSong: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  quitKeyDown: PropTypes.string,
  results: PropTypes.instanceOf(Immutable.List).isRequired,
  setQuery: PropTypes.func.isRequired,
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
    setQuery: (query) => dispatch(Search.Actions.findSongQuery(query)),
    playSong: (song) => dispatch(Song.Actions.setNowPlayingSong(song)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SongFinder));
