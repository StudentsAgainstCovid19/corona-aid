async function search_call_list()
{
    currentlySearched = true;
    window.location.hash = "";
    deleteScrollId();

    let input_field = document.getElementById("search_input");
    let words = input_field.value.toLowerCase().split(" ");
    let call_list_items = getAllNotHiddenCallBoxes();
    currentCallBoxes = call_list_items;

    if (call_list_items.length === 0) return noItemFound();

    let hits = [];

    let text, nameText, phoneText;
    for (let i = 0; i<call_list_items.length; i++)
    {
        nameText = call_list_items[i].getElementsByTagName("span")[0].innerText;
        phoneText = call_list_items[i].getElementsByTagName("span")[3].innerText;
        text = (nameText+" "+phoneText.replace("Tel.: ","")).replace(",", "").toLowerCase();
        if (check_in(text, words))
        {
            hits.push(i);
        }

    }
    foundIndices = hits;
    currentFoundIndex = 0;
    if (hits.length > 0)
    {
        scrollToIndex(hits[0]);

    } else {
        noItemFound();
    }
}

function deleteScrollId()
{
    let scrollToDiv = document.getElementById("scroll_to");
    if ( scrollToDiv ) scrollToDiv.id = ""; // delete id
}

function scrollToIndex(index)
{
    deleteScrollId();
    openCallList();
    let foundDiv = currentCallBoxes[index];
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
    for (let index = call_list_items.length - 1; index >= 0; index--)
    {
        if ( call_list_items[index].className.indexOf("hidden_box") !== -1 )
        {
            call_list_items.splice(index, 1);
        }
    }
    return call_list_items;
}

function noItemFound()
{
    let searchbar = document.getElementById("search_container");
    searchbar.className = searchbar.className.replace(" no_call_items_found","");
    setTimeout(function(){
        searchbar.className += " no_call_items_found";
    }, 100);
    currentlySearched = false;
}

function check_in(str, words) {
    for (var i = 0; i<words.length;i++)
    {
        if (str.indexOf(words[i]) === -1)
        {
            return false;
        }
    }
    return true;
}

function addSearchBarListener()
{
    let searchBar = document.getElementById("search_bar");
    searchBar.addEventListener("keyup", function (event){
        if ( event.key === "Enter" )
        {
            search_call_list();
        }
    });
}

function addKeyClickListenerToChild(elemId)
{
    let box = document.getElementById(elemId).children[0];
    box.addEventListener("keyup", function (event) {
        if ( event.key === "Enter" )
        {
            box.click();
        }
    });
    box.focus();
}

// TODO: add auto close after a minute and supress updates
function close_continue_search() {
    document.getElementById("continue_search_buttons").className += " invisible_object";
}

function show_continue_search() {
    let continue_search_bar = document.getElementById("continue_search_buttons");
    continue_search_bar.className = continue_search_bar.className.replace(" invisible_object", "");
}

function findNext() {
    if (currentFoundIndex < (foundIndices.length - 1))
    {
        currentFoundIndex++;
        scrollToIndex(currentFoundIndex);
    }
    updateButtonStates();
}

function findLast() {
    if (currentFoundIndex > 0)
    {
        currentFoundIndex++;
        scrollToIndex(currentFoundIndex);
    }
    updateButtonStates();
}

function updateButtonStates()
{
    let nextButton = document.getElementById("nextSearchButton");
    let lastButton = document.getElementById("lastSearchButton");
    nextButton.className = nextButton.className.replace("disabled_button", "");
    lastButton.className = nextButton.className.replace("disabled_button", "");
    if (currentFoundIndex === 0) lastButton.className += " disabled_button";
    if (currentFoundIndex >= (foundIndices.length - 1)) nextButton.className += " disabled_button";
}