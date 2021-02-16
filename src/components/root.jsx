import React from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";

import Murker from "./murker";

export default function Root({ store }) {
  return (
    <Provider store={store}>
      <Murker />
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }).isRequired,
};
