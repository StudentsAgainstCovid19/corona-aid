<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template name="prio_calculation">
        <xsl:param name="age"/>
        <xsl:param name="preExIllnesses"/>
        <xsl:param name="sumSymptoms"/>
        <xsl:param name="subjectiveWellbeing"/>

        <xsl:variable name="preIllnessWeight">
            <xsl:choose>
                <xsl:when test="($preExIllnesses * 0.25) > 1">1</xsl:when>
                <xsl:otherwise><xsl:value-of select="$preExIllnesses * 0.25"/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="symptomsWeight">
            <xsl:choose>
                <xsl:when test="($sumSymptoms * 0.1) > 1">1</xsl:when>
                <xsl:otherwise><xsl:value-of select="$sumSymptoms * 0.1"/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="subjectiveWellbeingFactor" select="(5-$subjectiveWellbeing)*0.2"/>
        <xsl:variable name="age_value" select="$age div 100.0"/>

        <xsl:value-of select="$subjectiveWellbeingFactor+$symptomsWeight+$preIllnessWeight+$age_value"/>
    </xsl:template>

    <xsl:template match="/">
        <infected>
            <xsl:for-each select="people/person">

                <person>
                    <id>
                        <xsl:value-of select="id"/>
                    </id>
                    <firstnames>
                        <xsl:value-of select="firstnames"/>
                    </firstnames>
                    <lastname>
                        <xsl:value-of select="lastname"/>
                    </lastname>
                    <age>
                        <xsl:value-of select="age"/>
                    </age>
                    <calledbool>
                        <xsl:value-of select="calledbool"/>
                    </calledbool>
                    <lastcall>
                        <xsl:value-of select="lastcall"/>
                    </lastcall>
                    <phone>
                        <xsl:value-of select="phone"/>
                    </phone>
                    <subjectiveWellbeing>
                        <xsl:value-of select="subjectiveWellbeing"/>
                    </subjectiveWellbeing>
                    <lat>
                        <xsl:value-of select="lat"/>
                    </lat>
                    <lon>
                        <xsl:value-of select="lon"/>
                    </lon>
                    <done>
                        <xsl:value-of select="done"/>
                    </done>




                    <priority>
                        <xsl:call-template name="prio_calculation">
                            <xsl:with-param name="age" select="age"/>
                            <xsl:with-param name="subjectiveWellbeing" select="subjectiveWellbeing"/>
                            <xsl:with-param name="preExIllnesses" select="sumPreExIllnes"/>
                            <xsl:with-param name="sumSymptoms" select="sumSymptoms"/>
                        </xsl:call-template>
                    </priority>
                </person>
            </xsl:for-each>
        </infected>
    </xsl:template>
</xsl:stylesheet>