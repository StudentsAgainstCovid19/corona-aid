<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="infected">
        <p>Symptome von <xsl:value-of select="lastname"></xsl:value-of>, <xsl:value-of select="firstnames"></xsl:value-of></p>
        <div>
            <xsl:for-each select="symptoms/symptom">
                <xsl:sort select="proba" order="descending"></xsl:sort>
                <p>
                    <input type="checkbox">
                        
                    </input>
                    <label><xsl:value-of select="name"></xsl:value-of></label>
                </p>
            </xsl:for-each>
        </div>
        <button id="close_edit_symptoms_button" onclick="hidePopUp();">Schließen</button>
        <button id="submit_edit_symptoms_button" onclick="submitSymptoms();">Bestätigen</button>
    </xsl:template>
</xsl:stylesheet>