import React from "react";
import { Provider } from "react-redux";

import FindSong from "./find_song";
import store from "../store";

export default function Root() {
  return (
    <Provider store={store}>
      <FindSong />
    </Provider>
  );
}
