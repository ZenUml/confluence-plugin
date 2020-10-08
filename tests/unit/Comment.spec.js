import Comment from '../../src/utils/Comment'

describe('Comment', () => {
  test('create a comment', () => {
    const comment = new Comment('ZEN', 'pageId-12345', 'Comment content')
    console.log(comment)
    expect(comment._space).toBe('ZEN')
    expect(comment._pageId).toBe('pageId-12345')
    expect(comment._commentContent).toBe('Comment content')
    expect(comment.requestBody()).toBe(`{
    "type": "comment",
    "space": {
      "key": "ZEN"
    },
    "body": {
      "storage": {
        "representation": "storage",
        "value": "Comment content"
      }
    },
    "title": "Test comment",
    "container": {
      "id": "pageId-12345",
      "type": "global"
    }
  }`)
  })
})