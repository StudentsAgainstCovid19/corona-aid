    var cumulativeOffset = function(element){
        var scrolltop = 0, screenHeight, top = 0, welement = element;
        do{
            top = element.offsetTop;
            scrolltop = element.parentElement.parentElement.scrollTop || 0;
            screenHeight = top - scrolltop + Math.floor(element.offsetHeight / 2)-10;
            welement = welement.offsetParent;
        } while(welement);

        console.log("top :" + top + " | element: " + element + " | berechnet: " + screenHeight + " | scrollTop: " + scrolltop);
        console.log(element);
        var temp = element.childNodes[0].getElementsByClassName("tooltiptext")[0].style.top = screenHeight + "px";
        console.log(temp);
    };

