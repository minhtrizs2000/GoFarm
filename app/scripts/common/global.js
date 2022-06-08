import "./function/quantity";
import "./events";

const theme = window.theme;

document.addEventListener('keyup', e=>{
	e.key == `Escape` && document.querySelectorAll('details[open]')?.forEach(item=>item.removeAttribute('open'));
})

theme.addEvent('click', '.js-popup-toggle', e=>{
	e.preventDefault();
	e.stopPropagation();

	const node = e.target.closest('.js-popup-toggle');
	const bodyClass = ['popup-show', 'overflow-hidden'];

	if(node.classList.contains('js-tload')) return;

	const popup = document.querySelector(`.js-popup[data-control="${node.dataset.control}"]`);
	if(!popup) return;

	node.classList.toggle('active');
	popup.classList.toggle('active');

	if(popup.classList.contains('active'))
		document.body.classList.add(...bodyClass);
	else
		document.body.classList.remove(...bodyClass);
})


theme.addEvent('click', '.js-tload', e=>{
	const node = e.target.closest('.js-tload');
	const target = document.querySelector(node.dataset.tload);

	e.preventDefault();

	if(target){
		Array.from(target.content.children)?.forEach(child=>{
			target.insertAdjacentElement('beforebegin', child);
		})
		target.remove();
	}

	node.classList.remove('js-tload');

	if(node.classList.contains('js-popup-toggle')){
		setTimeout(()=>{node.click()}, 300)
	};
})
theme.addEvent('click', '.js-popup-close', e=>{
	e.preventDefault();
	const node = e.target;
	const bodyClass = ['popup-show', 'overflow-hidden'];
	const popup = node.closest('.js-popup');

	if(!popup) return;

	popup.classList.remove('active');
	document.body.classList.remove(...bodyClass);

	document.querySelectorAll(`.js-popup-toggle[data-control="${popup.dataset.control}"]`)?.forEach(el=>el.classList.remove('active'));

})

theme.addEvent('click', '.js-close-details', e=>{
	const details = e.target.closest('details');

	details.removeAttribute('open');
})

theme.addEvent('click', '.js-social-share-toggle', e=>{
	const socialList = e.target.previousElementSibling;
	socialList?.classList.toggle('active');
})
theme.addEvent('click', 'details', e=>{
	const this4 = e.target.closest('details');
	document.querySelectorAll('details[open]')?.forEach(item=>item != this4 && item.removeAttribute('open'));

	if(!this4.dataset.class) return;

	const className = 'open-'+this4.dataset.class;

	if(( this4.hasAttribute('open') && e.target.closest('summary')) || e.target.closest('.js-close-details')){
		document.body.classList.remove(className);
		return;
	}
	document.body.classList.add(className);

	theme.debounce(()=>{this4.querySelector('input[autofocus]')?.focus();}, 500)();
})

theme.addEvent('click', 'body', e=>{
	if(e.target.closest('details')) return;
	document.querySelectorAll('details[open]:not([data-class])')?.forEach(item=>item.removeAttribute('open'));
})

document.documentElement.style.setProperty('--scrollbar-width', theme.scrollBarWidth() + 'px');
window.addEventListener('resize', ()=>{
	document.documentElement.style.setProperty('--scrollbar-width', theme.scrollBarWidth() + 'px');
})
