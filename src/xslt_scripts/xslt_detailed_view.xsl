<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="./xslt_priority_helpers.xsl"></xsl:import>
    <xsl:import href="./xslt_string_helpers.xsl"></xsl:import>
    
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
        <p>Informationen zu <xsl:value-of select="lastname"/>, <xsl:value-of select="firstnames"/></p>
        <p>Alter: <xsl:value-of select="age"/> Jahre</p>
        <p>Tel.: <xsl:value-of select="phone"/></p>
        <p><xsl:value-of select="street"/><xsl:text> </xsl:text><xsl:value-of select="housenumber"/></p>

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

        <p>Risikoeinschätzung: <span><img><xsl:attribute name="src">./assets/wellbeing_indicators/wellbeing_<xsl:value-of select="$prio_svg"/>.svg</xsl:attribute></img></span>
            <xsl:value-of select="$prio_desc"/>
        </p>
        <button id="preexisting_illness_button" onclick="showPreExistingIllnesses();">Vorerkrankungen</button>
        <p>Krankheitsverlauf</p>

        <input type="checkbox" id="test_result_checkbox" name="test_result">
            <xsl:attribute name="checked"><xsl:value-of select="test/result"/></xsl:attribute>
        </input>

        <xsl:variable name="testDaysText">
            <xsl:call-template name="dayFormatting">
                <xsl:with-param name="days" select="test/timeDue"/>
            </xsl:call-template>
        </xsl:variable>


        <label for="test_result">
            Test <xsl:if test="test/result = 'true'">
                positiv (vor <xsl:value-of select="$testDaysText"/>)
            </xsl:if>
        </label>

        <p id="prescribe_test">
            <xsl:if test="test/prescribed = 0">
                <xsl:attribute name="onclick">prescribeTest(<xsl:value-of select="id"/>);</xsl:attribute>
            </xsl:if>
            <xsl:attribute name="class"><xsl:choose>
            <xsl:when test="test/prescribed = 1">alreadyPrescribed</xsl:when>
            <xsl:otherwise>notPrescribed</xsl:otherwise>
        </xsl:choose></xsl:attribute>Test anordnen</p>



        <p>Symptome</p>
        <button id="addSymptomButton" onclick="showSymptoms();">+</button>

        <div id="symptomsDiv">
            <xsl:for-each select="symptoms/symptom">
                <xsl:variable name="sinceDaysText">
                    <xsl:call-template name="dayFormatting">
                        <xsl:with-param name="days" select="sinceDays"/>
                    </xsl:call-template>
                </xsl:variable>
                <p>
                    <input type="checkbox" class="symptom_checkbox" name="test_result">
                        <xsl:attribute name="checked"><xsl:value-of select="test/result"/></xsl:attribute>
                    </input>
                    <label><xsl:value-of select="name"/>
                        <span class="sinceDays"> seit <xsl:value-of select="$sinceDaysText"/>
                        </span>
                    </label>

                </p>

            </xsl:for-each>
        </div>

        <p> Verlauf (subj.) <xsl:apply-templates select="subjectiveWellbeings"/></p>
        <xsl:variable name="lastWellbeing">2</xsl:variable>

        <xsl:variable name="pronoun">
            <xsl:choose>
                <xsl:when test="gender = 'male'">ihm</xsl:when>
                <xsl:otherwise>ihr</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <p>Wie geht's <xsl:value-of select="$pronoun"/> heute?
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
        <button>
            <xsl:attribute name="onclick">failedCall(<xsl:value-of select="id"/>);</xsl:attribute>
            Nicht angenommen
        </button>
    </xsl:template>
</xsl:stylesheet>