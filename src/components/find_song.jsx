/* eslint react/prop-types: off */

import React from "react";
import { connect } from "react-redux";

import FindSong from "../redux/find_song";

class SongFinder extends React.PureComponent {
  handleQueryChange = (event) => {
    this.props.setQuery(event.target.value);
  }

  render() {
    let resultList = null;

    if (this.props.isFetching) {
      resultList = "... Searching ...";
    } else if (!this.props.results.isEmpty()) {
      resultList = this.props.results.take(10).map(r => (
        <div className="song-result" key={r.get("id")}>
          {r.get("name")}
        </div>
      ));
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongFinder);
