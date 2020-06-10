<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="./xslt_priority_helpers.xsl"></xsl:import>



    <xsl:template match="/">
        <infected>
            <xsl:for-each select="people/person">

                <person>
                    <id>
                        <xsl:value-of select="id"></xsl:value-of>
                    </id>
                    <firstnames>
                        <xsl:value-of select="firstnames"></xsl:value-of>
                    </firstnames>
                    <lastname>
                        <xsl:value-of select="lastname"></xsl:value-of>
                    </lastname>
                    <age>
                        <xsl:value-of select="age"></xsl:value-of>
                    </age>
                    <calledbool>
                        <xsl:value-of select="calledbool"></xsl:value-of>
                    </calledbool>
                    <lastcall>
                        <xsl:value-of select="lastcall"></xsl:value-of>
                    </lastcall>
                    <phone>
                        <xsl:value-of select="phone"></xsl:value-of>
                    </phone>
                    <subjectiveWellbeing>
                        <xsl:value-of select="subjectiveWellbeing"></xsl:value-of>
                    </subjectiveWellbeing>




                    <priority>
                        <xsl:call-template name="prio_calculation">
                            <xsl:with-param name="age" select="age"></xsl:with-param>
                            <xsl:with-param name="subjectiveWellbeing" select="subjectiveWellbeing"></xsl:with-param>
                            <xsl:with-param name="preExIllnesses" select="sumPreExIllnes"></xsl:with-param>
                            <xsl:with-param name="sumSymptoms" select="sumSymptoms"></xsl:with-param>
                        </xsl:call-template>
                    </priority>
                </person>
            </xsl:for-each>
        </infected>
    </xsl:template>
</xsl:stylesheet>