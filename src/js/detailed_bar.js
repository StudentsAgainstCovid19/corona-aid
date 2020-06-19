
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
        symptomsList = [];
        var detailed_view = document.getElementById("infected_detailed_view_right");
        detailed_view.innerHTML = "";
        var displayDetailed = getXSLT("./xslt_scripts/xslt_detailed_view.xsl");

        runXSLT([displayDetailed], xml_doc, "infected_detailed_view_right");

        var symptomsXSL = getXSLT("./xslt_scripts/xslt_symptom_div.xsl");
        var symptoms = xml_doc.getElementsByTagName("List")[0];

        runXSLT([symptomsXSL], symptoms, "symptomsDiv");

        var symp_checkboxes = document.getElementById("symptomsDiv").getElementsByClassName("symptom_checkbox");
        for ( var i = 0; i < symp_checkboxes.length; i++)
        {
            var id = parseInt(symp_checkboxes[i].id.replace("symp_",""));
            symptomsList.push(id);
        }
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
{
    if (!detailedXML) return;
    symptomsXML = loadXMLDoc(apiUrl+"symptom");
    var symptomsXSL = getXSLT("./xslt_scripts/xslt_edit_symptoms.xsl");
    runXSLT([symptomsXSL], symptomsXML, "popup_window");

    editSymptomsList = symptomsList;

    var checkbox;
    for (var i = 0; i < symptomsList.length; i++)
    {
        checkbox = document.getElementById("symptom_"+symptomsList[i]);
        if (checkbox) checkbox.checked = true;
    }
    displayPopUp();
}

function symptomInteraction(id)
{
    var checkbox = document.getElementById("symptom_"+id);
    editSymptomsList = changeSymptom(checkbox, editSymptomsList, id);
}

function symptomsChanged(id)
{
    var checkbox = document.getElementById("symp_"+id);
    symptomsList = changeSymptom(checkbox, symptomsList, id);
}

function changeSymptom(checkbox, list, id)
{
    if ( !checkbox )
    {
        console.log("Error occurred...");
    }

    if ( checkbox.checked )
    {
        if (list.indexOf(id) === -1) list.push(id);
    }
    else
    {
        const index = list.indexOf(id);
        if (index > -1)
        {
            list.splice(index, 1);
        }
    }
    return list;
}

function showPreExistingIllnesses()
{
    if (!detailedXML) return;
    var illnessXSL = getXSLT("./xslt_scripts/xslt_show_illnesses.xsl");

    runXSLT([illnessXSL], detailedXML, "popup_window");
    displayPopUp();
}

function submitSymptoms()
{

    symptomsList = editSymptomsList;
    symptomsList.sort((a, b) => a - b);
    editSymptomsList = [];

    var serializer = new XMLSerializer();
    var parser = new DOMParser();
    var items = symptomsXML.getElementsByTagName("item");

    xml_string = "<List>";
    var item_index = 0;

    for ( var i = 0; i < symptomsList.length; i++ )
    {

        for ( ; item_index < items.length; item_index++ )
        {

            var id = parseInt(items[item_index].getElementsByTagName("id")[0].childNodes[0].nodeValue);
            if ( id === symptomsList[i] )
            {
                xml_string += serializer.serializeToString(items[item_index]);
                break;
            }
        }
    }

    xml_string += "</List>";

    // reload symptoms_div, then close popup
    var symptomXSL = getXSLT("./xslt_scripts/xslt_symptom_div.xsl");
    runXSLT([symptomXSL], parser.parseFromString(xml_string, "application/xml"), "symptomsDiv");

    hidePopUp();
}

function slideOpenRightBar()
{
    console.log("Hi");
    let detailedView = document.getElementById("infected_detailed_view_right");
    console.log(detailedView.className);
    if (detailedView.className.indexOf("detailed_slideout") > -1 || detailedView.className === "floating_object") {
        detailedView.className = "floating_object detailed_slidein";
    }
}

function closeRightBar()
{
    console.log("Out");
    let detailedView = document.getElementById("infected_detailed_view_right");
    console.log(detailedView.className);
    if (detailedView.className.indexOf("detailed_slidein") > -1) {
        detailedView.className = "floating_object detailed_slideout";
    }
}

function prescribeTest(id)
{
    makeConfirmPopup("Wollen Sie einen Test anordnen?",
        function(id) {
            if (detailedXML === null) return;
            // TODO: check whether prescribed, change xml, reload detail view
            // var availableTests = detailedXML.getElementsByTagName("test");
            // console.log(availableTests.lastChild);

            const xml_string = "<Test><infected_id>"+id+"</infected_id><result>0</result><timestamp>"+parseInt(Date.now()/1000.0)+"</timestamp></Test>";
            postRequest("test", xml_string);
        }, function (id) { }, id );
}

function makeConfirmPopup(text, onSubmitCallback, onCancelCallback, parameters)
{
    confirmConfig = [onSubmitCallback, onCancelCallback, parameters];

    const overlay = document.getElementById("transparent_overlay");
    const textP = document.getElementById("confirm_text");
    textP.innerText = text;
    overlay.className = "";
    setFocus("submit_confirm_button");
}

function setFocus(id)
{
    document.getElementById(id).focus();
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
                "<symptoms></symptoms>"+
                "<timestamp>" + Date.now() + "</timestamp>" +
                "</History>";

    postRequest("history", xml_string);
    clearRightBar();
}

function closeDetailedView(id)
{
    putRequest("infected/unlock/"+id);
    clearRightBar();
}

function submitDetailView(id)
{
    var xml_string = "<History>" +
        "<infectedId>"+id+"</infectedId>"+
        "<notes>"+document.getElementById("notes_area").value+"</notes>"+
        "<personalFeeling>"+(document.getElementById("wellbeing_slider").value)+"</personalFeeling>"+
        "<status>1</status><symptoms>";
    symptoms = document.getElementsByClassName("symptom_checkbox");

    for (var i=0; i<symptomsList.length; i++)
    {
        xml_string += "<symptom>"+parseInt(symptomsList[i])+"</symptom>";
    }
    xml_string +=
        "</symptoms>" +
        "<timestamp>" + Date.now() + "</timestamp>" +
        "</History>";
    postRequest("history", xml_string);
    clearRightBar();
}

function clearRightBar()
{
    detail_bar = 0;
    closeRightBar();
    document.getElementById("infected_detailed_view_right").innerHTML = "";
}