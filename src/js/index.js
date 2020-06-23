
function parseNodeValueFromXML(xml_obj, tagName)
{
    return xml_obj.getElementsByTagName(tagName)[0].childNodes[0].nodeValue
}

function init()
{
    loadConfig();
    initMap();
    calculatePriorities();
    connectWebSocket();
}

function connectWebSocket() {
    realtimeWebSocket = new WebSocket(apiWebSocketUrl+"realtime/infected");
    realtimeWebSocket.onmessage = function(updateData) {
        realtimeUpdate( updateData );
    }
}

function loadConfig()
{
    // init configs
    let configXML = loadXMLDoc(apiUrl+"config", "application/xml", configLoadErrorFn);

    if ( !configXML ) return;
    let items = configXML.getElementsByTagName("item");
    for (let i=0; i<items.length; i++)
    {
        config_hash_table[parseNodeValueFromXML(items[i], "configKey")] =
            parseNodeValueFromXML(items[i], "configValue");
    }
}

function configLoadErrorFn(statusCode) {
    if (statusCode === 404)
    {
        makeConfirmPopup("Die Konfigurationen konnten nicht geladen werden.\n" +
            "Es werden standardkonfigurationen ausgewählt.\n" +
            "Die Website wird vermutlich nicht funktionieren.",
            null, null, true, "Schließen");
        config_hash_table = {"standardLat":"49.013868","standardLon":"8.404346", "clusteredDistance":"200",
                "pieChartScale":"0.6","markerScale":"0.3","standardZoom":"13","zoomChange":"0.5"};
    }
}

function realtimeUpdate( updateData )
{
    console.log(updateData);

    let serializer = new XMLSerializer();
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString("<Container></Container>", "application/xml");
    xmlDoc.children[0].innerHTML = serializer.serializeToString(updateData) +
                                    serializer.serializeToString(prioList);

    let updateXSL = getXSLT("./xslt_scripts/xslt_realtime_update.xsl");

    prioList = runXSLT(updateXSL, xmlDoc);
    // TODO: prevent reloading of whole map but instead update just one marker
    initCallList(false);

}