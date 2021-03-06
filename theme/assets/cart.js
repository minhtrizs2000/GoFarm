(() => {
  // app/scripts/cart.js
  var btn_minus_list = document.querySelectorAll(".cart-item__quantity .button-minus");
  var btn_plus_list = document.querySelectorAll(".cart-item__quantity .button-plus");
  var quantity_list = document.querySelectorAll(".cart-item__quantity .product-qty");
  var cart_counter = document.querySelector(".cart-heading__counter");
  var final_price = document.querySelectorAll(".cart-item__final-price");
  var compare_price = document.querySelectorAll(".cart-item__compare-price");
  var subtotal_price = document.querySelectorAll(".cart-item__subtotal-price");
  var subtotal_compare_price = document.querySelectorAll(".cart-item__subtotal-compare");
  var remove_icon = document.querySelectorAll(".cart-wrapper .remove-icon");
  var cart_subtotal = document.querySelector(".cart-total .list__subtotal-value");
  var cart_total = document.querySelector(".cart-total .list__total-value");
  btn_minus_list.forEach(function(btn_minus, index) {
    btn_minus.addEventListener("click", function() {
      const parent_element = this.parentElement;
      var qty = parseInt(quantity_list[index].value);
      var new_qty = qty - 1;
      if (new_qty >= 0) {
        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          dataType: "json",
          data: {
            "id": parent_element.dataset.key,
            "quantity": new_qty
          },
          success: function(res) {
            updateCartPage(res, index, new_qty);
          },
          error: function(e) {
            console.log(e);
          }
        });
      }
    });
  });
  btn_plus_list.forEach(function(btn_plus, index) {
    btn_plus.addEventListener("click", function() {
      const parent_element = this.parentElement;
      var qty = parseInt(quantity_list[index].value);
      var new_qty = qty + 1;
      $.ajax({
        type: "POST",
        url: "/cart/change.js",
        dataType: "json",
        data: {
          "id": parent_element.dataset.key,
          "quantity": new_qty
        },
        success: function(res) {
          updateCartPage(res, index, new_qty);
        },
        error: function(e) {
          console.log(e);
        }
      });
    });
  });
  remove_icon.forEach((icon) => {
    icon.addEventListener("click", function(e) {
      var index = this.dataset.index;
      var id = this.dataset.id;
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: "/cart/change.js",
        dataType: "json",
        data: {
          "id": id,
          "quantity": 0
        },
        success: function(res) {
          $(".cart-wrapper").find(`tbody tr:nth-child(${index})`).remove();
          cart_subtotal.innerText = "$" + res.items_subtotal_price / 100;
          cart_total.innerText = "$" + res.total_price / 100;
          $(".cart-wrapper .cart-heading__counter").text(`(${res.item_count})`);
        },
        error: function(e2) {
          console.log(e2);
        }
      });
    });
  });
  function updateCartPage(res, index, new_qty) {
    quantity_list[index].value = new_qty;
    cart_counter.innerText = `(${res.item_count})`;
    subtotal_price[index].innerText = "$" + final_price[index].innerText.slice(1) * new_qty;
    subtotal_compare_price[index].innerText = "$" + compare_price[index].innerText.slice(1) * new_qty;
    cart_subtotal.innerText = "$" + res.items_subtotal_price / 100;
    cart_total.innerText = "$" + res.total_price / 100;
  }
})();
