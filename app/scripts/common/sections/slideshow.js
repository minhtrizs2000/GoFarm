export default Slideshow = {
  onLoad: function(){
    this.slideshow = this.container.querySelector('slider-component');
    this.slideshow?.load();

    if(this.container.querySelector('.js-video')){
      this.loadYTVideo();
      this.slider = this.slideshow.getSlide();
      this.slider?.events.on('indexChanged', this.updateMedia.bind(this));

      this.container.querySelectorAll('.js-video')?.forEach(item=>{
        item.addEventListener("touchstart", (e) =>e.stopPropagation());
        item.addEventListener("touchmove", (e) =>e.stopPropagation());
        item.addEventListener("touchend", (e) =>e.stopPropagation());
        item.addEventListener("mousedown", (e) =>e.stopPropagation());
      })
    }
  }
  ,onUnload: function(){
    this.slider.destroy();
  }
  ,onSelect: function(){
    this.slideshow?.load();
    theme.toggleSticky(true);
  }
  ,onDeselect: function(){
    this.slideshow?.unLoad();
    theme.toggleSticky(false);
  }
  ,onBlockSelect: function(e){
    const index = e.target.closest('[data-slide-index]')?.dataset.slideIndex;
    this.slideshow?.goTo(+index);
  }

  ,loadYTVideo: function(){
    const YTItems = this.container.querySelectorAll('[data-youtube-id]');

    if(!YTItems.length) {
      return;
    }

    this.mediaArray = [];

    if(!document.getElementById('YTScript')){
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = 'YTScript';
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window['onPlayerStateChange'] = (event)=>{
      if (event.data == YT.PlayerState.ENDED) {
        let video = event.target;
        video.seekTo(0);
        video.playVideo();
      }
    }

    window['onYouTubeIframeAPIReady'] = ()=>{
      YTItems.forEach(video=>{
        this.mediaArray.push(new YT.Player(video.id, {
          videoId: video.dataset.youtubeId,
          playerVars: { 'autoplay': 0, 'playsinline': 1, 'controls': 0, 'showinfo': 0, 'enablejsapi': 1},
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        }));
      })
    }

    window['onPlayerReady'] = (event)=>{
      let video = event.target;
      video.mute();
      if(!video.h.closest('[data-slide-index="0"]')) return;
      video.h.classList.add('playing');
      video.playVideo();
    }
  }

  ,pauseAllVideos(){
    this.container.querySelectorAll('.playing')?.forEach(video=>{
      video.classList.remove('playing');

      if(video.tagName == 'VIDEO'){
        video.pause();
      }
      else if(video.dataset.ytIndex){
        const index = video.dataset.ytIndex;
        const YTVideo = this.mediaArray[index];
        if(YTVideo){
          YTVideo.pauseVideo();
        }
      }
    })
  }


  ,updateMedia(e){
    this.pauseAllVideos();

    const index = e?.displayIndex-1 || 0;
    const currentSlide = Array.from(this.container.querySelectorAll('.slide-item'))[index];
    const video = currentSlide.querySelector('.js-video');
    if(!video) return;

    video.classList.add('playing');
    if(video.tagName == 'VIDEO'){
      video.play();
    }
    else if(video.dataset.ytIndex){
      const index = video.dataset.ytIndex;
      const YTVideo = this.mediaArray[index];

      if(YTVideo && YTVideo.playVideo){
       YTVideo.playVideo();
      }
    }
  }
};