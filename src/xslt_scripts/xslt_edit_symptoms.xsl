<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <p>Symptome von <xsl:value-of select="lastname"/>, <xsl:value-of select="firstnames"/></p>
        <div>
            <xsl:for-each select="List/item">
                <xsl:sort select="probability" order="descending"/>
                <p>
                    <input type="checkbox">
                        <xsl:attribute name="id">symptom_<xsl:value-of select="id"/></xsl:attribute>
                        <xsl:attribute name="onclick">symptomInteraction(<xsl:value-of select="id"/>);</xsl:attribute>
                    </input>
                    <label><xsl:value-of select="name"/></label>
                </p>
            </xsl:for-each>
        </div>
        <button id="close_edit_symptoms_button" onclick="hidePopUp();" class="dialogButton cancel_button">Schließen</button>
        <button id="submit_edit_symptoms_button" onclick="submitSymptoms();" class="dialogButton submit_button">Bestätigen</button>
    </xsl:template>
</xsl:stylesheet>