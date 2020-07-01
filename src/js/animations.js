
function toggle_call_list()
{
    let call_list = document.getElementById("left_bar");
    let search_bar = document.getElementById("search_bar");
    if (call_list.className === "call_list_slideout") {
        call_list.className = "call_list_slidein";
        search_bar.className =  search_bar.className.replace("search_bar_slideout", "") + " search_bar_slidein";
    } else {
        call_list.className = "call_list_slideout";
        search_bar.className =  search_bar.className.replace("search_bar_slidein", "") + " search_bar_slideout";
    }
    close_continue_search();
}

function openCallList()
{
    let call_list = document.getElementById("left_bar");
    let search_bar = document.getElementById("search_bar");
    if (call_list.className.indexOf("call_list_slidein") === -1)
    {
        search_bar.className =  search_bar.className.replace("search_bar_slideout", "") + " search_bar_slidein";
        call_list.className = "call_list_slidein";
    }
}


function slideOpenRightBar()
{
    let detailedView = document.getElementById("right_bar");
    if (detailedView.className.indexOf("detailed_slideout") > -1 || detailedView.className === "floating_object") {
        detailedView.className = "floating_object detailed_slidein";
    }
}

function closeRightBar()
{
    let detailedView = document.getElementById("right_bar");
    if (detailedView.className.indexOf("detailed_slidein") > -1) {
        detailedView.className = "floating_object detailed_slideout";
    }
    currentInfectedId = null;
}

function showLoading()
{
    let loadingScreen = document.getElementById("loadingScreen");
    if ( loadingScreen.classList.contains("invisible_object") ) loadingScreen.classList.remove("invisible_object");
}

function hideLoading() {
    let loadingScreen = document.getElementById("loadingScreen");
    if ( !loadingScreen.classList.contains("invisible_object") ) loadingScreen.classList.add("invisible_object");
}