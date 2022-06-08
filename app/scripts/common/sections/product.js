import '../function/product-form';
import '../function/product-bundle';
import '../function/product-slider';
import '../function/store-availability';

export default Product = {
  onLoad: function(){
    this.container.querySelectorAll('product-slider-component')?.forEach(slide=>{
      slide.load();
    })
  }
  ,onUnload: function(){
  }
  ,onSelect: function(){
  }
  ,onDeselect: function(){
  }
  ,onBlockSelect: function(e){
  }
  ,onBlockDeselect: function(e){
  }
};


class productDescription extends HTMLElement {

  constructor() {
    super();

    this.dataset.style == 'tab' && this.toggleTab();

  }
  toggleTab(){

    this.querySelectorAll('.js-tab-link')?.forEach(item=>{
      item.addEventListener('click', e=>{
        const newTab = document.getElementById(item.dataset.id);

        if(!newTab) return;
        e.preventDefault();
        e.stopPropagation();

        this.querySelectorAll('.active')?.forEach(i=>{
          !i.querySelector(`[data-id=${item.dataset.id}]`) && i.classList.remove('active');
        });

        if(window.matchMedia('(min-width: 750px)').matches){
          this.querySelectorAll(`[data-id=${item.dataset.id}]`)?.forEach(i=>i.closest('.product__toggle-nav')?.classList.add('active'));
          newTab.classList.add('active');
        }
        else {
          this.querySelectorAll(`[data-id=${item.dataset.id}]`)?.forEach(i=>i.closest('.product__toggle-nav')?.classList.toggle('active'));
          newTab.classList.toggle('active');          
        }
      })
    })

    window.addEventListener('resize', e=>{
      if(!window.matchMedia('(min-width: 750px)').matches || this.querySelector('.active')) return;

      this.querySelector('.js-tab-link').dispatchEvent(new Event('click'));
      console.log('trigger click');
    })
  }
}

customElements.define('product-description', productDescription);