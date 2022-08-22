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


function loadMap(url, divMap, urlSearch, fn){
    require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/layers/MapImageLayer",
            "esri/widgets/Measurement", "esri/rest/identify", "esri/rest/support/IdentifyParameters", "esri/geometry/Point",
            "esri/Graphic", "esri/geometry/SpatialReference"],
        function (config, Map, MapView, FeatureLayer, MapImageLayer, Measurement, identify, IdentifyParameters, Point, Graphic,
                  SpatialReference) {

            publicDivMap = divMap;
            publicUrlSearch = urlSearch;
            publicPoint = Point;
            publicGraphic = Graphic;
            publicSpatialReference = SpatialReference;
            
            layer = new MapImageLayer({
                url : url
            });

            map = new Map({
            //basemap: "osm-light-gray",
            });

            mapView = new MapView({
                map: map,
                //center: [-107.71808390060319, 42.68918060911958],
                //center: [51.6573571480861, 32.64777704555835],
                //zoom: 20,
                container: divMap
            });

            //map.layers.addMany([layer]);
            map.add(layer);


            //----------------------------------------اندازه گیری-----------------------------------
            measurement = new Measurement();

            //------------------------------------------شناسایی----------------------------------

            publicIdentify = identify;

            // Add the map service as a MapImageLayer
            // use identify to query the service to add interactivity to the app
            /* identifyLayer = new MapImageLayer({
                url: urlSearch,
                opacity: 0.5
            }); */

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