function showNotes() {
    if (!detailedXML) return;

    let notesXSL = getXSLT("./xslt_scripts/xslt_notes_popup.xsl");
    runXSLT(notesXSL, detailedXML, "popup_window");
    let notesDiv = document.getElementById("notesHistoryDiv");

    if (notesDiv) {
        setTimeout(function(){notesDiv.scrollTop = notesDiv.scrollHeight;}, 50);
    }
    displayPopUp();
}

function displayPopUp() {
    let filterOverlay = document.getElementById("global_overlay");
    let popupWindow = document.getElementById("popup_window");
    filterOverlay.classList.remove("invisible_object");
    popupWindow.classList.remove("invisible_object");
}

function hidePopUp() {
    let filterOverlay = document.getElementById("global_overlay");
    let popupWindow = document.getElementById("popup_window");
    filterOverlay.classList.add("invisible_object");
    popupWindow.classList.add("invisible_object");
    popupWindow.innerHTML = "";
}

function showSymptoms () {
    if (!detailedXML) return;
    if ( !symptomsXML ) symptomsXML = loadXMLDoc(apiUrl+"symptom");
    // construct xml document for popup
    let parser = new DOMParser();
    let xmlDocument = constructSymptomPopupXML();

    let symptomsXSL = getXSLT("./xslt_scripts/xslt_edit_symptoms.xsl");
    runXSLT(symptomsXSL, xmlDocument, "popup_window");

    editSymptomsList = symptomsList;

    displayPopUp();
}

function symptomInteraction(id) {
    let checkbox = document.getElementById("symptom_"+id);
    editSymptomsList = changeSymptom(checkbox, editSymptomsList, id);
}

function symptomsChanged(id) {
    let checkbox = document.getElementById("symp_"+id);
    symptomsList = changeSymptom(checkbox, symptomsList, id);
}

function changeSymptom(checkbox, list, id) {
    if (!checkbox) console.log("Error occurred...");

    if ( checkbox.checked ) {
        if (list.indexOf(id) === -1) list.push(id);
    } else {
        const index = list.indexOf(id);
        if (index > -1) list.splice(index, 1);
    }
    return list;
}

function showPreExistingIllnesses() {
    if (!detailedXML) return;
    let illnessXSL = getXSLT("./xslt_scripts/xslt_show_illnesses.xsl");

    runXSLT(illnessXSL, detailedXML, "popup_window");
    displayPopUp();
}

function submitSymptoms() {
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

function constructSymptomPopupXML() {
    let parser = new DOMParser();
    let xmlHeaderString = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE symptomPopupXML SYSTEM "' + apiUrl
        + 'dtd/construct_symptom_popup_xml_result.dtd">';
    let xmlDoc = parser.parseFromString(xmlHeaderString + "<symptomPopupXML></symptomPopupXML>", "application/xml");
    xmlDoc.children[0].appendChild(deepCopyXML(initialSymptoms).children[0]);
    xmlDoc.children[0].appendChild(deepCopyXML(symptomsXML).children[0]);
    xmlDoc.children[0].appendChild(constructIdList().children[0]);
    console.log(xmlDoc);
    return xmlDoc;
}

function constructIdList() {
    let parser = new DOMParser();
    let tempIdString = "<symptomIdList>";
    for (let i = 0; i < symptomsList.length; i++) {
        tempIdString += "<symp_id>"+symptomsList[i]+"</symp_id>";
    }
    return parser.parseFromString(tempIdString + "</symptomIdList>", "application/xml");
}


function prescribeTest(id) {
    makeConfirmPopup("Wollen Sie einen Test anordnen?",
        function(id) {
            const xmlString = "<TestInsertDto><infectedId>"+id+"</infectedId><result>0</result><timestamp>"+Date.now()+"</timestamp></TestInsertDto>";
            postRequest("test", xmlString);
            document.getElementById("prescribe_test").setAttribute("disabled", "disabled");
        }, function (id) { }, id );
}


function makeConfirmPopup(text, onSubmitCallback, onCancelCallback, parameters, blurEffect = false,
                          hideSubmitButton = false,
                          hideCancelButton = false,
                          cancelButtonText= "Abbrechen",
                          submitButtonText = "Bestätigen") {
    confirmConfig = [onSubmitCallback, onCancelCallback, parameters];

    const overlay = document.getElementById("transparent_overlay");
    const textP = document.getElementById("confirm_text");
    textP.innerHTML = text;
    overlay.className = "";
    let submitButton = document.getElementById("submit_confirm_button");
    if (hideSubmitButton) {
        if ( submitButton.classList.contains("invisible_object") ) submitButton.classList.add("invisible_object");
        setFocus("cancel_confirm_button");
    } else {
        submitButton.className = submitButton.className.replace("invisible_object", "");
        setFocus("submit_confirm_button");
    }
    submitButton.innerText = submitButtonText;

    let cancelButton = document.getElementById("cancel_confirm_button");
    cancelButton.innerText = cancelButtonText;

    if ( hideCancelButton ) cancelButton.classList.add( "invisible_object" );
    else if ( cancelButton.classList.contains( "invisible_object" )) cancelButton.classList.remove( "invisible_object" );

    if (blurEffect && !overlay.classList.contains("overlayBlurred")) {
        overlay.classList.add("overlayBlurred");
    } else if (!blurEffect && overlay.classList.contains("overlayBlurred")) {
        overlay.classList.remove("overlayBlurred");
    }

    document.getElementById("confirm_popup").className = "floating_object";
}

function setFocus(id) {
    document.getElementById(id).focus();
}

function onSubmitPopup() {
    hideGenericPopup();
    if ( confirmConfig[0] ) confirmConfig[0](confirmConfig[2]);
    confirmConfig = [null, null, null];
}

function onCancelPopup() {
    hideGenericPopup();
    if ( confirmConfig[1] ) confirmConfig[1](confirmConfig[2]);
    confirmConfig = [null, null, null];
}

function hideGenericPopup() {
    const overlay = document.getElementById("transparent_overlay");
    overlay.className = "invisible_object";
    const popup = document.getElementById("confirm_popup");
    popup.className = "invisible_object";
}

function showSnackbar(message) {
    let snackbar = document.getElementById("snackbar");
    let snackbarText = document.getElementById("centeredSnackbarText");
    snackbarText.innerText = message;
    snackbar.className = snackbar.className.replace(" showSnackbarAnimation", "");
    setTimeout(function() { snackbar.className += " showSnackbarAnimation"; }, 50);

    let detailedView = document.getElementById("infected_detailed_view_right");
    detailedView.scrollTop = detailedView.scrollHeight;
}

function showHelp() {
    if (detailBarMode === 2) return showSnackbar("Die Hilfe kann nur aufgerufen werden, wenn Sie die Patientenansicht schließen!");
    let helpPopup = document.getElementById("helpPopup");
    helpPopup.className = "popupWindowStyle";

    let helpXML = loadXMLDoc("./help/help_popup.xml");
    let helpXSL = getXSLT("./xslt_scripts/xslt_construct_help.xsl");
    runXSLT(helpXSL, helpXML, "helpPopup");

    displayPopUp();
}

function closeHelpPopup() {
    let helpPopup = document.getElementById("helpPopup");
    helpPopup.className = "popupWindowStyle invisible_object";

    hidePopUp();
}

function showHelpPage(path) {
    document.getElementById("helpIframe").setAttribute("src", path);
}


function closeOverlay() {
    document.getElementById("districtsPopup").className = "invisible_object";
}

function showOverlay() {
    document.getElementById("districtsPopup").className = "";
}