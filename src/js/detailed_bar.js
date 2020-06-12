
function try_acquire_lock(id)
{ // id for infected
    if (detail_bar === 2) return;

    slideOpenRightBar();
    detailedXML = loadXMLDoc("./example_xmls/detailed_infected.xml");// ("api.sac19.jatsqi.com/infected/"+id);
    setDetailedView(detailedXML);
}

// set the detailed view with a given xml file for all specific data
function setDetailedView(xml_doc)
{
    if (xml_doc != null)
    {
        detail_bar = 2;
        var detailed_view = document.getElementById("infected_detailed_view_right");
        detailed_view.innerHTML = "";
        var stringHelpersXSL = getXSLT("./xslt_scripts/xslt_string_helpers.xsl");
        var prioHelperXSL = getXSLT("./xslt_scripts/xslt_calculate_prio.xsl");
        var displayDetailed = getXSLT("./xslt_scripts/xslt_detailed_view.xsl");

        runXSLT([stringHelpersXSL, prioHelperXSL, displayDetailed], xml_doc, "infected_detailed_view_right");
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
    var symptomsXSL = getXSLT("./xslt_scripts/xslt_edit_symptoms.xsl");
    runXSLT([symptomsXSL], detailedXML, "popup_window");
    displayPopUp();
}

function showPreExistingIllnesses()
{
    if (!detailedXML) return;
    var illnessXSL = getXSLT("./xslt_scripts/xslt_show_illnesses.xsl");

    runXSLT([illnessXSL], detailedXML, "popup_window");
    displayPopUp();
}

// TODO
function submitSymptoms()
{

}

function slideOpenRightBar()
{

}

function closeRightBar()
{

}

function prescribeTest(id)
{
    makeConfirmPopup("Wollen Sie einen Test anordnen?",
        function(id) {
            if (detailedXML === null) return;
            // TODO: check whether prescribed, change xml, reload detail view
            console.log(id);

            const xml_string = "<Test><id>"+id+"</id><result>0</result><timestamp>"+parseInt(Date.now()/1000.0)+"</timestamp></Test>";
            postRequest("test", xml_string);
        }, function (id) { }, id );
}

var confirmConfig = [null, null, null];
function makeConfirmPopup(text, onSubmitCallback, onCancelCallback, parameters)
{
    confirmConfig = [onSubmitCallback, onCancelCallback, parameters];

    const overlay = document.getElementById("transparent_overlay");
    const textP = document.getElementById("confirm_text");
    textP.innerText = text;
    overlay.className = "";
}

function onSubmitPopup()
{

    const overlay = document.getElementById("transparent_overlay");
    overlay.className = "invisible_object";
    if (confirmConfig[0] != null)
    {
        confirmConfig[0](confirmConfig[2]);
    }
    confirmConfig = [null, null, null];
}

function onCancelPopup()
{
    const overlay = document.getElementById("transparent_overlay");
    overlay.className = "invisible_object";
    if (confirmConfig[0] != null)
    {
        confirmConfig[1](confirmConfig[2]);
    }
    confirmConfig = [null, null, null];
}

function failedCall(id)
{
    const xml_string = "<History>" +
                "<infectedId>"+id+"</infectedId>"+
                "<notes></notes>"+
                "<personalFeeling>0</personalFeeling>"+
                "<status>0</status>"+
                "<symptom><symptom>0</symptom></symptom>"+
                "<timestamp>" + Date.now() + "</timestamp>" +
                "</History>";


    postRequest("history", xml_string);
    clearRightBar();
}

function closeDetailedView(id)
{
    // TODO: unlock entry
    clearRightBar();
}

function submitDetailView(id)
{
    var xml_string = "<History>" +
        "<infectedId>"+id+"</infectedId>"+
        "<notes>"+document.getElementById("notes_area").value+"</notes>"+
        "<personalFeeling>"+(document.getElementById("wellbeing_slider").value)+"</personalFeeling>"+
        "<status>0</status><symptom>";// TODO
    symptoms = document.getElementsByClassName("symptom_checkbox");

    for (var i=0; i<symptoms.length; i++)
    {
        console.log(symptoms[i].checked)
        if (symptoms[i].checked)
        {
            console.log(symptoms[i].id)
            xml_string += "<symptom_id>"+parseInt(symptoms[i].id)+"</symptom_id>";
        }
    }
    xml_string +=
        "</symptom>"+ // TODO
        "<timestamp>" + Date.now() + "</timestamp>" +
        "</History>";
    console.log(xml_string);
    postRequest("history", xml_string);
    clearRightBar();
}

function clearRightBar()
{
    detail_bar = 0;
    document.getElementById("infected_detailed_view_right").innerHTML = "";
    closeRightBar();
}