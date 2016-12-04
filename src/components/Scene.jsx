import Immutable from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class BaseScene extends Component {
  renderGL() {
    for (let i = 0; i < this.props.sceneGraph.length; i += 1) {
      this.props.sceneGraph[i].renderGL();
    }
  }

  render() { return null; }
}

BaseScene.propTypes = {
  sceneGraph: React.PropTypes.instanceOf(Immutable.List),
};

function mapStateToProps(state) {
  return { sceneGraph: state.sceneGraph };
}

const Scene = connect(mapStateToProps)(BaseScene);

export default Scene;
