
async function displayClusteredMap(idArray)
{
    close_continue_search();
    if ( !prioList || idArray.length === 0 ) return;
    if ( detail_bar === 2 )  return showSnackbar("Die Patientenansicht ist noch geöffnet.\n" +
                                    "Bitte kümmern Sie sich erst um den derzeitigen Patienten.");
    detail_bar = 1;
    slideOpenRightBar();
    let right_bar = document.getElementById("infected_detailed_view_right");
    right_bar.innerHTML = "";

    idArray.sort((a, b) => a - b);

    let infectedPeople = prioList.getElementsByTagName("person");
    let infectedIdList = [];
    for (let index = 0; index < infectedPeople.length; index++)
    {
        infectedIdList.push([parseInt(infectedPeople[index].getElementsByTagName("id")[0].childNodes[0].nodeValue), index]);
    }

    infectedIdList.sort((a, b) => a[0] - b[0]);
    let xmlString = "<infected>";
    let xmlSerializer = new XMLSerializer();
    for (let i = 0; i<infectedPeople.length && idArray.length > 0; i++)
    {
        if (idArray[0] === infectedIdList[i][0])
        {
            xmlString += xmlSerializer.serializeToString(infectedPeople[infectedIdList[i][1]]);
            idArray.shift();
        }
    }
    if (idArray.length !== 0)
    {
        // TODO: handle error!
        console.log("Error occurred. Not all ids in cluster are in priority list. Inconsistency...");
    }
    xmlString += "</infected>";

    let xmlParser = new DOMParser();
    let xmlDoc = xmlParser.parseFromString(xmlString, "application/xml");


    let clusteredListXSL = getXSLT("./xslt_scripts/xslt_clustered_list.xsl");
    runXSLT(clusteredListXSL, xmlDoc, "infected_detailed_view_right");
}

