import Immutable from 'immutable';
import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class BaseScene extends Component {
  renderGL() {
    R.forEach(sceneObject => sceneObject.renderGL(), this.props.sceneGraph);
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
