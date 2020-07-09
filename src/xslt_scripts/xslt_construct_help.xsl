<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


    <xsl:template match="/">
        <div class="flex_div">
            <div id="helpListDiv">
                <xsl:apply-templates select="helpPages/helpPage"/>
            </div>
            <div id="helpIframeDiv">
                <iframe id="helpIframe" class="helpPages">
                    <xsl:attribute name="src"><xsl:value-of select="helpPages/helpPage[4]/path"/>.html</xsl:attribute>
                </iframe>
            </div>
        </div>


        <button onclick="closeHelpPopup()" class="dialogButton cancel_button">Schließen</button>
    </xsl:template>

    <xsl:template match="helpPage">
        <button>
            <xsl:attribute name="onclick">showHelpPage("<xsl:value-of select="path"/>.html");</xsl:attribute>
            <xsl:value-of select="name"/></button>
    </xsl:template>
</xsl:stylesheet>