/* eslint indent: off */

import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Link } from "react-router-dom";

import FindSong from "./find_song";
import RenderContext from "../redux/render_context";

function Murker({ dimensions }) {
  return (
    <Router>
      <div id="murker-root" style={dimensions}>
        <div id="nav-bar">
          <Link to={"/"}>Home</Link>
          <Link to={"/find_song"}>Find Song</Link>
        </div>

        <Route path={"/find_song"} component={FindSong} />
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