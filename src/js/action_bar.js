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

function openExternalHelpPage(url) {
    window.open(url, "_blank");
}