class infiniteLoading extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		if(!this.dataset.url.length) return;

		this.removeEvents();
		window.addEventListener('scroll', this.onScrollHandler.bind(this), false);
	}

	disconnectedCallback() {
		this.removeEvents();
	}

	removeEvents(remove){
		window.removeEventListener('scroll', this.onScrollHandler.bind(this), false);		
		remove && this.remove();		
	}

	onScrollHandler(){
		if(this.getBoundingClientRect().top < 1 || this.getBoundingClientRect().top > window.innerHeight || this.waiting) return;

		this.fetch();
	}

	fetch(){
		this.waiting = true;
		this.classList.add('loading');

		if(!this.dataset.url.length){
			this.disconnectedCallback();
			return;
		}

		var url = this.dataset.url;
		url += url.includes('?') ? '&' : '?';
		url += 'section_id=' + this.dataset.sectionId;

		fetch(url).then(e=>e.text()).then(html=>{
			const div = document.createElement('div');
			div.innerHTML = html;

			this.render(div);
			div.remove();
		})
	}

	render(newContent){
		Array.from(newContent.querySelector('.js-product-grid').children)?.forEach(item=>{
			document.querySelector('.js-product-grid').insertAdjacentElement('beforeend', item);
		})
		this.setAttribute('data-url', newContent.querySelector(this.tagName)?.dataset.url);

		this.waiting = false;
		this.classList.remove('loading');

		if(!this.dataset.url.length){
			this.removeEvents(true);
		}
	}
}

customElements.define('infinite-loading', infiniteLoading);