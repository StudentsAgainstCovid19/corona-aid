function initMap() {
    // OpenLayers takes lon as first argument and then lat
    map = new ol.Map({
        target: 'map_div',
        interactions: ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false}),
        controls: [],
        loadTilesWhileAnimating: true,
        loadTilesWhileInteracting: true,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: getStandardCenter(),
            projection: config_hash_table["projectionType"],
            zoom: parseInt(config_hash_table["standardZoom"])
        })
    });
    setClusterLayer();
}

function getStandardCenter() {
    return ol.proj.fromLonLat([ parseFloat(config_hash_table["standardLon"]),
                                parseFloat(config_hash_table["standardLat"])]);
}

function readExt(feature, extensionsNode) {
    //var parser = new DOMParser();
    //var extensionXml = parser.parseFromString(extensionsNode, 'application/xml');

    function parseExtensions(tagName) {
        return extensionsNode.getElementsByTagName(tagName)[0].childNodes[0].nodeValue;
    }

    feature.set("id", parseInt(parseExtensions("id")));
    feature.set("priority", parseFloat(parseExtensions("priority")));
    feature.set("type", parseExtensions("type"));
    feature.set("called", parseExtensions("called")==="true");
    feature.set("done", parseInt(parseExtensions("done"))===1);
}

// Solution to flickering was not implementing a cache for openlayer-styles but for
// the underlying icons. See:
// https://github.com/openlayers/openlayers/issues/3137
// https://github.com/openlayers/openlayers/pull/1590
let pieChartCache = new Map(); // map to cache openlayer-icons, to prevent flickering

// asynchronous to prevent extreme slowdowns
async function setMarkers() {
    let gpxXSL = getXSLT("./xslt_scripts/xslt_prio_gpx.xsl");
    let gpxData = runXSLT(gpxXSL, prioList);


    let xmlSerializer = new XMLSerializer();
    // read features in gpx
    let gpx = new ol.format.GPX({readExtensions: readExt});
    let gpxFeatures = gpx.readFeatures(xmlSerializer.serializeToString(gpxData), {
        featureProjection: 'EPSG:3857'
    });

    let clusterSource = new ol.source.Cluster({
        distance: parseInt(config_hash_table["clusteredDistance"]),
        source: new ol.source.Vector({
            features: gpxFeatures
        })
    });
    clusteredLayer.setSource(clusterSource);
    clusterSource.refresh();
}

async function setClusterLayer() {
    let styles = getStyles();
    clusteredLayer = new ol.layer.Vector({
        style: function(feature) {
            let size = feature.get('features').length;
            let style;
            if (size < 2) {
                switch (feature.get('features')[0].get("type")) {
                    case "calledAlready":
                        style = styles[0];
                        break;
                    case "lowprio":
                        style = styles[1];
                        break;
                    case "intermediateprio":
                        style = styles[2];
                        break;
                    case "highprio":
                        style = styles[3];
                        break;
                    case "veryhighprio":
                        style = styles[4];
                        break;
                    default:
                        style = styles[4];
                        break;
                }
            } else {
                // use a pie chart
                let amountDone, amountCalled;
                let styleSVGIcon;
                if (feature.get("amountDone") && feature.get("amountCalled")) {
                    amountDone = feature.get("amountDone");
                    amountCalled = feature.get("amountCalled");
                } else {
                    amountDone = getAmountDone(feature.get('features'));
                    amountCalled = getAmountCalled(feature.get('features'));
                }

                const key = [size, amountDone, amountCalled];
                styleSVGIcon = pieChartCache.get(key.toString());
                if (!styleSVGIcon)
                { // caching did not work due to the fact that styles are disposed if a cluster is reloaded / disposed.
                    // Now we cache the SVG output as openlayers icon by the XSLTProcessor
                    styleSVGIcon = createPieChart(size, amountDone, amountCalled);
                    pieChartCache.set(key.toString(), styleSVGIcon);
                }
                style = createClusterFromSVG(styleSVGIcon);
            }
            return style;
        }
    });

    map.addLayer(clusteredLayer);


    map.on('click', function(evt){
        let clickedFeatures = [];
        map.forEachFeatureAtPixel(
            evt.pixel,
            function(ft) { clickedFeatures.push(ft); }
        );
        if (clickedFeatures.length === 0) return;

        let clicked_ids = parseFeatureTree(clickedFeatures[0]);
        let v = clicked_ids[0];
        for (let i = 0; i < clicked_ids.length; i++) v+=clicked_ids[i];

        if (clicked_ids.length === 1) {
            try_acquire_lock(clicked_ids[0]);
        } else {
            // open list with people with according ids
            displayClusteredMap(clicked_ids);
        }
    });
}

function setDistrictsLayer() {
    showLoading();
    // load xml from backend and process with xslt
    let districtsXML = loadXMLDoc("./assets/example_districts.xml");
    let districtsXSL = getXSLT("./xslt_scripts/xslt_show_districts.xsl");

    let districtsKML = runXSLT(districtsXSL, districtsXML);

    districtLayer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });

    districtLayer.getSource().addFeatures(new ol.format.KML().readFeatures(districtsKML, {featureProjection: config_hash_table["projectionType"]}));
    map.addLayer(districtLayer);
    hideLoading();
}

function toggleLayerVisibility() {
    if ( !clusteredLayer.getVisible() ) {
        clusteredLayer.setVisible(true);
        setVisibilityDistricts(false);
    } else {
        clusteredLayer.setVisible(false);
        setVisibilityDistricts(true);
    }
}

function setVisibilityDistricts(visibilityState) {
    if ( !visibilityState ) {
        if ( districtLayer ) districtLayer.setVisible(false);
    } else {
        if ( !districtLayer ) setDistrictsLayer();
        else districtLayer.setVisible(true);
    }
}

function parseFeatureTree(ft) {

    let id_list = [];
    let id = ft.get('id');
    if (id) id_list = [parseInt(id)];

    let children = ft.get("features");
    if ( !children || children.length === 0 ) return id_list;
    children.forEach(function (child){
        let ids = parseFeatureTree(child);
        id_list = id_list.concat(ids);
    });
    return id_list;
}


function getAmountDone(array) {
    let amount=0;
    for (let i=0; i<array.length; i++) {
        if (array[parseInt(i)].get('done')) {
            amount+=1;
        }
    }
    return amount;
}

function getAmountCalled(array) {
    let amount=0;
    for (let i=0; i<array.length; i++) {
        if (array[parseInt(i)].get('called') && !array[parseInt(i)].get('done')) amount+=1;
    }
    return amount;
}

function getStyles() {
    let icons = ['tried_call.svg', 'lower_prio.svg', 'intermed_prio.svg', 'high_prio.svg', 'veryhigh_prio.svg'];
    let styles = [];
    for (let i = 0; i < icons.length; i++) {
        styles.push(new ol.style.Style({
            image: new ol.style.Icon({
                opacity: 1,
                src: "./assets/markers/" + icons[i],
                scale: parseFloat(config_hash_table["markerScale"])
            })
        }));
    }
    return styles;
}

function getType(person) {
    if (person.getElementsByTagName("called")[0].childNodes[0].nodeValue) {
        return "calledAlready";
    } else {
        let prioMapping = ["low", "low", "intermediate", "high", "veryhigh"];
        return prioMapping[parseInt(person.getElementsByTagName("priority")[0].childNodes[0].nodeValue)];
    }
}

function createPieChart(size, amountDone, amountCalled) {
    if (size === 0) {
        console.log("Error occurred while creating pie chart.");
        return;
    }
    colors = ['green', 'purple'];
    angles = [0, amountDone / parseFloat(size) * 360, (amountDone + amountCalled) / parseFloat(size) * 360];
    let xml_string = "<chart><amountRemaining>" + (size - amountDone) + "</amountRemaining><arcs>";

    for (let i = 0; i < colors.length; i++) {
        let coordinates = calculateCirclePoint(angles[i + 1]);

        xml_string += "<arc>" +
            "<x>" + coordinates[0] + "</x>" +
            "<y>" + coordinates[1] + "</y>" +
            "<color>" + colors[i] + "</color>" +
            "<angle>" + (angles[i + 1] - angles[i]) + "</angle>" +
            "</arc>";

    }
    xml_string += "</arcs></chart>";
    let xmlParser = new DOMParser();
    let xmlDoc = xmlParser.parseFromString(xml_string, "application/xml");
    let pieChartXSL = getXSLT("./xslt_scripts/xslt_pie_chart_gen.xsl");
    let chart = runXSLT(pieChartXSL, xmlDoc);

    let serializer = new XMLSerializer();

    return new ol.style.Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + serializer.serializeToString(chart),
        scale: parseFloat(config_hash_table["pieChartScaleConstant"])
            + (size-amountDone) * parseFloat(config_hash_table["pieChartScaleLinear"])
    });
}

function createClusterFromSVG(icon) {
    return new ol.style.Style({
        image: icon
    });
}

function calculateCirclePoint(angle) {
    let angleRadians = (angle-90) * Math.PI / 180.0;
    return [50 + 50*Math.cos(angleRadians), 50 + 50*Math.sin(angleRadians)];
}

// button listeners for zooming
function zoomIn() {
    map.getView().animate({zoom: map.getView().getZoom() + parseFloat(config_hash_table["zoomChange"]),
                    duration: parseInt(config_hash_table["animationDuration"])});
}

function zoomOut() {
    map.getView().animate({zoom: map.getView().getZoom() - parseFloat(config_hash_table["zoomChange"]),
                    duration: parseInt(config_hash_table["animationDuration"])});
}

function standardZoom() {
    map.getView().animate({zoom: config_hash_table["standardZoom"],
                                    center: getStandardCenter()});
}