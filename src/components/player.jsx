import * as R from "ramda";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Song from "../redux/song_redux";

/* eslint-disable jsx-a11y/media-has-caption */
export default function Player() {
  const dispatch = useDispatch();
  const currentSong = useSelector(Song.Selectors.getNowPlayingSong);

  const audioRef = useRef(null);
  useEffect(() => {
    // console.log(currentSong);
    // console.log(audioRef);
    if (!R.isNil(currentSong)) {
      dispatch(Song.Actions.playSong(currentSong, audioRef.current));
    }
    return () => {
      // Stop playing song here.
    };
  }, [audioRef, currentSong, dispatch]);

  if (currentSong) {
    return (
      <div id="player-controls">
        <audio src={currentSong.url}
               key={currentSong.id}
               controls={false}
               crossOrigin="anonymous"
               ref={audioRef} />
        {currentSong.name}
      </div>
    );
  } else {
    return null;
  }
}
/* eslint-enable jsx-a11y/media-has-caption */
