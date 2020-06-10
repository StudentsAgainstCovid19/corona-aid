<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="infected">
        <p>Vorerkrankungen von <xsl:value-of select="lastname"></xsl:value-of>, <xsl:value-of select="firstnames"></xsl:value-of></p>
        <div>
            <xsl:for-each select="preExIllnesses/illness">
                <xsl:sort select="degreeOfDanger" order="descending"></xsl:sort>
                <p><xsl:value-of select="name"></xsl:value-of></p>
            </xsl:for-each>
        </div>
        <button id="close_illnesses_button" onclick="hidePopUp();">Schließen</button>
    </xsl:template>
</xsl:stylesheet>