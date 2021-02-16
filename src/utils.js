import * as R from "ramda";

export const isBlank = R.either(R.isNil, R.isEmpty);
export const isPresent = R.complement(isBlank);
export function getDimensions() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}
