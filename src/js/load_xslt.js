// this code was taken from https://www.w3schools.com/xml/xsl_client.asp
// Some aspects were changed, the rest, however, is not programmed by ourselves.
function loadXMLDoc(filename)
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
    try {xhttp.responseType = "msxml-document"} catch(err) {} // Helping IE11
    xhttp.send("");
    return xhttp.responseXML;
}


// run an xslt script using an xml and set result as content of dom object with id
function runXSLTDisplayHtml(xsl_list, xml, id)
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
        xsl_list.forEach(function (xsl) {
            xsltProcessor.importStylesheet(xsl);
        });
        resultDocument = xsltProcessor.transformToFragment(xml, document);
        document.getElementById(id).appendChild(resultDocument);
    }
}

// run a xslt script using an xml and get the document returned
// xsl_list is a list of xsl-documents
function runXSLT(xsl_list, xml)
{
    // code for IE
    if (window.ActiveXObject || xhttp.responseType == "msxml-document")
    {
        // for (var xsl in xsl_list)
        // {
        //     ex = xml.transformNode(xsl);
        // }
        //
        // return ex
    }
    // code for Chrome, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument)
    {
        xsltProcessor = new XSLTProcessor();
        xsl_list.forEach(function (xsl) {
            xsltProcessor.importStylesheet(xsl);
        });
        return xsltProcessor.transformToDocument(xml);
    }
}