import React from "react";
import { Provider } from "react-redux";

import Murker from "./murker";
import store from "../store";

export default function Root() {
  return (
    <Provider store={store}>
      <Murker />
    </Provider>
  );
}
