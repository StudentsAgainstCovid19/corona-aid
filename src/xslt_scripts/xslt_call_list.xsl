<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <p>Meine Anrufsliste</p>
        <table>
            <xsl:for-each select="infected/person">
                <xsl:sort select="priority" order="descending" data-type="number"></xsl:sort>

                <xsl:variable name="div_classtag">
                    <xsl:choose>
                        <xsl:when test="calledbool = 'true'">calledAlready</xsl:when>
                        <xsl:when test="round(priority) = 1 or round(priority) = 0">lowprio</xsl:when>
                        <xsl:when test="round(priority) = 2">intermediateprio</xsl:when>
                        <xsl:when test="round(priority) = 3">highprio</xsl:when>
                        <xsl:otherwise>veryhighprio</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>

                <xsl:variable name="wellbeing_svg">
                    <xsl:choose>
                        <xsl:when test="subjectiveWellbeing = 1">verybad</xsl:when>
                        <xsl:when test="subjectiveWellbeing = 2">bad</xsl:when>
                        <xsl:when test="subjectiveWellbeing = 3">intermediate</xsl:when>
                        <xsl:when test="subjectiveWellbeing = 4">good</xsl:when>
                        <xsl:otherwise>verygood</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <xsl:variable name="wellbeing_desc">
                    <xsl:choose>
                        <xsl:when test="subjectiveWellbeing = 1">Sehr schlecht</xsl:when>
                        <xsl:when test="subjectiveWellbeing = 2">Schlecht</xsl:when>
                        <xsl:when test="subjectiveWellbeing = 3">Mittelmäßig</xsl:when>
                        <xsl:when test="subjectiveWellbeing = 4">Gut</xsl:when>
                        <xsl:otherwise>Sehr gut</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>

                <tr>
                    <td>
                        <div>
                            <xsl:attribute name="class">call_box <xsl:value-of select="$div_classtag"></xsl:value-of></xsl:attribute>

                            <p><xsl:value-of select="lastname"></xsl:value-of>, <xsl:value-of select="firstnames"></xsl:value-of></p>
                            <p>Zustand:
                                <span class="wellbeing_imagespan">
                                    <img class="wellbeing_indicator">
                                        <xsl:attribute name="src">./assets/wellbeing_indicators/wellbeing_<xsl:value-of select="$wellbeing_svg"></xsl:value-of>.svg</xsl:attribute>
                                    </img>
                                </span>
                                <xsl:value-of select="$wellbeing_desc"></xsl:value-of>
                            </p>
                            <p>Tel.: <xsl:value-of select="phone"></xsl:value-of></p>
                            <xsl:choose>
                                <xsl:when test="$div_classtag = 'calledAlready'">
                                    <p>Letzter Versuch:</p>
                                    <p>Heute, <xsl:value-of select="lastcall"></xsl:value-of>Uhr</p>
                                </xsl:when>
                            </xsl:choose>
                        </div>
                    </td>
                </tr>

            </xsl:for-each>
        </table>

    </xsl:template>
</xsl:stylesheet>