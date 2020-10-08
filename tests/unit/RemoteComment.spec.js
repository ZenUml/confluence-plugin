import AP from '../../src/utils/MockApRequest'
import RemoteComment from '../../src/utils/RemoteComment'

describe('RemoteComment', () => {
  test('load by id', async () => {
    const remoteComment = new RemoteComment('id', AP)
    expect(await remoteComment.load()).toBe('something')
  })
})