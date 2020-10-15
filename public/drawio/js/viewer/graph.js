const TEXT_CELL_STYLE = 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;';

var graph = new Graph(document.getElementById('graph'));
graph.resizeContainer = false;
graph.setEnabled(true);
graph.setCellsEditable(false);
graph.setCellsMovable(false);
graph.setCellsResizable(false);
graph.setCellsBendable(false);
graph.setCellsSelectable(false);
graph.setDropEnabled(false);
graph.setSplitEnabled(false);
graph.setConnectable(false);

var img = new mxImage('/drawio/images/comment.svg', 20, 20);
var currentText, subject;
var remoteCommentCache = {};

graph.addListener(mxEvent.EDITING_STOPPED, function (sender, evt) {
    if (currentText) {
        showComment();
    }
});

function addComment(e, existingComment) {
    if (!isCommentModeActive()) {
        return;
    }

    var pt = graph.getPointForEvent(e);
    var parent = graph.getDefaultParent();
    var cell = graph.insertVertex(parent, null, existingComment || '', pt.x, pt.y, 100, 30, TEXT_CELL_STYLE);

    graph.startEditingAtCell(cell);
    currentText = cell;
    deactivateCommentMode();
}

async function addOverlayWithRemoteComment(cellId, commentId) {
  const remoteComment = new RemoteComment(commentId, AP);
  const localCommentContent = await remoteComment.load()
  addOrUpdateOverlay(cellId, localCommentContent);
  
  remoteCommentCache[cellId] = remoteComment;
}

function addOrUpdateOverlay(cellId, commentText) {
  const cell = graph.model.getCell(cellId);
  if(!cell) {
    return;
  }

  let overlay = getOverlay(cell);
  if(overlay) {
    overlay.tooltip = commentText;
  } else {
    overlay = new mxCellOverlay(img, commentText, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP)
    overlay.defaultOverlap = 0.7;
    graph.addCellOverlay(cell, overlay);
    overlay.addListener(mxEvent.CLICK, function (sender, evt) {
      if(store) {
        store.state.commentContent = commentText;
      }
    });
  }
}

async function showComment() {
  const comment = currentText.value;
  const cellId = subject.getId();
  addOrUpdateOverlay(cellId, comment);

  const urlParams = new URLSearchParams(window.location.search);
  const pageId = urlParams.get('pageId');

  if(pageId) {
    let commentId;
    const remoteComment = remoteCommentCache[cellId];
    if(remoteComment) {
      commentId = await updateCommentContent(remoteComment, comment);
    } else {
      commentId = await createCommentContent(pageId, comment);
    }
    
    window.macro.comment(cellId, commentId);
  }

  if (subject) {
    graph.removeCells([currentText]);
    currentText = null;
  } else {
    currentText.value = '';
  }
}

async function createCommentContent(pageId, comment) {
  const commentEntity = new Comment('ZEN', pageId, comment);

  const response = await AP.request('/rest/api/content', {
    type: 'POST',
    contentType: 'application/json',
    data: commentEntity.requestBody()
  })
  console.log('create comment response:', response);

  return JSON.parse(response.body).id;
}

async function updateCommentContent(remoteComment, newCommentText) {
  const commentId = remoteComment.responseBody.id;
  remoteComment.responseBody.body.storage.value = newCommentText;

  if(!remoteComment.responseBody.version) {
    remoteComment.responseBody.version = {number: 1};
  }
  remoteComment.responseBody.version.number = remoteComment.responseBody.version.number + 1;

  const response = await AP.request(`/rest/api/content/${commentId}`, {
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(remoteComment.responseBody)
  });
  console.log('update comment response:', response);
  return commentId;
}

function getOverlay(cell) {
  const overlays = graph.getCellOverlays(cell);
  return overlays && overlays[0];
}

graph.addListener(mxEvent.CLICK, function (sender, evt) {
    var e = evt.getProperty('event'); // mouse event
    var cell = evt.getProperty('cell'); // cell may be null

    if (cell != null) {
        subject = cell;

        const overlay = getOverlay(cell);
        const comment = overlay && overlay.tooltip || '';

        addComment(evt.getProperty('event'), comment);

        evt.consume();
    }
});

function setGraphStyle(styleUrl) {
    var req = mxUtils.load(styleUrl);
    var root = req.getDocumentElement();
    var dec = new mxCodec(root.ownerDocument);
    dec.decode(root, graph.stylesheet);
};


function setGraphXml(data) {
  var xmlDoc = mxUtils.parseXml(data);
  var codec = new mxCodec(xmlDoc);
  codec.decode(xmlDoc.documentElement, graph.getModel());
};

function setComments(comments) {
  comments.forEach((comment) => {
    addOverlayWithRemoteComment(comment.cellId, comment.commentId)
  })
}

const graphNode = document.getElementById('graph');
const commentBtn = document.getElementById("commentBtn");

function activateCommentMode() {
    graphNode.setAttribute('class', 'comment-active');
    commentBtn.setAttribute('disabled', '');
}

function isCommentModeActive() {
    return graphNode.getAttribute('class').includes('comment-active');
}

function deactivateCommentMode() {
    graphNode.setAttribute('class', '');
    commentBtn.removeAttribute('disabled');
}

commentBtn.onclick = activateCommentMode;
