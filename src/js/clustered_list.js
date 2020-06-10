
function displayClusteredMap(id_array)
{ // TODO
    console.log(prioList);
    if (!prioList) return;
    slideOpenRightBar();
    var right_bar = document.getElementById("infected_detailed_view_right");
    right_bar.innerHTML = "";
    console.log("Ne");

    id_array.sort();

    var clusteredListXSL = loadXMLDoc("./xslt_scripts/xslt_clustered_list.xsl");
    runXSLTDisplayHtml([clusteredListXSL], prioList, "infected_detailed_view_right");
}

