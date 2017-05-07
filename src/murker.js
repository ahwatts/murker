import React from "react";
import ReactDOM from "react-dom";

import "./murker.css";
import Root from "./components/root";
import Store from "./store";

let chooser = document.createElement("div");
chooser = document.body.appendChild(chooser);
chooser.style = "position: absolute;";

ReactDOM.render(React.createElement(Root), chooser);

Store.dispatch({ type: "STARTUP" });
