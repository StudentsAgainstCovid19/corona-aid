

function initMap() {
    var lonlat=[8.40631,49.01175];
    var map = new ol.Map({
        target: 'map_div',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat(lonlat),
            zoom: 13
        })
    });

    var marker_layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat(lonlat))
                })
            ]
        })
    });
    map.addLayer(marker_layer);
    clicked_marker(5);

    // var elements = document.querySelectorAll('[id^=OpenLayers_Layer_Markers]');
    // var newElm = document.createElement('div', {id:"OL_Icon_88", style:"position: absolute; width: 25px; height: 25px; left: 917.5px; top: -27px;"});
    // newElm.innerHTML = '<img id="OL_Icon_52_innerImage" style="position: relative; width: 25px; height: 25px;" class="olAlphaImg" src="../assets/markers/veryhigh_prio.svg">'
    // elements[0].appendChild(newElm);
    // console.log(elements[0]);
}



function clicked_marker(id) {
    var detailedXML = loadXMLDoc("./example_xmls/detailed_infected.xml");
    setDetailedView(detailedXML);
}