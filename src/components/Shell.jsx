/* eslint react/prop-types: off, react/no-unused-prop-types: off, no-bitwise: off */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createdWebGLContext } from '../actions/index';

class BaseShell extends Component {
  componentDidMount() {
    const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

    if (this.props.glOptions.clearColor !== undefined) {
      gl.clearColor(...this.props.glOptions.clearColor);
    }

    if (this.props.glOptions.enable !== undefined) {
      for (let i = 0; i < this.props.glOptions.enable.length; i += 1) {
        gl.enable(gl[this.props.glOptions.enable[i]]);
      }
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
      for (let i = 0; i < this.props.children.length; i += 1) {
        if (this.props.children[i].renderGL !== undefined) {
          this.props.children[i].renderGL();
        }
      }
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
