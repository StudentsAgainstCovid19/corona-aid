<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="root">
        <infected>
            <xsl:for-each select="infected/person">
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
                </person>
            </xsl:for-each>
        </infected>
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
    </xsl:template>
</xsl:stylesheet>