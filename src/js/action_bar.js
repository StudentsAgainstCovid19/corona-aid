function showHelp() {
    if (detailBarMode === 2) return showSnackbar("Die Hilfe kann nur aufgerufen werden, wenn Sie die Patientenansicht schließen!");
    let helpPopup = document.getElementById("helpPopup");
    helpPopup.className = "popupWindowStyle";

    displayPopUp();
}

function closeHelpPopup() {
    let filterOverlay = document.getElementById("global_overlay");
    filterOverlay.className = "invisible_object";
    let helpPopup = document.getElementById("helpPopup");
    helpPopup.className = "popupWindowStyle invisible_object";
}