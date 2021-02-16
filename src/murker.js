import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/root";
import "./icomoon.css";
import "./murker.scss";
import createMurkerStore from "./store";

function murker() {
  let canvas = document.createElement("canvas");
  canvas = document.body.appendChild(canvas);

  let chooser = document.createElement("div");
  chooser = document.body.appendChild(chooser);

  const store = createMurkerStore();
  ReactDOM.render(React.createElement(Root, { store }), chooser);
  store.dispatch({ type: "STARTUP", canvas, store });
}

window.addEventListener("load", (_event) => {
  murker();
});
