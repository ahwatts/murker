import R from "ramda";

const Types = R.indexBy(R.identity, [
  "GET_SONG_REQUEST",
]);

const Actions = {
  getSongRequest: id => ({ type: Types.GET_SONG_REQUEST, songId: id }),
};

export default {
  Types,
  Actions,
};
