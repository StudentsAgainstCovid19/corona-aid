<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template name="power_series">
        <xsl:param name="x_value"></xsl:param>
        <xsl:param name="numerator"></xsl:param>
        <xsl:param name="remaining_iterations"></xsl:param>
        <xsl:param name="demoninator_fak"></xsl:param>
        <xsl:param name="i"></xsl:param>


        <xsl:variable name="term">
            <xsl:choose>
                <xsl:when test="$i = 0">1</xsl:when>
                <xsl:otherwise><xsl:value-of select="$numerator div $demoninator_fak"></xsl:value-of></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="$remaining_iterations = 1"><xsl:value-of select="$term"></xsl:value-of></xsl:when>
            <xsl:otherwise>
                <xsl:variable name="recursive_ret">
                    <xsl:call-template name="power_series">
                        <xsl:with-param name="i" select="$i + 1"></xsl:with-param>
                        <xsl:with-param name="x_value" select="$x_value"></xsl:with-param>
                        <xsl:with-param name="remaining_iterations" select="$remaining_iterations - 1"></xsl:with-param>
                        <xsl:with-param name="demoninator_fak" select="$demoninator_fak * ($i+1)"></xsl:with-param>
                        <xsl:with-param name="numerator" select="$numerator * $x_value"></xsl:with-param>
                    </xsl:call-template>
                </xsl:variable>
                <xsl:value-of select="$term + $recursive_ret"></xsl:value-of>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="prio_calculation">
        <xsl:param name="age"></xsl:param>
        <xsl:param name="preExIllnesses"></xsl:param>
        <xsl:param name="sumSymptoms"></xsl:param>
        <xsl:param name="subjectiveWellbeing"></xsl:param>

        <xsl:variable name="euler_preIllnessValue">
            <xsl:call-template name="power_series">
                <xsl:with-param name="i" select="0"></xsl:with-param>
                <xsl:with-param name="x_value" select="$preExIllnesses * (-0.25)"></xsl:with-param>
                <xsl:with-param name="remaining_iterations" select="40"></xsl:with-param>
                <xsl:with-param name="numerator" select="1"></xsl:with-param>
                <xsl:with-param name="demoninator_fak" select="1"></xsl:with-param>
            </xsl:call-template>
        </xsl:variable>
        <xsl:variable name="euler_symptoms">
            <xsl:call-template name="power_series">
                <xsl:with-param name="i" select="0"></xsl:with-param>
                <xsl:with-param name="x_value" select="$sumSymptoms * (-0.25)"></xsl:with-param>
                <xsl:with-param name="remaining_iterations" select="40"></xsl:with-param>
                <xsl:with-param name="numerator" select="1"></xsl:with-param>
                <xsl:with-param name="demoninator_fak" select="1"></xsl:with-param>
            </xsl:call-template>
        </xsl:variable>

        <xsl:variable name="symptom_value" select="1 div ((2 div 3.0)+$euler_symptoms)-0.5"></xsl:variable>
        <xsl:variable name="preIllness_value" select="1 div ((2 div 3.0)+$euler_preIllnessValue)-0.5"></xsl:variable>
        <xsl:variable name="subjectiveWellbeingFactor" select="(5-$subjectiveWellbeing)*0.2"></xsl:variable>
        <xsl:variable name="age_value" select="$age div 100.0"></xsl:variable>

        <xsl:value-of select="$subjectiveWellbeingFactor+$symptom_value+$preIllness_value+$age_value"></xsl:value-of>
    </xsl:template>
    
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

    <xsl:template match="subjectiveWellbeings"> 5
        <xsl:for-each select="subjectiveWellbeings/subjectiveWellBeing">
            <xsl:sort select="timestamp" data-type="number"></xsl:sort>

            <xsl:value-of select="wellbeing"></xsl:value-of>
        </xsl:for-each>
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
        <p>Krankheitsverlauf</p>

        <input type="checkbox" id="test_result_checkbox" name="test_result">
            <xsl:attribute name="checked"><xsl:value-of select="test/result"></xsl:value-of></xsl:attribute>
        </input>
        <label for="test_result">Test <xsl:choose>
            <xsl:when test="test/result = 'true'">positiv (vor <xsl:value-of select="test/timeDue"></xsl:value-of><xsl:text> </xsl:text><xsl:choose>
                <xsl:when test="test/timeDue = 1">Tag</xsl:when>
                <xsl:otherwise>Tagen</xsl:otherwise>
            </xsl:choose>)</xsl:when>
        </xsl:choose></label>

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

        <xsl:variable name="wellbeingProgression">
            <xsl:apply-templates select="subjectiveWellBeing"></xsl:apply-templates>
        </xsl:variable>

        <p> Verlauf (subj.) <span>hi<xsl:value-of select="$wellbeingProgression"></xsl:value-of></span></p>

    </xsl:template>
</xsl:stylesheet>