
function showHelp()
{
    if (detail_bar === 2) return showSnackbar("Die Hilfe kann nur aufgerufen werden, wenn Sie die Patientenansicht schließen!");
    let helpPopup = document.getElementById("helpPopup");
    helpPopup.className = "helpPopup";

    displayPopUp();
}

function closeHelpPopup(){
    let filter_overlay = document.getElementById("global_overlay");
    filter_overlay.className = "invisible_object";
    let helpPopup = document.getElementById("helpPopup");
    helpPopup.className = "invisible_object";
}