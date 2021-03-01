/* eslint-env mocha */

import { expect } from "chai";
import * as R from "ramda";
import { createNamespacedSelectors } from "../src/namespaced_selectors";

describe("createNamespacedSelectors", () => {
  const namespace = "songs";

  const noNamespaceState = {
    lastFetched: "yesterday",
  };

  const namespacedState = {
    [namespace]: noNamespaceState,
  };

  const noNamespaceSelectors = {
    getLastFetched(state) {
      return R.prop("lastFetched", state);
    },
  };

  const namespacedSelectors = createNamespacedSelectors(namespace, noNamespaceSelectors);

  context("simple selector", () => {
    it("should return the value", () => {
      expect(namespacedSelectors.getLastFetched(namespacedState)).to.equal("yesterday");
    });
  });
});
