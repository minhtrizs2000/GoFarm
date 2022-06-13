import "./common/theme-section";
//import noUiSlider from "nouislider";

register("collection", {
  onLoad: function () {
    // var range_slider = this.container.querySelector(
    //   `#price-range-slider-${this.id}`
    // );
    // var input_min_element = this.container.querySelector(
    //   ".filter-group__price-range-from input"
    // );
    // var input_max_element = this.container.querySelector(
    //   ".filter-group__price-range-to input"
    // );
    // var input_max_value = this.container
    //   .querySelector(".filter-group__price-range-to input")
    //   .getAttribute("max");

    // var max_value = parseFloat(input_max_value);
    // var start_value = Math.floor(max_value / 4);
    // var end_value = Math.floor(max_value / 2 + start_value);
    // input_min_element.value = start_value;
    // input_max_element.value = end_value;

    // noUiSlider.create(range_slider, {
    //   start: [start_value, end_value],
    //   connect: true,
    //   step: 1,
    //   range: {
    //     min: 0,
    //     max: max_value,
    //   },
    // });

    // range_slider.noUiSlider.on("update", function (values, handle) {
    //   var value = values[handle];

    //   if (handle) {
    //     input_max_element.value = value;
    //   } else {
    //     input_min_element.value = value;
    //   }
    // });

    // input_min_element.addEventListener("change", function () {
    //   range_slider.noUiSlider.set([this.value, null]);
    // });

    // input_max_element.addEventListener("change", function () {
    //   range_slider.noUiSlider.set([null, this.value]);
    // });
  },
});

load("*");
