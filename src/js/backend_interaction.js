
function loadXMLDoc(filename, mimeType="application/xml", errorHandlingFn = null, callingFromGetXSLT = false) {
    if (!callingFromGetXSLT) {
        // console.log(`(LoadXMLDoc) loading XML-file: ${filename}`);
    }
    try {
        let request = new XMLHttpRequest();
        request.open("GET", filename, false);
        if (errorHandlingFn) {
            request.onreadystatechange = function(oEvent) {
                errorHandlingFn(request.status);
            };
        }
        request.setRequestHeader("Accept", mimeType);
        request.send("");

        return request.responseXML;
    } catch (e) {
        serviceUnavailableError();
    }
}

function postRequest(res, content) {
    let parser = new DOMParser();
    let request = new XMLHttpRequest();
    request.open("POST", apiUrl + res, true);
    request.setRequestHeader("Content-type", "application/xml");
    request.setRequestHeader("Accept", "application/xml");

    request.send(parser.parseFromString(content,"application/xml"));
}

function putRequest(res, content= null) {
    let request = new XMLHttpRequest();
    request.open("PUT", apiUrl + res, true);
    request.setRequestHeader("Content-type", "application/xml");
    request.setRequestHeader("Accept", "application/xml");
    request.send(content);
}