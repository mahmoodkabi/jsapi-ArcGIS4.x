# How to use this repo?
* Create a *.html page
* add map_v1.js refrence to your *.html page
* also add the flowing references to your page
  * <link href="https://js.arcgis.com/4.24/esri/themes/light/main.css">
  * <script src="https://js.arcgis.com/4.24/"></script>
  * <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
* Use the javascript function written in map_v1.js
* You can find the usage method in the Sample1.html file.

# The nameس of function in map_v1.js are
* 1. **loadMap** function loading wms service.
* 2. **mapClick** function return x and y coordinates.
* 3. **measurementTools** function add measurement box to map.
* 4. **getInfoClick** function return attributes of the point, polygon, or polyline clicked.
* 5. **changeBaseMap** function change the base map.
* 6. **geoLocation** function sets current location on the map.
* 7. **showOnMap** function search on wms service and point on the map.
* 8. **getAllSubLayers** function return all layers of wms service.
* 9. **populateAttributesTable** function return all attributes of selected layer.
* 10. **goToXY** function sets location to specified X and Y.
* 11. **clearMap** function clears all graphics on the map.
