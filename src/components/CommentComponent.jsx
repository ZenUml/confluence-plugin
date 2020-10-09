import React from 'react'

import Comment, { CommentAction, CommentAuthor, CommentEdited, CommentTime } from '@atlaskit/comment';

function CommentComponent() {
  return React.createElement(
    "div",
    null,
    React.createElement(Comment, {
      author: React.createElement(
        CommentAuthor,
        null,
        "John Smith"
      ),
      type: "author",
      edited: React.createElement(
        CommentEdited,
        null,
        "Edited"
      ),
      restrictedTo: "Restricted to Admins Only",
      time: React.createElement(
        CommentTime,
        null,
        "30 August, 2016"
      ),
      content: React.createElement(
        "p",
        null,
        "Content goes here. This can include ",
        React.createElement(
          "a",
          { href: "/link" },
          "links"
        ),
        " and other content."
      ),
      actions: [React.createElement(
        CommentAction,
        null,
        "Reply"
      ), React.createElement(
        CommentAction,
        null,
        "Edit"
      ), React.createElement(
        CommentAction,
        null,
        "Like"
      )]
    })
  );
}

export default CommentComponent;

