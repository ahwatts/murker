import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Link, Route } from "react-router-dom";
import RenderContext from "../redux/render_context_redux";
import FindSong from "./find_song";
import Player from "./player";

function Murker({ dimensions }) {
  return (
    <Router>
      <div id="murker-root" style={dimensions}>
        <div id="nav-bar">
          <Link to="/">Home</Link>
          <Link to="/find_song">Find Song</Link>
        </div>

        <div id="main">
          <Route path="/find_song" component={FindSong} />
        </div>

        <div id="player">
          <Player />
        </div>
      </div>
    </Router>
  );
}

Murker.propTypes = {
  dimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    dimensions: RenderContext.Selectors.getDimensions(state),
  };
}

export default connect(mapStateToProps)(Murker);
