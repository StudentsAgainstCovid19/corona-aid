<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="root">
        <infected>
            <xsl:apply-templates select="infected/person">
                <xsl:sort select="infected/person/id" data-type="number"/>
            </xsl:apply-templates>
        </infected>
    </xsl:template>

    <xsl:template match="person">
        <person>
            <xsl:variable name="id" select="id"/>
            <xsl:choose>
                <xsl:when test="count(/root/updateList/item[infectedId = $id]) &gt; 0">
                    <xsl:apply-templates select="/root/updateList/item[infectedId = $id][last()]"/>
                </xsl:when>
                <xsl:otherwise>
                    <locked><xsl:value-of select="locked"/></locked>
                    <done><xsl:value-of select="done"/></done>
                    <lastcall><xsl:value-of select="lastcall"/></lastcall>
                    <calledbool><xsl:value-of select="calledbool"/></calledbool>
                    <!--                            <subjectiveWellbeing><xsl:value-of select="subjectiveWellbeing"/></subjectiveWellbeing>-->
                </xsl:otherwise>
            </xsl:choose>
            <id><xsl:value-of select="id"/></id>
            <firstnames><xsl:value-of select="firstnames"/></firstnames>
            <lastname><xsl:value-of select="lastname"/></lastname>
            <age><xsl:value-of select="age"/></age>
            <phone><xsl:value-of select="phone"/></phone>
            <lat><xsl:value-of select="lat"/></lat>
            <lon><xsl:value-of select="lon"/></lon>
            <subjectiveWellbeing><xsl:value-of select="subjectiveWellbeing"/></subjectiveWellbeing>
            <priority><xsl:value-of select="priority"/></priority>
        </person>
    </xsl:template>

    <xsl:template match="item">
        <locked><xsl:value-of select="locked"/></locked>
        <done>
            <xsl:choose>
                <xsl:when test="done = 'true'">
                    1
                </xsl:when>
                <xsl:otherwise>
                    0
                </xsl:otherwise>
            </xsl:choose>
        </done>
        <lastcall><xsl:value-of select="lastUnsuccessfulCallTodayString"/></lastcall>
        <calledbool><xsl:value-of select="called"/></calledbool>
<!--        <subjectiveWellbeing><xsl:value-of select="subjectiveWellbeing"/></subjectiveWellbeing>-->
    </xsl:template>
</xsl:stylesheet>