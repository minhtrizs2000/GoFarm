import localforage from "localforage";

class recentlyViewed extends HTMLElement {
  constructor() {
    super();


    localforage.getItem('recentlyViewed').then(value=>{
      if(!value) return;

      let array = value?.split('|');

      if(theme.routes.pageType == 'product'){
        array = array.filter(item=>item != theme.product.handle);
      }

      this.handleArray = array;
      this.promiseArray = [];

      const handleIntersection = (entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);

        this.request();

        Promise.all(this.promiseArray).then(result=>{
          const html = result.join('');
          if(html.length){
            this.querySelector('.js-product-content').innerHTML = html;
            this.querySelector('.no-js-hidden')?.classList.remove('no-js-hidden');
            this.querySelector('slider-component')?.load();            
          }
        })

      }
      new IntersectionObserver(handleIntersection.bind(this), {rootMargin: '100px 0px 200px 0px'}).observe(this);

    })
  }

  request(){

    this.handleArray.forEach(handle=>{
      const url = theme.routes.collectionAllUrl + '/products/' + handle + this.dataset.url;
      handle.length && this.promiseArray.push(new Promise((rv, rj)=>{
        fetch(url).then(e=>e.text()).then(html=>{
          let div = document.createElement('div');
          div.innerHTML = html;
          rv(div.querySelector('section').innerHTML);
          div.remove();
        })
        .catch(error=>{
          console.log(error);
          rj('');
        })
      }))
    })
  }
}

customElements.define('recently-viewed', recentlyViewed);


(()=>{
  theme.routes.pageType == 'product' && localforage.getItem('recentlyViewed').then(value=>{
    let array = value?.split('|') || [];

    array = [theme.product.handle].concat(array.filter(item=>item != theme.product.handle));

    if(!array) return;

    array.length > 10 && (array.length = 10);
    localforage.setItem('recentlyViewed', array.join('|'));
  })
})()