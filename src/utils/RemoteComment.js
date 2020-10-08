class RemoteComment {
  _AP
  _id
  constructor(id, AP) {
    this._id = id
    this._AP = AP

  }

  async load() {
    return await this._AP.request()
  }
}

export default RemoteComment