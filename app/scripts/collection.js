import "./common/theme-section";
//import noUiSlider from "nouislider";

register("collection", {
  onLoad: function () {
    var viewmode_cols = this.container.querySelectorAll(".collection-viewmode__column");
    var card_wrappers = this.container.querySelectorAll(".card-wrapper");
    var row = this.container.querySelector("#collection-content .row");

    viewmode_cols.forEach(function(col){
      col.addEventListener('click', function(){
        if (!this.classList.contains('active')) {
          this.parentElement.querySelector(".active").classList.remove("active");
          this.classList.add("active");
          var col = parseInt(this.dataset.col);
         
          card_wrappers.forEach(function(item){
            switch (col) {
              case 1:
                item.classList.replace(item.classList[1], 'col-12');
                break;
              case 2:
                item.classList.replace(item.classList[1], 'col-6');
                break;
              case 3:
                item.classList.replace(item.classList[1], 'col-4');
                break;
              case 5:
                item.classList.replace(item.classList[1], 'col');
                row.classList.add('row-cols-5');
                break;
              default:
                break;
            }
          })
        }
      });
    })
    
  },
});

load("*");
