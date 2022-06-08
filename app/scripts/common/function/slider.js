class SliderComponent extends HTMLElement {

  constructor() {
    super();
  }

  load(){
    if(this.closest('[data-section-type="slideshow"]')){
      this.createSlide();
      return;
    }

    new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      this.createSlide();

    }, {rootMargin: '100px 0px 200px 0px'}).observe(this);
  }

  createSlide(){
    try {
      let config = this.querySelector('script[type="application/json"]');
      this.config = JSON.parse(config.innerHTML);
      config.remove();
    } catch(e) {
      console.log(e);
      return;
    }

    this.config.gutter && (this.config.gutter = +this.config.gutter.toString().replace(/[^\d.,]/g, ''));

    for( let i in this.config.responsive){
      let gutter = this.config.responsive[i]?.gutter || 0;
      this.config.responsive[i].gutter = +gutter.toString().replace(/[^\d.,]/g, '');
    }


    this.config.onInit = ()=>{
      let container = document.querySelector(this.config.container);
      let classToRemove = [];
      container.classList.forEach(i=>{
        !!i.match(/flex.*?\b/g) && classToRemove.push(i);
      })
      container.classList.remove(...classToRemove);
      this.classList.add("slide-initialized");
    };

    this.slider = tns(this.config);
  }

  getSlide(){
    return this.slider;
  }

  unLoad(){
    if(!this.slider) return;
    this.slider.destroy();
  }

  goTo(index){
    this.slider?.goTo(index);
  }
}

customElements.define('slider-component', SliderComponent);