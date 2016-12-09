import { EventEmitter } from "events";
import { createdWebGLContext } from "./actions";
import store from "./store";

class Shell {
  constructor(canvas) {
    this.tickRate = 33;
    this.animationId = null;
    this.tickId = null;
    this.events = new EventEmitter();

    if (document.readyState === "loading") {
      const self = this;
      document.onreadystatechange = () => {
        if (document.readyState === "interactive") {
          self.init(canvas);
        }
      };
    } else {
      this.init(canvas);
    }
  }

  init(canvas) {
    const self = this;
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    this.resized = false;

    this.setCanvasSize();
    window.addEventListener("resize", () => {
      self.resized = true;
    });

    store.dispatch(createdWebGLContext(this.gl));
    this.events.emit("gl-init", this);
  }

  setCanvasSize() {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    this.canvas.style = `position: fixed; top: 0; left: 0; width: ${width} height: ${height}`;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  startRendering() {
    this.animationId = requestAnimationFrame(() => this.render());
  }

  stopRendering() {
    cancelAnimationFrame(this.animationId);
  }

  render() {
    if (this.resized) {
      this.setCanvasSize();
    }

    this.events.emit("render", this);
    this.animationId = requestAnimationFrame(() => this.render());
  }

  startUpdating() {
    this.tickId = setInterval(() => this.update(), this.tickRate);
  }

  stopUpdating() {
    clearInterval(this.tickId);
  }

  update() {
    this.events.emit("tick", this);
  }
}

export default Shell;
