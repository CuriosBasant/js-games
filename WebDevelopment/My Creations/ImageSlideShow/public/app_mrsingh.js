let currentActiveSlideIndex = 1;
let images = null;
let len = 0;
window.onload = () => {
  images = document.getElementById('image-container').children;
  console.log(images);
  images[0].classList.add('left-slide');
  images[1].classList.add('active-slide');
    images[2].classList.add('right-slide');
    len = images.length;
};

document.onkeydown = ev => {
  console.log(ev.which);
  if (ev.which == 37) {
    slideLeft();
  } else if (ev.which == 39) {
    slideRight();
  }
};

function slideLeft () {
  
  if (currentActiveSlideIndex == 1)
      currentActiveSlideIndex = images.length;
  else
      currentActiveSlideIndex--;

  const img = images[currentActiveSlideIndex];
  if (!img) return;
  slide();
}
function slideRight () {
  const img = images[currentActiveSlideIndex - 1];
    if (!img) return;
  currentActiveSlideIndex++;
  img.className = 'hidden';
  slide();
}

function slide() {

    if (currentActiveSlideIndex == images.length) {
        images[currentActiveSlideIndex - 1].className = 'left-slide';
        images[currentActiveSlideIndex].className = 'active-slide';
        images[0].className = 'right-slide';
    }
    else if (currentActiveSlideIndex == 1) {
        images[images.length - 1].className = 'left-slide';
        images[currentActiveSlideIndex].className = 'active-slide';
        images[currentActiveSlideIndex + 1].className = 'right-slide';
    }
    else {
        images[currentActiveSlideIndex - 1].className = 'left-slide';
        images[currentActiveSlideIndex ].className = 'active-slide';
        images[currentActiveSlideIndex + 1].className = 'right-slide';
    }

  
}