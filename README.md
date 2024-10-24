# jsapi-ArcGIS4.x

The `map_v1.js` file helps developers use pre-built functions to display and interact with maps.

## How to use this repo?

* Create a `.html` page.
* Add a reference to `map_v1.js` in your `.html` page.
* Also, include the following references in your page:
  * `<link href="https://js.arcgis.com/4.24/esri/themes/light/main.css" rel="stylesheet" />`
  * `<script src="https://js.arcgis.com/4.24/"></script>`
  * `<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>`
* Use the JavaScript functions written in `map_v1.js`.
* For usage examples, refer to the **Sample1.html** file.

## Functions in `map_v1.js`

* **loadMap**: Loads a WMS service.
* **mapClick**: Returns X and Y coordinates of a map click.
* **measurementTools**: Adds a measurement tool to the map.
* **getInfoClick**: Retrieves attributes of a clicked point, polygon, or polyline.
* **changeBaseMap**: Switches the base map.
* **geoLocation**: Displays the current location on the map.
* **showOnMap**: Searches the WMS service and highlights the result on the map.
* **getAllSubLayers**: Returns all layers from the WMS service.
* **populateAttributesTable**: Returns all attributes of the selected layer.
* **goToXY**: Centers the map at specified X and Y coordinates.
* **clearMap**: Clears all graphics on the map.

