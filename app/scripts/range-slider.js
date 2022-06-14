import noUiSlider from "nouislider";

function createRangeSlider(){
  var range_slider = document.querySelector(`.filter-group__price-range-slider`);
  var input_min_element = document.querySelector(
    ".filter-group__price-range-from input"
  );
  var input_max_element = document.querySelector(
    ".filter-group__price-range-to input"
  );
  var input_max_value = document
    .querySelector(".filter-group__price-range-to input")
    .getAttribute("max");
  
  var max_value = parseFloat(input_max_value);

  noUiSlider.create(range_slider, {
    start: [0, max_value],
    connect: true,
    step: 1,
    range: {
      min: 0,
      max: max_value,
    },
  });
  
  range_slider.noUiSlider.on("update", function (values, handle) {
    var value = values[handle];
  
    if (handle) {
      input_max_element.value = value;
    } else {
      input_min_element.value = value;
    }
  });

  range_slider.noUiSlider.on("change", function (values, handle) {
    if (handle) {
      const e = new Event("change");
      input_max_element.dispatchEvent(e);
    } else {
      const e = new Event("change");
      input_min_element.dispatchEvent(e);
    }
  });
  
  input_min_element.addEventListener("change", function () {
    range_slider.noUiSlider.set([this.value, null]);
  });
  
  input_max_element.addEventListener("change", function () {
    range_slider.noUiSlider.set([null, this.value]);
  });  
}

createRangeSlider();