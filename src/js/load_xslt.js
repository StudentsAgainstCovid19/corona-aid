
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

// this code was taken from https://www.w3schools.com/xml/xsl_client.asp
// Some aspects were changed, the rest, however, is not programmed by ourselves.
function loadXMLDoc(filename, mimeType="application/xml")
{
    if (window.ActiveXObject)
    {
        xhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else
    {
        xhttp = new XMLHttpRequest();
    }
    xhttp.open("GET", filename, false);
    xhttp.setRequestHeader("Accept", mimeType);
    try {xhttp.responseType = "msxml-document"} catch(err) {} // Helping IE11
    xhttp.send("");
    return xhttp.responseXML;
}


// run an xslt script using an xml and set result as content of dom object with id
function runXSLT(xsl_file, xml, id=null)
{
    // code for IE
    if (window.ActiveXObject || xhttp.responseType == "msxml-document")
    {
        // ex = xml.transformNode(xsl);
        // document.getElementById(id).innerHTML = ex;
    }
    // code for Chrome, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument)
    {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl_file);
        if (id != null)
        {
            resultDocument = xsltProcessor.transformToFragment(xml, document);
            document.getElementById(id).innerHTML = "";
            document.getElementById(id).appendChild(resultDocument);
        }
        else
        {
            return xsltProcessor.transformToDocument(xml);
        }
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