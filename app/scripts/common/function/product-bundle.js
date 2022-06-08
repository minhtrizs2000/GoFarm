import Cart from "./cart";
import flyToCart from './fly-to-cart';


class productBundle extends HTMLElement {
	constructor() {
		super();
		this.Cart = new Cart();
		this.addEventListener('change', this.onChange.bind(this));
		this.submitBtn = this.querySelector('.js-bundle-add')

		this.submitBtn?.addEventListener('click', this.submit.bind(this));
		this.querySelectorAll('select')?.forEach(select=>select.addEventListener('change', this.selectChange.bind(this)));
	}
	onChange(event){

		const input = event.target;
		if(input && input.name == 'bundleItem') {			
			const id = input.id;
			const item = this.querySelector(`.bundle-item[data-control="${id}"]`);

			item.classList.toggle('available', input.checked);
		}
		this.updateTotal();
	}

	updateTotal(){
		let total = 0;
		this.querySelectorAll('[name="bundleItem"]:checked')?.forEach(input=>{
			total += +input.dataset.price;
		})

		this.querySelector('.js-bundle-total')?.set(total);
	}


	successNoti(qty){
		const div = document.createElement('div');
		const image = this.querySelector('img');

		div.classList.add('cart-notify');
		div.innerHTML = `<span class="bubble-count bubble-cart" data-cart-count="${qty || 1}"></span>`;

		flyToCart(div, this.loadingItem)
	}

	loadingState(remove = false){
		if(!this.loadingItem) return;

		if(remove){
			this.loadingItem.classList.remove('loading');
			this.loadingItem.removeAttribute('disabled', '');
			return;
		}

		if(!this.loadingItem.querySelector('.icon-loading')){
			let svgLoading = document.getElementById('svg_loading')?.innerHTML || '';
			this.loadingItem.insertAdjacentHTML('afterbegin', svgLoading)
		}

		this.loadingItem.classList.add('loading');
		this.loadingItem.setAttribute('disabled', '');
	}
	submit(){
		const items = Array.from(this.querySelectorAll('[name="bundleItem"]:checked')).map(i=>{return {id: i.value}})

		this.loadingItem = this.submitBtn;
		this.loadingState();

		const body = {
      		items: items
		};

		this.Cart.add(body)
		.then(e=>{
			if(e.status == 200){
				this.successNoti(items.length);
			}

			e.json().then(cart=>{
				if(e.status == 422){
					this.Cart.notify(cart.description);
					return;
				}

				this.Cart.success(cart);
			})

		})
		.finally(()=>this.loadingState(true));
	}

	selectChange(event){
		const this4 = event.target;
		const value = this4.value;
		const price = this4.options[this4.selectedIndex].dataset.price;
		const title = this4.options[this4.selectedIndex].textContent;

		const input = this.querySelector(`#${this4.dataset.control}`);
		const label = input.nextElementSibling;

		input.value = value;
		input.setAttribute('data-price', price);
		label.querySelector('.js-variant-title').innerHTML = title;

		this4.closest('product-card').querySelector('price-item.price').set(+price);
		label.querySelector('price-item.price').set(+price);
		this.dispatchEvent(new Event('change'));
	}
}
customElements.define('bundle-cart', productBundle);