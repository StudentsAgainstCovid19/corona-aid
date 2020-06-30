
async function displayClusteredMap(id_array)
{
    close_continue_search();
    if ( !prioList || id_array.length === 0 ) return;
    if ( detail_bar === 2 )  return showSnackbar("Die Patientenansicht ist noch geöffnet.\n" +
                                    "Bitte kümmern Sie sich erst um den derzeitigen Patienten.");
    detail_bar = 1;
    slideOpenRightBar();
    let right_bar = document.getElementById("infected_detailed_view_right");
    right_bar.innerHTML = "";

    id_array.sort((a, b) => a - b);

    let infected_people = prioList.getElementsByTagName("person");
    let infectedIdList = [];
    for (let index = 0; index < infected_people.length; index++)
    {
        infectedIdList.push(parseInt(infected_people[index].getElementsByTagName("id")[0].childNodes[0].nodeValue));
    }

    infectedIdList.sort((a, b) => a - b);
    xmlString = "<infected>"
    let xmlSerializer = new XMLSerializer();
    for (let i = 0; i<infected_people.length; i++)
    {
        if (id_array.length === 0) break;

        if (id_array[0] === infectedIdList[parseInt(i)]);
        {
            xmlString += xmlSerializer.serializeToString(infected_people[parseInt(i)]);
            id_array.shift();
        }
    }
    if (id_array.length !== 0)
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

