
function parseNodeValueFromXML(xml_obj, tagName)
{
    return xml_obj.getElementsByTagName(tagName)[0].childNodes[0].nodeValue
}

function init()
{
    // init configs
    var configXML = loadXMLDoc(apiUrl+"config");

    var items = configXML.getElementsByTagName("item");
    for (var i=0; i<items.length; i++)
    {
        config_hash_table[parseNodeValueFromXML(items[i], "configKey")] =
            parseNodeValueFromXML(items[i], "configValue");
    }
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