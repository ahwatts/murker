import R from "ramda";

export default {
  isBlank: R.either(R.isNil, R.isEmpty),
};
