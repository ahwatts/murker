import PropTypes from "prop-types";
import * as R from "ramda";
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import Song from "../redux/song_redux";

/* eslint-disable jsx-a11y/media-has-caption */
function Player({ currentSong, playSong }) {
  const audioRef = useRef(null);
  useEffect(() => {
    // console.log(currentSong);
    // console.log(audioRef);
    if (!R.isNil(currentSong)) {
      playSong(currentSong, audioRef.current);
    }
    return () => {
      // Stop playing song here.
    };
  }, [currentSong]);

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

Player.propTypes = {
  currentSong: PropTypes.shape({
    name: PropTypes.string,
  }),
  playSong: PropTypes.func.isRequired,
};

Player.defaultProps = {
  currentSong: null,
};

function mapStateToProps(state) {
  return {
    currentSong: Song.Selectors.getNowPlayingSong(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    playSong: (song, audio) => dispatch(Song.Actions.playSong(song, audio)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
