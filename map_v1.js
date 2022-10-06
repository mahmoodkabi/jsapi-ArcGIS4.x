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
let publicFn1;
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
let find;
let publicFindParameters;
let publicParams;
let publicquery;
let publicGraphicsLayer;
let publicWMSLayer;
let publicMapImageLayer;
let arrServices = [];
let publicI = 0;
let parentId = 0;
let publicRequest;


function loadMap(url, divMap, urlSearch, fn){
    require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/layers/MapImageLayer",
            "esri/widgets/Measurement", "esri/rest/identify", "esri/rest/support/IdentifyParameters", "esri/geometry/Point",
            "esri/Graphic", "esri/geometry/SpatialReference", "esri/layers/OpenStreetMapLayer", "esri/config",
            "esri/widgets/Locate", "esri/rest/find", "esri/rest/support/FindParameters", "esri/rest/query", "esri/rest/support/Query",
            "esri/layers/GraphicsLayer", "esri/layers/WMSLayer", "esri/request"],
        function (config, Map, MapView, FeatureLayer, MapImageLayer, Measurement, identify, IdentifyParameters, Point, Graphic,
                  SpatialReference, OpenStreetMapLayer, esriConfig, Locate, find, FindParameters, query, Query, GraphicsLayer, WMSLayer,
                  Request) {

            publicDivMap = divMap;
            publicUrlSearch = urlSearch;
            publicPoint = Point;
            publicGraphic = Graphic;
            publicSpatialReference = SpatialReference;
            publicOpenStreetMapLayer = OpenStreetMapLayer;
            publicEsriConfig = esriConfig;
            publicIdentify = identify;
            publicLocate = Locate;
            publicFind = find;
            publicFindParameters = FindParameters;
            publicParams = new Query({
                returnGeometry: true,
                outFields: ["*"]
            });
            publicquery = query;
            publicGraphicsLayer = GraphicsLayer;
            publicWMSLayer = WMSLayer;
            publicMapImageLayer = MapImageLayer;
            publicRequest = Request;

	    
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
                            id: layerbaseMapID[layerbaseMapID.indexOf("MAPSERVER") - 1],
                            // sublayers: [{
                            //   id: 10,
                            //   popupTemplate: {
                            //     title: "qweqwe",
                            //     content: "{NAM_MADI}"
                            //   }
                            // },
                            //  {
                            //   id: 15,
                            //   popupTemplate: {
                            //     title: "adsas",
                            //     content: "{layer}"
                            //   }
                            // }]
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
    map.basemap = nameBaseMap;
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



function showOnMap(url, layerID, condition, isClearMap, fn){
    
  if(isClearMap == true)
    clearMap();

    //publicParams.where = field + " like N'%"+ value +"%'";
    publicParams.where = condition;
    publicFn = fn;

    // executes the query and calls getResults() once the promise is resolved
    // promiseRejected() is called if the promise is rejected
    publicquery
    .executeQueryJSON(url + "/" + layerID, publicParams)
    .then(getResults)
    .catch(promiseRejected);
}

 // Called each time the promise is resolved
 function getResults(response) {
    var textSymbol = {
      type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
      style: "square",
      color: "blue",
      size: "8px",  // pixels
      outline: {  // autocasts as new SimpleLineSymbol()
        color: [ 255, 255, 0 ],
        width: 3  // points
      }
    };

    var resultsLayer = new publicGraphicsLayer();

    // Loop through each of the results and assign a symbol and PopupTemplate
    // to each so they may be visualized on the map
    var peakResults = response.features.map(function (feature) {

      // // Sets the symbol of each resulting feature to a cone with a
      // // fixed color and width. The height is based on the mountain's elevation
      // feature.symbol = {
      //   type: "point", // autocasts as new PointSymbol3D()
      //   symbolLayers: [
      //     {
      //       type: "object", // autocasts as new ObjectSymbol3DLayer()
      //       material: {
      //         color: "green"
      //       },
      //       resource: {
      //         primitive: "cone"
      //       },
      //       width: 100000,
      //       height: feature.attributes.ELEV_m * 100
      //     }
      //   ]
      // };

      if(feature.geometry.type == "point"){
        var p = new publicPoint({
          longitude: feature.geometry.x,
          latitude: feature.geometry.y,
            spatialReference: {
              wkid: wkid
          },
        });
  
        // Create a graphic and add the geometry and symbol to it
        var pointGraphic1 = new publicGraphic({
          geometry: p,
          symbol: textSymbol
        });
  
        // Add the graphics to the view's graphics layer
        mapView.graphics.addMany([
          pointGraphic1
        ]);
        
      } else  if(feature.geometry.type == "polyline"){

        // First create a line geometry (this is the Keystone pipeline)
        var polyline = {
          type: "polyline", // autocasts as new Polyline()
          paths: feature.geometry.paths,
          spatialReference: {
            wkid: wkid
          },
        };

        // Create a symbol for drawing the line
        var lineSymbol = {
          type: "simple-line", // autocasts as SimpleLineSymbol()
          color: [220,20,60],
          width: 4,
          style: "dash"
        };

        //Create a new graphic and add the geometry,
        var polylineGraphic1 = new publicGraphic({
          geometry: polyline,
          symbol: lineSymbol,
        });

        // Add the graphics to the view's graphics layer
        mapView.graphics.addMany([
          polylineGraphic1
        ]);

      } else  if(feature.geometry.type == "polygon"){
        // Create a polygon geometry
        var polygon = {
          type: "polygon", // autocasts as new Polygon()
          rings: feature.geometry.rings,
          spatialReference: {
            wkid: wkid
          },
        };

        // Create a symbol for rendering the graphic
        var fillSymbol = {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: [227, 139, 79, 0.8],
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 1
          }
        };

        // Add the geometry and symbol to a new graphic
        var polygonGraphic1 = new publicGraphic({
          geometry: polygon,
          symbol: fillSymbol
        });

        // Add the graphics to the view's graphics layer
        mapView.graphics.addMany([
          polygonGraphic1
        ]);
      }
      
      //feature.popupTemplate = popupTemplate;
      return feature;
    });

    resultsLayer.addMany(peakResults);

    // animate to the results after they are added to the map
    mapView
      .goTo(peakResults)
      .then(function () {
        // mapView.popup.open({
        //   features: peakResults,
        //   featureMenuOpen: true,
        //   updateLocationEnabled: true
        // });
      })
      .catch(function (error) {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });

      publicFn();
  }

  // Called each time the promise is rejected
  function promiseRejected(error) {
    console.error("Promise rejected: ", error.message);
  }


function getAllSubLayers(url, fn){
  layer = new publicMapImageLayer({
    url: url
  });
 
  publicFn1 = fn;
  publicI = 0;
  map.add(layer);
  layer.when(buildToc);
}


function buildToc(){
  map.remove(layer);
  populateLayerRecursive(layer);

  publicFn1(arrServices);
}

function populateLayerRecursive(thislayer){
    arrServices[publicI] = [];
    arrServices[publicI][0] = publicI + 1;
    if(publicI == 0)
      arrServices[publicI][1] = null;
    //else
    //  arrServices[publicI][1] = arrServices[publicI - 1][0];
    arrServices[publicI][2] = thislayer.title;
    arrServices[publicI][3] = thislayer.url;

    
    if (thislayer.sublayers != null && thislayer.sublayers.items.length > 0)
    {
        // let newlist = document.createElement("ul");
        // layerlist.appendChild(newlist);

        //if(publicI != 0)
        if(publicI != 0)
          arrServices[publicI][1] = parentId;
          
        parentId = arrServices[publicI][0];

        publicI += 1;

        if(publicI == 18)
          var aa =0;

        for (let i = 0; i < thislayer.sublayers.length; i++)
        {
            this.populateLayerRecursive(thislayer.sublayers.items[thislayer.sublayers.length - i - 1]);
        }

    }
    else{
      arrServices[publicI][1] = parentId;
      publicI += 1;

      if(publicI == 18)
       var aa =0;
    }
    //let sublayer = thislayer.sublayers.items[i];
}




//populate the attribute of a given layer
function populateAttributesTable(url, fn)
{
	//alert (featureCount);
	let queryurl = url + "/query";

	let arrAttribute = [];

	let extent = undefined;

	if (mapView.useExtent) extent = JSON.stringify(mapView.extent);

	let queryOptions = {
     					responseType: "json",
     					query:  
     					{
							f: "json",
							where:"1=1",
							geometry: extent,
							//inSR: JSON.stringify(mapView.extent.spatialReference),
							geometryType: "esriGeometryEnvelope",
							spatialRel: "esriSpatialRelEnvelopeIntersects",
							returnCountOnly: false,
							outFields: "*",
							resultOffset: 1,
							resultRecordCount: 1
     					}
            }

       publicRequest(queryurl,queryOptions).then (response => 
	     {
          for (let i = 0; i < response.data.fields.length; i++)
          {
            arrAttribute.push(response.data.fields[i].alias);
          }

          fn(arrAttribute);
	     }, response => true );
}

function aa(){
  
}