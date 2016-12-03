/* eslint react/prop-types: off, react/no-unused-prop-types: off */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createdWebGLContext } from './actions/index';

function mapStateToProps(state) {
  return { gl: state.gl };
}

function mapDispatchToProps(dispatch) {
  return {
    createdWebGLContext: (gl) => {
      dispatch(createdWebGLContext(gl));
    },
  };
}

class BaseShell extends Component {
  componentDidMount() {
    const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    this.props.createdWebGLContext(gl);
  }

  render() {
    return (
      <div>
        <canvas name="murker" ref={(c) => { this.canvas = c; }} />
        {this.props.children}
      </div>
    );
  }
}

BaseShell.propTypes = {
  createdWebGlContext: React.PropTypes.func,
};

const Shell = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseShell);

export default Shell;
