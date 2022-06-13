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

        var variant_index = 0;
        const data = JSON.parse(this.container.querySelector("#data-product").innerText).data;
        const { variants } = data;
        const btn_minus = this.container.querySelector(".button-minus");
        const btn_plus = this.container.querySelector(".button-plus");
        const quantity = this.container.querySelector(".product-qty");
        const product_size_options = this.container.querySelectorAll(".product-size__list li");
        const current_price_element = this.container.querySelector(".product-price--current");
        const compare_price_element = this.container.querySelector(".product-price--old");
        const product_title_element = this.container.querySelector(".product-name");
        const product_sku_element = this.container.querySelector(".product-sku span");
        const product_form = this.container.querySelector("#main-product-form");

        btn_minus.addEventListener('click', function(){
            var qty = parseInt(quantity.value);
            if (qty != 1) {
              quantity.value = qty - 1;
              calculatorTotalPrice()
            }
        })

        btn_plus.addEventListener('click', function(){
          var qty = parseInt(quantity.value);
          quantity.value = qty + 1;
          calculatorTotalPrice()
        })

        product_size_options.forEach(function(option, index){
          option.addEventListener('click', function(){
              if (!this.classList.contains('active')) {
                  this.parentElement.querySelector("li.active").classList.remove("active");
                  this.classList.add("active");
                  variant_index = index;
                  product_title_element.innerText = variants[variant_index].name;
                  product_sku_element.innerText = variants[variant_index].sku;
                  calculatorTotalPrice();
              }
          })
        })

        product_form.addEventListener('submit', (e)=>{
          e.preventDefault();
          const id = this.container.querySelector(".product-size__list li.active").dataset.id;
          const qty = this.container.querySelector("input.product-qty").value;
          const items = [
            {
              'id': id,
              'quantity': parseInt(qty)
            }
          ];

          let formData = {
              'items': items
          }

          $.ajax({
              type: 'POST',
              url: '/cart/add.js',
              dataType: 'json',
              data: formData,
              success: function(res) {
                  
              },
              error: function(e) {
                  console.log(e);
              }
          }); 
        });
        
        function calculatorTotalPrice() {
          var qty = parseInt(quantity.value);
          current_price_element.innerText = '$' + variants[variant_index].price / 100 * qty;
          compare_price_element.innerText = '$' + variants[variant_index].compare_at_price / 100 * qty;
        }
    }
  });
  
load('*');