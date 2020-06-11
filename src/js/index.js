var config_hash_table = {};

function parseNodeValueFromXML(xml_obj, tagName)
{
    return xml_obj.getElementsByTagName(tagName)[0].childNodes[0].nodeValue
}

function init()
{
    // init configs
    var configXML = loadXMLDoc("https://api.sac19.jatsqi.com/config");
    console.log("Hey");
    var items = configXML.getElementsByTagName("item");
    for (var i=0; i<items.length; i++)
    {
        config_hash_table[parseNodeValueFromXML(items[i], "configKey")] =
            parseNodeValueFromXML(items[i], "configValue");
    }
    initMap();
    initCallList();
}