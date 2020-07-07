<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <kml>
            <Document>
                <xsl:call-template name="insertStyles"/>
                <xsl:apply-templates select="Set/item"/>
            </Document>
        </kml>
    </xsl:template>

    <xsl:template match="item">
        <xsl:variable name="polyPos" select="position()"/>
        <Placemark>
            <name><xsl:value-of select="name"/></name>
            <styleUrl>#style<xsl:value-of select="id"/></styleUrl>
            <Polygon>
                <extrude>1</extrude>
                <Data><amountInfected><xsl:value-of select="infected"/></amountInfected></Data>
                <altitudeMode>relativeToGround</altitudeMode>
                <outerBoundaryIs>
                    <LinearRing>
                        <coordinates>
                            <xsl:apply-templates select="geometry/ring/point"/>
                        </coordinates>
                    </LinearRing>
                </outerBoundaryIs>
            </Polygon>
        </Placemark>

    </xsl:template>


    <xsl:template match="point">
        <xsl:value-of select="lon"/>, <xsl:value-of select="lat"/>, 0
    </xsl:template>

    <xsl:template name="insertStyles">
        <xsl:for-each select="/Set/item">
            <xsl:variable name="percentage">
                <xsl:call-template name="convertDensityToPercentage">
                    <xsl:with-param name="density" select="infected div number(area)"/>
                </xsl:call-template>
            </xsl:variable>

            <xsl:call-template name="insertStyle">
                <xsl:with-param name="percentage" select="$percentage"/>
            </xsl:call-template>
        </xsl:for-each>
    </xsl:template>

    <xsl:template name="insertStyle">
        <xsl:param name="percentage"/>
        <xsl:variable name="colorString">
            <xsl:call-template name="colorGradient">
                <xsl:with-param name="percentage" select="1-$percentage"/>
            </xsl:call-template>
        </xsl:variable>

        <Style>
            <xsl:attribute name="id">style<xsl:value-of select="id"/></xsl:attribute>
            <LineStyle>
                <width>5</width>
                <color><xsl:value-of select="concat(50, $colorString)"/></color>
            </LineStyle>
            <PolyStyle>
                <color><xsl:value-of select="concat(40, $colorString)"/></color>
                <fill>1</fill>
                <outline>1</outline>
            </PolyStyle>
        </Style>
    </xsl:template>

    <xsl:template name="convertDensityToPercentage">
        <xsl:param name="density"/>
        <xsl:choose>
            <xsl:when test="$density*100000 > 1">1</xsl:when>

            <!-- convert to percentage as two digit decimal places: ex.: 0.78 -->
            <xsl:otherwise><xsl:value-of select="floor($density*10000000) div 100"/></xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template name="colorGradient">
        <xsl:param name="percentage"/>
        <xsl:variable name="blue_val">
            <xsl:call-template name="interpolateColorChannel">
                <xsl:with-param name="value" select="floor(204*$percentage)"/>
            </xsl:call-template>
        </xsl:variable>
        <xsl:variable name="green_val">
            <xsl:call-template name="interpolateColorChannel">
                <xsl:with-param name="value" select="floor(255*$percentage)"/>
            </xsl:call-template>
        </xsl:variable>
        <xsl:variable name="red_val">
            <xsl:call-template name="interpolateColorChannel">
                <xsl:with-param name="value" select="floor(255*(1-$percentage))"/>
            </xsl:call-template>
        </xsl:variable>

        <xsl:value-of select="concat($blue_val, $green_val, $red_val)"/>
    </xsl:template>

    <xsl:template name="interpolateColorChannel">
        <xsl:param name="value"/>
        <xsl:variable name="lowerDigit">
            <xsl:call-template name="hexConverter">
                <xsl:with-param name="value" select="$value mod 16"/>
            </xsl:call-template>
        </xsl:variable>
        <xsl:variable name="upperDigit">
            <xsl:call-template name="hexConverter">
                <xsl:with-param name="value" select="floor($value div 16)"/>
            </xsl:call-template>
        </xsl:variable>

        <xsl:value-of select="concat($upperDigit, $lowerDigit)"/>
    </xsl:template>

    <xsl:template name="hexConverter">
        <xsl:param name="value"/>
        <xsl:choose>
            <xsl:when test="$value &lt; 10"><xsl:value-of select="$value"/></xsl:when>
            <xsl:when test="$value = 10">A</xsl:when>
            <xsl:when test="$value = 11">B</xsl:when>
            <xsl:when test="$value = 12">C</xsl:when>
            <xsl:when test="$value = 13">D</xsl:when>
            <xsl:when test="$value = 14">E</xsl:when>
            <xsl:when test="$value = 15">F</xsl:when>
            <xsl:otherwise>Error...</xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>