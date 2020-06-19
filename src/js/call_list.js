
async function initCallList()
{
    console.log(loadXMLDoc(apiUrl+"/infected?compress=true"));
    var callListsXML = loadXMLDoc("./example_xmls/call_list.xml");//(apiUrl+"/infected?compress=true");
    var prioCalcXSL = getXSLT("./xslt_scripts/xslt_calculate_prio.xsl");

    prioList = runXSLT([prioCalcXSL], callListsXML);
    var displayCallXSL = getXSLT("./xslt_scripts/xslt_call_list.xsl");
    runXSLT([displayCallXSL], prioList, "call_list_div");
    setMarkers();

}