function toggleCallList() {
    let callList = document.getElementById("left_bar");
    let searchBar = document.getElementById("search_bar");
    let actionBar = document.getElementById("actionBar");
    if (callList.className === "call_list_slideout") {
        callList.className = "call_list_slidein";
        searchBar.className =  searchBar.className.replace("search_bar_slideout", "") + " search_bar_slidein";
        actionBar.className =  actionBar.className.replace("actionBarSlideout", "") + " actionBarSlidein";
    } else {
        callList.className = "call_list_slideout";
        searchBar.className =  searchBar.className.replace("search_bar_slidein", "") + " search_bar_slideout";
        actionBar.className =  actionBar.className.replace("actionBarSlidein", "") + " actionBarSlideout";
    }
    closeContinueSearch();
}

function openCallList() {
    let callList = document.getElementById("left_bar");
    let searchBar = document.getElementById("search_bar");
    let actionBar = document.getElementById("actionBar");
    if (callList.className.indexOf("call_list_slidein") === -1) {
        searchBar.className =  searchBar.className.replace("search_bar_slideout", "") + " search_bar_slidein";
        actionBar.className =  actionBar.className.replace("actionBarSlideout", "") + " actionBarSlidein";
        callList.className = "call_list_slidein";
    }
}


function slideOpenRightBar() {
    let detailedView = document.getElementById("right_bar");
    let progressBar = document.getElementById("progressBarDiv");
    if (detailedView.className.indexOf("detailed_slideout") > -1 || detailedView.className === "floating_object") {
        detailedView.className = "floating_object detailed_slidein";
        progressBar.className = "progressBarSlidein";
    }
}

function closeRightBar() {
    let detailedView = document.getElementById("right_bar");
    let progressBar = document.getElementById("progressBarDiv");
    if (detailedView.className.indexOf("detailed_slidein") > -1) {
        detailedView.className = "floating_object detailed_slideout";
        progressBar.className = "progressBarSlideout";
    }
    currentInfectedId = null;
}

function showLoading() {
    let loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen.classList.contains("invisible_object")) loadingScreen.classList.remove("invisible_object");
}

function hideLoading() {
    let loadingScreen = document.getElementById("loadingScreen");
    if (!loadingScreen.classList.contains("invisible_object")) loadingScreen.classList.add("invisible_object");
}