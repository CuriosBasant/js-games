class VideoPlayer {
  constructor(element, controls) {
    this.isFullscreen = false;
    this.durationFormatted = '';
    this.videoController = element;

    this.controls = Object.fromEntries(
      [...controls.children].map(ctrl => [ctrl.id, ctrl])
    );

    this.dj = element.firstElementChild;

    // Handling Player Events
    this.dj.onloadedmetadata = ev => {
      this.durationFormatted = getFormattedTime(this.dj.duration);
      this.seeking();
    };
    this.dj.onclick = () => this.pauseResume();
    this.controls.volume.onclick = ev => this.dj.muted = !this.dj.muted;
    this.dj.ontimeupdate = () => this.seeking();
    this.dj.onvolumechange = () => this.volume();
    this.dj.onplay = () => this.controls.pause_resume.textContent = 'pause';
    this.dj.onpause = () => this.controls.pause_resume.textContent = 'play_arrow';

    this.dj.volume = 0.01;
    console.log(this.controls);
    // this.controls = controls;
    this.controls.seek_bar.oninput = ev => {
      this.seek(ev.target.value);
    }
    this.controls.volume_bar.oninput = ev => {
      this.dj.volume = ev.target.value / 400;
    }
    controls.onclick = ev => {
      if (ev.target == ev.currentTarget) return;
      // console.log(ev.target.id);
      switch (ev.target.id) {
        case 'pause_resume':
          this.pauseResume();
          break;
        case 'toggle_fullscreen':
          this.toggleFullscreen();
      }
    }
  }

  seek (value) {
    const time = value * this.dj.duration / 100;
    this.dj.currentTime = time;
  }
  seeking () {
    const value = this.dj.currentTime * 100 / this.dj.duration;
    this.controls.seek_bar.style.setProperty('--val', `${value}%`);
    this.controls.seek_bar.firstElementChild.value = value;

    this.controls.timer.textContent = `${getFormattedTime(this.dj.currentTime)} / ${this.durationFormatted}`;
  }
  pauseResume () {
    this.dj[this.dj.paused ? 'play' : 'pause']();
  }
  volume (val) {
    const vol = val || this.dj.volume;
    this.controls.volume.textContent = `volume_${this.dj.muted ? 'off' : vol > 0.2 ? 'up' : vol > 0.07 ? 'down' : 'mute'}`;
    this.controls.volume_bar.firstElementChild.value = vol * 400;
    this.controls.volume_bar.style.setProperty('--val', `${vol * 400}%`);
  }

  toggleFullscreen () {
    const fullscreenButton = this.controls.toggle_fullscreen;
    if (this.isFullscreen) {
      document.exitFullscreen();
      fullscreenButton.textContent = 'fullscreen';
    } else {
      this.videoController.requestFullscreen();
      fullscreenButton.textContent = 'fullscreen_exit';
    }
    this.isFullscreen = !this.isFullscreen;
  }
}

let videoPlayer;
window.onload = () => {
  const element = document.getElementById('video-player');
  const controls = document.getElementById('button-controls');
  videoPlayer = new VideoPlayer(element, controls);
  console.log(videoPlayer);


};


function getFormattedTime (time) {
  const mins = `0${time / 60 | 0}`.slice(-2);
  const secs = `0${time % 60 | 0}`.slice(-2);
  return mins + ':' + secs;
}