/* eslint indent: off */

import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import RenderContext from "../redux/render_context";
import Styles from "./styles/murker_style";

function Murker({ dimensions }) {
  return (
    <div style={[
           Styles.container,
           { width: dimensions.width, height: dimensions.height },
         ]}>
      <span style={{ color: "white" }}>Hello, World!</span>
    </div>
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

function mapDispatchToProps(/* dispatch */) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Murker);
