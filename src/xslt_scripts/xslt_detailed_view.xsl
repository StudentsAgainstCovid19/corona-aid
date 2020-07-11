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

        <xsl:choose>
            <xsl:when test="$days = 1">gestern</xsl:when>
            <xsl:otherwise><xsl:value-of select="$days"/><xsl:text> </xsl:text>Tagen</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="callStrFormatting">
        <xsl:param name="calls"/>

        <xsl:choose>
            <xsl:when test="$calls = 1">dem letzten Anruf</xsl:when>
            <xsl:otherwise><xsl:value-of select="$calls"/><xsl:text> </xsl:text>Anrufen</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="getWellbeingColor">
        <xsl:param name="wellbeing"/>
        <xsl:choose>
            <xsl:when test="$wellbeing = 1">darkred</xsl:when>
            <xsl:when test="$wellbeing = 2">red</xsl:when>
            <xsl:when test="$wellbeing = 3">orange</xsl:when>
            <xsl:when test="$wellbeing = 4">lightgreen</xsl:when>
            <xsl:when test="$wellbeing = 5">darkgreen</xsl:when>
            <xsl:otherwise>white</xsl:otherwise>
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
                <xsl:call-template name="callStrFormatting">
                    <xsl:with-param name="calls" select="$amountValues"/>
                </xsl:call-template>
            </xsl:variable>

            vor <xsl:value-of select="$daysBeforeText"/>
        </xsl:if>
        <span>
            <svg id="wellbeing_indicator_history" height="100"   xmlns="http://www.w3.org/2000/svg">
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
            <span id="wellbeingHistorySpaceRight">gestern</span>
        </xsl:if>
    </xsl:template>

    <xsl:template name="historyItemNotNull">
        <xsl:variable name="amountFound" select="count(historyItems/historyItem[not(status = 0)])"/>
        <xsl:choose>
            <xsl:when test="$amountFound = 0">-1</xsl:when>
            <xsl:otherwise>
                <xsl:variable name="indexLegit" select="count(historyItems/historyItem[not(status = 0)][last()]/preceding-sibling::*)"/>
                <xsl:value-of select="$indexLegit"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="sumSymptomsTemplate">
        <xsl:choose>
            <xsl:when test="historyItems = ''">0</xsl:when>
            <xsl:otherwise>
                <xsl:variable name="indexOfHistoryItem"><xsl:call-template name="historyItemNotNull"/></xsl:variable>
                <xsl:choose>
                    <xsl:when test="$indexOfHistoryItem = -1">
                        0
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="sum(historyItems/historyItem[$indexOfHistoryItem]/degreeOfDanger)"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="sumInitialDiseases">
        <xsl:value-of select="sum(initialDiseases/degreeOfDanger)"/>
    </xsl:template>

    <xsl:template name="getLatestWellbeing">
        <xsl:variable name="indexLastHistoryItem">
            <xsl:call-template name="historyItemNotNull"/>
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="$indexLastHistoryItem = -1">1</xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="historyItems/historyItem[not(status = 0)][last()]/personalFeeling"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="lastTestIndex">
        <xsl:param name="prescribed"/>
        <xsl:variable name="index">
            <xsl:choose>
                <xsl:when test="$prescribed = 0"><xsl:value-of  select="tests/test[not(result = 0)][last()]/id"/></xsl:when>
                <xsl:otherwise><xsl:value-of  select="tests/test[result = 0][last()]/id"/></xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:choose>
            <xsl:when test="not(tests/test[id = $index]/result = '')"><xsl:value-of select="$index"/></xsl:when>
            <xsl:otherwise>-1</xsl:otherwise>
        </xsl:choose>
    </xsl:template>




    <xsl:template match="InfectedDto">

        <div id="overallDiv">
        <div id="informationDiv">
            <p id="textInformationen" class="text boldText">Informationen zu <xsl:value-of select="surname"/>, <xsl:value-of select="forename"/></p>
            <p class="text">Alter: <xsl:value-of select="age"/> Jahre</p>
            <p class="text">Tel.: <span class="boldText"><xsl:choose>
                <xsl:when test="count(contactData/contactItem[contactKey = 'phone']) > 0">
                    <xsl:value-of select="contactData/contactItem[contactKey = 'phone']/contactValue"/>
                </xsl:when>
                <xsl:when test="count(contactData/contactItem[contactKey = 'mobile']) > 0">
                    <xsl:value-of select="contactData/contactItem[contactKey = 'mobile']/contactValue"/>
                </xsl:when>
                <xsl:otherwise>nicht vorhanden. Fehler!</xsl:otherwise>
            </xsl:choose></span></p>
            <p class="text"><xsl:value-of select="street"/><xsl:text> </xsl:text><xsl:value-of select="houseNumber"/></p>
            <p class="text"><xsl:value-of select="postalCode"/><xsl:text> </xsl:text><xsl:value-of select="city"/></p>
            <p class="text">Versicherungsnummer: <xsl:value-of select="healthInsuranceNumber"/></p>
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
            <p id="riskParagraph">Risikoeinschätzung:</p>
            <img id="wellbeingImage"><xsl:attribute name="src">./assets/markers/<xsl:value-of select="$prio_svg"/>_prio.svg</xsl:attribute></img>
            <p  id="riskText"><xsl:value-of select="$prio_desc"/></p>
            <div id="preexistingIllnessButtonDiv"><button id="preexistingIllnessButton" onclick="showPreExistingIllnesses();" class="dialogButton grayButton" >Vorerkrankungen</button></div>
        </div>

        <xsl:variable name="lastTestDoneId">
            <xsl:call-template name="lastTestIndex">
                <xsl:with-param name="prescribed">0</xsl:with-param>
            </xsl:call-template>
        </xsl:variable>
         <xsl:variable name="lastTestPrescribedId">
             <xsl:call-template name="lastTestIndex">
                 <xsl:with-param name="prescribed">1</xsl:with-param>
             </xsl:call-template>
         </xsl:variable>



        <p id="courseOfDiseaseHeader" class="text">Krankheitsverlauf</p>
            <div id="prescribeTestBorderdiv">
        <div id="prescribeTestDiv" class="flex-container-testresult">
        <xsl:variable name="testDaysText">
            <xsl:call-template name="dayFormatting">
                <xsl:with-param name="days" select="tests/test[id = $lastTestDoneId]/daysOverdue"/>
            </xsl:call-template>
        </xsl:variable>
            <input type="checkbox" id="test_result_checkbox" name="test_result_checkbox">
                <xsl:attribute name="disabled"/>
                <xsl:if test="tests/test[id = $lastTestDoneId]/result = 1">
                    <xsl:attribute name="checked"/>
                </xsl:if>
            </input>

            <label  id="test_result_label" for="test_result_checkbox">
                Test <xsl:choose>
                <xsl:when test="$lastTestDoneId = ''">noch nicht stattgefunden</xsl:when>
                <xsl:when test="tests/test[id = $lastTestDoneId]/result = 1">
                    positiv (vor <xsl:value-of select="$testDaysText"/>)
                </xsl:when>
                <xsl:otherwise>negativ (vor <xsl:value-of select="$testDaysText"/>)</xsl:otherwise>
            </xsl:choose>

            </label>
        <button id="prescribe_test" class="dialogButton grayButton">
            <xsl:choose>
                <xsl:when test="not(tests/test[id = $lastTestPrescribedId]/result = 0)">
                    <xsl:attribute name="onclick">prescribeTest(<xsl:value-of select="id"/>);</xsl:attribute>
                    Test anordnen
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="disabled">disabled;</xsl:attribute>
                    Test wurde angeordnet
                </xsl:otherwise>
            </xsl:choose>
        </button>
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

            <xsl:call-template name="notesContent"/>

            <xsl:call-template name="actionButtons"/>



        </div>

    </xsl:template>

    <xsl:template name="notesContent">
        <div id="notesDiv">
            <div id="notesHeaderDiv">
                <p id="notesHeaderText" class="text">Weitere Hinweise:</p>
                <button  class="dialogButton grayButton">
                    <xsl:choose>
                        <xsl:when test="count(historyItems/historyItem[(notes != '')]) > 0">
                            <xsl:attribute name="onclick">showNotes();</xsl:attribute>
                            Notizen anzeigen
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="disabled"/>
                            Keine Notizen vorhanden
                        </xsl:otherwise>
                    </xsl:choose>
                </button>
            </div>
            <textarea id="notes_area" class="notes_field" rows="10" cols="30" maxlength="100">
                <xsl:if test="updateFlag = 'true'">
                    <xsl:value-of select="historyItems/historyItem[last()]/notes"/>
                </xsl:if>
            </textarea>
        </div>
    </xsl:template>

    <xsl:template name="actionButtons">
        <div id="endButtonsDiv">
            <button class="dialogButton cancelButton">
                <xsl:attribute name="onclick">closeDetailedView(<xsl:value-of select="id"/>);</xsl:attribute>
                Abbrechen
            </button>
            <button id="submitButton" class="dialogButton submitButton">
                <xsl:attribute name="onclick">submitDetailView(<xsl:value-of select="id"/>
                    <xsl:if test="updateFlag = 'true'">
                        ,<xsl:value-of select="historyItems/historyItem[last()]/id"/>
                    </xsl:if>);</xsl:attribute>
                Senden
            </button>
            <button id="notCalledButton" class="dialogButton grayButton">
                <xsl:attribute name="onclick">failedCall(<xsl:value-of select="id"/>);</xsl:attribute>
                Nicht abgenommen
            </button>
        </div>
    </xsl:template>

</xsl:stylesheet>