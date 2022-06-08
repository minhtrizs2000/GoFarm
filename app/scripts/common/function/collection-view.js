class collectionView extends HTMLElement { 
  constructor() {
    super();

    this.querySelectorAll('.js-collection-view')?.forEach(i=>{
      i.addEventListener('click', e=>{
        this.changeView(i);
      });
    })

    // window.addEventListener('resize', ()=>{
    //   this.resize().find(i=>i.match == true)?.run();
    // })
  }
 
  resize(){
    return [
      {
        match: window.matchMedia(`(max-width: 749px)`).matches
        ,run: ()=>this.querySelector('.js-collection-index-0').dispatchEvent(new Event('click'))
      }
      /*
      ,
      {
        match: window.matchMedia(`(min-width: 750px) and (max-width: 999px)`).matches
        ,run: ()=>this.querySelector('.js-collection-index-1').dispatchEvent(new Event('click'))
      },
      {
        match: window.matchMedia(`(min-width: 1000px) and (max-width: 1299px)`).matches
        ,run: ()=>this.querySelector('.js-collection-index-2').dispatchEvent(new Event('click'))
      },
      {
        match: window.matchMedia(`(min-width: 1300px)`).matches
        ,run: ()=>this.querySelector('.js-collection-index-3').dispatchEvent(new Event('click'))
      }
      */
      ]

  }

  changeView(button){
    this.querySelectorAll('.js-collection-view.active')?.forEach(i=>i.classList.remove('active'));
    button.classList.add('active');
    this.grid = document.querySelector('.js-product-grid');

    if(!this.grid) return;

    let classToRemove = [];
    this.grid.classList.forEach(i=>{
      !!i.replace(/[^\d]/g, '').length && classToRemove.push(i);
    })
    this.grid.classList.remove(...classToRemove);
    this.grid.classList.add(...button.dataset.class.split(' '));
    this.setAttribute(button.dataset.class);
  }

  setAttribute(value){
    if(this.isPosting != null)
      clearTimeout(this.isPosting);

    const attributes = {collectionView: value};

    this.isPosting = fetch(`${theme.routes.cartUpdate}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;'
      },
      body: JSON.stringify({ attributes: attributes })
    })
    .then(e=>{
      e.json().then(e=>{
        this.isPosting = null;
      })
    })
    .catch(e=>{
      this.isPosting = null;
    })

  }
}
customElements.define('collection-view', collectionView);
