<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="10">
            <defs>
                <linearGradient id="progressColorGradient" x1="0%" y1="100%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                    <stop offset="20%" style="stop-color:rgb(255,165,0);stop-opacity:1" />
                    <stop offset="50%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgb(0,255,0);stop-opacity:1" />
                </linearGradient>
            </defs>

            <xsl:variable name="amountTotal">
                <xsl:choose>
                    <xsl:when test="count(infected/person) > 0">
                        <xsl:value-of select="count(infected/person)"/>
                    </xsl:when>
                    <xsl:otherwise>1</xsl:otherwise> <!-- Prevent division by zero -->
                </xsl:choose>
            </xsl:variable>

            <xsl:variable name="amountDone" select="count(infected/person[done = 1])"/>

            <xsl:variable name="percentage" select="$amountDone div $amountTotal * 100"/>


            <rect x="0%" y="0%" width="100%" height="10" rx="5" ry="5" fill="url(#progressColorGradient)" stroke-width="0.5" stroke="black"/>
            <rect y="0.25" height="9.5" rx="5" ry="5" fill="white">
                <xsl:attribute name="x"><xsl:value-of select="$percentage"/></xsl:attribute>
                <xsl:attribute name="width"><xsl:value-of select="100 - $percentage"/></xsl:attribute>
            </rect>

            <text text-anchor="middle" font-size="7.5">
                <tspan x="50" y="7.5">
                    <xsl:value-of select="round($percentage)"/>%
                </tspan>
            </text>
        </svg>
    </xsl:template>

</xsl:stylesheet>