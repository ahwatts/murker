import R from "ramda";

export default {
  isBlank: R.either(R.isNil, R.isEmpty),

  getDimensions() {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  },
};
