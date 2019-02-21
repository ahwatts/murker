function WebGLContext() {
  return new Promise((resolve) => {
    function init() {
      let canvas = document.createElement("canvas");
      canvas = document.body.appendChild(canvas);
      const gl = canvas.getContext("webgl2");
      resolve({ gl, canvas });
    }

    if (document.readyState === "loading") {
      document.onreadystatechange = () => {
        if (document.readyState === "interactive") {
          init();
        }
      };
    } else {
      init();
    }
  });
}

export default WebGLContext;
