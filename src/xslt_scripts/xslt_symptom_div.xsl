<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="dayFormatting">
        <xsl:param name="days"/>

        <xsl:choose>
            <xsl:when test="$days = 1">dem letzten Anruf</xsl:when>
            <xsl:otherwise><xsl:value-of select="$days"/><xsl:text> </xsl:text>Anrufen</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="symptomXML">
        <xsl:for-each select="symptoms/symptom">
            <xsl:sort select="degreeOfDanger" order="descending"/>
            <xsl:variable name="sinceDaysText">
                <xsl:choose>
                    <xsl:when test="sinceDays != ''"> seit <xsl:call-template name="dayFormatting">
                            <xsl:with-param name="days" select="sinceDays"/>
                        </xsl:call-template>
                    </xsl:when>
                    <xsl:otherwise> seit heute</xsl:otherwise>
                </xsl:choose>
            </xsl:variable>
            <p id="symptomsTable">
                <input type="checkbox" class="symptom_checkbox">
                    <xsl:attribute name="checked">true</xsl:attribute>

                    <xsl:attribute name="id">symp_<xsl:value-of select="id"/></xsl:attribute>
                    <xsl:attribute name="onclick">symptomsChanged(<xsl:value-of select="id"/>);</xsl:attribute>
                </input>
                <label>
                    <xsl:attribute name="for">symp_<xsl:value-of select="id"/></xsl:attribute>
                    <xsl:value-of select="name"/><span class="sinceDays"><xsl:value-of select="$sinceDaysText"/></span>
                </label>
            </p>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>