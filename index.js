'use strict';

let isPointerDown = false;
let isPointerMove = false;
let draggableElement;

let blockSpace = document.getElementById('block-space');
let pasteBlock = document.createElement('div');
pasteBlock.id = 'paste-block';
let rowBlock = false;
let isPasteBefore = false;

// _________________________DOWN______________________________
document.addEventListener('pointerdown', e => {
  console.log('pointerdown');
  isPointerDown = true;
});

// __________________________OVER_______________________________
blockSpace.addEventListener('pointerover', e => {
  console.log('pointerover');
  // console.log(e.target);

  if (draggableElement) {
    if (e.target.classList.contains('block-space')) {
      pasteBlock.remove();
    }
    if (e.target.classList.contains('sub-block-default')) {
      e.target.append(pasteBlock);
    }
    if (e.target.classList.contains('main-parent') === false) {
      if (
        e.target.classList.contains('row-block') ||
        e.target.classList.contains('main-block')
      ) {
        rowBlock = e.target;
        // console.log(e.offsetY);
        if (isPasteBefore) {
          rowBlock.before(pasteBlock);
        } else {
          rowBlock.after(pasteBlock);
        }
        if (rowBlock.classList.contains('sub-block-default')) {
          rowBlock.append(pasteBlock);
        }
      }
    }
  } else {
    rowBlock = false;
  }
});

// _________________________MOVE_______________________________
document.addEventListener('pointermove', e => {
  console.log('pointermove');

  if (isPointerDown && !isPointerMove) {
    console.log(e.target);
    let className = e.target.classList[0];
    if (className === 'sample') {
      draggableElement = e.target.cloneNode(true);
      e.target.releasePointerCapture(e.pointerId);

      draggableElement.classList.add('draggable');
      draggableElement.classList.remove('sample');
      draggableElement.style.transition = 'none';
      document.body.append(draggableElement);
    } else if (className === 'main-block' || className === 'row-block') {
      draggableElement = e.target;
      e.target.releasePointerCapture(e.pointerId);
      draggableElement.classList.add('draggable');
      draggableElement.style.transition = 'none';
      document.body.append(draggableElement);
    }

    isPointerMove = true;
  }

  if (isPointerMove && draggableElement) {
    draggableElement.style.left = Math.round(e.clientX) + 'px';
    draggableElement.style.top = Math.round(e.clientY) + 'px';
    if (rowBlock) {
      isPasteBefore = e.offsetY < rowBlock.offsetHeight / 2;
    }
  }
});

// __________________________UP_______________________________
document.addEventListener('pointerup', e => {
  console.log('pointerup>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log(e.target);

  if (draggableElement) {
    let dropClass = e.target.classList[0];

    if (dropClass === 'sample' || dropClass === 'block-menu') {
      draggableElement.remove();
    } else if (dropClass === 'block-space') {
      draggableElement.classList.remove('draggable');
      draggableElement.classList.add('main-parent');
      draggableElement.style.transition = '0.3s';
      blockSpace.append(draggableElement);
    }

    if (document.getElementById('paste-block') !== null) {
      pasteBlock.replaceWith(draggableElement);
      draggableElement.classList.remove('draggable');
      draggableElement.classList.remove('main-parent');
      draggableElement.style.transition = '0.3s';
    }
    // if (pasteBlock) {
    //   paste.replaceWith(draggableElement);
    // }
  }
  isPointerDown = false;
  isPointerMove = false;
  draggableElement = false;
});
