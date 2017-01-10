class ReverbApi {
  constructor(baseUrl) {
    this.base = baseUrl;
  }

  artist(id) {
    return fetch(`${this.base}/artist/${id}`).then(resp => resp.json());
  }

  artistSongs(id) {
    return fetch(`${this.base}/artist/${id}/songs`).then(resp => resp.json());
  }
}

export default ReverbApi;
