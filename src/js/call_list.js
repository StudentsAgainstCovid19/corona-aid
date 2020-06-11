
function initCallList()
{
    var callListsXML = loadXMLDoc("./example_xmls/call_list.xml");
    var prioCalcXSL = getXSLT("./xslt_scripts/xslt_calculate_prio.xsl");
    var prioHelpersXSL = getXSLT("./xslt_scripts/xslt_priority_helpers.xsl");

    prioList = runXSLT([prioHelpersXSL, prioCalcXSL], callListsXML);
    var displayCallXSL = getXSLT("./xslt_scripts/xslt_call_list.xsl");
    var stringHelpersXSL = getXSLT("./xslt_scripts/xslt_string_helpers.xsl");
    runXSLT([stringHelpersXSL, displayCallXSL], prioList, "call_list_div");
    setMarkers();
}