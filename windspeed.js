// import { mapboxgl } from "mapboxgl";
// import { sampleFill, source } from "./libs/windgl/src";
import * as windGL from "./libs/windgl/dist/windgl.esm";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2F0YW1hcmFuaTQiLCJhIjoiY2ppNDdtenh5MDFkYTN2b2VjOG5ucmIybCJ9.AG0bncC30hHPHVRnVGeCxQ";

const windSource = windGL.source(
  "./libs/windgl/docs/wind/2019031012/tile.json"
);
console.log(windSource);

const map = new mapboxgl.Map({
  container: "mapbox_map",
  center: [113.5, 39.5],
  zoom: 8,
  style: "mapbox://styles/mapbox/satellite-v9",
  maxBounds: [
    [-180, -90], // Southwest coordinates
    [180, 90], // Northeast coordinates
  ],
});

map.on("load", () => {
  const layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style.
  let firstSymbolId;
  for (const layer of layers) {
    if (layer.type === "symbol") {
      firstSymbolId = layer.id;
      console.log(firstSymbolId);
      break;
    }
  }

  map.addSource("test", {
    type: "geojson",
    data: "https://docs.mapbox.com/mapbox-gl-js/assets/ne_50m_urban_areas.geojson",
  });

  map.addLayer(
    windGL.sampleFill(
      {
        id: "windbackground", // required
        source: windSource, // required
        "sample-fill-opacity": 0.1, // optional
      },
      firstSymbolId
    )
  );
});

// console.log(map);
