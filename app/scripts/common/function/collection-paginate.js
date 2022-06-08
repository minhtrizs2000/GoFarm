export default class collectionPaginate{
  constructor(element) {
    this.el = element;
    this.container = this.el.closest('[data-section-id]');
    this.el.querySelectorAll('.js-paginate')?.forEach(i=>{
      i.addEventListener('click', e=>{
        this.change(i);
      });
    })
  }

  change(button){
    this.el.querySelectorAll('.js-paginate.active')?.forEach(i=>i.classList.remove('active'));
    button.classList.add('active');
    let value = button.textContent.trim();
    this.el.querySelector('.js-collection-paginate-value').innerHTML = value;
    this.setAttribute(value);
  }

  setAttribute(value){
    if(this.isPosting != null)
      clearTimeout(this.isPosting);

    const attributes = {collectionPaginate: value};

    this.isPosting = fetch(`${theme.routes.cartUpdate}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;'
      },
      body: JSON.stringify({
          attributes: attributes,
          sections: [this.container.dataset.sectionId],
          sections_url: this.el.dataset.base + location.href.split(this.el.dataset.base)[1]
        })
    })
    .then(e=>{
      e.json().then(e=>{
        this.isPosting = null;
        let div = document.createElement('div');
        div.innerHTML = e.sections[this.container.dataset.sectionId];
        this.render(div);
        div.remove();
      })
    })
    .catch(e=>{
      this.isPosting = null;
    })
  }

  render(div){
    document.getElementById('mainProducts').innerHTML = div.querySelector('#mainProducts').innerHTML;
  }
}
