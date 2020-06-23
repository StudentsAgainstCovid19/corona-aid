<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="InfectedDto">
        <p>Vorerkrankungen von <xsl:value-of select="surname"/>, <xsl:value-of select="forename"/></p>
        <div>
            <xsl:for-each select="initialDiseases/initialDisease">
                <xsl:sort select="degreeOfDanger" order="descending"/>
                <p><xsl:value-of select="name"/></p>
            </xsl:for-each>
        </div>
        <button id="close_illnesses_button" class="dialogButton cancel_button" onclick="hidePopUp();">Schließen</button>
    </xsl:template>
</xsl:stylesheet>