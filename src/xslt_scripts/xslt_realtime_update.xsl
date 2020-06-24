<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="root">
        <infected>
            <xsl:for-each select="Set/item">
                <person>
                    <xsl:variable name="id" select="id"/>
                    <xsl:choose>
                        <xsl:when test="count(/root/ArrayList/item[infectedId = $id]) > 0">
                            <xsl:variable name="lastNode" select="/root/ArrayList/item[infectedId = $id][last()]"/>
                            <locked><xsl:value-of select="lastNode/locked"/></locked>
                            <done><xsl:value-of select="lastNode/done"/></done>
                            <lastcall><xsl:value-of select="lastNode/lastUnsuccessfulCallTodayString"/></lastcall>
                            <calledbool><xsl:value-of select="lastNode/called"/></calledbool>
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
</xsl:stylesheet>