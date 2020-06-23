<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="dayFormatting">
        <xsl:param name="days"/>

        <xsl:variable name="dayText">
            <xsl:choose>
                <xsl:when test="$days = 1">Tag</xsl:when>
                <xsl:otherwise>Tagen</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:value-of select="$days"/><xsl:text> </xsl:text><xsl:value-of select="$dayText"/>
    </xsl:template>

    <xsl:template match="/">
        <xsl:for-each select="List/item">
            <xsl:sort select="degreeOfDanger" order="descending"/>
            <xsl:variable name="sinceDaysText">
                <xsl:choose>
                    <xsl:when test="sinceDays != ''"> seit <xsl:call-template name="dayFormatting">
                            <xsl:with-param name="days" select="sinceDays"/>
                        </xsl:call-template>
                    </xsl:when>
                    <xsl:otherwise></xsl:otherwise>
                </xsl:choose>
            </xsl:variable>
            <p>


                    <input type="checkbox">
                        <xsl:attribute name="checked"><xsl:value-of select="true"/></xsl:attribute>
                        <xsl:attribute name="id">symp_<xsl:value-of select="id"/></xsl:attribute>
                        <xsl:attribute name="onclick">symptomsChanged(<xsl:value-of select="id"/>);</xsl:attribute>
                    </input>
                <label>
                    <xsl:attribute name="for">symp_<xsl:value-of select="id"/></xsl:attribute>
                    <xsl:value-of select="name"/>
                </label>
                <label>
                    <span class="sinceDays"><xsl:value-of select="$sinceDaysText"/></span>
                </label>
            </p>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>