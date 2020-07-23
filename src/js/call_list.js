async function calculatePriorities() {
    let callListsXML = loadXMLDoc(apiUrl + "infected?compress");
    let prioCalcXSL = getXSLT("./xslt_scripts/xslt_calculate_prio.xsl");

    prioList = runXSLT(prioCalcXSL, callListsXML);
    initCallList();
}

async function initCallList(openCallListBool = true) {
    let displayCallXSL = getXSLT("./xslt_scripts/xslt_call_list.xsl");
    runXSLT(displayCallXSL, prioList, "callListDiv");
    if (openCallListBool) openCallList();
    addSearchBarListener();
    setMarkers();
    showProgressBar();
}