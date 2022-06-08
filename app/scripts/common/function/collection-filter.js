import './price-range';

class collectionFilter extends HTMLElement {
  constructor() {
    super();
    this.cache = [];
    this.container = this.closest('[data-section-type]');
    this.filterType = this.dataset.type;
    this.andLogic = JSON.parse(this.dataset.andLogic || 'false');
    this.form = this.querySelector('form');

    this.init();
  }

  init(){
    this.container.querySelectorAll('input.js-filter')?.forEach(input=>{
      input.addEventListener('change', e=>{
        let timeout = 100;

        input.type == 'range' && (timeout = 300);

        if(this.waiting != null)
          clearTimeout(this.waiting);

        this.waiting = setTimeout(()=>{

          !this.andLogic && this.container.querySelectorAll(`input.js-filter[name="${input.name}"]`)?.forEach(i=>i.id != input.id && (i.removeAttribute('checked'), i.checked = false));
          this.updateSort(input);
          this.fetch();
          this.waiting = null;
        }, timeout)
      })
    })

    this.container.querySelector('.js-select-sort')?.addEventListener('change', e=>{
      const input = this.container.querySelector(`input[value="${e.target.value}"]`);
      input.checked = true;
      input?.dispatchEvent(new Event('change'));
    })

    this.container.dataset.filterStyle == 'sidebar' &&
    !this.container.querySelector('price-range-slider')?.sliderCreated &&
    this.container.querySelector('price-range-slider')?.initSlider();
  }

  updateSort(e){
    if(!e.closest('.js-collection-sort')) return;

    this.container.querySelectorAll('.js-sort-label')?.forEach(i=>{
      i.innerHTML = e.tagName == 'INPUT' ? e.nextElementSibling.textContent.trim() : e.value;
    })
  }

  getQueryString(){
    const formData = new FormData(this.form);
    const query = new URLSearchParams(formData).toString();

    if(this.filterType == 'attribute')
      return query;

    const arrayFilter = [];
    let sort = '';

    query.split('&').map(i=>{
      !i.includes('sort_by=') ? arrayFilter.push(i.split('=')[1]) : (sort = i);
    });

    return arrayFilter.join('+') + (sort.length ? `?${sort}` : '');
  }

  fetch(){

    const query = this.getQueryString();
    const findInCache = this.cache.find(i=>i.query == query);
    if (findInCache){
      const div = document.createElement('div');
      div.innerHTML = findInCache.html;
      this.render(div, findInCache.query);
      div.remove();
      return;
    }

    let url = this.form.action;
    url += this.filterType == 'attribute' ? '?':'/';
    url += query;
    url += (this.filterType == 'attribute' || query.includes('?')) ? '&':'?';
    url += `section_id=${this.container.dataset.sectionId}`;

    fetch(url).then(e=>e.text()).then(html=>{
      const div = document.createElement('div');
      div.innerHTML = html;
      this.cache.push({
        query: query,
        html: html
      })
      this.render(div, query);
      div.remove();
    })
  }

  render(result, searchParams = null){
    document.querySelectorAll('.js-filter-facet')?.forEach((item, index)=>{
      const id = item.dataset.filterIndex ? `[data-filter-index="${item.dataset.filterIndex}"]` : item.id ? `[id="${item.id}"]` : `[class="${item.className}"]`;
      const target = result.querySelector(id);

      if(item.tagName == 'INPUT'){
        if(item.type == 'radio' || item.type == 'checkbox'){
          target?.hasAttribute('checked') ? item.setAttribute('checked', '') : item.removeAttribute('checked');
        }
        else{
          item.value = target?.value || '';
        }
      }
      else if(item.tagName == 'SELECT'){
        item.value = target?.value || '';
      }
      else{
        item.innerHTML = target?.innerHTML;
      }
    })

    if(searchParams){
      let splitCharacter = this.filterType == 'attribute' ? '?' : (!searchParams.includes('?') || (searchParams.includes('?') && searchParams.split('?')[0].length)) ? '/' : '';
      history.pushState({ searchParams }, '', `${this.form.action}${searchParams && splitCharacter.concat(searchParams)}`);
    }
  }

  toggle(){
    if(this.closest('#sidebar')){
      this.closest('#sidebar').classList.toggle('active');
      document.body.classList.toggle('sidebar-opened');
      return;
    }
    this.classList.toggle('active');
    this.style.setProperty('max-height', (this.classList.contains('active') ? this.scrollHeight : 0) + 'px');

    this.container.dataset.filterStyle == 'dropdown' &&
    !this.container.querySelector('price-range-slider')?.sliderCreated &&
    this.container.querySelector('price-range-slider')?.initSlider();
  }
}

customElements.define('collection-filter', collectionFilter);