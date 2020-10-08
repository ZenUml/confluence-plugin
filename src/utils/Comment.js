class Comment {
  _space
  _pageId
  _commentContent
  constructor(space, pageId, commentContent) {
    this._space = space
    this._pageId = pageId
    this._commentContent = commentContent
  }

  requestBody() {
    return `{
    "type": "comment",
    "space": {
      "key": "${this._space}"
    },
    "body": {
      "storage": {
        "representation": "storage",
        "value": "${this._commentContent}"
      }
    },
    "title": "Test comment",
    "container": {
      "id": "${this._pageId}",
      "type": "global"
    }
  }`
  }
}

export default Comment