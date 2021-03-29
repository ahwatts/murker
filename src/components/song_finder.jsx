import * as R from "ramda";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import KeyPress from "../redux/keypress_redux";
import Search from "../redux/search_redux";
import Song from "../redux/song_redux";
import { isBlank } from "../utils";

function escapeSelector(state) {
  return KeyPress.Selectors.isKeyDown(state, "Escape");
}

export default function SongFinder() {
  const dispatch = useDispatch();
  const history = useHistory();

  const query = useSelector(Search.Selectors.getQuery);
  function handleQueryChange(event) {
    dispatch(Search.Actions.findSongQuery(event.target.value));
  }

  const quitKeyDown = useSelector(escapeSelector);
  useEffect(() => {
    if (quitKeyDown) {
      history.goBack();
    }
  }, [history, quitKeyDown]);

  const results = useSelector(Search.Selectors.getResults);
  const isFetching = useSelector(Search.Selectors.isFetching);

  function handleSongSelect(event) {
    const songId = parseInt(event.currentTarget.dataset.songId, 10);
    const song = results.find((s) => s.id === songId);
    if (song) {
      dispatch(Song.Actions.setNowPlayingSong(song));
      history.goBack();
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSongSelect(event);
    }
  }

  let resultList = null;
  if (!isBlank(results)) {
    resultList = R.pipe(
      R.take(10),
      R.map((song) => (
        <div className="song-result"
             role="button"
             tabIndex={0}
             key={song.id}
             data-song-id={song.id}
             onClick={handleSongSelect}
             onKeyPress={handleKeyPress}>
          {song.name}
        </div>
      )),

    )(results);
  } else if (isFetching) {
    resultList = "... Searching ...";
  }

  return (
    <div className="modal-container">
      <div className="modal-outer-window">
        <div className="modal-inner-window">
          Search for song
          <input type="text" value={query} onChange={handleQueryChange} />
          {resultList}
        </div>
      </div>
    </div>
  );
}
