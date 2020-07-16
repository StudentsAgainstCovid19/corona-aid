async function searchCallList() {
    currentlySearched = true;
    window.location.hash = "";
    deleteScrollId();

    let inputField = document.getElementById("searchInput");
    let words = inputField.value.toLowerCase().split(" ");
    let callListItems = getAllNotHiddenCallBoxes();
    currentCallBoxes = callListItems;

    if (callListItems.length === 0) return noItemFound();

    let hits = [];

    let text, nameText, phoneText;
    for (let i = 0; i < callListItems.length; i++) {
        nameText = callListItems[i].getElementsByTagName("span")[0].innerText;
        phoneText = callListItems[i].getElementsByTagName("span")[2].innerText;
        text = (nameText+" "+phoneText.replace("Tel.: ","")).replace(",", "").toLowerCase();
        if (checkIn(text, words)) hits.push(i);
    }

    foundIndices = hits;
    currentFoundIndex = 0;
    if (hits.length > 0) {
        scrollToIndex(hits[0]);
    } else {
        noItemFound();
    }
}

function deleteScrollId() {
    let scrollToDiv = document.getElementById("scrollTo");
    if (scrollToDiv) {
        scrollToDiv.children[0].removeEventListener("keyup", function(e){});
        scrollToDiv.children[0].removeEventListener("keydown", function(e){});
        scrollToDiv.id = ""; // delete id
    }
}

function scrollToIndex(index) {
    deleteScrollId();
    openCallList();
    let foundDiv = currentCallBoxes[parseInt(index)];
    foundDiv.id = "scrollTo";
    let childDiv = foundDiv.childNodes[0];
    childDiv.className = childDiv.className.replace("foundCallItems", "");
    setTimeout(function () {
        childDiv.className += " foundCallItems";
    }, 100);
    window.location.hash = "#scrollTo";
    addKeyClickListenerToChild("scrollTo");
    showContinueSearch();
}

function getAllNotHiddenCallBoxes() {
    let callListItems = document.getElementsByClassName("callListElement");
    if (callListItems.toString().indexOf("HTMLCollection") !== -1) callListItems = Array.prototype.slice.call(callListItems);
    for (let index = callListItems.length - 1; index >= 0; index--) {
        if (callListItems[parseInt(index)].className.indexOf("hiddenBox") !== -1) {
            callListItems.splice(index, 1);
        }
    }
    return callListItems;
}

function noItemFound() {
    let searchbar = document.getElementById("searchContainer");
    searchbar.className = searchbar.className.replace(" noCallItemsFound","");
    setTimeout(function() {
        searchbar.className += " noCallItemsFound";
    }, 100);
    currentlySearched = false;
}

function checkIn(str, words) {
    for (let i = 0; i < words.length; i++) {
        if (str.indexOf(words[parseInt(i)]) === -1) return false;
    }
    return true;
}

function addSearchBarListener() {
    let searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("keyup", function (event){
        if (event.key === "Enter") searchCallList();
    });
}


function addKeyClickListenerToChild(elemId) {
    let box = document.getElementById(elemId).children[0];
    onEnter = false;

    box.addEventListener("keyup", function (event) {
        setTimeout(function(){ calledLast = false; }, 200);
        setTimeout(function(){ calledNext = false; }, 200);
        if (event.key === "Enter") {
            if(onEnter) return;
            box.click();
            onEnter = true;
        }
        else if (event.key === "s") {
            if (!calledLast) {
                findLast();
                calledLast = true;
            }
        } else if (event.key === "d") {
            if (!calledNext) {
                findNext();
                calledNext = true;
            }
        }
    });
    box.focus();
}

function closeContinueSearch() {
    document.getElementById("continueSearchButtons").className += " invisibleObject";
    console.log(); // without, hiding of continue search box is very laggy

    if (suppressUpdates) enforceUpdate();
    suppressUpdates = false;
}

function showContinueSearch() {
    suppressUpdates = true;
    updateButtonStates();
    let continueSearchBar = document.getElementById("continueSearchButtons");
    continueSearchBar.className = continueSearchBar.className.replace(" invisibleObject", "");
    setTimeout(function (){ closeContinueSearch(); }, parseInt(configHashTable["closeContinueSearchTime"]));
}

function findNext() {
    if (currentFoundIndex < (foundIndices.length - 1)) {
        currentFoundIndex++;
        scrollToIndex(foundIndices[currentFoundIndex]);
    }
    updateButtonStates();
}

function findLast() {
    if (currentFoundIndex > 0) {
        currentFoundIndex--;
        scrollToIndex(foundIndices[currentFoundIndex]);
    }
    updateButtonStates();
}

function updateButtonStates() {
    let nextButton = document.getElementById("nextSearchButton");
    let lastButton = document.getElementById("lastSearchButton");
    nextButton.className = nextButton.className.replace("disabledButton", "");
    lastButton.className = nextButton.className.replace("disabledButton", "");
    if (currentFoundIndex === 0) lastButton.className += " disabledButton";
    if (currentFoundIndex >= (foundIndices.length - 1)) nextButton.className += " disabledButton";
}