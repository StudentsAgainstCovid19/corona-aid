
// This file is used to simulate a typical day
// Therefore, tests are prescribed and history items are posted,
//      some of which have status 0
// Accordingly, the coding style of this file is particularly dirty.

// The relative amount of calls is specified as decimal percentage.
//

function parseInfectedIds() {
    let peopleIds = [];

    let people = prioList.getElementsByTagName("person");

    for (let index = 0; index < people.length; index++) {
        if (parseInt(parseNodeValueFromXML(people[parseInt(index)], "done")) === 0) {
            peopleIds.push(parseInt(parseNodeValueFromXML(people[parseInt(index)], "id")));
        }
    }

    return peopleIds;
}

function parseSymptoms() {
    if ( !symptomsXML ) symptomsXML = loadXMLDoc(apiUrl+"symptom");

    let symptoms = [];

    let items = symptomsXML.getElementsByTagName("item");

    for (let index = 0; index < items.length; index++) {
        symptoms.push([parseInt(parseNodeValueFromXML(items[parseInt(index)], "id")),
            parseFloat(parseNodeValueFromXML(items[parseInt(index)], "probability"))/100.0]);
    }
    return symptoms;
}

function prepareData() {
    const relAmountCalls = 0.5;
    const testProbability = 0.1;
    const successProbability = 0.8;

    let symptomList = parseSymptoms();
    let people = parseInfectedIds();
    for (let index = 0; index < people.length; index++) {
        if (Math.random() < relAmountCalls) {
            addHistoryItem(successProbability, people[parseInt(index)], symptomList);
            if (Math.random() < testProbability) {
                prescribeTestSimulation(people[parseInt(index)]);
            }
        }
    }
}

function addHistoryItem(successProbability, infectedId, symptomList) {
    let xmlString;
    if (Math.random() > successProbability) {  // status = 0
        xmlString = "<History>" +
            "<infectedId>"+infectedId+"</infectedId>"+
            "<notes></notes>"+
            "<personalFeeling>0</personalFeeling>"+
            "<status>0</status>"+
            "<symptoms></symptoms>"+
            "<timestamp>" + Date.now() + "</timestamp>" +
            "</History>";
    } else { // status = 1
        xmlString = "<History>" +
            "<infectedId>"+infectedId+"</infectedId>"+
            "<notes></notes>"+
            "<personalFeeling>"+parseInt(Math.random()*5+1)+"</personalFeeling>"+
            "<status>1</status><symptoms>"+
            buildSymptomString(symptomList) +
            "</symptoms>" + "<timestamp>" + Date.now() + "</timestamp>" +
            "</History>";
    }
    let xmlHeaderString = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE History SYSTEM "' + apiUrl
        + 'dtd/push_history_item.dtd">';
    postRequest("history", xmlHeaderString+xmlString);
}

function prescribeTestSimulation(infectedId) {
    let xmlString = "<TestInsertDto><infectedId>"+infectedId+"</infectedId><result>0</result><timestamp>"+Date.now()+"</timestamp></TestInsertDto>";
    let xmlHeaderString = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE TestInsertDto SYSTEM "' + apiUrl
    + 'dtd/push_prescribe_test.dtd">';
    postRequest("test/", xmlHeaderString+xmlString);
}

function buildSymptomString(symptomList) {
    let xmlString = "";
    for (let index = 0; index < symptomList.length; index++) {
        if (Math.random() < symptomList[parseInt(index)][1]) {
            xmlString += "<symptom>"+symptomList[parseInt(index)][0]+"</symptom>";
        }
    }
    return xmlString;
}