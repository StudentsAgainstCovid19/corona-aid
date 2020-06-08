
// set the detailed view with a given xml file for all specific data
function setDetailedView(xml_doc)
{
    if (xml_doc != null)
    {
        var stringHelpersXSL = loadXMLDoc("./xslt_scripts/xslt_string_helpers.xsl");
        var prioHelperXSL = loadXMLDoc("./xslt_scripts/xslt_calculate_prio.xsl");
        var displayDetailed = loadXMLDoc("./xslt_scripts/xslt_detailed_view.xsl");

        runXSLTDisplayHtml([stringHelpersXSL, prioHelperXSL, displayDetailed], xml_doc, "infected_detailed_view_right");
    }
}