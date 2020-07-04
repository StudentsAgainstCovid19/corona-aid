<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="InfectedDto">
        <p class="popupHeader">Vorerkrankungen von <xsl:value-of select="surname"/>, <xsl:value-of select="forename"/></p>
        <div id="listOfIllnesses">
            <xsl:apply-templates select="initialDiseases/initialDisease">
                <xsl:sort select="degreeOfDanger" order="descending"/>
            </xsl:apply-templates>
        </div>
        <div id="close_illnesses_button_div">
        <button id="close_illnesses_button" class="dialogButton cancel_button" onclick="hidePopUp();">Schließen</button>
        </div>
    </xsl:template>

    <xsl:template match="initialDisease">
        <p><xsl:value-of select="name"/></p>
    </xsl:template>
</xsl:stylesheet>