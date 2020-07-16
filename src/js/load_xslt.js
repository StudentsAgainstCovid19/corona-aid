function getXSLT(filename) {
    let xslDoc = xsltFiles.get(filename);
    if ( !xslDoc ) {
        // console.log("(GetXSLT) Loading XSL-File: "+filename);
        xslDoc = loadXMLDoc(filename, "text/xsl");
        xsltFiles.set(filename, xslDoc);
    }
    return xslDoc;
}


// run an xslt script using an xml and set result as content of dom object with id
function runXSLT(xslFile, xml, id= null) {
    // console.log(`(RunXSLT) transforming the following xml-file: \n\n${new XMLSerializer().serializeToString(xml)}`);
    let xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslFile);
    if ( id ) {
        resultDocument = xsltProcessor.transformToFragment(xml, document);
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).appendChild(resultDocument);
    } else {
        return xsltProcessor.transformToDocument(xml); // Return only in the else branch ???
    }
}