/* eslint react/prop-types: off, react/no-unused-prop-types: off, no-bitwise: off */

import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createdWebGLContext } from '../actions/index';

class BaseShell extends Component {
  componentDidMount() {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;

    const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

    if (this.props.glOptions.clearColor !== undefined) {
      gl.clearColor(...this.props.glOptions.clearColor);
    }

    if (this.props.glOptions.enable !== undefined) {
      R.forEach(opt => gl.enable(gl[opt]), this.props.glOptions.enable);
    }

    this.props.createdWebGLContext(gl);
    this.animationId = requestAnimationFrame(() => { this.renderGL(); });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationId);
  }

  renderGL() {
    const gl = this.props.gl;
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    if (this.props.children !== undefined) {
      R.forEach((child) => {
        if (child.renderGL !== undefined) {
          child.renderGL();
        }
      }, this.props.children);
    }

    this.animationId = requestAnimationFrame(() => { this.renderGL(); });
  }

  render() {
    return (
      <div>
        <canvas key="murker" ref={(c) => { this.canvas = c; }} />
        {this.props.children}
      </div>
    );
  }
}

BaseShell.propTypes = {
  gl: React.PropTypes.instanceOf(WebGLRenderingContext),
  createdWebGlContext: React.PropTypes.func,
};

function mapStateToProps(state) {
  return {
    gl: state.gl,
    glOptions: state.glOptions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createdWebGLContext: (gl) => {
      dispatch(createdWebGLContext(gl));
    },
  };
}

const Shell = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseShell);

export default Shell;
