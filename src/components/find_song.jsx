/* eslint react/prop-types: off */

import React from "react";
import { connect } from "react-redux";

import FindSong from "../redux/find_song";

class SongFinder extends React.PureComponent {
  handleQueryChange = (query) => {
    this.props.setQuery(query);
  }

  render() {
    return (
      <div style={{ flex: "1 1 auto", flexFlow: "column", justifyContent: "center", alignItems: "center" }}>
        <input type="text" value={this.props.query} onChange={this.handleQueryChange} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    query: FindSong.Selectors.getQuery(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setQuery: query => dispatch(FindSong.Actions.findSongQuery(query)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongFinder);
