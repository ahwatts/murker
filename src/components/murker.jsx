/* eslint indent: off */

import PropTypes from "prop-types";
import R from "ramda";
import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import FindSong from "./find_song";
import RenderContext from "../redux/render_context";
import Styles from "./styles/murker_style";

function Murker({ dimensions }) {
  return (
    <Router>
      <div style={R.merge(Styles.container, {
             width: dimensions.width,
             height: dimensions.height,
           })}>
        <div>
          <ul>
            <li><Link to={"/find_song"}>Find Song</Link></li>
          </ul>

          <Route path={"/find_song"} component={FindSong} />
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
