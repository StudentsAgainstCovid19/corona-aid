<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="chart">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <circle cx="50" cy="50" r="50" fill="yellow"/>
            <xsl:variable name="remaining" select="amountRemaining"/>
            <xsl:for-each select="arcs/arc">
                <xsl:variable name="lastX">
                    <xsl:choose>
                        <xsl:when test="position() = 1">50</xsl:when>
                        <xsl:otherwise><xsl:value-of select="//x[position()]"/></xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <xsl:variable name="lastY">
                    <xsl:choose>
                        <xsl:when test="position() = 1">0</xsl:when>
                        <xsl:otherwise><xsl:value-of select="(//y[position()])"/></xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <xsl:variable name="largeAngle">
                    <xsl:choose>
                        <xsl:when test="angle &lt; 180">0</xsl:when>
                        <xsl:otherwise>1</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <xsl:choose>
                    <xsl:when test="angle = 360">
                        <circle r="50" cx="50" cy="50">
                            <xsl:attribute name="fill"><xsl:value-of select="color"/></xsl:attribute>
                        </circle>
                    </xsl:when>
                    <xsl:when  test="not(angle = 0)">
                        <path>
                            <xsl:attribute name="d">M <xsl:value-of select="$lastX"/>, <xsl:value-of select="$lastY"/> A 50 50 0 <xsl:value-of select="$largeAngle"/> 1 <xsl:value-of select="x"/>, <xsl:value-of select="y"/> L 50 50</xsl:attribute>
                            <xsl:attribute name="fill"><xsl:value-of select="color"/></xsl:attribute>
                        </path>
                    </xsl:when>

                </xsl:choose>
            </xsl:for-each>


            <text text-anchor="middle" font-size="40">
                <tspan x="50">
                    <xsl:attribute name="y">66</xsl:attribute>
                    <xsl:value-of select="$remaining"/>
                </tspan>
            </text>
        </svg>
    </xsl:template>
</xsl:stylesheet>