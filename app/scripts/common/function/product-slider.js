class productSliderComponent extends HTMLElement {

  constructor() {
    super();

    this.cache = {};

    try {
      let config = this.querySelector('script[type="application/json"]');
      this.config = JSON.parse(config.innerHTML);
      this.config.onInit = this.onInit.bind(this);

      // config.remove();
    } catch(e) {
      console.log(e);
    }

    this.querySelectorAll('.media-wrapper')?.forEach(item=>{
      item.addEventListener("touchstart", (e) =>e.stopPropagation());
      item.addEventListener("touchmove", (e) =>e.stopPropagation());
      item.addEventListener("touchend", (e) =>e.stopPropagation());
      item.addEventListener("mousedown", (e) =>e.stopPropagation());
    })


    document.querySelector('.js-large-vertical') && window.addEventListener('resize', theme.debounce(e=>{
      this.onResize(e);
    }, 300).bind(this));


    this.initZoom();/*Zoom init*/
    this.loadYTVideo();
  }

  load(){
    const config = this.getConfig();

    this.slider = tns(config);
    this.slider.events.on('indexChanged', this.onIndexChanged.bind(this));
    this.mobileDevice = this.isMobileDevice();
  }

  getSlide(){
    return this.slider;
  }

  onIndexChanged(e){

    if(this.dataset.type == 'main'){
      this.updateMediaVideo(e);

      const sliderThumb = document.querySelector(this.tagName+'[class*="thumb"]');
      if(sliderThumb){
        const indexToGoTo = e.index > sliderThumb.getSlide().getInfo().slideCount ? 0 : e.index - 1;
        sliderThumb.goTo(indexToGoTo);
        sliderThumb.startIndex = e.index;
        this.startIndex = e.index;
      }
    }
  }

  getConfig(){
    this.config.gutter && (this.config.gutter = +this.config.gutter.toString().replace(/[^\d.,]/g, ''));
    this.config.startIndex = this.startIndex || 0;


    for( let i in this.config.responsive){
      let gutter = this.config.responsive[i]?.gutter || 0;
      this.config.responsive[i].gutter = +gutter.toString().replace(/[^\d.,]/g, '');
    }

    if(this.config.axis != 'vertical') return this.config;

    this.thumbsOpts = {axis: this.isMobileDevice() ? 'horizontal' : 'vertical'};

    return (Object.assign({}, this.config, this.thumbsOpts));
  }

  isMobileDevice(){
    return !window.matchMedia( '( min-width: 1300px )' ).matches;
  }

  onInit(){
    let container = document.querySelector(this.config.container);
    let classToRemove = [];
    container.classList.forEach(i=>{
      !!i.match(/flex.*?\b/g) && classToRemove.push(i);
    })

    container.classList.remove(...classToRemove);
    this.classList.add("slide-initialized");
    this.querySelectorAll('.lazyloading')?.forEach(item=>{
      item.classList.remove('lazyloading');
      item.classList.add('lazyload');
    });

    const firstSlide = this.querySelector('[data-media-index="1"]');

    if(firstSlide && firstSlide.classList.contains('media-type-video')){      
      firstSlide.querySelector('video')?.play();
      firstSlide.querySelector('video')?.classList.add('playing');
    }
  }

  initZoom(){
    let zoomGalleryJSON = document.getElementById('zoomGalleryJSON');

    if(this.dataset.type != 'main' || !zoomGalleryJSON) return;

    this.zoomGalleryJSON = JSON.parse(zoomGalleryJSON.innerHTML);
    this.cache.zoomJSON = this.zoomGalleryJSON;

    function callPhotoSwipe( index, items ){
      let pswpElement = document.querySelectorAll('.pswp')[0];

      if(document.body.dataset.dir && (document.body.dataset.dir == 'rtl')) {
        index = items.length - index - 1;
        items = items.reverse();
      }

      let gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, {
        index: index,
        history: false
      });
      gallery.init();
    }

    theme.addEvent('click', '.media-item.media-type-image', e=>{
        e.preventDefault();
        e.stopPropagation();

        let template = document.querySelector(`template#zoomPopupTemplate`);
        if(template != null){
          document.body.insertAdjacentElement('beforeend', template.content.firstElementChild);
          template.remove();
        }

        let target = e.target.closest('.media-item.media-type-image');
        let index = Array.prototype.indexOf.call(target.parentNode.children, target);

        callPhotoSwipe(index, this.zoomGalleryJSON);
    })
  }

  onResize(){
    if(this.mobileDevice == this.isMobileDevice()) return;

    this.unLoad();
    setTimeout(()=>{
      this.load();
    }, 300)

  }

  unLoad(){
    this.slider && this.slider.destroy();
    this.classList.remove("slide-initialized");
  }

  goTo(index){
    this.slider?.goTo(index);
  }

  loadYTVideo(){
    const YTItems = this.querySelectorAll('[data-yt-id]');

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
          videoId: video.dataset.ytId,
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
      if(!(video.h.closest('[data-media-index="1"]'))) return;
      video.playVideo();
      video.h.classList.add('playing');
    }
  }

  updateMediaVideo(event){
    /*
    -------------------------------
    SHOPIFY VIDEO
    -------------------------------
    */
    if(this.querySelector('.media-type-video')){
      this.querySelectorAll('video.playing')?.forEach((item)=>{
        item.pause();
        item.classList.remove('playing');
      })

      let nextVideo = this.querySelector(`[data-media-index="${event.index+1}"] video`);

      if(nextVideo){
        nextVideo.classList.add('playing');
        nextVideo.play();
      }
    }

    /*
    -------------------------------
    YOUTUBE VIDEO
    -------------------------------
    */
    if(this.querySelector('.media-type-external_video')){
      this.querySelectorAll('.playing[data-video-index]')?.forEach((item)=>{
        let index = item.dataset.videoIndex;
        let YTVideo = this.mediaArray[index];
        if(YTVideo){
          YTVideo.pauseVideo();
          item.classList.remove('playing');
        }
      })

      let nextVideo = this.querySelector(`[data-media-index="${event.index+1}"] [data-video-index]`);
      if(nextVideo){
        let index = nextVideo.dataset.videoIndex;
        let YTVideo = this.mediaArray[index];

        if(YTVideo){
          YTVideo.playVideo();
          nextVideo.classList.add('playing');
        }
      }
    }
  }
}

customElements.define('product-slider-component', productSliderComponent);