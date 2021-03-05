/* eslint-env mocha */
/* eslint no-unused-expressions: off */

import { expect } from "chai";
import * as R from "ramda";
import { createNamespacedReducer } from "../../src/namespaced_selectors";
import Song from "../../src/redux/song_redux";

describe("Song redux", () => {
  function createInitialState() {
    return Song.rootReducer(null, {});
  }

  function createInitialNsState() {
    return {
      [Song.namespace]: createInitialState(),
    };
  }

  const nsReducer = createNamespacedReducer(Song.namespace, Song.rootReducer);

  context("initial state", () => {
    it("should have an empty pipeline", () => {
      const state = createInitialState();
      expect(state.pipeline).to.deep.equal({});
    });

    it("should not be playing", () => {
      const state = createInitialState();
      expect(state.nowPlaying).to.be.null;
    });
  });

  context("setAudioPipeline reducer", () => {
    it("should set the pipeline", () => {
      let state = createInitialState();
      state = Song.rootReducer(state, Song.Actions.setAudioPipeline({ source: "source", sink: "sink" }));
      expect(state.pipeline).to.deep.equal({ source: "source", sink: "sink" });
    });
  });

  context("setNowPlayingSong reducer", () => {
    it("should set the now playing song", () => {
      let state = createInitialState();
      state = Song.rootReducer(state, Song.Actions.setNowPlayingSong({ id: 1, title: "Some Song" }));
      expect(state.nowPlaying).to.deep.equal({ id: 1, title: "Some Song" });
    });
  });

  context("getAudioPipeline selector", () => {
    it("should initially return the empty object", () => {
      const state = createInitialNsState();
      expect(Song.Selectors.getAudioPipeline(state)).to.deep.equal({});
    });

    it("should return the set pipeline", () => {
      let state = createInitialNsState();
      state = nsReducer(state, Song.Actions.setAudioPipeline({ source: "source", sink: "sink" }));
      expect(Song.Selectors.getAudioPipeline(state)).to.deep.equal({ source: "source", sink: "sink" });
    });
  });

  context("getNowPlayingSong selector", () => {
    it("should initially return null", () => {
      const state = createInitialNsState();
      expect(Song.Selectors.getNowPlayingSong(state)).to.be.null;
    });

    it("should return the now playing song", () => {
      let state = createInitialNsState();
      state = nsReducer(state, Song.Actions.setNowPlayingSong({ id: 1, title: "Some song"}));
      expect(Song.Selectors.getNowPlayingSong(state)).to.deep.equal({ id: 1, title: "Some song"});
    });
  });
});
