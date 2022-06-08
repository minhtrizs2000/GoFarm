import Newsletter from '../function/newsletter';

const Cookie = {
  get: async (key) => {

    const data = await theme.localforage().getItem(key);

    if(!data)
      return data;

    const { expire, value } = data;

    if(expire < Date.now()){
      theme.localforage().removeItem(key);
      return null;
    }

    return value;

  },

  set: (key, value, expire = false, callback = false) => {
    if(expire && typeof expire === 'number')
      expire = Math.round(expire*1000*60*60 + Date.now());

    return theme.localforage().setItem(key, { value, expire }, expire && callback);

  }
}


export default NewsletterSection = {
  onLoad: async function(){
    const script = this.container.querySelector('script');

    if(script){
      this.config = JSON.parse(script.innerHTML);

      if(location.hash.includes(this.id)){
        this.callRequest();
        return;
      }

      const newsletterCookie = await Cookie.get('newsletterPopup');
      if(this.config.homepage && theme.routes.pageType != 'index' || newsletterCookie) return;

      const trigger = this.config.popupTrigger;


      switch (trigger) {
        case 'delay':
          this.delayTrigger();
          break;
        case 'exit-intent':
          this.exitTrigger();
          break;
        case 'scroll':
          this.scrollTrigger();
          break;
        default:
          break;
      }
    }
    else{
      this.initSection();
    }
  }
  ,initSection: function(){

    if(this.container.querySelector('form')){
      this.newsletter = new Newsletter(this.container.querySelector('form'));
    }

    if(this.container.querySelector('.js-popup')){
      this.popup = theme.Popup(this.container.querySelector('.js-popup'));
    }
  }
  ,onUnload: function(){
    this.popup?.toggle(false);
  }
  ,onSelect: function(){
    this.popup?.toggle(true);
  }
  ,onDeselect: function(){
    this.popup?.toggle(false);
  }
  ,delayTrigger: function(){
    theme.debounce(()=>{
      this.callRequest();
    }, this.config.delayTime * 1000)();
  }
  ,exitTrigger: function(){

    const exitFunction = e=>{
      if(e.toElement || e.relatedTarget) return;

      this.callRequest();
      document.removeEventListener('mouseout', exitFunction);
    }

    document.addEventListener('mouseout', exitFunction);
  }
  ,scrollTrigger: function(){

    const scrollFunction = theme.debounce((e)=>{
      if(window.scrollY >= this.config.scrollPosition){
        this.callRequest();
        window.removeEventListener('scroll', scrollFunction, {passive: true})
      }
    }, 300)

    window.addEventListener('scroll', scrollFunction, {passive: true})
  }

  ,callRequest: function(){
    const href = location.pathname + location.search;
    let url = href + (href.includes('?') ? '&' : '?') + 'section_id=' + this.config.section;

    fetch(url).then(e=>e.text()).then(html=>{
      let div = document.createElement('div');
      div.innerHTML = html;
      this.container.innerHTML = div.querySelector('.shopify-section').innerHTML;

      this.initSection();

      setTimeout(()=>{
        this.popup?.toggle(true);
      }, 700)

      Cookie.set('newsletterPopup', true, this.config.expires);
    })
  }
};