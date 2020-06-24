<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="symptomPopupXML">


        <p id="symptomsPopupHeader">Symptome von <xsl:value-of select="symptomXML/surname"/>, <xsl:value-of select="symptomXML/forename"/></p>
        <div id="listOfPossibleSymptoms">
            <xsl:for-each select="Set/item">
                <xsl:sort select="probability" order="descending" data-type="number"/>
                <xsl:variable name="id" select="id"/>
                <p>
                    <input type="checkbox" class="symptom_checkbox">
                        <xsl:attribute name="id">symptom_<xsl:value-of select="id"/></xsl:attribute>
                        <xsl:attribute name="onclick">symptomInteraction(<xsl:value-of select="id"/>);</xsl:attribute>
                        <xsl:if test="count(/symptomPopupXML/symptomIdList/symp_id[text() = $id]) > 0">
                            <xsl:attribute name="checked"/>
                        </xsl:if>
                    </input>
                    <label>
                        <xsl:attribute name="for">symptom_<xsl:value-of select="id"/></xsl:attribute>
                        <xsl:value-of select="name"/>
                    </label>
                </p>
            </xsl:for-each>
        </div>
        <div id="symptomsPopupEnd">
            <button id="close_edit_symptoms_button" onclick="hidePopUp();" class="dialogButton cancel_button">Schließen</button>
            <button id="submit_edit_symptoms_button" onclick="submitSymptoms();" class="dialogButton submit_button">Bestätigen</button>
         </div>

    </xsl:template>
</xsl:stylesheet>