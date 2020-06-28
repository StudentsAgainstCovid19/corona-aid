
function showHelp()
{
    if (detail_bar === 2) return showSnackbar("Die Hilfe kann nur aufgerufen werden, wenn Sie die Patientenansicht schließen!");
    let popupWindow = document.getElementById("popup_window");
    popupWindow.innerText="Hilfe? Wechsel doch den Schweregrad, du Noob!";

    displayPopUp();
}