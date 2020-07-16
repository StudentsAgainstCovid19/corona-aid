function createPieChart(size, amountDone, amountCalled, resolution) {
    if (size === 0) {
        console.log("Error occurred while creating pie chart.");
        return null;
    }
    let colors = ["green", "purple"];
    let angles = [0, amountDone / parseFloat(size) * 360, (amountDone + amountCalled) / parseFloat(size) * 360];
    let xmlString = '<?xml version="1.0"?><!DOCTYPE chart SYSTEM "' + apiUrl + 'dtd/create_pie_chart_result.dtd">';
    xmlString += "<chart><amountRemaining>" + (size - amountDone) + "</amountRemaining><arcs>";

    for (let i = 0; i < colors.length; i++) {
        let coordinates = calculateCirclePoint(angles[i + 1]);

        xmlString += "<arc>" +
            "<x>" + coordinates[0] + "</x>" +
            "<y>" + coordinates[1] + "</y>" +
            "<color>" + colors[i] + "</color>" +
            "<angle>" + (angles[i + 1] - angles[i]) + "</angle>" +
            "</arc>";

    }
    xmlString += "</arcs></chart>";
    let xmlParser = new DOMParser();
    let xmlDoc = xmlParser.parseFromString(xmlString, "application/xml");
    let pieChartXSL = getXSLT("./xslt_scripts/xslt_pie_chart_gen.xsl");
    let chart = runXSLT(pieChartXSL, xmlDoc);

    let serializer = new XMLSerializer();

    let remainingPatients = size-amountDone;
    let pieChartScaleConstant = parseFloat(configHashTable["pieChartScaleConstant"]); // default: 0.42
    let pieChartScaleLinear = parseFloat(configHashTable["pieChartScaleLinear"]); // default: 0.0035
    let zoomScaleFactor = Math.pow(Math.E, -(0.004*resolution));
    return new ol.style.Icon({
        opacity: 1,
        src: "data:image/svg+xml;utf8," + serializer.serializeToString(chart),
        scale: (pieChartScaleConstant + remainingPatients * pieChartScaleLinear)*zoomScaleFactor
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