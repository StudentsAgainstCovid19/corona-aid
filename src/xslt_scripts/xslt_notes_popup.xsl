<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="InfectedDto">


        <p class="popupHeader">Anmerkungen zu <xsl:value-of select="surname"/>, <xsl:value-of select="forename"/></p>
        <div id="notesHistoryDiv" class="notesDiv">
            <xsl:apply-templates select="historyItems/historyItem[not(notes = '')]"/>
        </div>
        <button onclick="hidePopUp();" class="dialogButton cancel_button">Schließen</button>
    </xsl:template>

    <xsl:template match="historyItem">
        <div>
            <p>Vom <xsl:value-of select="timestamp"/>:</p>
            <textarea class="notes_field">
                <xsl:attribute name="readonly"/>
                <xsl:value-of select="notes"/>
            </textarea>
        </div>
    </xsl:template>
</xsl:stylesheet>