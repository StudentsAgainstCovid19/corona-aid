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

    <xsl:template name="prioMarkerSVGName">
        <xsl:param name="prio"/>
        <xsl:choose>
            <xsl:when test="round($prio) = 1 or round($prio) = 0">lower</xsl:when>
            <xsl:when test="round($prio) = 2">intermed</xsl:when>
            <xsl:when test="round($prio) = 3">high</xsl:when>
            <xsl:otherwise>veryhigh</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="prioSpecification">
        <xsl:param name="prio"/>
        <xsl:choose>
            <xsl:when test="round($prio) = 1 or round($prio) = 0">niedrig</xsl:when>
            <xsl:when test="round($prio) = 2">mittelmäßg</xsl:when>
            <xsl:when test="round($prio) = 3">hoch</xsl:when>
            <xsl:otherwise>sehr hoch</xsl:otherwise>
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

    <xsl:template match="historyItems">
        <xsl:variable name="rawAmount" select="count(/InfectedDto/historyItems/historyItem[not(status = 0)])"/>
        <xsl:variable name="amountValues">
            <xsl:choose>
                <xsl:when test="$rawAmount > 7">7</xsl:when>
                <xsl:otherwise><xsl:value-of select="$rawAmount"/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="width">
            <xsl:choose>
                <xsl:when test="$amountValues = 0">0</xsl:when>
                <xsl:otherwise><xsl:value-of select="$amountValues * 70 - 20"/></xsl:otherwise>
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
        <span>
        <svg id="wellbeing_indicator_history" height="100">
            <xsl:attribute name="width"><xsl:value-of select="$width"/></xsl:attribute>

            <xsl:for-each select="/InfectedDto/historyItems/historyItem[not(status = 0)][position() > ($rawAmount - $amountValues)]">
                <xsl:sort select="timestamp" data-type="number"/>
                <xsl:variable name="color">
                    <xsl:call-template name="getWellbeingColor">
                        <xsl:with-param name="wellbeing" select="personalFeeling"/>
                    </xsl:call-template>
                </xsl:variable>
                <xsl:variable name="circle_x_pos" select="position()*70 - 45"/>
                <circle cy="50" r="20" stroke-width="2px" stroke="black">
                    <xsl:attribute name="fill"><xsl:value-of select="$color"/></xsl:attribute>
                    <xsl:attribute name="cx"><xsl:value-of select="$circle_x_pos"/></xsl:attribute>
                </circle>
                <xsl:if test="not(position() = $amountValues)">
                    <xsl:variable name="line_x1_pos" select="position()*70 - 21"/>
                    <xsl:variable name="line_x2_pos" select="position()*70 + 1"/>

                    <line y1="50" y2="50" stroke="black" stroke-width="5">
                        <xsl:attribute name="x1"><xsl:value-of select="$line_x1_pos"/></xsl:attribute>
                        <xsl:attribute name="x2"><xsl:value-of select="$line_x2_pos"/></xsl:attribute>
                    </line>
                </xsl:if>
            </xsl:for-each>
        </svg>
        </span>
        <xsl:if test="$amountValues > 0">
            <span>gestern</span>
        </xsl:if>
    </xsl:template>

    <xsl:template name="historyItemNotNull">
        <xsl:variable name="amountFound" select="count(/InfectedDto/historyItems/historyItem[not(status = 0)])"/>
        <xsl:choose>
            <xsl:when test="$amountFound = 0">-1</xsl:when>
            <xsl:otherwise>
                <xsl:variable name="indexLegit" select="count(/InfectedDto/historyItems/historyItem[not(status = 0)][$amountFound]/preceding-sibling::*)+1"/>
                <xsl:value-of select="$indexLegit"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="sumSymptomsTemplate">
        <xsl:choose>
            <xsl:when test="/InfectedDto/historyItems = ''">0</xsl:when>
            <xsl:otherwise>
                <xsl:variable name="indexOfHistoryItem"><xsl:call-template name="historyItemNotNull"/></xsl:variable>
                <xsl:choose>
                    <xsl:when test="$indexOfHistoryItem = -1">
                        0
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="sum(/InfectedDto/historyItems/historyItem[$indexOfHistoryItem]/degreeOfDanger)"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="sumInitialDiseases">
        <xsl:value-of select="sum(/InfectedDto/initialDiseases/degreeOfDanger)"/>
    </xsl:template>

    <xsl:template name="getLatestWellbeing">
        <xsl:variable name="indexLastHistoryItem">
            <xsl:call-template name="historyItemNotNull"/>
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="$indexLastHistoryItem = -1">1</xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="/InfectedDto/historyItems/historyItem[$indexLastHistoryItem]/personalFeeling"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="lastTestIndex">
        <xsl:param name="statusValue"/>
        <xsl:variable name="index" select="count(/InfectedDto/tests/tests[status = $statusValue][last()]/preceding-sibling::*)+1"/>
        <xsl:choose>
            <xsl:when test="/InfectedDto/tests/tests[$index]/status = $statusValue"><xsl:value-of select="$index"/></xsl:when>
            <xsl:otherwise>-1</xsl:otherwise>
        </xsl:choose>
    </xsl:template>





    <xsl:template match="InfectedDto">

        <div id="overallDiv">
        <div id="informationDiv">
        <p id="textInformationen" class="text">Informationen zu <xsl:value-of select="surname"/>, <xsl:value-of select="forename"/></p>
        <p class="text">Alter: <xsl:value-of select="age"/> Jahre</p>
        <p class="text">Tel.: <xsl:choose>
            <xsl:when test="count(/InfectedDto/contactData/contactItem[contactKey = 'phone']) > 0">
                <xsl:value-of select="/InfectedDto/contactData/contactItem[contactKey = 'phone']/contactValue"/>
            </xsl:when>
            <xsl:when test="count(/InfectedDto/contactData/contactItem[contactKey = 'mobile']) > 0">
                <xsl:value-of select="/InfectedDto/contactData/contactItem[contactKey = 'mobile']/contactValue"/>
            </xsl:when>
            <xsl:otherwise>nicht vorhanden. Fehler!</xsl:otherwise>
        </xsl:choose></p>
        <p class="text"><xsl:value-of select="street"/><xsl:text> </xsl:text><xsl:value-of select="houseNumber"/></p>
        </div>

        <xsl:variable name="lastWellbeing">
            <xsl:call-template name="getLatestWellbeing"/>
        </xsl:variable>
        <xsl:variable name="sumInitialDiseases">
            <xsl:call-template name="sumInitialDiseases"/>
        </xsl:variable>
        <xsl:variable name="sumSymptoms">
            <xsl:call-template name="sumSymptomsTemplate"/>
        </xsl:variable>

        <xsl:variable name="priority_value">
            <xsl:call-template name="prio_calculation">
                <xsl:with-param name="age" select="age"/>
                <xsl:with-param name="subjectiveWellbeing" select="$lastWellbeing"/>
                <xsl:with-param name="preExIllnesses" select="$sumInitialDiseases"/>
                <xsl:with-param name="sumSymptoms" select="$sumSymptoms"/>
            </xsl:call-template>
        </xsl:variable>

        <xsl:variable name="prio_svg">
            <xsl:call-template name="prioMarkerSVGName">
                <xsl:with-param name="prio" select="$priority_value"/>
            </xsl:call-template>
        </xsl:variable>

        <xsl:variable name="prio_desc">
            <xsl:call-template name="prioSpecification">
                <xsl:with-param name="prio" select="$priority_value"/>
            </xsl:call-template>
        </xsl:variable>

        <div id="riskDiv">
            <p id="riskParagraph">Risikoeinschätzung:
                <span id="wellbeingImageSpan"><img id="wellbeingImage"><xsl:attribute name="src">./assets/markers/<xsl:value-of select="$prio_svg"/>_prio.svg</xsl:attribute></img></span>
                <span id="riskEvaluationTextSpan"><xsl:value-of select="$prio_desc"/></span>
                <span id="preexistingIllnessButtonSpan"><button id="preexisting_illness_button" onclick="showPreExistingIllnesses();" class="dialogButton btn-gray" >Vorerkrankungen</button></span>
           </p>
        </div>

        <xsl:variable name="lastTestDoneIndex">
            <xsl:call-template name="lastTestIndex">
                <xsl:with-param name="statusValue">1</xsl:with-param>
            </xsl:call-template>
        </xsl:variable>
         <xsl:variable name="lastTestPrescribedIndex">
             <xsl:call-template name="lastTestIndex">
                 <xsl:with-param name="statusValue">0</xsl:with-param>
             </xsl:call-template>
         </xsl:variable>



        <p id="courseOfDiseaseHeader" class="text">Krankheitsverlauf</p>
            <div id="prescribeTestBorderdiv">
        <div id="prescribeTestDiv" class="flex-container-testresult">
        <xsl:variable name="testDaysText">
            <xsl:call-template name="dayFormatting">
                <xsl:with-param name="days" select="/InfectedDto/tests/tests[$lastTestDoneIndex]/timeDue"/>
            </xsl:call-template>
        </xsl:variable>


            <input type="checkbox" id="test_result_checkbox" name="test_result" class="chk">
                <xsl:attribute name="checked"><xsl:value-of select="/InfectedDto/tests/tests[$lastTestDoneIndex]/result"/></xsl:attribute>
            </input>

            <label  id="test_result_label" for="test_result">
                Test <xsl:choose>
                <xsl:when test="$lastTestDoneIndex = -1">noch nicht stattgefunden</xsl:when>
                <xsl:when test="/InfectedDto/tests/tests[$lastTestDoneIndex]/result = 'true'">
                    positiv (vor <xsl:value-of select="$testDaysText"/>)
                </xsl:when>
                <xsl:otherwise>negativ (vor <xsl:value-of select="$testDaysText"/>)</xsl:otherwise>
            </xsl:choose>

            </label>

        <button id="prescribe_test" class="dialogButton btn-gray">
            <xsl:if test="$lastTestDoneIndex = -1">
                <xsl:attribute name="onclick">prescribeTest(<xsl:value-of select="id"/>);</xsl:attribute>
            </xsl:if>
            <xsl:if test="/InfectedDto/tests/tests[$lastTestDoneIndex]/status = 0">
                <xsl:attribute name="disabled">disabled;</xsl:attribute>
            </xsl:if>
            Test anordnen</button>
        </div>
            </div>

        <p id="symptomHeader" class="text">Symptome<button id="addSymptomButton" onclick="showSymptoms();">+</button></p>
        <div id="symptomsDiv" ></div>


        <p id="wellbeingHistoryParagraph" class="text"> Verlauf (subj.) <div id="wellbeingHistoryDiv"><xsl:apply-templates select="historyItems"/></div></p>

        <div id="wellbeingContentDiv" >
        <p class="text">Wie geht es der Person heute?
            <input type="range" min="1" max="5" step="1" id="wellbeing_slider">
                <xsl:attribute name="value"><xsl:value-of select="$lastWellbeing"/></xsl:attribute>
            </input>
        </p>
        </div>
        <p class="text">Weitere Hinweise:</p>
        <textarea id="notes_area" rows="10" cols="30"/>



        <div id="endButtonsDiv" class="flex-container-endbuttons">
            <button class="dialogButton cancel_button">
            <xsl:attribute name="onclick">closeDetailedView(<xsl:value-of select="id"/>);</xsl:attribute>
            Abbrechen
             </button>
            <button id="submitButton" class="dialogButton submit_button">
                <xsl:attribute name="onclick">submitDetailView(<xsl:value-of select="id"/>);</xsl:attribute>
                Senden
            </button>
            <button id="notCalledButton" class="dialogButton btn-gray">
                <xsl:attribute name="onclick">failedCall(<xsl:value-of select="id"/>);</xsl:attribute>
                Nicht abgenommen
            </button>
        </div>
        </div>



    </xsl:template>
</xsl:stylesheet>