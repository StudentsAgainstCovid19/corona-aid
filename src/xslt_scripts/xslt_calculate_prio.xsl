<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template name="power_series">
        <xsl:param name="x_value"/>
        <xsl:param name="numerator"/>
        <xsl:param name="remaining_iterations"/>
        <xsl:param name="demoninator_fak"/>
        <xsl:param name="i"/>


        <xsl:variable name="term">
            <xsl:choose>
                <xsl:when test="$i = 0">1</xsl:when>
                <xsl:otherwise><xsl:value-of select="$numerator div $demoninator_fak"/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="$remaining_iterations = 1"><xsl:value-of select="$term"/></xsl:when>
            <xsl:otherwise>
                <xsl:variable name="recursive_ret">
                    <xsl:call-template name="power_series">
                        <xsl:with-param name="i" select="$i + 1"/>
                        <xsl:with-param name="x_value" select="$x_value"/>
                        <xsl:with-param name="remaining_iterations" select="$remaining_iterations - 1"/>
                        <xsl:with-param name="demoninator_fak" select="$demoninator_fak * ($i+1)"/>
                        <xsl:with-param name="numerator" select="$numerator * $x_value"/>
                    </xsl:call-template>
                </xsl:variable>
                <xsl:value-of select="$term + $recursive_ret"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="prio_calculation">
        <xsl:param name="age"/>
        <xsl:param name="preExIllnesses"/>
        <xsl:param name="sumSymptoms"/>
        <xsl:param name="subjectiveWellbeing"/>

        <xsl:variable name="euler_preIllnessValue">
            <xsl:call-template name="power_series">
                <xsl:with-param name="i" select="0"/>
                <xsl:with-param name="x_value" select="$preExIllnesses * (-0.25)"/>
                <xsl:with-param name="remaining_iterations" select="40"/>
                <xsl:with-param name="numerator" select="1"/>
                <xsl:with-param name="demoninator_fak" select="1"/>
            </xsl:call-template>
        </xsl:variable>
        <xsl:variable name="euler_symptoms">
            <xsl:call-template name="power_series">
                <xsl:with-param name="i" select="0"/>
                <xsl:with-param name="x_value" select="$sumSymptoms * (-0.25)"/>
                <xsl:with-param name="remaining_iterations" select="40"/>
                <xsl:with-param name="numerator" select="1"/>
                <xsl:with-param name="demoninator_fak" select="1"/>
            </xsl:call-template>
        </xsl:variable>

        <xsl:variable name="symptom_value" select="1 div ((2 div 3.0)+$euler_symptoms)-0.5"/>
        <xsl:variable name="preIllness_value" select="1 div ((2 div 3.0)+$euler_preIllnessValue)-0.5"/>
        <xsl:variable name="subjectiveWellbeingFactor" select="(5-$subjectiveWellbeing)*0.2"/>
        <xsl:variable name="age_value" select="$age div 100.0"/>

        <xsl:value-of select="$subjectiveWellbeingFactor+$symptom_value+$preIllness_value+$age_value"/>
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