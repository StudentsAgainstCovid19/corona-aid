
function try_acquire_lock(id) { // id for infected
    close_continue_search();
    if (detail_bar === 2) return showSnackbar("Die Patientenansicht ist noch geöffnet.\nBitte kümmern Sie sich erst um den derzeitigen Patienten.");
    console.log("Trying to load infected: "+id);
    detailedXML = loadXMLDoc(apiUrl + "infected/" + id, "application/xml", handleErrorsDetailRequest);

    if ( detailedXML )
    {
        addLockingTimer(id);
        if ( detailedXML.getElementsByTagName("done")[0].innerHTML === "true") {
            makeConfirmPopup("Dieser Patient wurde heute bereits bearbeitet.\nFortfahren mit dem Editieren?",
                function (infectedId) {
                    slideOpenRightBar();
                    setDetailedView(detailedXML);
                },
                function(infectedId)
                {
                    putRequest("infected/unlock/"+infectedId);
                    deleteTimeouts();
                }, id);
        }
        else
        {
            slideOpenRightBar();
            setDetailedView(detailedXML);
        }
    }
    console.log(detailedXML);
}

function addLockingTimer(infectedId)
{
    if ( autoWarningLocking ) clearTimeout( autoWarningLocking );
    addAutoUnlockTimeout(infectedId);
    autoWarningLocking = setTimeout(function(){
        makeConfirmPopup("Ihre Session läuft ab.\n Wollen Sie weiterhin den Patienten bearbeiten?",
            function(){
                postRequest("infected/lock/" + infectedId);
                addLockingTimer(infectedId);
            }, function(){
                if ( autoUnlockTimeout ) clearTimeout(autoUnlockTimeout);
                putRequest("infected/unlock/" + infectedId);
                hidePopUp();
                clearRightBar();
            }, infectedId);
    }, parseInt(config_hash_table["autoResetOffset"])*0.8*1000);


}

function addAutoUnlockTimeout(infectedId)
{
    if ( autoUnlockTimeout ) clearTimeout(autoUnlockTimeout);
    autoUnlockTimeout = setTimeout(function(){
        onCancelPopup();
        putRequest("infected/unlock/"+infectedId);
        hidePopUp();
        clearRightBar();
    }, parseInt(config_hash_table["autoResetOffset"])*1000);

}

function deleteTimeouts()
{
    if ( autoUnlockTimeout ) clearTimeout(autoUnlockTimeout);
    if ( autoWarningLocking ) clearTimeout(autoWarningLocking);
}

function handleErrorsDetailRequest( statusCode )
{
    let displayText;
    switch (statusCode) {
        case 200:
            return;
        case 423:
            displayText = "Der Patient ist gerade in Bearbeitung.\n" +
                "Wählen Sie einen anderen Patienten aus.";
            break;
        case 404:
            displayText = "Es ist ein Fehler aufgetreten.\n" +
                "Fehlermeldung: 404 - Infected not found.";
            break;
        default:
            return;

    }
    makeConfirmPopup(displayText, null, null, null, true, "Schließen");
}

function parseInfectedID(xmlDocument)
{
    let children = xmlDocument.children[0].children;
    let id;
    for (let index = 0; index < children.length; index++)
    {
        if (children[index].nodeName === "id")
        {
            id = parseInt(children[index].innerHTML);
            break;
        }
    }
    return id;
}

// set the detailed view with a given xml file for all specific data
function setDetailedView(xml_doc)
{
    if (xml_doc != null)
    {
        detail_bar = 2;
        currentInfectedId = parseInfectedID(xml_doc);
        symptomsList = [];

        let displayDetailed = getXSLT("./xslt_scripts/xslt_detailed_view.xsl");

        runXSLT(displayDetailed, xml_doc, "infected_detailed_view_right");

        let parseSymptomsXSL = getXSLT("./xslt_scripts/xslt_parse_symptoms.xsl");
        initialSymptoms = runXSLT(parseSymptomsXSL, xml_doc);


        let symptomsXSL = getXSLT("./xslt_scripts/xslt_symptom_div.xsl");

        runXSLT(symptomsXSL, initialSymptoms, "symptomsDiv");

        let symp_checkboxes = document.getElementById("symptomsDiv").getElementsByClassName("symptom_checkbox");
        for ( let i = 0; i < symp_checkboxes.length; i++)
        {
            let id = parseInt(symp_checkboxes[i].id.replace("symp_",""));
            symptomsList.push(id);
        }
    }
}

function showNotes()
{
    if (!detailedXML) return;

    var notesXSL = getXSLT("./xslt_scripts/xslt_notes_popup.xsl");
    runXSLT(notesXSL, detailedXML, "popup_window");
    let notesDiv = document.getElementById("notesHistoryDiv");

    if (notesDiv)
    {
        setTimeout(function(){notesDiv.scrollTop = notesDiv.scrollHeight;}, 50);
    }
    displayPopUp();
}

function displayPopUp()
{
    let filter_overlay = document.getElementById("global_overlay");
    let popup_window = document.getElementById("popup_window");
    filter_overlay.className = "";
    popup_window.className = "";
}

function hidePopUp()
{
    let filter_overlay = document.getElementById("global_overlay");
    let popup_window = document.getElementById("popup_window");
    filter_overlay.className = "invisible_object";
    popup_window.className = "invisible_object";
    popup_window.innerHTML = "";
}

function deepCopyXML(node)
{
    let parser = new DOMParser();
    let serializer = new XMLSerializer();
    return parser.parseFromString(serializer.serializeToString(node), "application/xml");
}

function showSymptoms ()
{
    if (!detailedXML) return;
    if ( !symptomsXML ) symptomsXML = loadXMLDoc(apiUrl+"symptom");
    // construct xml document for popup
    let parser = new DOMParser();
    let xmlDocument = constructSymptomPopupXML();

    var symptomsXSL = getXSLT("./xslt_scripts/xslt_edit_symptoms.xsl");
    runXSLT(symptomsXSL, xmlDocument, "popup_window");

    editSymptomsList = symptomsList;

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

    runXSLT(illnessXSL, detailedXML, "popup_window");
    displayPopUp();
}

function submitSymptoms()
{
    if ( !symptomsXML ) symptomsXML = loadXMLDoc(apiUrl+"symptom");

    symptomsList = editSymptomsList;
    symptomsList.sort((a, b) => a - b);

    let xmlDoc = constructSymptomPopupXML();



    let mergeSymptomsXSL = getXSLT("./xslt_scripts/xslt_merge_symptoms.xsl");
    let mergedXML = runXSLT(mergeSymptomsXSL, xmlDoc);

    // reload symptoms_div, then close popup
    let symptomXSL = getXSLT("./xslt_scripts/xslt_symptom_div.xsl");
    runXSLT(symptomXSL, mergedXML, "symptomsDiv");

    hidePopUp();
}

function constructSymptomPopupXML()
{
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString("<symptomPopupXML></symptomPopupXML>", "application/xml");
    xmlDoc.children[0].appendChild(deepCopyXML(initialSymptoms).children[0]);
    xmlDoc.children[0].appendChild(deepCopyXML(symptomsXML).children[0]);
    xmlDoc.children[0].appendChild(constructIdList().children[0]);
    return xmlDoc;
}

function constructIdList()
{
    let parser = new DOMParser();
    let temp_id_string = "<symptomIdList>";
    for (let i = 0; i < symptomsList.length; i++)
    {
        temp_id_string += "<symp_id>"+symptomsList[i]+"</symp_id>";
    }
    return parser.parseFromString(temp_id_string + "</symptomIdList>", "application/xml");
}


function prescribeTest(id)
{
    makeConfirmPopup("Wollen Sie einen Test anordnen?",
        function(id) {
            if (detailedXML === null) return;

            const xmlString = "<TestInsertDto><infectedId>"+id+"</infectedId><result>0</result><timestamp>"+Date.now()+"</timestamp></TestInsertDto>";
            postRequest("test", xmlString);
        }, function (id) { }, id );
}

function makeConfirmPopup(text, onSubmitCallback, onCancelCallback, parameters, hideSubmitButton = false, cancelButtonText="Abbrechen")
{
    confirmConfig = [onSubmitCallback, onCancelCallback, parameters];

    const overlay = document.getElementById("transparent_overlay");
    const textP = document.getElementById("confirm_text");
    textP.innerHTML = text;
    overlay.className = "";
    let submitButton = document.getElementById("submit_confirm_button");
    if (hideSubmitButton)
    {
        if ( submitButton.className.indexOf("invisible_object") === -1 ) submitButton.className += " invisible_object";
        setFocus("cancel_confirm_button");
    }
    else
    {
        submitButton.className = submitButton.className.replace("invisible_object", "");
        setFocus("submit_confirm_button");
    }

    let cancelButton = document.getElementById("cancel_confirm_button");
    cancelButton.innerText = cancelButtonText;
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
    if (confirmConfig[1] != null)
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
    deleteTimeouts();
    clearRightBar();
}

function closeDetailedView(id)
{
    makeConfirmPopup(   "Sind Sie sich sicher, dass Sie die Patientenansicht schließen wollen?\n" +
                            "Ein Datenverlust wird die Folge sein. Falls der Patient nicht abgenommen\n" +
                            "hat, wählen Sie den Button \"nicht abgenommen\"!\n\n" +
                            "                   Trotzdem fortfahren?                                ",
        function(infectedId){
            deleteTimeouts();
            putRequest("infected/unlock/"+id);
            clearRightBar();
        }, function(notUsed){}, id);
}

function submitDetailView(id, historyItemId = null)
{
    let xmlString = "<History>" +
        ( historyItemId ? "<historyItemId>" + historyItemId + "</historyItemId>" : "") +
        "<infectedId>"+id+"</infectedId>"+
        "<notes>"+document.getElementById("notes_area").value+"</notes>"+
        "<personalFeeling>"+(document.getElementById("wellbeing_slider").value)+"</personalFeeling>"+
        "<status>1</status><symptoms>";
    symptoms = document.getElementsByClassName("symptom_checkbox");

    for (let i=0; i<symptomsList.length; i++)
    {
        xmlString += "<symptom>"+parseInt(symptomsList[i])+"</symptom>";
    }
    xmlString +=
        "</symptoms>" +
        "<timestamp>" + Date.now() + "</timestamp>" +
        "</History>";

    if ( !historyItemId )
    {
        postRequest("history", xmlString);
    }
    else
    {
        putRequest("history", xmlString);
    }

    deleteTimeouts();
    clearRightBar();
}

function clearRightBar()
{
    detail_bar = 0;
    closeRightBar();
    document.getElementById("infected_detailed_view_right").innerHTML = "";
}

function showSnackbar(message)
{
    let snackbar = document.getElementById("snackbar");
    let snackbarText = document.getElementById("centeredSnackbarText");
    snackbarText.innerText = message;
    snackbar.className = snackbar.className.replace(" showSnackbarAnimation", "");
    setTimeout(function(){snackbar.className += " showSnackbarAnimation"}, 50);

    let detailedView = document.getElementById("infected_detailed_view_right");
    detailedView.scrollTop = detailedView.scrollHeight;
}