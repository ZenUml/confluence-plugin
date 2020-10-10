<template>
  <Comment :author="author" :type="type" :edited="edited" :content="content" :time="time" :actions="actions"></Comment>
</template>

<script>
  import React from 'react'
  import Comment, { CommentAction, CommentAuthor, CommentEdited, CommentTime } from '@atlaskit/comment'
  const e = React.createElement
  export default {
    data() {
      return {
        content: e('p', null, '<div>c</div>'),
        time: e(CommentTime, null, '30 August, 2020'),
        author: e(CommentAuthor, null, 'John Smith'),
        type: 'author',
        edited: e(CommentEdited, null, 'Edited'),
        actions: [
          e(CommentAction, null, 'Reply')
        ]
      }
    },
    components: {
      Comment,
      CommentAuthor,
      CommentAction,
      CommentTime,
      CommentEdited
    }

  }
</script>

