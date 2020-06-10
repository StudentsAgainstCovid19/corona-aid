
var map;
var detailedXML;
var prioList;

function initMap() {
    var lonlat=[8.40631,49.01175];
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
            zoom: 13
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
    feature.set("called", parseExtensions("called")==="1");
    feature.set("done", parseExtensions("done")==="1");
}

// asynchronous to prevent extreme slowdowns
async function setMarkers()
{
    var gpxXSL = loadXMLDoc("./xslt_scripts/xslt_prio_gpx.xsl");
    var gpxData = runXSLT([gpxXSL], prioList);

    var clusterDistance = 25;

    var styles = getStyles();

    var xmlSerializer = new XMLSerializer();
    // read features in gpx
    var gpx = new ol.format.GPX({readExtensions: readExt});
    var gpxFeatures = gpx.readFeatures(xmlSerializer.serializeToString(gpxData), {
        featureProjection: 'EPSG:3857'
    });

    var clusterSource = new ol.source.Cluster({
        distance: clusterDistance,
        source: new ol.source.Vector({
            features: gpxFeatures
        })
    });

    var piechart_cache = {};
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
                sytle = piechart_cache[[size,amountDone,amountCalled]]
                if (!style)
                {
                    style = createPieChart(size, amountDone, amountCalled);
                    piechart_cache[[size,amountDone,amountCalled]] = style;
                }
            }
            return style;
        }
    });
    map.addLayer(clusters);

    map.on('click', function(evt){
        var clickedFeatures = []
        map.forEachFeatureAtPixel(
            evt.pixel,
            function(ft, layer){clickedFeatures.push(ft)}
        )
        if (clickedFeatures.length === 0) return;
        var clicked_ids = []
        var childFeatures = clickedFeatures[0].get('features')
        childFeatures.forEach(function (child){
            clicked_ids.push(child.get('id'))
        });
        console.log(clicked_ids);
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


function getAmountDone(array)
{
    var amount=0;
    for (var i=0; i<array.length; i++)
    {
        if (array[i].get('cmt'))
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
                scale: 0.2
            })
        }));
    }
    return styles;
}

function getType(person)
{
    if (person.getElementsByTagName("called")[0].childNodes[0].nodeValue==="1")
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

function createPieChart(size, amountDone, amountCalled)
{ // TODO: generate pie chart
    return new ol.style.Style({
        image: new ol.style.Icon({
            opacity: 1,
            src: "./assets/markers/example_pie_chart.svg",
            scale: 0.4
        })
    })
}

// button listeners for zooming
function zoom_in()
{
    map.getView().setZoom(map.getView().getZoom()+1/3.0);
}

function zoom_out()
{
    map.getView().setZoom(map.getView().getZoom()-1/3.0);
}