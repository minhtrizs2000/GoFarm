class storeAvailability extends HTMLElement {
  constructor() {
    super();
    
    this.variantId = this.dataset.variantId;
    this.baseUrl = this.dataset.baseUrl;
    
    if(!this.variantId){
      this.remove();
      return;
    }

    fetch(`${this.baseUrl}/variants/${this.variantId}/?section_id=store-availability`).then(e=>e.text()).then(result=>{
      const div = new DOMParser().parseFromString(result, 'text/html').querySelector('.shopify-section');

      if(!div.firstElementChild){
        this.remove();
        return;        
      }

      this.innerHTML = div.innerHTML;
      this.querySelector('.js-product-title').innerHTML = this.dataset.productTitle;

      if(this.dataset.hasOnlyDefaultVariant){
        this.querySelector('.js-variant-title').remove();
      }
    })
  }
}

customElements.define('store-availability', storeAvailability);