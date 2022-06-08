import { Map } from "mapbox-gl";

class mapSection extends HTMLElement {
  constructor() {
    super();

    this.mapConfig = JSON.parse(this.querySelector("[data-map-config]").innerHTML);

    this.mapBoxOptions = {
      accessToken: this.mapConfig.accessToken,
      container: this.id,
      style: "mapbox://styles/mapbox/streets-v11",
      center: this.mapConfig.startPoint,
      zoom: this.mapConfig.zoom,
      styles: {
        "satellite-streets-v10": "mapbox://styles/mapbox/satellite-streets-v10",
        "streets-v11": "mapbox://styles/mapbox/streets-v11",
      }
    };

  }
  init(){
    this.map = new Map(this.mapBoxOptions);    
  }
}

customElements.define('map-section', mapSection);