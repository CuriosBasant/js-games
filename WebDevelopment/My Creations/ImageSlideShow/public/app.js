let images = null;
const slideClasses = ['left-slide', 'active-slide', 'right-slide'];

window.onload = () => {
  images = Array.from(document.getElementById('image-container').children);
  slide();
};

function slideLeft () {
  images[2].className = 'hidden';
  images.unshift(images.pop());
  slide();
}

function slideRight () {
  images[0].className = 'hidden';
  images.push(images.shift());
  slide();
}

function slide () {
  // slideClasses.forEach((className, i) => images[i].className = className);

  for (let i = 0; i < slideClasses.length; i++) {
    images[i].className = slideClasses[i];
  }
}

/* 
function slideLeft () {
  if (activeSlideIndex > 0) slide(-1);
}

function slideRight () {
  if (activeSlideIndex < images.length - 1) slide(1);
}

function slide (sign) {
  setSlideClass(images[activeSlideIndex - sign], 'hidden');
  activeSlideIndex += sign;

  setVisibleSlideClasses(activeSlideIndex);
}

function setVisibleSlideClasses (index) {
  slideClasses.forEach((className, i) => setSlideClass(images[index + i - 1], className));
}

function setSlideClass (slide, className) {
  if (slide) slide.className = className;
}
 */
// Pressing Left and Right arrow keys to slide
document.onkeydown = ev => {
  console.log(ev.which);
  if (ev.which == 37) {
    slideLeft();
  } else if (ev.which == 39) {
    slideRight();
  }
};