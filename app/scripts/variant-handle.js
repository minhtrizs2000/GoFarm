class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange);
  }


  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.resetQtyInput();
    this.toggleAddButton(true, "", false);
    //this.updatePickupAvailability();
    //this.removeErrorMessage();

    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      //this.updateShareUrl();
    }
  }

  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value
    );
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  resetQtyInput(){
    const qty = document.querySelector("quantity-input .quantity__input");
    qty.value = 1;
  }


  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === "false") return;
    window.history.replaceState(
      {},
      "",
      `${this.dataset.url}?variant=${this.currentVariant.id}`
    );
  }

  updateShareUrl() {
    const shareButton = document.getElementById(
      `Share-${this.dataset.section}`
    );
    if (!shareButton || !shareButton.updateUrl) return;
    shareButton.updateUrl(
      `${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`
    );
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }

  removeErrorMessage() {
    const section = this.closest("section");
    if (!section) return;

    const productForm = section.querySelector("product-form");
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${
        this.dataset.originalSection
          ? this.dataset.originalSection
          : this.dataset.section
      }`
    )
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const price_destination = document.getElementById(
          `price-${this.dataset.section}`
        );
        const price_source = html.getElementById(
          `price-${
            this.dataset.originalSection
              ? this.dataset.originalSection
              : this.dataset.section
          }`
        );
        const title_destination = document.getElementById(
          `title-${this.dataset.section}`
        );
        const title_source = html.getElementById(
          `title-${
            this.dataset.originalSection
              ? this.dataset.originalSection
              : this.dataset.section
          }`
        );
        const sku_destination = document.getElementById(
          `sku-${this.dataset.section}`
        );
        const sku_source = html.getElementById(
          `sku-${
            this.dataset.originalSection
              ? this.dataset.originalSection
              : this.dataset.section
          }`
        );
        const stock_destination = document.getElementById(
          `stock-${this.dataset.section}`
        );
        const stock_source = html.getElementById(
          `stock-${
            this.dataset.originalSection
              ? this.dataset.originalSection
              : this.dataset.section
          }`
        );
        
        if (price_source && price_destination) price_destination.innerHTML = price_source.innerHTML;
        if (title_source && title_destination) title_destination.innerText = title_source.innerText;
        if (sku_source && sku_destination) sku_destination.innerText = sku_source.innerText;
        if (stock_source && stock_destination) stock_destination.innerText = stock_source.innerText;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove("visibility-hidden");
        this.toggleAddButton(!this.currentVariant.available, 'Sold out');
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] .product-form__submit-text');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("disabled", "disabled");
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute("disabled");
      addButtonText.textContent = 'Add to cart';
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-${this.dataset.section}`
    );
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] .product-form__submit-text');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = 'Unavailable';
    if (price) price.classList.add("visibility-hidden");
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define("variant-selects", VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }
}

customElements.define("variant-radios", VariantRadios);
