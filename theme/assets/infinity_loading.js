(() => {
  // app/scripts/infinity_loading.js
  var paginate = JSON.parse(document.querySelector("#data-paginate").innerText).data;
  var query_string = "";
  var pages = paginate.pages;
  var current = paginate.current_page;
  var counter = 0;
  window.addEventListener("scroll", function() {
    const card_wrapper = document.querySelector(".card-wrapper:last-child");
    if (window.scrollY > card_wrapper.offsetTop && pages > 1 && current < pages) {
      counter++;
      if (counter == 1) {
        if (window.location.search == "") {
          query_string = window.location.href + `?page=${current + 1}`;
        } else {
          query_string = window.location.href + `?page=${current + 1}`;
        }
        fetch(query_string).then((response) => response.text()).then((data) => {
          current++;
          counter = 0;
          let html_div = document.createElement("div");
          html_div.innerHTML = data;
          let html_dom = html_div.querySelector("#collection-content .row").innerHTML;
          document.querySelector("#collection-content .row").innerHTML = document.querySelector("#collection-content .row").innerHTML + html_dom;
        }).catch((error) => console.error("Error:", error)).finally(() => loading = false);
      }
    }
  });
})();
