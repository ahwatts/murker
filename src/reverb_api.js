class ReverbApi {
  constructor(baseUrl) {
    this.base = baseUrl;
  }

  artist(id) {
    return fetch(`${this.base}/api/artist/${encodeURI(id)}`);
  }

  artistSongs(id) {
    return fetch(`${this.base}/api/artist/${encodeURI(id)}/songs`);
  }

  song(id) {
    return fetch(`${this.base}/api/song/${encodeURI(id)}`);
  }

  findSong(query) {
    return fetch(`${this.base}/api/song/search/${encodeURI(query)}`);
  }
}

export default ReverbApi;
