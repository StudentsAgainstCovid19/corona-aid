
function getXSLT(filename)
{
    let xslDoc = xslt_files.get(filename);
    if ( !xslDoc )
    {
        // console.log("(GetXSLT) Loading XSL-File: "+filename);
        xslDoc = loadXMLDoc(filename, "text/xsl", null, true);
        xslt_files.set(filename, xslDoc);
    }
    return xslDoc;
}

function loadXMLDoc(filename, mimeType="application/xml", errorHandlingFn = null, callingFromGetXSLT = false)
{
    if (!callingFromGetXSLT) {
        // console.log(`(LoadXMLDoc) loading XML-file: ${filename}`);
    }
    try {
        let request = new XMLHttpRequest();
        request.open("GET", filename, false);
        if ( errorHandlingFn )
        {
            request.onreadystatechange = function(oEvent)
            {
                errorHandlingFn(request.status);
            };
        }
        request.setRequestHeader("Accept", mimeType);
        request.send("");

        return request.responseXML;
    }catch (e) {
        serviceUnavailableError();
    }

}


// run an xslt script using an xml and set result as content of dom object with id
function runXSLT(xsl_file, xml, id=null)
{
    console.log(`(RunXSLT) transforming the following xml-file: \n\n${new XMLSerializer().serializeToString(xml)}`);
    xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl_file);
    if (id != null)
    {
        resultDocument = xsltProcessor.transformToFragment(xml, document);
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).appendChild(resultDocument);
    }
    else {
        return xsltProcessor.transformToDocument(xml);
    }
}

function postRequest(res, content)
{
    let parser = new DOMParser();
    let request = new XMLHttpRequest();
    request.open("POST", apiUrl+res, true);
    request.setRequestHeader("Content-type", "application/xml");
    request.setRequestHeader("Accept", "application/xml");

    request.send(parser.parseFromString(content,"application/xml"));
}

function putRequest(res)
{
    console.log("PUT-Request");
    let parser = new DOMParser();
    let request = new XMLHttpRequest();
    request.open("PUT", apiUrl+res, true);
    request.send(null);
}