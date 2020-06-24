
function toggle_call_list()
{
    let call_list = document.getElementById("call_list_div");
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
    let call_list = document.getElementById("call_list_div");
    let search_bar = document.getElementById("search_bar");
    if (call_list.className.indexOf("call_list_slidein") === -1)
    {
        search_bar.className =  search_bar.className.replace("search_bar_slideout", "") + " search_bar_slidein";
        call_list.className = "call_list_slidein";
    }
}