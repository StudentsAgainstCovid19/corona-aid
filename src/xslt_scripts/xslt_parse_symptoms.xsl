<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output
    method="xml"
    version="1.0"
    encoding="utf-8"
    standalone="no"
    doctype-system="https://www.corona-aid-ka.de/dtd/parse_symptoms_result.dtd"/>

    <xsl:template name="getSinceDaysSymptom">
        <xsl:param name="symptomId"/>


        <xsl:choose>
            <xsl:when test="count(/InfectedDto/historyItems/historyItem[not(status = 0) and count(symptoms/symptom[id = $symptomId]) = 0]) > 0">
        <!--
        Template to determine the time in days since when a symptom persists.
        Idea: 1. using the first part: "/InfectedDto/historyItems/historyItems[not(status = 0) and count(symptoms/symptoms[id = $symptomId]) = 0]"
                    all historyItem-nodes with successful as status and no entry with symptom-id as the parameter $symptomId
              2. then the last node is obtained (because only the last node when the symptom was not persistent is of interest)
              3. all following siblings (of the last node from 2.) with status unequal to 0 are obtained
                    (since all of them *must* have the symptom with id "$symptomId")
              4. the amount of nodes from 3. is counted which then results in the amount of days since when a person has a symptom
                    (with premise: every day has a symptom-->

                <xsl:value-of
                        select="count(/InfectedDto/historyItems/historyItem[not(status = 0) and count(symptoms/symptom[id = $symptomId]) = 0][last()]/following-sibling::*[not(status = 0)])"/>
            </xsl:when>
            <xsl:otherwise>
                <!--Symptom has always persisted-->
                <xsl:value-of select="count(/InfectedDto/historyItems/historyItem[not(status = 0) and count(symptoms/symptom[id = $symptomId]) > 0])"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="InfectedDto">
        <symptomXML>
            <surname><xsl:value-of select="surname"/></surname>
            <forename><xsl:value-of select="forename"/></forename>
            <symptoms>
                <xsl:if test="count(historyItems/historyItem[not(status = 0)]) > 0">
                    <xsl:apply-templates select="historyItems/historyItem[not(status = 0)][last()]/symptoms/symptom"/>
                </xsl:if>
            </symptoms>
        </symptomXML>
    </xsl:template>

    <xsl:template match="symptom">
        <xsl:variable name="sinceDays">
            <xsl:call-template name="getSinceDaysSymptom">
                <xsl:with-param name="symptomId" select="id"/>
            </xsl:call-template>
        </xsl:variable>

        <symptom>
            <id><xsl:value-of select="id"/></id>
            <sinceDays><xsl:value-of select="$sinceDays"/></sinceDays>
            <degreeOfDanger><xsl:value-of select="degreeOfDanger"/></degreeOfDanger>
            <name><xsl:value-of select="name"/></name>
            <probability><xsl:value-of select="probability"/></probability>
        </symptom>
    </xsl:template>
</xsl:stylesheet>