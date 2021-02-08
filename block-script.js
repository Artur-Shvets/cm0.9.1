"use strict"

let mainParent = false;
let lastMouseOver = false;
let sample = false;
let mouseDown = false;
let element;
let mouseDownLink = false;
let svg;
let v1;
let v2;
let path;
let paste = document.createElement('div');
paste.id = 'paste-block';
paste.classList.add('paste-block');
let idList = [[]];

// _________________________MOUSE OVER_______________________________
function getMainParent (e) {
  let block = e.target;
  while (!block.classList.contains('main-parent') || !block.classList.contains('sample')) {
    if (block.classList.contains('body')||block.classList.contains('sample')||block.classList.contains('main-parent')) break;
    block = block.parentElement;
  };
  if (block.classList.contains('main-parent')) {
    mainParent = block;
  } else {
    mainParent = false;
  };
  if (block.classList.contains('sample')) {
    sample = block;
  } else {
    sample = false;
  };
};

function deleteRowPosition () {
  if (!mainParent && document.getElementById('paste-block') !== null) {
    paste.remove();
  };
};

function deleteActiveLight (e) {
  if (lastMouseOver) {
    lastMouseOver.style.background = '';
    lastMouseOver = false;
  };
};

function getActiveLight (e) {
  deleteActiveLight(e);
  if (e.target.classList.contains('block')||e.target.classList.contains('row-block')||e.target.classList.contains('main-block')) {
    e.target.style.background = 'white';
    lastMouseOver = e.target;
  };
  let parent = e.target.parentElement;
  if (e.target.classList.contains('string') && parent.classList.contains('row-block')) {
    parent.style.background = 'white';
    lastMouseOver = parent;
  };
  if (e.target.classList.contains('row') && !e.target.classList.contains('row-block')) {
    parent.style.background = 'white';
    lastMouseOver = parent;
  };
  let nextParent = parent.parentElement;
  if (e.target.classList.contains('string') && !parent.classList.contains('row-block')) {
    nextParent.style.background = 'white';
    lastMouseOver = nextParent;
  };
};

function getPastePosition (e) {
  if (mainParent && !e.target.classList.contains('main-parent')) {
    if (e.target.classList.contains('row-block') || e.target.classList.contains('main-block')) {
      if (document.getElementById('paste-block') !== null) {
        document.getElementById('paste-block').remove();
      };
      if (e.offsetY < e.target.offsetHeight / 2) {
        e.target.before(paste);
      } else {
        e.target.after(paste);
      };
    };
    if (e.target.classList.contains('sub-block-default')) {
      e.target.append(paste);
    };
  };
};

// ___________________EVENT_____________________
document.addEventListener('mouseover', e => {
  getActiveLight(e);
  getMainParent(e);
  if (mouseDown) {
    deleteRowPosition();
    getPastePosition(e);
  };
});

// _________________________MOUSE OVER_______________________________
// ******************************************************************
// _________________________MOUSE DOWN_______________________________

function putDraggableClass () {
  element.querySelectorAll('.block, .row-block').forEach((block) => {
    block.classList.add('draggable');
  });
};

function setParameters (e) {
  let x = e.clientX;
  let y = e.clientY;
  element.style.position = 'absolute';
  element.style.transition = 'none';
  element.style.zIndex = 2;
  element.style.left = x + 10 + 'px';
  element.style.top = y + 10 + 'px';
  document.body.append(element);
};

function createIdOfLinks () {
  if (v1.id == "") {
    let parentId = String(idList.length);
    let pushIdList = [parentId, [parentId+'.'+'1'], [parentId+'..'+'1']];
    v1.id = pushIdList[0];
    svg.id = pushIdList[1];
    v2.id = pushIdList[2];
    idList.push(pushIdList);
  } else {
    let parentId = v1.id;
    let linkId = parentId+'.'+(Number(idList[parentId][1][idList[parentId][1].length - 1].split('.')[1])+1);
    let secondVertexId = parentId+'..'+linkId.split('.')[1];
    svg.id = linkId;
    v2.id = secondVertexId;
    idList[parentId][1].push(linkId);
    idList[parentId][2].push(secondVertexId);
  };
};

function takeLink (e) {
  v1 = e.target;
  v2 = document.createElement('div');
  v2.className = "v2 vertex";
  v2.style.cssText = "transition: 0s";

  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = "position:absolute";
  document.getElementById('svg-space').append(svg);

  path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-width', 2);
  path.setAttribute('stroke', '#C792EA');
  path.setAttribute('fill', 'transparent');
  svg.append(path);

  element = e.target.parentElement.cloneNode(true);
  element.querySelectorAll('.vertex')[0].remove();
  element.prepend(v2);
  setParameters(e);
  createIdOfLinks();
};

function takeSample (e) {
  element = sample.cloneNode(true);
  element.classList.remove('sample');
  element.classList.add('draggable', 'main-parent');
};

function takeParent (e) {
  element = e.target;
  while (element.classList.contains('draggable') === false) {
    if (element.classList.contains('draggable')) break;
    element = element.parentElement;
  };
  let parent = element.parentElement;
  if (parent.classList.contains('sub-block') && parent.children.length == 1) {
    parent.classList.remove('sub-block');
    parent.classList.add('sub-block-default');
  };
  setParameters(e);
};

function takeElement (e) {
  deleteActiveLight(e);
  if (sample && !e.target.classList.contains('vertex')) {
    takeSample(e);
    putDraggableClass();
    setParameters(e);
    mouseDown = true;
  };
  if (mainParent && !e.target.classList.contains('vertex')) {
    takeParent(e);
    mouseDown = true;
  };
  if (!sample && e.target.classList.contains('v1')) {
    takeLink(e);
    mouseDown = true;
  };
};

// ___________________EVENT_____________________
document.addEventListener('mousedown', e => {
  if (mouseDown === false) {
    takeElement(e);
  };
});

// _________________________MOUSE DOWN_______________________________
// ******************************************************************
// _________________________MOUSE MOVE_______________________________


function doDynamicAllLinks () {
  let len = idList.length
  for (let i = 1; i < len; i++) { // выведет 0, затем 1, затем 2
    idList[i][1].forEach((svg, e, list) => {
      let vertex1 = document.getElementById(idList[i][0]);
      let link = document.getElementById(svg);
      let vertex2 = document.getElementById(idList[i][2][e]);
      let path = link.children[0];

      let x1 = vertex1.getBoundingClientRect().x;
      let y1 = vertex1.getBoundingClientRect().y;
      let x2 = vertex2.getBoundingClientRect().x;
      let y2 = vertex2.getBoundingClientRect().y;
      vertex2.style.left = x2 + 'px';
      vertex2.style.top = y2 + 'px';
      link.style.left = Math.min(x1, x2)+4+'px';
      link.style.top = Math.min(y1, y2)+4+'px';
      link.setAttribute('width', Math.abs(x1 - x2)+2+'px');
      link.setAttribute('height', Math.abs(y1 - y2)+2+'px');
      let centerWidth = Math.abs(x1 - x2) / 2;
      let height = Math.abs(y1 - y2) + 1;
      let width = Math.abs(x1 - x2) + 1;
      if (x2 < x1 & y2 < y1 || x2 > x1 & y2 > y1) {
        path.setAttribute('d', 'M '+' '+0+' '+1+' C '+centerWidth+' '+1+', '+centerWidth+' '+height+' '+width+' '+height);
      } else {
        path.setAttribute('d', 'M '+' '+0+' '+height+' C '+centerWidth+' '+height+', '+centerWidth+' '+1+' '+width+' '+1);
      };
    });
}
};

// ___________________EVENT_____________________
window.addEventListener('mousemove', e => {
  if (mouseDown) {
    element.style.left = e.clientX + 10 + 'px';
    element.style.top = e.clientY + 10 + 'px';
    doDynamicAllLinks();
  };
  if (mainParent && !mouseDown) {
    doDynamicAllLinks();
  };
});

// _________________________MOUSE MOVE_______________________________
// ******************************************************************
// _________________________MOUSE UP_______________________________

function pasteElement (e) {
  if (document.getElementById('paste-block') !== null) {
    let parent = document.getElementById('paste-block').parentElement;
    if (parent.classList.contains('sub-block-default')) {
      parent.classList.remove('sub-block-default');
      parent.classList.add('sub-block');
    };
    let cloneBlock = element.cloneNode(true);
    cloneBlock.style.position = 'static'
    cloneBlock.style.transition = '0.3s';
    cloneBlock.classList.remove('main-parent');
    cloneBlock.style.background = '';
    paste.replaceWith(cloneBlock);
  };
};

function putElement (e) {
  if (e.target.classList.contains('work-space')) {
    element.style.background = '';
    element.style.transition = '0.3s';
    if (element.classList.contains('main-parent') === false) {
      element.classList.add('main-parent');
    };
    document.getElementById('work-space').append(element);
  } else {
    element.remove();
  };
};

// ___________________EVENT_____________________
document.addEventListener('mouseup', e => {
  if (mouseDown) {
    pasteElement(e);
    putElement(e);
    element = false;
    mouseDown = false;
  };
  if (mouseDownLink) {
    mouseDownLink = false;
  };
});

// _________________________MOUSE UP_______________________________
