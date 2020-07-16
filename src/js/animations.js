function toggleCallList() {
    let callList = document.getElementById("leftBar");
    let searchBar = document.getElementById("searchBar");
    let actionBar = document.getElementById("actionBar");
    if (callList.className === "callListSlideout") {
        callList.className = "callListSlidein";
        searchBar.className =  searchBar.className.replace("searchBarSlideout", "") + " searchBarSlidein";
        actionBar.className =  actionBar.className.replace("actionBarSlideout", "") + " actionBarSlidein";
    } else {
        callList.className = "callListSlideout";
        searchBar.className =  searchBar.className.replace("searchBarSlidein", "") + " searchBarSlideout";
        actionBar.className =  actionBar.className.replace("actionBarSlidein", "") + " actionBarSlideout";
    }
    closeContinueSearch();
}

function openCallList() {
    let callList = document.getElementById("leftBar");
    let searchBar = document.getElementById("searchBar");
    let actionBar = document.getElementById("actionBar");
    if (callList.className.indexOf("callListSlidein") === -1) {
        searchBar.className =  searchBar.className.replace("searchBarSlideout", "") + " searchBarSlidein";
        actionBar.className =  actionBar.className.replace("actionBarSlideout", "") + " actionBarSlidein";
        callList.className = "callListSlidein";
    }
}


function slideOpenRightBar() {
    let detailedView = document.getElementById("rightBar");
    let progressBar = document.getElementById("progressBarDiv");
    if (detailedView.className.indexOf("detailedSlideout") > -1 || detailedView.className === "floatingObject") {
        detailedView.className = "floatingObject detailedSlidein";
        progressBar.className = "progressBarSlidein";
    }
}

function closeRightBar() {
    let detailedView = document.getElementById("rightBar");
    let progressBar = document.getElementById("progressBarDiv");
    if (detailedView.className.indexOf("detailedSlidein") > -1) {
        detailedView.className = "floatingObject detailedSlideout";
        progressBar.className = "progressBarSlideout";
    }
    currentInfectedId = null;
}

function showLoading() {
    let loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen.classList.contains("invisibleObject")) loadingScreen.classList.remove("invisibleObject");
}

function hideLoading() {
    let loadingScreen = document.getElementById("loadingScreen");
    if (!loadingScreen.classList.contains("invisibleObject")) loadingScreen.classList.add("invisibleObject");
}