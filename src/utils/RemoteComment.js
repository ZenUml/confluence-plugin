class RemoteComment {
  _AP
  _id
  constructor(id, AP) {
    this._id = id
    this._AP = AP
    this.responseBody = {};
  }

  async load() {
    const commentResourcePath = `/rest/api/content/${this._id}?expand=body.storage,version`
    const commentResponse = await this._AP.request(commentResourcePath)
    this.responseBody = JSON.parse(commentResponse.body)
    return this.responseBody.body.storage.value
  }
}

export default RemoteComment