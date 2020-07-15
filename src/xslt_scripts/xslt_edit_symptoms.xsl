<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output
        method="html"
        version="1.0"
        encoding="utf-8"/>
    <xsl:template match="symptomPopupXML">


        <p class="popupHeader">Symptome von <xsl:value-of select="concat(symptomXML/surname, ', ', symptomXML/forename)"/></p>
        <div id="listOfPossibleSymptoms">
            <xsl:apply-templates select="Set/item">
                <xsl:sort select="probability" order="descending" data-type="number"/>
            </xsl:apply-templates>
        </div>
        <div id="symptomsPopupEnd">
            <button id="closeEditSymptomsButton" onclick="hidePopUp();" class="dialogButton cancelButton">Schließen</button>
            <button id="submitEditSymptomsButton" onclick="submitSymptoms();" class="dialogButton submitButton">Bestätigen</button>
         </div>

    </xsl:template>

    <xsl:template match="item">
        <xsl:variable name="id" select="id"/>
        <p>
            <input type="checkbox" class="symptomCheckbox">
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
    </xsl:template>
</xsl:stylesheet>
