class cartRecommendation extends HTMLElement {
  constructor() {
    super();

    if(this.isLoaded) return;

    const handleIntersection = (entries, observer) => {

      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      this.onLoad();
    }

    new IntersectionObserver(handleIntersection.bind(this)).observe(this);
  }

  onLoad(){
    this.dataset.listId ? this.fetchArray() : this.fetch();
  }

  loaded(html){
    this.isLoaded = true;

    this.querySelector('.js-recommend-items').innerHTML = html;

    if(!this.removeExist()){
      this.remove();
      return;
    }

    this.querySelector('.js-container')?.classList.remove('hide');
    this.classList.add('recommend-initialized');
    this.querySelector('slider-component')?.load();

    this.closest('.js-popup')?.classList.add('cart-recommend-loaded');
  }

  fetch(){
    fetch(this.dataset.url)
    .then(response => response.text())
    .then(text => {
      const div = new DOMParser().parseFromString(text, 'text/html').querySelector('.shopify-section');

      if (div.innerHTML.trim().length) {
        this.loaded(div.innerHTML);
      }
    })
    .catch(e => {
      console.error(e);
    });
  }

  fetchArray(){
    const arrayPromise = [];
    const listId = this.dataset.listId.split(',');

    listId.forEach(id=>{
      arrayPromise.push(new Promise((resolved)=>{

        fetch(this.dataset.url.replace('PRODUCTID', id.trim()))
        .then(response => response.text())
        .then(text => {
          const div = new DOMParser().parseFromString(text, 'text/html').querySelector('.shopify-section');

          resolved(Array.from(div.children));
        })
      }))
    })

    Promise.all(arrayPromise).then(result=>{
      let arrayHTML = result.flat(1);
      
      arrayHTML = arrayHTML.map(i=>i.outerHTML);
      arrayHTML = [...new Set(arrayHTML)];

      this.loaded(arrayHTML.join(''));
    })
  }

  removeExist(){

    this.querySelectorAll('.remove')?.forEach(item=>{
      item.remove();
    })

    return this.querySelectorAll('.product-card').length;
  }
}
customElements.define('cart-recommendation', cartRecommendation);