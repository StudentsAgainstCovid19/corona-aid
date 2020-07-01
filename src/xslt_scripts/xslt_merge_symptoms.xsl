<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="symptomPopupXML">
        <symptomXML>
            <surname><xsl:value-of select="symptomXML/surname"/></surname>
            <forename><xsl:value-of select="symptomXML/forename"/></forename>
            <symptoms>
                <xsl:apply-templates select="symptomIdList/symp_id"/>
            </symptoms>
        </symptomXML>
    </xsl:template>

    <xsl:template match="symp_id">
        <xsl:variable name="id" select="text()"/>
        <symptom>
            <id><xsl:value-of select="$id"/></id>

            <sinceDays>
                <xsl:if test="count(/symptomPopupXML/symptomXML/symptoms/symptom[id = $id]) > 0">
                    <xsl:value-of select="/symptomPopupXML/symptomXML/symptoms/symptom[id = $id]/sinceDays"/>
                </xsl:if>
            </sinceDays>

            <name>
                <xsl:value-of select="/symptomPopupXML/Set/item[id = $id]/name"/>
            </name>

            <degreeOfDanger>
                <xsl:value-of select="/symptomPopupXML/Set/item[id = $id]/degreeOfDanger"/>
            </degreeOfDanger>

            <probability>
                <xsl:value-of select="symptomPopupXML/Set/item[id = $id]/probability"/>
            </probability>
        </symptom>

    </xsl:template>
</xsl:stylesheet>