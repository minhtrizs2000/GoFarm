class NavigationMobile extends HTMLElement{
	constructor(){
		super();
		this.disableLink = JSON.parse(document.querySelector(`[data-disable-link]`)?.dataset.disableLink || 'false');

		this.template = document.querySelector('[data-section-type="mega-menu"]');
		if(this.template){

			this.designMode = this.template.tagName != 'TEMPLATE';

			this.arrayMega = [];
			document.querySelectorAll('[data-section-type="mega-menu"]')?.forEach(item=>{
				const template = (this.designMode ? item : item.content);
				template.querySelectorAll(`[data-layer]`)?.forEach(i=>{
					this.arrayMega.push(i);
					i.remove();
				});

			})
			this.getMegaMenu();
			this.setIndex();
		}

		this.querySelectorAll('a[data-layer-id]')?.forEach(i=>{
			i.addEventListener('click', this.callLayer.bind(this));
		})

		this.querySelectorAll('.js-nav-back')?.forEach(i=>{
			i.addEventListener('click', this.closeLayer.bind(this));
		})
	}

	callLayer(event){
		const element = event.target;
		const layerID = element.closest('[data-layer-id]').dataset.layerId;
		const layer = this.querySelector(`[data-layer="${layerID}"]`);
		const currentLayer = element.closest('.mobile-navigation-layer');

		if(this.disableLink || element.closest('.expand')){
			event.preventDefault();
		}
		else{
			return;
		}

		if(!layer) return;

		layer.closest('.mobile-navigation-layer').classList.add('active');
		// currentLayer.className.includes('main-layer') && setTimeout(()=>{currentLayer.classList.remove('active');}, 300)
	}

	closeLayer(event){
		const element = event.target;
		const currentLayer = element.closest('[data-layer]');
		const layerID = currentLayer.dataset.layer;
		const layer = this.querySelector(`[data-layer-id="${layerID}"]`)?.closest('[data-layer]') || this.querySelector('.main-layer');

		// layer.classList.add('active');
		setTimeout(()=>{currentLayer.classList.remove('active');}, 200)
	}

	getMegaMenu(){
		this.arrayMega.forEach(mega=>{

			const id = mega.dataset.layer;
			const currentLayer = this.querySelector(`[data-layer="${id}"]`);
			const nodeCallLayer = this.querySelector(`[data-layer-id="${id}"]`);

			currentLayer && currentLayer.remove();

			this.querySelector(`a[data-layer-id="${id}"]`)?.closest('li')?.classList.add('has-sub-layer');

			if(nodeCallLayer?.closest('.list-item-vertical')){
				nodeCallLayer.closest('ul').insertAdjacentHTML('beforebegin', mega.querySelector('ul').outerHTML);
				nodeCallLayer.closest('.list-item-vertical').remove();
			}
			else{
				this.querySelector(this.dataset.layerList).insertAdjacentHTML('beforeend', mega.outerHTML);
			}
		})

		this.arrayMega.length = 0;
	}

	setIndex(){
		this.querySelectorAll('.mobile-navigation-layer')?.forEach(layer=>{
			layer.querySelectorAll('.js-nav-counter')?.forEach((item, index)=>{
				item.classList.add('animation-fade-index-'+index)
			})
		})
	}
}
customElements.define('mobile-navigation', NavigationMobile);

class footerNavigation extends HTMLElement {
  constructor() {
    super();
    this.container = this.closest('footer');

    if(!this.container.querySelector('#footerMenu')) return;

    Array.from(this.container.querySelector('#footerMenu').content.children).forEach(i=>{
      this.insertAdjacentHTML('beforeend', i.outerHTML);
    })
    this.container.querySelector('#footerMenu').remove();
  }
}

customElements.define('footer-mobile-navigation', footerNavigation);

function loadMenuMobile(){
	const element = document.querySelector('#mobileNavigation');
	const isMobile = window.matchMedia('(max-width: 1000px)').matches;

	if(isMobile && element.tagName == 'TEMPLATE'){
		element.replaceWith(element.content.firstElementChild);
		window.removeEventListener('resize', loadMenuMobile);
	}
}

window.addEventListener('resize', loadMenuMobile);
loadMenuMobile();