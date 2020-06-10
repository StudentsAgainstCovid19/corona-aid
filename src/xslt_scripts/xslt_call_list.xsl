<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:import href="./xslt_string_helpers.xsl"></xsl:import>

    <xsl:template match="/">
        <p>Meine Anrufsliste</p>
        <table>
            <xsl:for-each select="infected/person">
                <xsl:sort select="priority" order="descending" data-type="number"></xsl:sort>

                <xsl:variable name="div_classtag">
                    <xsl:call-template name="div_classtag_template">
                        <xsl:with-param name="called" select="calledbool"></xsl:with-param>
                        <xsl:with-param name="prio" select="priority"></xsl:with-param>
                    </xsl:call-template>
                </xsl:variable>

                <xsl:variable name="wellbeing_svg">
                    <xsl:call-template name="wellbeing_svg_template">
                        <xsl:with-param name="wellbeing" select="subjectiveWellbeing"></xsl:with-param>
                    </xsl:call-template>
                </xsl:variable>

                <xsl:variable name="wellbeing_desc">
                    <xsl:call-template name="wellbeing_desc">
                        <xsl:with-param name="wellbeing" select="subjectiveWellbeing"></xsl:with-param>
                    </xsl:call-template>
                </xsl:variable>

                <tr>
                    <td>
                        <div>
                            <xsl:attribute name="class"><xsl:value-of select="$div_classtag"></xsl:value-of> call_box</xsl:attribute>
                            <xsl:attribute name="onclick">try_acquire_lock(<xsl:value-of select="id"></xsl:value-of>)</xsl:attribute>

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
                                    <p>Heute, <xsl:value-of select="lastcall"></xsl:value-of> Uhr</p>
                                </xsl:when>
                            </xsl:choose>
                        </div>
                    </td>
                </tr>

            </xsl:for-each>
        </table>

    </xsl:template>
</xsl:stylesheet>