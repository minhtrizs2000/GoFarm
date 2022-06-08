export default class Cart{
	constructor(){
		this.sectionsArray = ['cart-live-region-text', 'cart-section-item'];
		this.popSection = 'cart-popup-error'; 

		if(theme.settings.cartStyle != 'cart_page' && theme.settings.cartStyle != 'cart_page'){
			this.attachEvents();
		}
	}

	attachEvents(){
		this.sectionsArray.push('cart-section');

		document.body.addEventListener('keydown', e=>{
			if(e.key == "Escape" && document.querySelector('header .js-mini-cart.active')){
				document.querySelector('header .js-mini-cart').classList.remove('active');
			}
		})

		if(theme.settings.cartStyle == 'dropdown'){
			theme.addEvent('click', 'body', e=>{
				const target = e.target;

				if(target.closest('header') && target.closest('.js-mini-cart')){
					e.preventDefault();
					e.target.closest('.js-mini-cart').classList.toggle('active');
				}
				else if(document.querySelector('header .js-mini-cart.active') && !target.closest('cart-items')){
					document.querySelector('header .js-mini-cart').classList.remove('active');
				}
			})
		}

	}

	setDefault(body = {}){

		body.sections = (body?.sections || []).concat(this.sectionsArray);
		body.sections_url = body?.sections_url || location.pathname;

		return JSON.stringify(body);
	}

	getSections(){
		const body = JSON.parse(this.setDefault());
		return fetch(`${location.pathname}?sections=${body.sections.join(',')}`);
	}

	add(data){
		const body = this.setDefault(data);
		return fetch(`${theme.routes.cartAdd}`, {...theme.request(), ...{ body }})
	}

	change(data){
		const body = this.setDefault(data);
		return fetch(`${theme.routes.cartChange}`, {...theme.request(), ...{ body }})
	}

	success(cart){
		this.renderSections(cart.sections);
	}

	notify(msg){

		fetch(theme.routes.searchUrl + '?q=' + msg + '&section_id=' + this.popSection).then(e=>e.text()).then(html=>{
			const div = new DOMParser().parseFromString(html, 'text/html').querySelector('.shopify-section');

			Array.from(div.children).forEach(child=>{
				document.querySelector(`[class="${child.className}"]`)?.remove();

				document.body.insertAdjacentElement('beforeend', child);
				child.classList.contains('js-popup') && theme.Popup(child).toggle();
			})
		})
	}

	updateStatus(e){
		e.json().then(cart=>{
			if(e.status == 422){
				alert(cart.description);
				return;
			}
			this.renderSections(cart.sections);
		})
	}

	renderSections(sections){
		if(!sections) return;
		this.sections = sections;

		this.sectionsArray?.forEach(section=>{
			if(this.eventType == 'cartChange' && section == 'cart-section'){
				return;
			}

			if(sections[section]){
				const div = new DOMParser().parseFromString(sections[section], 'text/html').querySelector('.shopify-section');
				Array.from(div.children).forEach(child=>{

					if(child.classList.contains('product-card')){
						child = child.querySelector('cart-form')
						this.eventType == 'cartChange' && this.renderCardForm(child);
					}
					else if(child.classList.contains('js-cart-noti')){
						this.renderNotiPoup(child);
					}
					else{
						this.renderContent(child);
					}
				})

			}
		})
	}
	renderContent(selector){

		const c = selector.className;
		const content = selector.innerHTML;

		document.querySelectorAll(`[class*="${c}"]`)?.forEach(item=>{
			if(c.includes('js-cart-count'))
				item.setAttribute('data-cart-count', content);
			else{
				item.innerHTML = content
			}
		})
	}

	renderCardForm(selector){
		if(!selector) return;

		document.querySelectorAll(`[class*="${selector.className}"]`)?.forEach(item=>{
			item.closest('product-card')?.classList.toggle('showing', selector.closest('product-card')?.classList.contains('showing'));
			item.insertAdjacentElement('afterend', selector.cloneNode(true));
			item.remove();
		})
	}

	renderNotiPoup(selector){
		if(this.eventType != 'cartAdded') return;
		
		document.querySelectorAll(`[id="${selector.id}"]`)?.forEach(item=>item.remove());
		document.body.appendChild(selector);
		
		setTimeout(()=>{
			theme.Popup(selector).toggle(true);
		}, 300)
	}
}
