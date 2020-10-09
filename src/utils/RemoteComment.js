class RemoteComment {
  _AP
  _id
  constructor(id, AP) {
    this._id = id
    this._AP = AP

  }

  async load() {
    const commentResourcePath = `/rest/api/content/${this._id}?expand=body.storage`
    const commentResponse = await this._AP.request(commentResourcePath)
    const responseBody = JSON.parse(commentResponse.body)
    return responseBody.body.storage.value
  }
}

export default RemoteComment