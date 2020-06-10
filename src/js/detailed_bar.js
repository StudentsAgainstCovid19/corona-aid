
function try_acquire_lock(id)
{ // id for infected
    slideOpenRightBar();
    console.log(id);
    detailedXML = loadXMLDoc("./example_xmls/detailed_infected.xml"); // TODO
    setDetailedView(detailedXML);
}

// set the detailed view with a given xml file for all specific data
function setDetailedView(xml_doc)
{
    if (xml_doc != null)
    {
        var detailed_view = document.getElementById("infected_detailed_view_right");
        detailed_view.innerHTML = "";
        var stringHelpersXSL = loadXMLDoc("./xslt_scripts/xslt_string_helpers.xsl");
        var prioHelperXSL = loadXMLDoc("./xslt_scripts/xslt_calculate_prio.xsl");
        var displayDetailed = loadXMLDoc("./xslt_scripts/xslt_detailed_view.xsl");

        runXSLTDisplayHtml([stringHelpersXSL, prioHelperXSL, displayDetailed], xml_doc, "infected_detailed_view_right");
    }
}

function displayPopUp()
{
    var filter_overlay = document.getElementById("global_overlay");
    var popup_window = document.getElementById("popup_window");
    filter_overlay.className = "";
    popup_window.className = "";
}

function hidePopUp()
{
    var filter_overlay = document.getElementById("global_overlay");
    var popup_window = document.getElementById("popup_window");
    filter_overlay.className = "invisible_object";
    popup_window.className = "invisible_object";
    popup_window.innerHTML = "";
}

function showSymptoms ()
{ // TODO
    if (!detailedXML) return;
    var symptomsXSL = loadXMLDoc("./xslt_scripts/xslt_edit_symptoms.xsl");
    runXSLTDisplayHtml([symptomsXSL], detailedXML, "popup_window");
    displayPopUp();
}

function showPreExistingIllnesses()
{
    if (!detailedXML) return;
    var illnessXSL = loadXMLDoc("./xslt_scripts/xslt_show_illnesses.xsl");
    console.log(illnessXSL)
    console.log(detailedXML)
    runXSLTDisplayHtml([illnessXSL], detailedXML, "popup_window");
    displayPopUp();
}

function slideOpenRightBar()
{

}

function closeRightBar()
{

}