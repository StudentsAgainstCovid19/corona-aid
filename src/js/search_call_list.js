async function search_call_list()
{
    window.location.hash = "";
    var scrollToDiv = document.getElementById("scroll_to");
    if ( scrollToDiv ) scrollToDiv.id = ""; // delete id

    var input_field = document.getElementById("search_input");
    var words = input_field.value.toLowerCase().split(" ");
    var call_list_items = document.getElementsByClassName("call_box")

    if (call_list_items.length === 0) return;

    var hits = [];

    var text, nameText, phoneText;
    for (var i = 0; i<call_list_items.length; i++)
    {
        nameText = call_list_items[i].getElementsByTagName("p")[0].innerText;
        phoneText = call_list_items[i].getElementsByTagName("p")[2].innerText;
        text = (nameText+" "+phoneText.replace("Tel.: ","")).replace(",", "").toLowerCase();
        if (check_in(text, words))
        {
            hits.push(i);
        } // TODO: potentially stop after first hit (if we decide against next buttons or sth)

    }
    if (hits.length > 0)
    {
        var foundDiv = call_list_items[hits[0]]
        foundDiv.id = "scroll_to";
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