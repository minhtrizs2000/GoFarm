(() => {
  // app/scripts/product-form-handle.js
  if (!customElements.get("product-form")) {
    customElements.define("product-form", class ProductForm extends HTMLElement {
      constructor() {
        super();
        this.form = this.querySelector("form");
        this.form.querySelector("[name=id]").disabled = false;
        this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
        this.submitButton = this.querySelector('[type="submit"]');
      }
      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute("aria-disabled") === "true")
          return;
        this.handleErrorMessage();
        this.submitButton.setAttribute("aria-disabled", true);
        this.submitButton.classList.add("loading");
        this.querySelector(".loading-overlay__spinner").classList.remove("hidden");
        const formData = new FormData(this.form);
        const config = {
          method: "POST",
          body: formData
        };
        fetch(window.Shopify.routes.root + "cart/add.js", config).then((response) => response.json()).then((response) => {
          if (response.status) {
            this.handleErrorMessage(response.description);
            const soldOutMessage = this.submitButton.querySelector(".sold-out-message");
            if (!soldOutMessage)
              return;
            this.submitButton.setAttribute("aria-disabled", true);
            this.submitButton.querySelector("span").classList.add("hidden");
            soldOutMessage.classList.remove("hidden");
            this.error = true;
            return;
          }
          this.error = false;
        }).catch((e) => {
          console.error(e);
        }).finally(() => {
          this.submitButton.classList.remove("loading");
          if (!this.error)
            this.submitButton.removeAttribute("aria-disabled");
          this.querySelector(".loading-overlay__spinner").classList.add("hidden");
        });
      }
      handleErrorMessage(errorMessage = false) {
        this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector(".product-form__error-message-wrapper");
        if (!this.errorMessageWrapper)
          return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector(".product-form__error-message");
        this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);
        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    });
  }
})();
