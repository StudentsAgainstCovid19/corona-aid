var piechart_cache = {};

function initMap() {
    // OpenLayers takes lon as first argument and then lat
    var lonlat=[parseFloat(config_hash_table["standardLon"]),
        parseFloat(config_hash_table["standardLat"])];

    map = new ol.Map({
        target: 'map_div',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat(lonlat),
            projection: "EPSG:3857",
            zoom: parseInt(config_hash_table["standardZoom"])
        })
    });
}

function readExt(feature, extensionsNode)
{
    //var parser = new DOMParser();
    //var extensionXml = parser.parseFromString(extensionsNode, 'application/xml');
    var val = extensionsNode.getElementsByTagName("id");

    function parseExtensions(tagName)
    {
        return extensionsNode.getElementsByTagName(tagName)[0].childNodes[0].nodeValue;
    }

    feature.set("id", parseInt(parseExtensions("id")));
    feature.set("priority", parseFloat(parseExtensions("priority")));
    feature.set("type", parseExtensions("type"));
    feature.set("called", parseExtensions("called")==="true");
    feature.set("done", parseExtensions("done")==="1");
}

// asynchronous to prevent extreme slowdowns
async function setMarkers()
{
    var gpxXSL = getXSLT("./xslt_scripts/xslt_prio_gpx.xsl");
    var gpxData = runXSLT([gpxXSL], prioList);

    var styles = getStyles();

    var xmlSerializer = new XMLSerializer();
    // read features in gpx
    var gpx = new ol.format.GPX({readExtensions: readExt});
    var gpxFeatures = gpx.readFeatures(xmlSerializer.serializeToString(gpxData), {
        featureProjection: 'EPSG:3857'
    });

    var clusterSource = new ol.source.Cluster({
        distance: parseInt(config_hash_table["clusteredDistance"]),
        source: new ol.source.Vector({
            features: gpxFeatures
        })
    });

    var clusters = new ol.layer.Vector({
        source: clusterSource,
        style: function(feature) {
            var size = feature.get('features').length;
            var style;
            if (size < 2)
            {
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
            }
            else {
                // use a pie chart
                var amountDone = getAmountDone(feature.get('features'));
                var amountCalled = getAmountCalled(feature.get('features'));
                var key = [size, amountDone, amountCalled];
                styleSVG = piechart_cache[key];
                if (!styleSVG)
                { // caching did not work due to the fact that styles are disposed if a cluster is reloaded / disposed.
                  // Now we cache the SVG output by the XSLTProcessor
                    console.log("I love caching...");
                    styleSVG = createPieChart(size, amountDone, amountCalled);
                    piechart_cache[key] = styleSVG;
                }
                style = createClusterFromSVG(styleSVG);
            }
            return style;
        }
    });
    map.addLayer(clusters);

    map.on('click', function(evt){
        var clickedFeatures = []
        map.forEachFeatureAtPixel(
            evt.pixel,
            function(ft, layer){clickedFeatures.push(ft);}
        )
        if (clickedFeatures.length === 0) return;

        var clicked_ids = parseFeatureTree(clickedFeatures[0]);
        var v=clicked_ids[0];
        for (var i = 0; i < clicked_ids.length; i++)
        {
            v+=clicked_ids[i];
        }

        if (clicked_ids.length === 1)
        {
            try_acquire_lock(clicked_ids[0]);
        }
        else
        {
            // open list with people with according ids
            displayClusteredMap(clicked_ids);
        }
    })
}

function parseFeatureTree(ft)
{

    var id_list = [];
    var id = ft.get('id');
    if (id) id_list = [parseInt(id)];

    var children = ft.get("features");
    if ( !children || children.length === 0 ) return id_list;
    children.forEach(function (child){
        var ids = parseFeatureTree(child);
        id_list = id_list.concat(ids);
    });
    return id_list;
}


function getAmountDone(array)
{
    var amount=0;
    for (var i=0; i<array.length; i++)
    {
        if (array[i].get('done'))
        {
            amount+=1;
        }
    }
    return amount;
}

function getAmountCalled(array)
{
    var amount=0;
    for (var i=0; i<array.length; i++)
    {
        if (array[i].get('called') && !array[i].get('done'))
        {
            amount+=1;
        }
    }
    return amount;
}

function getStyles()
{
    var icons = ['tried_call.svg', 'lower_prio.svg', 'intermed_prio.svg', 'high_prio.svg', 'veryhigh_prio.svg'];
    var styles = [];
    for (var i=0; i<icons.length;i++)
    {
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

function getType(person)
{
    if (person.getElementsByTagName("called")[0].childNodes[0].nodeValue)
    {
        return "calledAlready";
    }
    else
    {
        var prioMapping = ["low", "low", "intermediate", "high", "veryhigh"];
        return prioMapping[parseInt(person.getElementsByTagName("priority")[0].childNodes[0].nodeValue)];
    }
    return "low";
}

function createPieChart(size, amountDone, amountCalled) {
    if (size === 0) {
        console.log("Error occurred while creating pie chart.");
        return;
    }
    colors = ['green', 'purple'];
    angles = [0, amountDone / parseFloat(size) * 360, (amountDone + amountCalled) / parseFloat(size) * 360];
    xml_string = "<chart><amountRemaining>" + (size - amountDone) + "</amountRemaining><arcs>";

    for (var i = 0; i < colors.length; i++) {
        var coordinates = calculateCirclePoint(angles[i + 1]);

        xml_string += "<arc>" +
            "<x>" + coordinates[0] + "</x>" +
            "<y>" + coordinates[1] + "</y>" +
            "<color>" + colors[i] + "</color>" +
            "<angle>" + (angles[i + 1] - angles[i]) + "</angle>" +
            "</arc>";

    }
    xml_string += "</arcs></chart>";
    var xmlParser = new DOMParser();
    var xmlDoc = xmlParser.parseFromString(xml_string, "application/xml");
    var pieChartXSL = getXSLT("./xslt_scripts/xslt_pie_chart_gen.xsl");
    var chart = runXSLT([pieChartXSL], xmlDoc);

    var serializer = new XMLSerializer();
    return serializer.serializeToString(chart);
}

function createClusterFromSVG(pieChartSVG)
{
    return new ol.style.Style({
        image: new ol.style.Icon({
            opacity: 1,
            src: "data:image/svg+xml;utf8," + pieChartSVG,
            scale: parseFloat(config_hash_table["pieChartScale"])
        })
    })
}

function calculateCirclePoint(angle)
{
    var angleRadians = (angle-90) * Math.PI / 180.0;
    return [50 + 50*Math.cos(angleRadians), 50 + 50*Math.sin(angleRadians)];
}

// button listeners for zooming
function zoom_in()
{
    map.getView().setZoom(map.getView().getZoom()+parseFloat(config_hash_table["zoomChange"]));
}

function zoom_out()
{
    map.getView().setZoom(map.getView().getZoom()-parseFloat(config_hash_table["zoomChange"]));
}