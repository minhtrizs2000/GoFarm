import './common/theme-section';
import { toast } from './common/function/toast';

register("product-frequently", {
    onLoad: function () {
        const input_arr = this.container.querySelectorAll(".custom-checkbox input");
        const price_arr = this.container.querySelectorAll(".custom-checkbox .price-current");
        const compare_price_arr = this.container.querySelectorAll(".custom-checkbox .price-old");
        const total_price_element = this.container.querySelector(".product-frequently__total--current");
        const total_compare_price_element = this.container.querySelector(".product-frequently__total--old");
        const my_form = this.container.querySelector("#product-frequently-form");
        const data = JSON.parse(this.container.querySelector("#data-bundle").innerText).data;
        const container = this.container;
 
        input_arr.forEach((input)=>{
            input.addEventListener('click', ()=>{
                calculatorTotalPrice();
            });
        })
        
        my_form.addEventListener('submit', (e)=>{
            e.preventDefault();
            const product_selected = data.filter((item,index)=> input_arr[index].checked);
           
            const items = product_selected.map((item)=>{
                var id = item.split("=")[1];
                
                return {
                    'id': parseFloat(id),
                    'quantity': 1
                }
            })

            let formData = {
                'items': items
            }

            $.ajax({
                type: 'POST',
                url: '/cart/add.js',
                dataType: 'json',
                data: formData,
                success: function(res) {
                    toast(container, 'Add to cart success!');
                },
                error: function(e) {
                    console.log(e);
                }
            }); 
        })

        function calculatorTotalPrice() {
            var total_price = 0, total_compare_price = 0;
            input_arr.forEach((input, index)=>{
                if (input.checked) {
                    total_price += parseFloat(price_arr[index].innerText.slice(1));
                    if (compare_price_arr[index]) {
                        total_compare_price += parseFloat(compare_price_arr[index].innerText.slice(1));
                    }
                    
                }
            })
            total_price_element.innerText = '$' + total_price.toFixed(2);
            total_compare_price_element.innerText = total_compare_price > 0 ? ('$' + total_compare_price.toFixed(2)) : "";
        }
        calculatorTotalPrice();

    }
});
  
load('*');