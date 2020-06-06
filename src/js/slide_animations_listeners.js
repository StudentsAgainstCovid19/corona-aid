
var element = document.getElementById("watchme");

function toggle_call_list()
{
    console.log("Clicked open/close call list button.");
    var call_list = document.getElementById("call_list_div");
    console.log(call_list);
    if (call_list.className === "call_list_slideout")
    {

        call_list.className = "call_list_slide";
    }
    else {
        call_list.className = "call_list_slideout";
    }
}