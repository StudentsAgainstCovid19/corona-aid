async function calculatePriorities() {
    let callListsXML = loadXMLDoc(apiUrl + "infected?compress");
    let prioCalcXSL = getXSLT("./xslt_scripts/xslt_calculate_prio.xsl");

    prioList = runXSLT(prioCalcXSL, callListsXML);
    // console.log('=== PrioList XML:');
    // console.log(new XMLSerializer().serializeToString(prioList));
    initCallList();
}

async function initCallList(openCallListBool = true) {
    let displayCallXSL = getXSLT("./xslt_scripts/xslt_call_list.xsl");
    runXSLT(displayCallXSL, prioList, "call_list_div");
    if (openCallListBool) openCallList();
    addSearchBarListener();
    setMarkers();
    showProgressBar();
}