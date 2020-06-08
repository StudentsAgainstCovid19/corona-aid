<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="./xslt_priority_helpers.xsl"></xsl:import>
    <xsl:import href="./xslt_string_helpers.xsl"></xsl:import>
    
    <xsl:template name="dayFormatting">
        <xsl:param name="days"></xsl:param>

        <xsl:variable name="dayText">
            <xsl:choose>
                <xsl:when test="$days = 1">Tag</xsl:when>
                <xsl:otherwise>Tagen</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:value-of select="$days"></xsl:value-of><xsl:text> </xsl:text><xsl:value-of select="$dayText"></xsl:value-of>
    </xsl:template>

    <xsl:template name="getWellbeingColor">
        <xsl:param name="wellbeing"></xsl:param>
        <xsl:choose>
            <xsl:when test="$wellbeing = 1">darkred</xsl:when>
            <xsl:when test="$wellbeing = 2">red</xsl:when>
            <xsl:when test="$wellbeing = 3">orange</xsl:when>
            <xsl:when test="$wellbeing = 4">lightgreen</xsl:when>
            <xsl:when test="$wellbeing = 5">darkgreen</xsl:when>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="subjectiveWellbeings">

        <xsl:variable name="amountValues" select="count(subjectiveWellBeing)"></xsl:variable>
        <xsl:variable name="width">
            <xsl:choose>
                <xsl:when test="$amountValues = 0">0</xsl:when>
                <xsl:otherwise><xsl:value-of select="$amountValues * 120 - 20"></xsl:value-of></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:if test="$amountValues > 0">

            <xsl:variable name="daysBeforeText">
                <xsl:call-template name="dayFormatting">
                    <xsl:with-param name="days" select="$amountValues"></xsl:with-param>
                </xsl:call-template>
            </xsl:variable>

            vor <xsl:value-of select="$daysBeforeText"></xsl:value-of>
        </xsl:if>
        <svg id="wellbeing_indicator_history" height="100">
            <xsl:attribute name="width"><xsl:value-of select="$width"></xsl:value-of></xsl:attribute>

            <xsl:for-each select="subjectiveWellBeing">
                <xsl:sort select="timestamp" data-type="number"></xsl:sort>
                <xsl:variable name="color">
                    <xsl:call-template name="getWellbeingColor">
                        <xsl:with-param name="wellbeing" select="wellbeing"></xsl:with-param>
                    </xsl:call-template>
                </xsl:variable>
                <xsl:variable name="circle_x_pos" select="position()*120 - 70"></xsl:variable>
                <circle cy="50" r="49" stroke-width="2px" stroke="black">
                    <xsl:attribute name="fill"><xsl:value-of select="$color"></xsl:value-of></xsl:attribute>
                    <xsl:attribute name="cx"><xsl:value-of select="$circle_x_pos"></xsl:value-of></xsl:attribute>
                </circle>
                <xsl:if test="not(position() = $amountValues)">
                    <xsl:variable name="line_x1_pos" select="position()*120 - 21"></xsl:variable>
                    <xsl:variable name="line_x2_pos" select="position()*120 + 1"></xsl:variable>

                    <line y1="50" y2="50" stroke="black" stroke-width="15">
                        <xsl:attribute name="x1"><xsl:value-of select="$line_x1_pos"></xsl:value-of></xsl:attribute>
                        <xsl:attribute name="x2"><xsl:value-of select="$line_x2_pos"></xsl:value-of></xsl:attribute>
                    </line>
                </xsl:if>
            </xsl:for-each>
        </svg>

        <xsl:if test="$amountValues > 0">
            gestern
        </xsl:if>
    </xsl:template>


    <xsl:template match="infected">
        <p>Informationen zu <xsl:value-of select="lastname"></xsl:value-of>, <xsl:value-of select="firstnames"></xsl:value-of></p>
        <p>Alter: <xsl:value-of select="age"></xsl:value-of> Jahre</p>
        <p>Tel.: <xsl:value-of select="phone"></xsl:value-of></p>
        <p><xsl:value-of select="street"></xsl:value-of><xsl:text> </xsl:text><xsl:value-of select="housenumber"></xsl:value-of></p>

        <xsl:variable name="priority_value">
            <xsl:call-template name="prio_calculation">
                <xsl:with-param name="age" select="age"></xsl:with-param>
                <xsl:with-param name="subjectiveWellbeing" select="subjectiveWellbeing"></xsl:with-param>
                <xsl:with-param name="preExIllnesses" select="sumPreExIllnes"></xsl:with-param>
                <xsl:with-param name="sumSymptoms" select="sumSymptoms"></xsl:with-param>
            </xsl:call-template>
        </xsl:variable>

        <xsl:variable name="prio_svg">intermediate</xsl:variable>

        <xsl:variable name="prio_desc">Sehr gut</xsl:variable>

        <p>Risikoeinschätzung: <span><img><xsl:attribute name="src">./assets/wellbeing_indicators/wellbeing_<xsl:value-of select="$prio_svg"></xsl:value-of>.svg</xsl:attribute></img></span>
            <xsl:value-of select="$prio_desc"></xsl:value-of>
        </p>
        <button id="preexisting_illness_button">Vorerkrankungen</button>
        <p>Krankheitsverlauf</p>

        <input type="checkbox" id="test_result_checkbox" name="test_result">
            <xsl:attribute name="checked"><xsl:value-of select="test/result"></xsl:value-of></xsl:attribute>
        </input>

        <xsl:variable name="testDaysText">
            <xsl:call-template name="dayFormatting">
                <xsl:with-param name="days" select="test/timeDue"></xsl:with-param>
            </xsl:call-template>
        </xsl:variable>


        <label for="test_result">
            Test <xsl:if test="test/result = 'true'">
                positiv (vor <xsl:value-of select="$testDaysText"></xsl:value-of>)
            </xsl:if>
        </label>

        <p><xsl:attribute name="class"><xsl:choose>
            <xsl:when test="test/prescribed = 1">alreadyPrescribed</xsl:when>
            <xsl:otherwise>notPrescribed</xsl:otherwise>
        </xsl:choose></xsl:attribute>Test anordnen</p>



        <p>Symptome</p>
        <button id="addSymptomButton">+</button>

        <div id="symptomsDiv">
            <xsl:for-each select="symptoms/symptom">
                <xsl:variable name="sinceDaysText">
                    <xsl:call-template name="dayFormatting">
                        <xsl:with-param name="days" select="sinceDays"></xsl:with-param>
                    </xsl:call-template>
                </xsl:variable>
                <p>
                    <input type="checkbox" class="symptom_checkbox" name="test_result">
                        <xsl:attribute name="checked"><xsl:value-of select="test/result"></xsl:value-of></xsl:attribute>
                    </input>
                    <label><xsl:value-of select="name"></xsl:value-of>
                        <span class="sinceDays"> seit <xsl:value-of select="$sinceDaysText"></xsl:value-of>
                        </span>
                    </label>

                </p>

            </xsl:for-each>
        </div>

        <p> Verlauf (subj.) <xsl:apply-templates select="subjectiveWellbeings"></xsl:apply-templates></p>
        <xsl:variable name="lastWellbeing">2</xsl:variable>

        <xsl:variable name="pronoun">
            <xsl:choose>
                <xsl:when test="gender = 'male'">ihm</xsl:when>
                <xsl:otherwise>ihr</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <p>Wie geht's <xsl:value-of select="$pronoun"></xsl:value-of> heute?
            <input type="range" min="1" max="5" step="1" id="wellbeing_slider">
                <xsl:attribute name="value"><xsl:value-of select="$lastWellbeing"></xsl:value-of></xsl:attribute>
            </input>
        </p>

        <button id="cancel_detail_button" class="dialogButton">Abbrechen<i class="fa fa-search"></i></button>
        <button id="submit_detail_button" class="dialogButton">Senden</button>
    </xsl:template>
</xsl:stylesheet>