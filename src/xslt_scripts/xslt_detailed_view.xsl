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

    <xsl:template name="div_classtag_template">
        <xsl:param name="prio"/>
        <xsl:param name="called"/>
        <xsl:choose>
            <xsl:when test="$called = 'true'">calledAlready</xsl:when>
            <xsl:when test="round($prio) = 1 or round($prio) = 0">lowprio</xsl:when>
            <xsl:when test="round($prio) = 2">intermediateprio</xsl:when>
            <xsl:when test="round($prio) = 3">highprio</xsl:when>
            <xsl:otherwise>veryhighprio</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="wellbeing_svg_template">
        <xsl:param name="wellbeing"/>
        <xsl:choose>
            <xsl:when test="$wellbeing = 1">verybad</xsl:when>
            <xsl:when test="$wellbeing = 2">bad</xsl:when>
            <xsl:when test="$wellbeing = 3">intermediate</xsl:when>
            <xsl:when test="$wellbeing = 4">good</xsl:when>
            <xsl:otherwise>verygood</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="wellbeing_desc">
        <xsl:param name="wellbeing"/>
        <xsl:choose>
            <xsl:when test="$wellbeing = 1">Sehr schlecht</xsl:when>
            <xsl:when test="$wellbeing = 2">Schlecht</xsl:when>
            <xsl:when test="$wellbeing = 3">Mittelmäßig</xsl:when>
            <xsl:when test="$wellbeing = 4">Gut</xsl:when>
            <xsl:otherwise>Sehr gut</xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
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

    <xsl:template name="getWellbeingColor">
        <xsl:param name="wellbeing"/>
        <xsl:choose>
            <xsl:when test="$wellbeing = 1">darkred</xsl:when>
            <xsl:when test="$wellbeing = 2">red</xsl:when>
            <xsl:when test="$wellbeing = 3">orange</xsl:when>
            <xsl:when test="$wellbeing = 4">lightgreen</xsl:when>
            <xsl:when test="$wellbeing = 5">darkgreen</xsl:when>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="subjectiveWellbeings">

        <xsl:variable name="amountValues" select="count(subjectiveWellBeing)"/>
        <xsl:variable name="width">
            <xsl:choose>
                <xsl:when test="$amountValues = 0">0</xsl:when>
                <xsl:otherwise><xsl:value-of select="$amountValues * 120 - 20"/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:if test="$amountValues > 0">

            <xsl:variable name="daysBeforeText">
                <xsl:call-template name="dayFormatting">
                    <xsl:with-param name="days" select="$amountValues"/>
                </xsl:call-template>
            </xsl:variable>

            vor <xsl:value-of select="$daysBeforeText"/>
        </xsl:if>
        <svg id="wellbeing_indicator_history" height="100">
            <xsl:attribute name="width"><xsl:value-of select="$width"/></xsl:attribute>

            <xsl:for-each select="subjectiveWellBeing">
                <xsl:sort select="timestamp" data-type="number"/>
                <xsl:variable name="color">
                    <xsl:call-template name="getWellbeingColor">
                        <xsl:with-param name="wellbeing" select="wellbeing"/>
                    </xsl:call-template>
                </xsl:variable>
                <xsl:variable name="circle_x_pos" select="position()*120 - 70"/>
                <circle cy="50" r="49" stroke-width="2px" stroke="black">
                    <xsl:attribute name="fill"><xsl:value-of select="$color"/></xsl:attribute>
                    <xsl:attribute name="cx"><xsl:value-of select="$circle_x_pos"/></xsl:attribute>
                </circle>
                <xsl:if test="not(position() = $amountValues)">
                    <xsl:variable name="line_x1_pos" select="position()*120 - 21"/>
                    <xsl:variable name="line_x2_pos" select="position()*120 + 1"/>

                    <line y1="50" y2="50" stroke="black" stroke-width="15">
                        <xsl:attribute name="x1"><xsl:value-of select="$line_x1_pos"/></xsl:attribute>
                        <xsl:attribute name="x2"><xsl:value-of select="$line_x2_pos"/></xsl:attribute>
                    </line>
                </xsl:if>
            </xsl:for-each>
        </svg>

        <xsl:if test="$amountValues > 0">
            gestern
        </xsl:if>
    </xsl:template>


    <xsl:template match="infected">
        <p id="textInformationen" class="text">Informationen zu <xsl:value-of select="lastname"/>, <xsl:value-of select="firstnames"/></p>
        <p class="text">Alter: <xsl:value-of select="age"/> Jahre</p>
        <p class="text">Tel.: <xsl:value-of select="phone"/></p>
        <p class="text"><xsl:value-of select="street"/><xsl:text> </xsl:text><xsl:value-of select="housenumber"/></p>

        <xsl:variable name="priority_value">
            <xsl:call-template name="prio_calculation">
                <xsl:with-param name="age" select="age"/>
                <xsl:with-param name="subjectiveWellbeing" select="subjectiveWellbeing"/>
                <xsl:with-param name="preExIllnesses" select="sumPreExIllnes"/>
                <xsl:with-param name="sumSymptoms" select="sumSymptoms"/>
            </xsl:call-template>
        </xsl:variable>

        <xsl:variable name="prio_svg">intermediate</xsl:variable>

        <xsl:variable name="prio_desc">Sehr gut</xsl:variable>

        <p id="risk" class="text">Risikoeinschätzung:
            <div id="riskEvaluationImageDiv"><img><xsl:attribute name="src">./assets/wellbeing_indicators/wellbeing_<xsl:value-of select="$prio_svg"/>.svg</xsl:attribute></img></div>
            <div id="riskEvaluationTextDiv"><xsl:value-of select="$prio_desc"/></div>
            <button id="preexisting_illness_button" onclick="showPreExistingIllnesses();" class="dialogButton btn-gray" >Vorerkrankungen</button>
        </p>


        <p class="text">Krankheitsverlauf</p>

        <input type="checkbox" id="test_result_checkbox" name="test_result">
            <xsl:attribute name="checked"><xsl:value-of select="test/result"/></xsl:attribute>
        </input>

        <xsl:variable name="testDaysText">
            <xsl:call-template name="dayFormatting">
                <xsl:with-param name="days" select="test/timeDue"/>
            </xsl:call-template>
        </xsl:variable>


        <label for="test_result" id="test_result_label">
            Test <xsl:if test="test/result = 'true'">
                positiv (vor <xsl:value-of select="$testDaysText"/>)
            </xsl:if>
        </label>
        <button id="prescribe_test" class="dialogButton btn-gray">
            <xsl:if test="test/prescribed = 0">
                <xsl:attribute name="onclick">prescribeTest(<xsl:value-of select="id"/>);</xsl:attribute>
            </xsl:if>
            <xsl:if test="test/prescribed = 1">
                <xsl:attribute name="disabled">disabled;</xsl:attribute>
            </xsl:if>
            Test anordnen</button>


        <p id="symptomHeader" class="text">Symptome</p>
        <div id="symptomsDiv" ></div>
        <button id="addSymptomButton" onclick="showSymptoms();">+</button>


        <p class="text"> Verlauf (subj.) <xsl:apply-templates select="subjectiveWellbeings"/></p>
        <xsl:variable name="lastWellbeing">2</xsl:variable>

        <xsl:variable name="pronoun">
            <xsl:choose>
                <xsl:when test="gender = 'male'">ihm</xsl:when>
                <xsl:otherwise>ihr</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <p class="text">Wie geht's <xsl:value-of select="$pronoun"/> heute?
            <input type="range" min="1" max="5" step="1" id="wellbeing_slider">
                <xsl:attribute name="value"><xsl:value-of select="$lastWellbeing"/></xsl:attribute>
            </input>
        </p>

        <button class="dialogButton cancel_button">
            <xsl:attribute name="onclick">closeDetailedView(<xsl:value-of select="id"/>);</xsl:attribute>
            Abbrechen
        </button>
        <button class="dialogButton submit_button">
            <xsl:attribute name="onclick">submitDetailView(<xsl:value-of select="id"/>);</xsl:attribute>
            Senden
        </button>
        <button class="dialogButton btn-gray">
            <xsl:attribute name="onclick">failedCall(<xsl:value-of select="id"/>);</xsl:attribute>
            Nicht abgenommen
        </button>


        <textarea id="notes_area" rows="10" cols="30"/>
    </xsl:template>
</xsl:stylesheet>