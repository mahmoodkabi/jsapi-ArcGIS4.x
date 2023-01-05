# How to use this repo?
* Create a *.html page
* add map_v1.js refrence to your *.html page
* also add the flowing references to your page
  *-- <link href="https://js.arcgis.com/4.24/esri/themes/light/main.css">
  * <script src="https://js.arcgis.com/4.24/"></script>
  * <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
* Use the javascript function written in map_v1.js
* You can find the usage method in the Sample1.html file.

# The nameس of function in map_v1.js are
* **loadMap** function loading wms service.
* **mapClick** function return x and y coordinates.
* **measurementTools** function add measurement box to map.
* **getInfoClick** function return attributes of the point, polygon, or polyline clicked.
* **changeBaseMap** function change the base map.
* **geoLocation** function sets current location on the map.
* **showOnMap** function search on wms service and point on the map.
* **getAllSubLayers** function return all layers of wms service.
* **populateAttributesTable** function return all attributes of selected layer.
* **goToXY** function sets location to specified X and Y.
* **clearMap** function clears all graphics on the map.
