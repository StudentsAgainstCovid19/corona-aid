
function showHelp()
{
    if (detail_bar === 2) return showSnackbar("Die Hilfe kann nur aufgerufen werden, wenn Sie die Patientenansicht schließen!");
    let popupWindow = document.getElementById("popup_window");
    popupWindow.className = "helpPopup";
    let helpPopup = document.getElementById("helpPopup");
    helpPopup.className = "helpPopup";

    displayPopUp();
}

function closeHelpPopup(){
    let filter_overlay = document.getElementById("global_overlay");
    let popup_window = document.getElementById("popup_window");
    filter_overlay.className = "invisible_object";
    popup_window.className = "invisible_object";
    let helpPopup = document.getElementById("helpPopup");
    helpPopup.className = "invisible_object";
}