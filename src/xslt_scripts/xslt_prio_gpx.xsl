<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="priority_name_template">
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

    <xsl:template match="/">
        <gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Wikipedia"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
            <metadata>
                <name>CoronaAid</name>
                <desc>CoronaAid-GPX-Daten</desc>
                <author>
                    <name>CoronaAid-Team</name>
                </author>
            </metadata>

            <xsl:for-each select="infected/person">
                <wpt>
                    <xsl:attribute name="lon"><xsl:value-of select="lon"/></xsl:attribute>
                    <xsl:attribute name="lat"><xsl:value-of select="lat"/></xsl:attribute>
                    <extensions>
                        <id><xsl:value-of select="id"/></id>
                        <priority><xsl:value-of select="priority"/></priority>
                        <done><xsl:value-of select="done"/></done>
                        <called><xsl:value-of select="calledbool"/></called>
                        <type>
                            <xsl:call-template name="priority_name_template">
                                <xsl:with-param name="prio"><xsl:value-of select="priority"/></xsl:with-param>
                                <xsl:with-param name="called"><xsl:value-of select="calledbool"/></xsl:with-param>
                            </xsl:call-template>
                        </type>
                    </extensions>
                </wpt>
            </xsl:for-each>
        </gpx>
    </xsl:template>
</xsl:stylesheet>