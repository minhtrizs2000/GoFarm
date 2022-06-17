import './common/theme-section';
import { tns } from 'tiny-slider';

register("main-product", {
    onLoad: function () {
       var slider = tns(
          {
            "container": `#slider-${this.id}`,
            "items": 1,
            "controls": false,
            "navContainer": `#nav-container-${this.id}`,
            "navAsThumbnails": true
          }
       );

        const product = JSON.parse(this.container.querySelector("#data-product").innerText).data;
        const { variants } = product;
        const current_variant_id = this.container.querySelector(`#product-form-${this.id} input[name="id"]`).value;
        const current_variant = variants.find((variant)=> variant.id == parseFloat(current_variant_id));
  
        const quantity = this.container.querySelector(".quantity__input");
        const _this = this;

        quantity.addEventListener('change', function(){
          calculatorTotalPrice();
        });
        
        function calculatorTotalPrice() {
          const price = _this.container.querySelector(".price");
          const price_regular = _this.container.querySelector(".price__regular .price-item--regular");
          const price_sale = _this.container.querySelector(".price__sale .price-item--sale");
          const price_sale_compare = _this.container.querySelector(".price__sale .price-item--regular");
          const qty = parseInt(quantity.value);
          
          price.classList.forEach((className) =>{
            if (className == "price--sold-out" || className == "price--on-sale" || className == "price--no-compare") {
              price.classList.remove(className);
            }
          })
         
          if (product.price_varies == false && product.compare_at_price_varies) {
              price.classList.add("price--no-compare");
          }
         
          if (current_variant.compare_at_price && current_variant.compare_at_price > current_variant.price) {
              price.classList.add("price--on-sale");
          }
          if (current_variant.available == false) {
              price.classList.add("price--sold-out");
          }
          
          price_regular.innerText = '$' + current_variant.price / 100 * qty;
          price_sale.innerText = '$' + current_variant.price / 100 * qty;
          if (current_variant.compare_at_price) {
            price_sale_compare.innerText = '$' + current_variant.compare_at_price / 100 * qty;
          } else {
            price_sale_compare.innerText = '';
          }
          
        }
    }
  });
  
load('*');