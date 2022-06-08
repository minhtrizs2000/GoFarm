import flyToCart from './fly-to-cart';
import Cart from "./cart";
import "./cart-recommendation";

window.themeCart = new Cart();

class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();

      this.closest('cart-items').updateQuantity(this.querySelector('a'));
    });
  }
}
customElements.define('cart-remove-button', CartRemoveButton);

class cartForm extends HTMLElement{
	constructor(){
		super();

		this.Cart = themeCart;
		this.cardId = this.dataset.cardId;
		this.sectionId = this.dataset.sectionId || this.closest('[data-section-id]')?.dataset.sectionId;

		this.debounce = theme.debounce(e=>this.changeCart(e), 500);

		this.addEvents();
	}

	addEvents(){
		this.form = this.querySelector('form[action*="cart"]');
		if(!this.form) return;

		this.form.addEventListener('submit', this.addCart.bind(this));

		if(this.classList.contains('js-cart-change') && this.querySelector('quantity-input')){
			this.addEventListener('change', this.debounce.bind(this));
		}
	}

	removeEvents(){
		this.form?.removeEventListener('submit', this.addCart.bind(this));

		this.closest('product-card') && this.removeEventListener('change', this.debounce.bind(this));
	}

	addCart(e){
		if(theme.settings.cartStyle == 'cart_page' || e.submitter.name == 'checkout') return;

		e.preventDefault();

		this.loadingItem = e.submitter;
		this.loadingState();

		const url = this.getURL(e);
		const sections = [];

		const body = {
      ...JSON.parse(theme.serializeForm(this.form)),
			sections: sections,
			sections_url: url
		};

		this.Cart.add(body)
		.then(e=>{
			if(e.status == 200){
				this.successNoti(body.quantity);
			}

			e.json().then(cart=>{
				if(e.status == 422){
					this.Cart.notify(cart.description);
					return;
				}

				if(this.tagName == 'CART-FORM' && this.classList.contains('js-cart-change')){
					this.updateForm(cart);
				}

				if(theme.settings.cartAddedEffect == 'default'
						&& theme.settings.pageType != 'cart_page'
						&& theme.settings.cartStyle != 'cart_page'
						&& theme.settings.cartStyle != 'dropdown'){
					document.querySelector('header .js-mini-cart')?.click();
				}
				if(!document.querySelector('#cartSidebar.active')){
					this.Cart.eventType = 'cartAdded';
				}
				this.Cart.success(cart);
			})

		})
		.finally(()=>{
			this.loadingState(true);
			this.Cart.eventType = null;
		});
	}

	changeCart(e){
		this.loadingItem = e.target.tagName == 'INPUT' ? e.target.parentNode : e.target;
		this.loadingState();

		if(this.loadingItem.closest('cart-items')){
			this.Cart.eventType = 'cartChange';
		}

		const line = +e.target.dataset.index;
		const qty = +e.target?.value || 0;
		const url = this.getURL(e);

		const body = {
			line: line,
			quantity: qty,
			sections: [this.cardId && this.sectionId],
			sections_url: url
		};

		let currentTotal = document.querySelector('.js-cart-count')?.dataset.cartCount || 0;

		this.Cart.change(body)
		.then(e=>{

			e.json().then(cart=>{

				if(currentTotal == cart.item_count){
					this.Cart.notify(`422qty`+cart.items[line-1].quantity);
				}

				this.updateForm(cart, line, qty);
				this.Cart.success(cart);

			})
			.catch(error=>{
				this.Cart.notify(error)
			})
		})
		.finally(()=>{
			this.loadingState(true);

			if(this.loadingItem.closest('cart-items')){
				this.Cart.eventType = 'cartChange';
			}
		});
	}

	getURL(){
		return this.dataset.url || location.pathname;
	}

	updateQuantity(selector){
		this.changeCart({
			target: selector
		});
	}

	successNoti(qty){
		if(theme.settings.cartAddedEffect != 'fly_to_cart' ) return;

		const div = document.createElement('div');
		const image = this.querySelector('img');

		div.classList.add('cart-notify');

		if(image){
			div.innerHTML = image.outerHTML;
		}
		else{
			div.innerHTML = `<span class="bubble-count bubble-cart" data-cart-count="${qty || 1}"></span>`;
		}

		flyToCart(div, this.loadingItem);
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

	updateForm(cart){
		const sections = cart.sections;
		if(!sections || !sections['cart-section-item'] || this.Cart.eventType == 'cartChange') return;

		let section = new DOMParser().parseFromString(sections['cart-section-item'], 'text/html').querySelector('.shopify-section');
		let target = section.querySelector(`cart-form[data-card-id="${this.cardId}"]`);

		target && document.querySelectorAll(`cart-form[data-card-id="${this.cardId}"]`)?.forEach(item=>{
			item.innerHTML = target.innerHTML;
			item.closest('product-card')?.classList.toggle('showing', target.closest('product-card')?.classList.contains('showing'));
			item.removeEvents();
			item.addEvents();
		})
	}

}
customElements.define('cart-form', cartForm);

themeCart.hasCartItems = false;

class cartItems extends cartForm{
	constructor(){
		super();

		if(theme.routes.pageType == 'cart')
			themeCart.hasCartItems = true;

		if(theme.routes.pageType == 'cart' || theme.settings.cartStyle == 'cart_page' || themeCart.hasCartItems) return;

		const handleIntersection = (entries, observer) => {
			if (!entries[0].isIntersecting) return;

			observer.unobserve(this);
			themeCart.hasCartItems = true;
			this.fetch();
		}

		new IntersectionObserver(handleIntersection.bind(this), {rootMargin: '100px 0px 200px 0px'}).observe(this);
	}

	updateForm(cart, index, qty){
		if(!cart.sections || !cart.sections[this.sectionId]) return;


		const section = new DOMParser().parseFromString(cart.sections[this.sectionId], 'text/html').querySelector('.shopify-section');
		const elReplace = section.querySelector(`.js-cart-line[data-index="${index}"]`);


		if(qty > 0 && elReplace){
			elReplace.querySelectorAll('.js-item-content')?.forEach(i=>{
				const newItem = this.querySelector(`.js-cart-line[data-index="${index}"] [class="${i.className}"]`);

				if(newItem)
					newItem.innerHTML = i.innerHTML;
			})
		}
		else{
			if (theme.routes.pageType == 'cart' && cart.item_count == 0)
				location.reload();
			else
				this.querySelector(`form`).innerHTML = section.querySelector(`form[class="${this.querySelector(`form`).className}"]`).innerHTML;
		}

		this.removeEvents();
		this.addEvents();
	}

	fetch(){
		themeCart.getSections().then(e=>e.json()).then(sections=>{
			this.updateForm({sections: sections})
		})
	}

	getURL(e){
		return e.target?.dataset.url || location.pathname;
	}
}
customElements.define('cart-items', cartItems);