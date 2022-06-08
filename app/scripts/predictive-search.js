class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.input = this.querySelector('[name=q]');
    this.searchQuery = JSON.parse(theme.serializeForm(this.form));
    this.searchQuery.view = 'suggest';
    this.searchQuery.section_id = 'main-search';

    this.searchRecommend = JSON.parse(this.querySelector('script[type*=json]')?.innerHTML || '[]');
    this.attachEvents()

  }


  attachEvents(){
    this.addEventListener('input', theme.debounce((event)=>{
      this.onChange(event);
    }, 300).bind(this))


    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
  }

  onChange(e){
  	const key = e.target.value.trim();

    if(!key.length){
      this.close();
      return;
    }
    this.classList.add('is-searching');
    const recommend = this.searchRecommend.length ? this.recommend(key) : '';
    this.getRequest(key, recommend);
  }


  open(){
    this.classList.add('show');
  }

  close(){
    this.classList.remove('show');
  }

  onFocus() {
    this.open();
  }

  onFocusOut() {
    setTimeout(()=>{
      if (!this.contains(document.activeElement)) this.close();
    })
  }

  onKeyup(event) {
    if(event.code == 'Escape') this.close();
  }

  getRequest(key, recommend){
    this.searchQuery.q = key;

    recommend.length && (this.searchQuery.recommend = recommend);

    const query = new URLSearchParams(this.searchQuery).toString();
    const url = this.form.action + '?' + query

    fetch(url).then(e=>e.text()).then(html=>{
      let div = document.createElement('div');
      div.innerHTML = html;

      this.querySelector('.js-search-result').innerHTML = div.querySelector('.shopify-section').innerHTML;

      this.querySelector('.js-search-result .js-search-submit')?.addEventListener('click', e=>{
        this.form.submit();
      });

      this.classList.remove('is-searching');      
      this.open();
    })
  }

  recommend(value){
    const arrayCounter = [];

    this.searchRecommend.every(string=>{
      let count = this.countOcurrences(string, value);
      count > 0 && arrayCounter.push({count: count, str: string});

      if(arrayCounter.length >= 5)
        return false;
      else
        return true;
    })

    if(!arrayCounter.length){
      return '';
    }

    arrayCounter.sort((a,b)=>{return b.count - a.count});

    return arrayCounter.map(i=>i.str).join(', ')
  }

  countOcurrences(str, value) {
    var regExp = new RegExp(value, "gi");
    return (str.match(regExp) || []).length;
  }
}

customElements.define('predictive-search', PredictiveSearch);
