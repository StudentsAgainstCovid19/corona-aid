
async function calculatePriorities()
{
    var callListsXML = loadXMLDoc(apiUrl+"/infected?compress");
    var prioCalcXSL = getXSLT("./xslt_scripts/xslt_calculate_prio.xsl");

    prioList = runXSLT(prioCalcXSL, callListsXML);
    initCallList();
}

async function initCallList(openCallListBool = true)
{
    var displayCallXSL = getXSLT("./xslt_scripts/xslt_call_list.xsl");
    runXSLT(displayCallXSL, prioList, "call_list_div");
    if (openCallListBool) openCallList();
    addSearchBarListener();
    setMarkers();
    showProgressBar();
}