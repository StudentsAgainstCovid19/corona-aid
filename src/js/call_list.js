function initCallList()
{
    var callListsXML = loadXMLDoc("./example_xmls/call_list.xml");
    var prioCalcXSL = loadXMLDoc("./xslt_scripts/xslt_calculate_prio.xsl");
    var prioHelpersXSL = loadXMLDoc("./xslt_scripts/xslt_priority_helpers.xsl");

    var ret = runXSLT([prioHelpersXSL, prioCalcXSL], callListsXML);
    var displayCallXSL = loadXMLDoc("./xslt_scripts/xslt_call_list.xsl");
    var stringHelpersXSL = loadXMLDoc("./xslt_scripts/xslt_string_helpers.xsl");
    runXSLTDisplayHtml([stringHelpersXSL, displayCallXSL], ret, "call_list_div");
}