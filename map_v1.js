let map;
let layer;
let mapView;
let measurement;
let publicDivMap
//let identifyLayer;
let paramsIden;
let publicIdentify;
let publicUrlSearch;
let publicFn;
let publicPoint;
let publicGraphic;
let publicSpatialReference;
let wkid = 32639;
let publicOpenStreetMapLayer;
let defaultX = 51.65;
let defaultY = 32.64;
let defaultZoom = 12;
let publicEsriConfig; 
let apiKey = "AAPK6dfcfe07760346799cdda2a5dcd53f28o4F5FuXFQkyyoyiWhsiXfG9L8VlQf5AfG1AErUDWJTlFcCxfWJDPKDOCvbsdq3UU";
let publicLocate;


function loadMap(url, divMap, urlSearch, fn){
    require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/layers/MapImageLayer",
            "esri/widgets/Measurement", "esri/rest/identify", "esri/rest/support/IdentifyParameters", "esri/geometry/Point",
            "esri/Graphic", "esri/geometry/SpatialReference", "esri/layers/OpenStreetMapLayer", "esri/config",
            "esri/widgets/Locate"],
        function (config, Map, MapView, FeatureLayer, MapImageLayer, Measurement, identify, IdentifyParameters, Point, Graphic,
                  SpatialReference, OpenStreetMapLayer, esriConfig, Locate) {

            publicDivMap = divMap;
            publicUrlSearch = urlSearch;
            publicPoint = Point;
            publicGraphic = Graphic;
            publicSpatialReference = SpatialReference;
            publicOpenStreetMapLayer = OpenStreetMapLayer;
            publicEsriConfig = esriConfig;
            publicIdentify = identify;
            publicLocate = Locate;

	    
            esriConfig.apiKey = apiKey;

            var urls = url.split(",");

            map = new Map({
            });

            if(url.toUpperCase().includes("OSM"))
                map.basemap = "osm";
            

            if (url.trim() != "") {
                urls.forEach(function (entry) {
                    if(entry.toUpperCase().includes("MAPSERVER")){
                        layerbaseMapID = entry.toUpperCase().split('/');
                        layer = new MapImageLayer({
                            url : entry,
                            id: layerbaseMapID[layerbaseMapID.indexOf("MAPSERVER") - 1]
                        });

                        map.add(layer);
                    }
                });
            }


            mapView = new MapView({
                map: map,
                center: [defaultX, defaultY],
                zoom: defaultZoom,
                container: divMap
            });

            

            //----------------------------------------اندازه گیری-----------------------------------
            measurement = new Measurement();

            //------------------------------------------شناسایی----------------------------------

            mapView.when(function () {
        
                // Set the parameters for the identify
                paramsIden = new IdentifyParameters();
                paramsIden.tolerance = 5;
                paramsIden.layerIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
                paramsIden.layerOption = "all";
                paramsIden.width = mapView.width;
                paramsIden.height = mapView.height;
            });

            //--------------------------------------------------------------------------------------


            fn();
    })
}


function mapClick(fn){
    mapView.on("click", function(e){
        //alert("x:" + e.mapPoint.x + " y:" + e.mapPoint.y );

        fn("x:" + e.mapPoint.x + " y:" + e.mapPoint.y);
    });
}

function measurementTools(){
    let toolbarStr = '<div id="toolbarDiv" class="esri-component esri-widget"> '+
    '<button '+
      'id="distance" '+
      'class="esri-widget--button esri-interactive esri-icon-measure-line" '+
      'title="Distance Measurement Tool" '+
    '></button> '+
    '<button '+
      'id="area" '+
      'class="esri-widget--button esri-interactive esri-icon-measure-area" '+
      'title="Area Measurement Tool" '+
    '></button> '+
    '<button '+
      'id="clear" '+
      'class="esri-widget--button esri-interactive esri-icon-trash" '+
      'title="Clear Measurements" '+
    '></button> '+
  '</div>';

    $(toolbarStr).appendTo('body');
    
    let activeView = mapView;

    const distanceButton = $("#distance");
    const areaButton = $("#area");
    const clearButton = $("#clear");

    distanceButton.click(distanceMeasurement);
    areaButton.click(areaMeasurement);
    clearButton.click(clearMeasurements);

    activeView.set({
        container: publicDivMap
    });
    // Add the appropriate measurement UI to the bottom-right when activated
    activeView.ui.add(measurement, "bottom-right");
    // Set the views for the widgets
    measurement.view = activeView;

    // Call the appropriate DistanceMeasurement2D or DirectLineMeasurement3D
    function distanceMeasurement() {
        const type = activeView.type;
        measurement.activeTool =
            type.toUpperCase() === "2D" ? "distance" : "direct-line";
        //distanceButton.classList.add("active");
        //areaButton.classList.remove("active");
    }
  
    // Call the appropriate AreaMeasurement2D or AreaMeasurement3D
    function areaMeasurement() {
        measurement.activeTool = "area";
        //distanceButton.classList.remove("active");
        //areaButton.classList.add("active");
    }

    // Clears all measurements
    function clearMeasurements() {
        //distanceButton.classList.remove("active");
        //areaButton.classList.remove("active");
        measurement.clear();
    }
}

function getInfoClick(fn){
    publicFn = fn;

    // executeIdentify() is called each time the mapView is clicked
    mapView.on("click", executeIdentify);
}

 // Executes each time the mapView is clicked
 function executeIdentify(event) {
    // Set the geometry to the location of the mapView click
    paramsIden.geometry = event.mapPoint;
    paramsIden.mapExtent = mapView.extent;

    // This function returns a promise that resolves to an array of features
    // A custom popupTemplate is set for each feature based on the layer it
    // originates from
    publicIdentify
      .identify(publicUrlSearch, paramsIden)
      .then(function (response) {
        var results = response.results;

        results.map(function (result) {
          var feature = result.feature;
        });

        publicFn(results);
      });
}

function goToXY(x, y){

    let markerSymbol = {
        type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
        url: "https://gisfava.isfahan.ir/SuportSite/Content/Image/addPlace.png",
        width: "32px",
        height: "32px"
      };

    var gotopt = new publicPoint({
        longitude: x,
        latitude: y,
        spatialReference: {
            wkid: wkid
        },
    });

    mapView.goTo(gotopt);

    var gotographic = new publicGraphic({
        geometry: gotopt,
        symbol: markerSymbol,
    });

    mapView.graphics.add(gotographic);
}

function clearMap() {
	mapView.graphics.removeAll();
}

function changeBaseMap(nameBaseMap){
    //publicEsriConfig.apiKey = apiKey;
    map.basemap = nameBaseMap;
    //map.basemap = "osm"
    //map.basemap = "osm-standard",

    //map.removeAll();
    //const osmLayer = new publicOpenStreetMapLayer();
    //map.add(osmLayer);
    //map.allLayers.items[0].spatialReference.wkid = wkid;
}

function geoLocation(){
    const locateBtn = new publicLocate({
        view: mapView
    });

    // Add the locate widget to the top left corner of the view
    mapView.ui.add(locateBtn, {
        position: "top-left"
    });
}
