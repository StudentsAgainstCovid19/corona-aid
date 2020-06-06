
// set the detailed view with a given xml file for all specific data
function setDetailedView(xml_doc)
{
    console.log("hi");
    console.log(xml_doc);
    if (xml_doc != null)
    {
        var displayDetailed = loadXMLDoc("./xslt_scripts/xslt_detailed_view.xsl");
        console.log(displayDetailed);
        runXSLTDisplayHtml(displayDetailed, xml_doc, "infected_detailed_view_right");
    }
}