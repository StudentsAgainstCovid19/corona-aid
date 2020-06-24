
// This file is used to simulate a typical day
// Therefore, tests are prescribed and history items are posted,
//      some of which have status 0
// Accordingly, the coding style of this file is particularly dirty.

// The relative amount of calls is specified as decimal percentage.
//

function parseInfectedIds()
{

    let people_ids = [];

    let people = prioList.getElementsByTagName("person");

    for (let index = 0; index < people.length; index++)
    {
        if (parseInt(parseNodeValueFromXML(people[index], "done")) === 0)
        {
            people_ids.push(parseInt(parseNodeValueFromXML(people[index], "id")));
        }
    }

    return people_ids;
}

function parseSymptoms()
{
    if ( !symptomsXML ) symptomsXML = loadXMLDoc(apiUrl+"symptom");

    let symptoms = [];

    let items = symptomsXML.getElementsByTagName("item");

    for (let index = 0; index < items.length; index++)
    {
        symptoms.push([parseInt(parseNodeValueFromXML(items[index], "id")),
            parseFloat(parseNodeValueFromXML(items[index], "probability"))/100.0]);
    }
    return symptoms;
}

function prepareData()
{
    const relAmountCalls = 0.5;
    const testProba = 0.1;
    const successProbability = 0.8;

    let symptom_list = parseSymptoms();
    let people = parseInfectedIds();
    for (let index = 0; index < people.length; index++)
    {
        if (Math.random() < relAmountCalls)
        {
            addHistoryItem(successProbability, people[index], symptom_list);
            if (Math.random() < testProba)
            {
                prescribeTest(people[index]);
            }
        }
    }
}

function addHistoryItem(successProbability, infected_id, symptom_list)
{
    let xml_string;
    if (Math.random() > successProbability)
    {  // status = 0
        xml_string = "<History>" +
            "<infectedId>"+infected_id+"</infectedId>"+
            "<notes></notes>"+
            "<personalFeeling>0</personalFeeling>"+
            "<status>0</status>"+
            "<symptoms></symptoms>"+
            "<timestamp>" + Date.now() + "</timestamp>" +
            "</History>";
    }
    else{ // status = 1
        xml_string = "<History>" +
            "<infectedId>"+infected_id+"</infectedId>"+
            "<notes></notes>"+
            "<personalFeeling>"+Math.round(Math.random()*5+1)+"</personalFeeling>"+
            "<status>1</status><symptoms>"+
            buildSymptomString(symptom_list) +
            "</symptoms>" + "<timestamp>" + Date.now() + "</timestamp>" +
            "</History>";


    }
    //postRequest("history", xml_string);
}

function prescribeTest(infected_id)
{
    let xml_str = "<TestInsertDto><infectedId>"+infected_id+"</infectedId><result>0</result><timestamp>"+parseInt(Date.now()/1000.0)+"</timestamp></TestInsertDto>";
    postRequest("test/", xml_string);
}

function buildSymptomString(symptom_list)
{
    let xml_string = "";
    for ( let index = 0; index < symptom_list.length; index++ )
    {
        if (Math.random() < symptom_list[index][1])
        {
            xml_string += "<symptom>"+symptom_list[index][0]+"</symptom>";
        }
    }
    return xml_string;
}