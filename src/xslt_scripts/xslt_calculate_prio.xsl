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

    <xsl:template name="handleNullability">
        <xsl:param name="default"/>
        <xsl:param name="value"/>

        <xsl:choose>
            <xsl:when test="not($value = '')"><xsl:value-of select="$value"/></xsl:when>
            <xsl:otherwise><xsl:value-of select="$default"/></xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="/">
        <infected>
            <xsl:for-each select="Set/item">
                <xsl:variable name="sumSymptomsNotNull">
                    <xsl:call-template name="handleNullability">
                        <xsl:with-param name="value" select="sumSymptoms"/>
                        <xsl:with-param name="default" select="0"/>
                    </xsl:call-template>
                </xsl:variable>
                <xsl:variable name="wellBeingNotNull">
                    <xsl:call-template name="handleNullability">
                        <xsl:with-param name="value" select="personalFeeling"/>
                        <xsl:with-param name="default" select="1"/>
                    </xsl:call-template>
                </xsl:variable>


                <person>
                    <id>
                        <xsl:value-of select="id"/>
                    </id>
                    <firstnames>
                        <xsl:value-of select="forename"/>
                    </firstnames>
                    <lastname>
                        <xsl:value-of select="surname"/>
                    </lastname>
                    <age>
                        <xsl:value-of select="age"/>
                    </age>
                    <calledbool>
                        <xsl:choose>
                            <xsl:when test="not(lastUnsuccessfulCallToday = '')  and done = 'false'">1</xsl:when>
                            <xsl:otherwise>0</xsl:otherwise>
                        </xsl:choose>
                    </calledbool>
                    <lastcall>
                        <xsl:value-of select="lastUnsuccessfulCallTodayString"/>
                    </lastcall>
                    <phone>
                        <xsl:value-of select="phone"/>
                    </phone>
                    <subjectiveWellbeing>
                        <xsl:value-of select="$wellBeingNotNull"/>
                    </subjectiveWellbeing>
                    <lat>
                        <xsl:value-of select="lat"/>
                    </lat>
                    <lon>
                        <xsl:value-of select="lon"/>
                    </lon>
                    <done>
                        <xsl:choose>
                            <xsl:when test="done = 'true'">1</xsl:when>
                            <xsl:otherwise>0</xsl:otherwise>
                        </xsl:choose>
                    </done>




                    <priority>
                        <xsl:call-template name="prio_calculation">
                            <xsl:with-param name="age" select="age"/>
                            <xsl:with-param name="subjectiveWellbeing" select="$wellBeingNotNull"/>
                            <xsl:with-param name="preExIllnesses" select="sumInitialDiseases"/>
                            <xsl:with-param name="sumSymptoms" select="$sumSymptomsNotNull"/>
                        </xsl:call-template>
                    </priority>
                </person>
            </xsl:for-each>
        </infected>
    </xsl:template>
</xsl:stylesheet>
