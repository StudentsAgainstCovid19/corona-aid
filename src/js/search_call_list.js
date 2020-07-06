async function search_call_list() {
    currentlySearched = true;
    window.location.hash = "";
    deleteScrollId();

    let input_field = document.getElementById("search_input");
    let words = input_field.value.toLowerCase().split(" ");
    let callListItems = getAllNotHiddenCallBoxes();
    currentCallBoxes = callListItems;

    if (callListItems.length === 0) return noItemFound();

    let hits = [];

    let text, nameText, phoneText;
    for (let i = 0; i<callListItems.length; i++) {
        nameText = callListItems[parseInt(i)].getElementsByTagName("span")[0].innerText;
        phoneText = callListItems[parseInt(i)].getElementsByTagName("span")[2].innerText;
        text = (nameText+" "+phoneText.replace("Tel.: ","")).replace(",", "").toLowerCase();
        if (check_in(text, words)) hits.push(i);
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
    let scrollToDiv = document.getElementById("scroll_to");
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
    foundDiv.id = "scroll_to";
    let childDiv = foundDiv.childNodes[0];
    childDiv.className = childDiv.className.replace("found_call_items", "");
    setTimeout(function () {
        childDiv.className += " found_call_items";
    }, 100);
    window.location.hash = "#scroll_to";
    addKeyClickListenerToChild("scroll_to");
    show_continue_search();
}

function getAllNotHiddenCallBoxes() {
    let call_list_items = document.getElementsByClassName("call_list_element");
    if (call_list_items.toString().indexOf("HTMLCollection") !== -1) call_list_items = Array.prototype.slice.call(call_list_items);
    for (let index = call_list_items.length - 1; index >= 0; index--) {
        if (call_list_items[parseInt(index)].className.indexOf("hidden_box") !== -1) {
            call_list_items.splice(index, 1);
        }
    }
    return call_list_items;
}

function noItemFound() {
    let searchbar = document.getElementById("search_container");
    searchbar.className = searchbar.className.replace(" no_call_items_found","");
    setTimeout(function() {
        searchbar.className += " no_call_items_found";
    }, 100);
    currentlySearched = false;
}

function check_in(str, words) {
    for (let i = 0; i<words.length;i++) {
        if (str.indexOf(words[parseInt(i)]) === -1) return false;
    }
    return true;
}

function addSearchBarListener() {
    let searchBar = document.getElementById("search_bar");
    searchBar.addEventListener("keyup", function (event){
        if (event.key === "Enter") search_call_list();
    });
}


function addKeyClickListenerToChild(elemId) {
    let box = document.getElementById(elemId).children[0];
    onEnter = false;

    box.addEventListener("keyup", function (event) {
        setTimeout(function(){calledLast = false;}, 200);
        setTimeout(function(){calledNext = false;}, 200);
        if ( event.key === "Enter" ) {
            if( onEnter ) return;
            box.click();
            onEnter = true;
        }
        else if (event.key === "s") {
            if ( !calledLast ) {
                findLast();
                calledLast = true;
            }
        } else if (event.key === "d") {
            if ( !calledNext ) {
                findNext();
                calledNext = true;
            }
        }
    });
    box.focus();
}

function close_continue_search() {
    document.getElementById("continue_search_buttons").className += " invisible_object";
    console.log(); // without, hiding of continue search box is very laggy

    if (suppressUpdates) enforceUpdate();
    suppressUpdates = false;
}

function show_continue_search() {
    suppressUpdates = true;
    updateButtonStates();
    let continue_search_bar = document.getElementById("continue_search_buttons");
    continue_search_bar.className = continue_search_bar.className.replace(" invisible_object", "");
    setTimeout(function (){ close_continue_search(); }, parseInt(config_hash_table["closeContinueSearchTime"]));
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
    nextButton.className = nextButton.className.replace("disabled_button", "");
    lastButton.className = nextButton.className.replace("disabled_button", "");
    if (currentFoundIndex === 0) lastButton.className += " disabled_button";
    if (currentFoundIndex >= (foundIndices.length - 1)) nextButton.className += " disabled_button";
}