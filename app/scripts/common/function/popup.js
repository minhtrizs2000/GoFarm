class Popup{
	constructor(container){
		this.container = container;
		this.dataControl = this.container.dataset.control;
		this.bodyClass = ['popup-show', 'overflow-hidden'];

		this.elems = {
			close: this.container.querySelectorAll('.js-popup-close')
		}

		this.eventListener();
	}

	toggle(bool){
		this.container.classList.toggle('active', bool);
		
		if(bool)
			document.body.classList.add(...this.bodyClass);
		else
			document.body.classList.remove(...this.bodyClass);

		document.querySelectorAll(`.js-popup-toggle[data-control="${this.dataControl}"]`)?.forEach(el=>el.classList.toggle('active', bool));
	}

	eventListener(){
		this.elems.close?.forEach(item=>{
			item.addEventListener('click', e=>{
				e.preventDefault();
				this.toggle(false);
			});
		})
	}
}

export default Popup;