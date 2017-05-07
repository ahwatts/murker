class ReverbApi {
  constructor(baseUrl) {
    this.base = baseUrl;
  }

  artist(id) {
    return fetch(`${this.base}/artist/${id}`);
  }

  artistSongs(id) {
    return fetch(`${this.base}/artist/${id}/songs`);
  }

  song(id) {
    return fetch(`${this.base}/song/${id}`);
  }
}

export default ReverbApi;
