async function search_call_list()
{
    openCallList();
    window.location.hash = "";
    var scrollToDiv = document.getElementById("scroll_to");
    if ( scrollToDiv ) scrollToDiv.id = ""; // delete id

    var input_field = document.getElementById("search_input");
    var words = input_field.value.toLowerCase().split(" ");
    var call_list_items = document.getElementsByClassName("call_list_element")

    if (call_list_items.length === 0) return;

    var hits = [];

    var text, nameText, phoneText;
    for (var i = 0; i<call_list_items.length; i++)
    {
        nameText = call_list_items[i].getElementsByTagName("span")[0].innerText;
        phoneText = call_list_items[i].getElementsByTagName("span")[3].innerText;
        text = (nameText+" "+phoneText.replace("Tel.: ","")).replace(",", "").toLowerCase();
        if (check_in(text, words))
        {
            hits.push(i);
        } // TODO: potentially stop after first hit (if we decide against next buttons or sth)

    }
    if (hits.length > 0)
    {
        let foundDiv = call_list_items[hits[0]];
        foundDiv.id = "scroll_to";
        let childDiv = foundDiv.childNodes[0];
        childDiv.className = childDiv.className.replace("found_call_items", "");
        setTimeout(function () {
            childDiv.className += " found_call_items";
        }, 100);
    } else {
        let searchbar = document.getElementById("search_bar");
        searchbar.className = searchbar.className.replace(" no_call_items_found","");
        setTimeout(function(){
            searchbar.className += " no_call_items_found";
        }, 100);
    }
    window.location.hash = "#scroll_to";
    console.log(window.location.hash);

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
    })
}