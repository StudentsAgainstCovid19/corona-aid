
async function displayClusteredMap(id_array)
{
    close_continue_search();
    if ( !prioList || id_array.length === 0 ) return;
    if ( detail_bar === 2 )  return showSnackbar("Die Patientenansicht ist noch geöffnet.\n" +
                                    "Bitte kümmern Sie sich erst um den derzeitigen Patienten.");
    detail_bar = 1;
    slideOpenRightBar();
    var right_bar = document.getElementById("infected_detailed_view_right");
    right_bar.innerHTML = "";

    id_array.sort((a, b) => a - b);

    var infected_people = prioList.getElementsByTagName("person");
    xmlString = "<infected>"
    var xmlSerializer = new XMLSerializer();
    for (var i = 0; i<infected_people.length; i++)
    {
        if (id_array.length === 0) break;

        if (id_array[0] === parseInt(infected_people[i].getElementsByTagName("id")[0].childNodes[0].nodeValue))
        {
            xmlString += xmlSerializer.serializeToString(infected_people[i]);
            id_array.shift();
        }
    }
    if (id_array.length !== 0)
    {
        // TODO: handle error!
        console.log("Error occurred. Not all ids in cluster are in priority list. Inconsistency...");
    }
    xmlString += "</infected>";

    var xmlParser = new DOMParser();
    var xmlDoc = xmlParser.parseFromString(xmlString, "application/xml");


    var clusteredListXSL = getXSLT("./xslt_scripts/xslt_clustered_list.xsl");
    runXSLT(clusteredListXSL, xmlDoc, "infected_detailed_view_right");
}

