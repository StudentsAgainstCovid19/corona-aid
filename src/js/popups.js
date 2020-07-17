function showNotes() {
    if (!detailedXML) return;

    let notesXSL = getXSLT("./xslt_scripts/xslt_notes_popup.xsl");
    runXSLT(notesXSL, detailedXML, "popupWindow");
    let notesDiv = document.getElementById("notesHistoryDiv");

    if (notesDiv) {
        setTimeout(function(){notesDiv.scrollTop = notesDiv.scrollHeight;}, 50);
    }
    displayPopUp();
}

function displayPopUp() {
    let filterOverlay = document.getElementById("globalOverlay");
    let popupWindow = document.getElementById("popupWindow");
    filterOverlay.classList.remove("invisibleObject");
    popupWindow.classList.remove("invisibleObject");
}

function hidePopUp() {
    let filterOverlay = document.getElementById("globalOverlay");
    let popupWindow = document.getElementById("popupWindow");
    filterOverlay.classList.add("invisibleObject");
    popupWindow.classList.add("invisibleObject");
    popupWindow.innerHTML = "";
}

function showSymptoms () {
    if (!detailedXML) return;
    if ( !symptomsXML ) symptomsXML = loadXMLDoc(apiUrl+"symptom");
    // construct xml document for popup
    let parser = new DOMParser();
    let xmlDocument = constructSymptomPopupXML();

    let symptomsXSL = getXSLT("./xslt_scripts/xslt_edit_symptoms.xsl");
    runXSLT(symptomsXSL, xmlDocument, "popupWindow");

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

    runXSLT(illnessXSL, detailedXML, "popupWindow");
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
            document.getElementById("prescribeTest").setAttribute("disabled", "disabled");
            document.getElementById("prescribeTest").classList.remove("grayButton");
            document.getElementById("prescribeTest").classList.add("disabledButton");
            console.log(xmlString);
        }, function (id) { }, id );
}


function makeConfirmPopup(text, onSubmitCallback, onCancelCallback, parameters, blurEffect = false,
                          hideSubmitButton = false,
                          hideCancelButton = false,
                          cancelButtonText= "Abbrechen",
                          submitButtonText = "Bestätigen") {
    confirmConfig = [onSubmitCallback, onCancelCallback, parameters];

    const overlay = document.getElementById("transparentOverlay");
    const textP = document.getElementById("confirmText");
    textP.innerHTML = text;
    overlay.className = "";
    let submitButton = document.getElementById("submitConfirmButton");
    if (hideSubmitButton) {
        if ( submitButton.classList.contains("invisibleObject") ) submitButton.classList.add("invisibleObject");
        setFocus("cancelConfirmButton");
    } else {
        submitButton.className = submitButton.className.replace("invisibleObject", "");
        setFocus("submitConfirmButton");
    }
    submitButton.innerText = submitButtonText;

    let cancelButton = document.getElementById("cancelConfirmButton");
    cancelButton.innerText = cancelButtonText;

    if ( hideCancelButton ) cancelButton.classList.add( "invisibleObject" );
    else if ( cancelButton.classList.contains( "invisibleObject" )) cancelButton.classList.remove( "invisibleObject" );

    if (blurEffect && !overlay.classList.contains("overlayBlurred")) {
        overlay.classList.add("overlayBlurred");
    } else if (!blurEffect && overlay.classList.contains("overlayBlurred")) {
        overlay.classList.remove("overlayBlurred");
    }

    document.getElementById("confirmPopup").className = "floatingObject";
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
    const overlay = document.getElementById("transparentOverlay");
    overlay.className = "invisibleObject";
    const popup = document.getElementById("confirmPopup");
    popup.className = "invisibleObject";
}

function showSnackbar(message) {
    let snackbar = document.getElementById("snackbar");
    let snackbarText = document.getElementById("centeredSnackbarText");
    snackbarText.innerText = message;
    snackbar.className = snackbar.className.replace(" showSnackbarAnimation", "");
    setTimeout(function() { snackbar.className += " showSnackbarAnimation"; }, 50);

    let detailedView = document.getElementById("infectedDetailedViewRight");
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
    helpPopup.className = "popupWindowStyle invisibleObject";

    hidePopUp();
}

function showHelpPage(path) {
    document.getElementById("helpIframe").setAttribute("src", path);
}

function openExternalHelpPage(url) {
    window.open(url, "_blank");
}

function closeOverlay() {
    document.getElementById("districtsPopup").className = "invisibleObject";
}

function showOverlay() {
    document.getElementById("districtsPopup").className = "";
}