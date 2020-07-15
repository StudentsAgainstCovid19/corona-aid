function tryAcquireLock(id) { // id for infected
    closeContinueSearch();
    if (detailBarMode === 2) return showSnackbar("Die Patientenansicht ist noch geöffnet.\nBitte kümmern Sie sich erst um den derzeitigen Patienten.");

    detailedXML = loadXMLDoc(apiUrl + "infected/" + id, "application/xml", handleErrorsDetailRequest);

    if (detailedXML) {
        addLockingTimer(id);
        if ( detailedXML.getElementsByTagName("done")[0].innerHTML === "true") {
            makeConfirmPopup("Dieser Patient wurde heute bereits bearbeitet.\nFortfahren mit dem Editieren?",
                function (infectedId) {
                    slideOpenRightBar();
                    setDetailedView(detailedXML);
                },
                function(infectedId) {
                    putRequest("infected/unlock/"+infectedId);
                    deleteTimeouts();
                }, id);
        } else {
            slideOpenRightBar();
            setDetailedView(detailedXML);
        }
    }
}

function addLockingTimer(infectedId) {
    if ( autoWarningLocking ) clearTimeout( autoWarningLocking );
    addAutoUnlockTimeout(infectedId);
    autoWarningLocking = setTimeout(function(){
        makeConfirmPopup("Ihre Session läuft in Kürze ab. Möchten Sie die Person weiter bearbeiten?",
            function() {
                postRequest("infected/lock/" + infectedId);
                addLockingTimer(infectedId);
            }, function() {
                if ( autoUnlockTimeout ) clearTimeout( autoUnlockTimeout );
                hidePopUp();
                clearRightBar();
            }, infectedId, true, false, true, "", "Weiter bearbeiten!");
    }, parseInt(configHashTable["autoResetOffset"])*0.8*1000);
}

function addAutoUnlockTimeout(infectedId) {
    if ( autoUnlockTimeout ) clearTimeout(autoUnlockTimeout);
    autoUnlockTimeout = setTimeout(function(){
        onCancelPopup();
        putRequest("infected/unlock/"+infectedId);
        hidePopUp();
        clearRightBar();
    }, parseInt(configHashTable["autoResetOffset"])*1000);
}

function deleteTimeouts() {
    if (autoUnlockTimeout) clearTimeout(autoUnlockTimeout);
    if (autoWarningLocking) clearTimeout(autoWarningLocking);
}

function handleErrorsDetailRequest( statusCode ) {
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
    makeConfirmPopup(displayText, null, null, null, false,false, true, "Schließen");
}

function parseInfectedID(xmlDocument) {
    let children = xmlDocument.children[0].children;
    let id;
    for (let index = 0; index < children.length; index++) {
        if (children[index].nodeName === "id") {
            id = parseInt(children[index].innerHTML);
            break;
        }
    }
    return id;
}

// set the detailed view with a given xml file for all specific data
function setDetailedView(xmlDoc) {
    if ( xmlDoc ) {
        detailBarMode = 2;
        currentInfectedId = parseInfectedID(xmlDoc);
        symptomsList = [];

        let displayDetailed = getXSLT("./xslt_scripts/xslt_detailed_view.xsl");

        runXSLT(displayDetailed, xmlDoc, "infected_detailed_view_right");

        let parseSymptomsXSL = getXSLT("./xslt_scripts/xslt_parse_symptoms.xsl");
        initialSymptoms = runXSLT(parseSymptomsXSL, xmlDoc);

        let symptomsXSL = getXSLT("./xslt_scripts/xslt_symptom_div.xsl");

        runXSLT(symptomsXSL, initialSymptoms, "symptomsDiv");

        let sympCheckboxes = document.getElementById("symptomsDiv").getElementsByClassName("symptom_checkbox");
        for ( let i = 0; i < sympCheckboxes.length; i++) {
            let id = parseInt(sympCheckboxes[i].id.replace("symp_",""));
            symptomsList.push(id);
        }
    }
}

function deepCopyXML(node) {
    let parser = new DOMParser();
    let serializer = new XMLSerializer();
    return parser.parseFromString(serializer.serializeToString(node), "application/xml");
}



function failedCall(id) {
    const xmlString = "<History>" +
                "<infectedId>"+id+"</infectedId>"+
                "<notes></notes>"+
                "<personalFeeling>0</personalFeeling>"+
                "<status>0</status>"+
                "<symptoms></symptoms>"+
                "<timestamp>" + Date.now() + "</timestamp>" +
                "</History>";

    postRequest("history", xmlString);
    deleteTimeouts();
    clearRightBar();
}

function closeDetailedView(id) {
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

function submitDetailView(id, historyItemId = null) {
    let xmlString = "<HistoryItem"+(historyItemId ? "Update" : "Insert")+"Dto>"+
        ( historyItemId ? "<historyItemId>" + historyItemId + "</historyItemId>" : "") +
        "<infectedId>"+id+"</infectedId>"+
        "<notes>"+document.getElementById("notes_area").value+"</notes>"+
        "<personalFeeling>"+(document.getElementById("wellbeing_slider").value)+"</personalFeeling>"+
        "<status>1</status><symptoms>";
    symptoms = document.getElementsByClassName("symptom_checkbox");

    for (let i = 0; i < symptomsList.length; i++) {
        xmlString += "<symptom>"+parseInt(symptomsList[i])+"</symptom>";
    }
    xmlString +=
        "</symptoms>" +
        "<timestamp>" + Date.now() + "</timestamp>" +
        "</HistoryItem"+(historyItemId ? "Update" : "Insert")+"Dto>";
    if (!historyItemId) {
        postRequest("history", xmlString);
    } else {
        putRequest("history", xmlString);
    }

    deleteTimeouts();
    clearRightBar();
}

function clearRightBar() {
    detailBarMode = 0;
    closeRightBar();
    document.getElementById("infected_detailed_view_right").innerHTML = "";
}
