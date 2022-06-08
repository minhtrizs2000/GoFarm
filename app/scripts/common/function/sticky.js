class StickyHeader extends HTMLElement {
  constructor() {
    super();

    const stickyDirection = this.dataset.sticky || 'down';
    stickyDirection == 'up' && this.closest('header').setAttribute('data-sticky', 'up');
    this.removeAttribute('data-sticky1');
  }

  connectedCallback() {
    this.header = document.querySelector('header');
    this.headerBounds = {};
    this.currentScrollTop = this.header.getBoundingClientRect().bottom || 0;

    this.onScrollHandler = this.onScroll.bind(this);

    window.addEventListener('scroll', this.onScrollHandler, false);

    this.createObserver();
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScrollHandler);
  }

  createObserver() {
    let observer = new IntersectionObserver((entries, observer) => {
      this.headerBounds = entries[0].intersectionRect;
      observer.disconnect();
    });

    observer.observe(this.header);
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.currentScrollTop && scrollTop > this.headerBounds.bottom) {
      requestAnimationFrame(this.hide.bind(this));

    } else if (scrollTop < this.currentScrollTop && scrollTop > this.headerBounds.bottom) {

      if (!this.preventReveal) {
        requestAnimationFrame(this.reveal.bind(this));
      } else {
        window.clearTimeout(this.isScrolling);

        this.isScrolling = setTimeout(() => {
          this.preventReveal = false;
        }, 66);

        requestAnimationFrame(this.hide.bind(this));
      }
    } else if (scrollTop <= this.headerBounds.top) {
      requestAnimationFrame(this.reset.bind(this));
    }


    this.currentScrollTop = scrollTop;
  }

  hide() {
    this.header.classList.add('header-sticky', 'is-scrolling-down');
    this.header.classList.remove('is-scrolling-up');
    this.closeMenuDisclosure();
    this.closeSearchModal();
  }

  reveal() {
    this.header.classList.add('header-sticky', 'is-scrolling-up');
    this.header.classList.remove('is-scrolling-down');
  }

  reset() {
    this.header.classList.remove('header-sticky', 'is-scrolling-up');
  }

  closeMenuDisclosure() {
    this.disclosures = this.disclosures || this.header.querySelectorAll('details-disclosure');
    this.disclosures?.forEach(disclosure => disclosure.close());
  }

  closeSearchModal() {
    this.searchModal = this.searchModal || this.header.querySelector('details-modal');
    this.searchModal?.close(false);
  }
}

customElements.define('sticky-header', StickyHeader);