import React from "react";
import { useSelector } from "react-redux";
import { HashRouter as Router, Link, Route } from "react-router-dom";
import RenderContext from "../redux/render_context_redux";
import SongFinder from "./song_finder";
import Player from "./player";

export default function Murker() {
  const dimensions = useSelector(RenderContext.Selectors.getDimensions);
  return (
    <Router>
      <div id="murker-root" style={dimensions}>
        <div id="nav-bar">
          <Link to="/">Home</Link>
          <Link to="/find_song">Find Song</Link>
        </div>

        <div id="main">
          <Route path="/find_song" component={SongFinder} />
        </div>

        <div id="player">
          <Player />
        </div>
      </div>
    </Router>
  );
}
