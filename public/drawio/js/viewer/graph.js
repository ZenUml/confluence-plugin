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
var currentText, overlay, subject;

graph.addListener(mxEvent.EDITING_STOPPED, function (sender, evt) {
    if (currentText) {
        showComment();
    }
});

function addComment(e) {
    if (!isCommentModeActive()) {
        return;
    }

    var pt = graph.getPointForEvent(e);
    var parent = graph.getDefaultParent();
    var cell = graph.insertVertex(parent, null, '', pt.x, pt.y, 100, 30, 'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;');

    graph.startEditingAtCell(cell);
    currentText = cell;
    deactivateCommentMode();
}

async function addOverlay(cellId, commentId) {
  const remoteComment = new RemoteComment(commentId, AP);
  const localCommentContent = await remoteComment.load()
  overlay = new mxCellOverlay(img, localCommentContent, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_TOP)
  overlay.defaultOverlap = 0.7
  graph.addCellOverlay(graph.model.getCell(cellId), overlay)
  overlay.addListener(mxEvent.CLICK, function (sender, evt) {
    store.state.commentContent = localCommentContent
  })
}

async function showComment() {
  const comment = currentText.value;
  const urlParams = new URLSearchParams(window.location.search);

  const pageId = urlParams.get('pageId');
  const commentEntity = new Comment('ZEN', pageId, comment)

  const response = await AP.request('/rest/api/content', {
    type: 'POST',
    contentType: 'application/json',
    data: commentEntity.requestBody()
  })
  console.log('showComment', response);

  const commentId = JSON.parse(response.body).id
  const cellId = subject.getId()
  window.macro.comment(cellId, commentId)
  addOverlay(cellId, commentId)

  if (subject) {
    graph.removeCells([currentText])
    currentText = null
  } else {
    currentText.value = ''
  }
}

graph.addListener(mxEvent.CLICK, function (sender, evt) {
    var e = evt.getProperty('event'); // mouse event
    var cell = evt.getProperty('cell'); // cell may be null

    if (cell != null) {
        subject = cell;
        addComment(evt.getProperty('event'));

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
  // addOverlay(2, '563707905')
  // addOverlay(3, '1154')
};

function setComments(comments) {
  comments.forEach((comment) => {
    addOverlay(comment.cellId, comment.commentId)
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