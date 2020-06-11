<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="./xslt_string_helpers.xsl"></xsl:import>

    <xsl:template match="/">
        <p>Meine Anrufsliste</p>
        <table>
            <xsl:for-each select="infected/person">
                <xsl:sort select="done" data-type="number"/>
                <xsl:sort select="priority" order="descending" data-type="number"/>

                <xsl:variable name="div_classtag">
                    <xsl:call-template name="div_classtag_template">
                        <xsl:with-param name="called" select="calledbool"/>
                        <xsl:with-param name="prio" select="priority"/>
                    </xsl:call-template>
                </xsl:variable>

                <xsl:variable name="wellbeing_svg">
                    <xsl:call-template name="wellbeing_svg_template">
                        <xsl:with-param name="wellbeing" select="subjectiveWellbeing"/>
                    </xsl:call-template>
                </xsl:variable>

                <xsl:variable name="wellbeing_desc">
                    <xsl:call-template name="wellbeing_desc">
                        <xsl:with-param name="wellbeing" select="subjectiveWellbeing"/>
                    </xsl:call-template>
                </xsl:variable>

                <tr>
                    <td>
                        <div>
                            <xsl:attribute name="class">
                                <xsl:choose>
                                    <xsl:when test="done = 1">done_call_box</xsl:when>
                                    <xsl:otherwise><xsl:value-of select="$div_classtag"/></xsl:otherwise>
                                </xsl:choose> call_box</xsl:attribute>


                            <xsl:attribute name="onclick">try_acquire_lock(<xsl:value-of select="id"/>)</xsl:attribute>

                            <p><xsl:value-of select="lastname"/>, <xsl:value-of select="firstnames"/></p>
                            <p>Zustand:
                                <span class="wellbeing_imagespan">
                                    <img class="wellbeing_indicator">
                                        <xsl:attribute name="src">./assets/wellbeing_indicators/wellbeing_<xsl:value-of select="$wellbeing_svg"/>.svg</xsl:attribute>
                                    </img>
                                </span>
                                <xsl:value-of select="$wellbeing_desc"/>
                            </p>
                            <p>Tel.: <xsl:value-of select="phone"/></p>
                            <xsl:choose>
                                <xsl:when test="$div_classtag = 'calledAlready'">
                                    <p>Letzter Versuch:</p>
                                    <p>Heute, <xsl:value-of select="lastcall"/> Uhr</p>
                                </xsl:when>
                            </xsl:choose>
                        </div>
                    </td>
                </tr>

            </xsl:for-each>
        </table>

    </xsl:template>
</xsl:stylesheet>