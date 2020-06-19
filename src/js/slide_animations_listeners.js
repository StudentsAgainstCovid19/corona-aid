
function toggle_call_list()
{
    let call_list = document.getElementById("call_list_div");
    if (call_list.className === "call_list_slideout") {
        call_list.className = "call_list_slidein";
    } else {
        call_list.className = "call_list_slideout";
    }
}

function openCallList()
{
    let call_list = document.getElementById("call_list_div");
    if (call_list.className.indexOf("call_list_slidein") === -1)
    {
        call_list.className = "call_list_slidein";
    }
}