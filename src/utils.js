import R from "ramda";

const isBlank = R.either(R.isNil, R.isEmpty);
const isPresent = R.complement(isBlank);

export default {
  isBlank,
  isPresent,

  getDimensions() {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  },
};
