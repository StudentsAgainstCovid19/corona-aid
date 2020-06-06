

function initMap() {
		var lonlat=[8.40631,49.01175];
        map = new OpenLayers.Map("basicMap");
        var mapnik         = new OpenLayers.Layer.OSM();
        var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
        var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
        var position       = new OpenLayers.LonLat(lonlat[0], lonlat[1]).transform( fromProjection, toProjection);
        var zoom           = 13;
        map.addLayer(mapnik);
        map.setCenter(position, zoom );
		var size = new OpenLayers.Size(100, 100);
		// marker tests
		var markers = new OpenLayers.Layer.Markers("Marker")
		map.addLayer(markers);

		var size = new OpenLayers.Size(25,25);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        OpenLayers.Icon()
        var icon = new OpenLayers.Icon("./assets/markers/veryhigh_prio.svg", size,offset);

        markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(lonlat[0],lonlat[1]).transform( fromProjection, toProjection),icon));



        marker = new OpenLayers.Marker(new OpenLayers.LonLat(lonlat[0]+0.005,lonlat[1]+0.02).transform( fromProjection, toProjection),icon.clone());

        marker.events.register('click', marker, function(evt) {
            clicked_marker(2)
        });
        markers.addMarker(marker);
        clicked_marker(5);

    // var elements = document.querySelectorAll('[id^=OpenLayers_Layer_Markers]');
    // var newElm = document.createElement('div', {id:"OL_Icon_88", style:"position: absolute; width: 25px; height: 25px; left: 917.5px; top: -27px;"});
    // newElm.innerHTML = '<img id="OL_Icon_52_innerImage" style="position: relative; width: 25px; height: 25px;" class="olAlphaImg" src="../assets/markers/veryhigh_prio.svg">'
    // elements[0].appendChild(newElm);
    // console.log(elements[0]);
}



function clicked_marker(id) {
    var detailedXML = loadXMLDoc("./example_xmls/detailed_infected.xml");
    console.log(detailedXML);
    setDetailedView(detailedXML);
    console.log("Called...");
}