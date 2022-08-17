'use strict';

let isPointerDown = false;
let isPointerMove = false;
let draggableElement;

let blockSpace = document.getElementById('block-space');
let pasteBlock = document.createElement('div');
pasteBlock.id = 'paste-block';
let offsetBlock = false;

let offsetX;
let offsetY;
let clientX;
let clientY;

let isMainBlock;
let isAfter = false;
let isBefore = false;

// _________________________DOWN______________________________
document.addEventListener('pointerdown', e => {
  console.log('pointerdown');
  offsetX = e.offsetX;
  offsetY = e.offsetY;
  clientX = e.clientX;
  clientY = e.clientY;
  isPointerDown = true;
});

// __________________________OVER_______________________________
blockSpace.addEventListener('pointerover', e => {
  if (draggableElement) {
    if (e.target.classList.contains('block-space')) {
      pasteBlock.remove();
      offsetBlock = false;
    }
    if (
      e.target.classList.contains('sub-block') &&
      e.target.children.length === 0
    ) {
      e.target.append(pasteBlock);
    }

    if (
      e.target.classList.contains('row-block') ||
      e.target.classList.contains('main-block')
    ) {
      if (e.target.classList.contains('main-parent')) {
        offsetBlock = false;
      } else {
        offsetBlock = e.target;
      }
    } else {
      offsetBlock = false;
    }
  }
});

// _________________________MOVE_______________________________
document.addEventListener('pointermove', e => {
  if (isPointerDown && !isPointerMove) {
    if (e.target.classList.contains('sample')) {
      draggableElement = e.target.cloneNode(true);
      e.target.releasePointerCapture(e.pointerId);

      draggableElement.classList.add('draggable');
      if (draggableElement.classList.contains('blue-shadow')) {
        draggableElement.classList.add('blue-shadow-draggable');
      }
      draggableElement.classList.remove('main-block');
      draggableElement.classList.remove('sample');
      draggableElement.classList.remove('row-block');
      draggableElement.style.transition = 'none';
      document.body.append(draggableElement);
    } else if (
      e.target.classList.contains('main-parent') ||
      e.target.classList.contains('row-block') ||
      e.target.classList.contains('main-block')
    ) {
      draggableElement = e.target;
      e.target.releasePointerCapture(e.pointerId);
      draggableElement.classList.add('draggable');
      draggableElement.classList.remove('main-block');
      draggableElement.classList.remove('main-parent');
      draggableElement.classList.remove('row-block');
      draggableElement.style.transition = 'none';
      document.body.append(draggableElement);
    } else if (e.target.classList[0] === 'sub-block') {
      draggableElement = e.target.parentElement;
      // console.log(e.target.parentElement);
      e.target.releasePointerCapture(e.pointerId);

      draggableElement.classList.add('draggable');
      draggableElement.classList.remove('main-parent');
      draggableElement.classList.remove('row-block');
      draggableElement.style.transition = 'none';
      document.body.append(draggableElement);
    }
    isPointerMove = true;
  }

  if (isPointerMove && draggableElement) {
    draggableElement.style.left = Math.round(e.clientX - offsetX) + 'px';
    draggableElement.style.top = Math.round(e.clientY - offsetY) + 'px';
    if (offsetBlock) {
      console.log(e.clientY);
      if (e.offsetY < 5) {
        offsetBlock.before(pasteBlock);
      } else if (e.offsetY > offsetBlock.offsetHeight - 5) {
        offsetBlock.after(pasteBlock);
      }
    }
  }
});

// __________________________UP_______________________________
document.addEventListener('pointerup', e => {
  if (draggableElement) {
    if (
      e.target.classList.contains('sample') ||
      e.target.classList.contains('block-menu')
    ) {
      draggableElement.remove();
    } else if (e.target.classList.contains('block-space')) {
      blockSpace.append(draggableElement);
      draggableElement.classList.remove('draggable');
      draggableElement.classList.remove('main-block');
      if (draggableElement.children[1].classList == 'sub-block') {
        draggableElement.classList.add('main-block');
      } else {
        draggableElement.classList.add('row-block');
      }
      draggableElement.classList.add('main-parent');
      draggableElement.style.transition = '0.3s';
    } else if (document.getElementById('paste-block') !== null) {
      draggableElement.classList.remove('draggable');
      draggableElement.classList.remove('main-parent');
      if (draggableElement.children[1].classList == 'sub-block') {
        draggableElement.classList.add('main-block');
      } else {
        draggableElement.classList.add('row-block');
      }
      draggableElement.style.transition = '0.3s';
      pasteBlock.replaceWith(draggableElement);
    }
  }
  isPointerDown = false;
  isPointerMove = false;
  draggableElement = false;
});
