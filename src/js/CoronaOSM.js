
var map;
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
            zoom: 13
        })
    });
    setMarkers();


    clicked_marker(5);

}

// asynchronous to prevent extreme slowdowns
async function setMarkers()
{
    // TODO: priorities are not actually in the received xml (or won't be)
    var geoXML = loadXMLDoc("./example_xmls/example_map_data.xml");
    var clusterDistance = 25;

    var features = []
    var nodes = geoXML.getElementsByTagName("marker");
    for (var i=0; i<nodes.length; i++){
        features.push(new ol.Feature({
            id: parseInt(nodes[i].getElementsByTagName("id")[0].childNodes[0].nodeValue),
            type: getType(nodes[i]),
            geometry: new ol.geom.Point(ol.proj.fromLonLat([
                parseFloat(nodes[i].getElementsByTagName("lon")[0].childNodes[0].nodeValue),
                parseFloat(nodes[i].getElementsByTagName("lat")[0].childNodes[0].nodeValue)
            ])),
            done: (nodes[i].getElementsByTagName("done")[0].childNodes[0].nodeValue==="1"),
            called: (nodes[i].getElementsByTagName("called")[0].childNodes[0].nodeValue==="1")
        }));
    }


    var styles = getStyles();

    var clusterSource = new ol.source.Cluster({
        distance: clusterDistance,
        source: new ol.source.Vector({
            features: features
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
                switch (feature.get('features')[0].get('type')) {
                    case "calledAlready":
                        style = styles[0];
                        break;
                    case "low":
                        style = styles[1];
                        break;
                    case "intermediate":
                        style = styles[2];
                        break;
                    case "high":
                        style = styles[3];
                        break;
                    case "veryhigh":
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
        if (clicked_ids.length == 1)
        { //TODO
            // open detailed view for specfic person
        }
        else
        { //TODO
            // open list with people with according ids
        }
    })
}

function clicked_marker(id) {
    var detailedXML = loadXMLDoc("./example_xmls/detailed_infected.xml");
    setDetailedView(detailedXML);
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