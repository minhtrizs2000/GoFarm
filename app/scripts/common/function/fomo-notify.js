var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

class fomoNotify extends HTMLElement {
  constructor() {
    super();
    this.cookieTime = false;
    this.admin = this.querySelector('template') ? false : true;
    !this.admin && this.firstLoad();
  }

  getTimes(){
    const current = new Date().getTime();
    this.times = {
      cookie: current + this.dataset.cookie*1000,
      firstShow: current + this.dataset.firstShow*1000,
      loop: current + this.dataset.loop*1000,
      show: current + this.dataset.show*1000
    }
  }

  countdown(time, callback){
    this.deadline = time;
    this.callback = callback;
    this.startAnimationFrame = requestAnimationFrame(this.animationFrame.bind(this));
  }

  animationFrame(time, callback){
    const currentTime = new Date().getTime();
    const remain = this.deadline - currentTime;

    if(remain >= 1000){
      this.startAnimationFrame = requestAnimationFrame(this.animationFrame.bind(this));
    }
    else{
      cancelAnimationFrame(this.startAnimationFrame);
      this.callback();
    }

  }

  async show(){
    this.closest('.js-fomo-container').insertAdjacentElement('afterbegin', this);
    this.checkForTemplate();

    this.randomString();
    this.randomProduct();
    await this.randomNumber();

    this.classList.add('active');
    
  }

  close(){
    this.classList.remove('active');
  }

  firstLoad(){
    this.getTimes();

    this.countdown(this.times.firstShow, ()=>{
      this.onShow();
    });
  }

  onShow(){
    this.getTimes();

    this.show();
    this.countdown(this.times.show, ()=>{
      this.onClose();
    })
  }

  onClose(){
    this.getTimes();
    this.close();

    this.countdown(this.times.loop, ()=>{
      this.onShow();
    })
  }

  checkForTemplate(){
    const template = this.querySelector('template');

    if(!template) return;
    Array.from(template.content.children)?.forEach(child=>{
      template.insertAdjacentElement('beforebegin', child);
    })
    template.remove();
  }

  getRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1) ) + min
  }

  async randomNumber(){
    const content = this.querySelectorAll('.js-fomo-number');
    if(!content.length) return;

    const arrayStoraged = await theme.get(this.dataset.id);
    const arrayNumber = [];

    if(!this.admin && !arrayStoraged){
      this.cookieTime = this.times.cookie;
    }

    content.forEach(target=>{
      const index = +target.dataset.index;
      const randomMin = +target.dataset.randomMin;
      const randomMax = +target.dataset.randomMax;
      const oldValue = arrayStoraged ? arrayStoraged?.find(i=>i.index == index) : null;

      let value = this.getRandomNumber(randomMin, randomMax);

      if(!this.admin && oldValue){
        const deviation = this.dataset.deviation;
        let min = Math.round(oldValue - (oldValue * deviation/100))
        let max = Math.round(oldValue + (oldValue * deviation/100))

        if(min < randomMin || isNaN(min)){ min = randomMin; }
        if(max > randomMax || isNaN(max)){ max = randomMax; }
        if( max == min ){ max = randomMax; min = randomMin;}

        value = this.getRandomNumber(min, max);
      }
      target.innerHTML = value;
      arrayNumber.push({index: index, value: value})

    })

    theme.set(this.dataset.id, arrayNumber, this.cookieTime);
  }

  randomString(){
    const content = this.querySelectorAll('.js-fomo-string');
    if(!content.length) return;

    content.forEach(target=>{
      const strings = target.dataset.string.split(',');
      const randomMin = 0;
      const randomMax = strings.length-1;

      let index = this.getRandomNumber(randomMin, randomMax);
      target.innerHTML = strings[index];
    })
  }

  randomProduct(){
    const content = this.querySelectorAll('.js-fomo-product');
    if(!content.length) return;

    content.forEach(target=>{
      const array = JSON.parse(this.querySelector(`[data-random-product="${target.dataset.index}"]`).innerHTML);
      const randomMin = 0;
      const randomMax = array.length-1;

      const index = this.getRandomNumber(randomMin, randomMax);
      const product = array.find(i=>i.index == index);
      if(!product) return;

      target.innerHTML = product.title;
      target.href = product.url;

      if(this.querySelector('img')){
        const imageOld = this.querySelector('img');
        const imageNew = document.createElement('img');
        imageNew.src = product.image;
        imageNew.className = imageOld.className;
        imageOld.replaceWith(imageNew);
      }
    })
  }
}
customElements.define('fomo-item', fomoNotify);
