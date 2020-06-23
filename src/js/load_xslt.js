
function getXSLT(filename)
{
    var xsl_doc = xslt_files[filename];
    if (!xsl_doc)
    {
        console.log("Loading XSL-File: "+filename);
        xsl_doc = loadXMLDoc(filename, "text/xsl");
        xslt_files[filename] = xsl_doc;
    }
    return xsl_doc;
}

function loadXMLDoc(filename, mimeType="application/xml", errorHandlingFn = null)
{
    request = new XMLHttpRequest();
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
}


// run an xslt script using an xml and set result as content of dom object with id
function runXSLT(xsl_file, xml, id=null)
{
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
    var parser = new DOMParser();
    var request = new XMLHttpRequest();
    request.open("POST", apiUrl+res, true);
    request.setRequestHeader("Content-type", "application/xml");

    request.send(parser.parseFromString(content,"application/xml"));
}

function putRequest(res)
{
    console.log("PUT-Request");
    var parser = new DOMParser();
    var request = new XMLHttpRequest();
    request.open("PUT", apiUrl+res, true);
    request.send(null);
}