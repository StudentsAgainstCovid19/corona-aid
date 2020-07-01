<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <kml>
            <Document>
                <xsl:call-template name="insertStyles"/>
                <xsl:apply-templates select="districts/district"/>
            </Document>
        </kml>
    </xsl:template>

    <xsl:template match="district">
        <Placemark>
            <name><xsl:value-of select="name"/></name>
            <styleUrl>
                <xsl:call-template name="polygonStyleChooser">
                    <xsl:with-param name="density" select="amountInfected div number(area)"/>
                </xsl:call-template>
            </styleUrl>
            <Polygon>
                <extrude>1</extrude>
                <altitudeMode>relativeToGround</altitudeMode>
                <outerBoundaryIs>
                    <LinearRing>
                        <coordinates>
                            <xsl:apply-templates select="outline/point"/>
                        </coordinates>
                    </LinearRing>
                </outerBoundaryIs>
            </Polygon>
        </Placemark>
    </xsl:template>

    <xsl:template name="polygonStyleChooser">
        <xsl:param name="density"/>
        <xsl:choose>
            <xsl:when test="$density &lt; 2.5">#districtGreen</xsl:when>
            <xsl:otherwise>#districtRed</xsl:otherwise>
        </xsl:choose>

    </xsl:template>

    <xsl:template match="point">
        <xsl:value-of select="lon"/>, <xsl:value-of select="lat"/>, 0
    </xsl:template>

    <xsl:template name="insertStyles">
        <Style id="districtGreen">
            <LineStyle>
                <width>5</width>
                <color>5000ff00</color>
            </LineStyle>
            <PolyStyle>
                <color>4000d000</color>
                <fill>1</fill>
                <outline>1</outline>
            </PolyStyle>
        </Style>
        <Style id="districtRed">
            <LineStyle>
                <width>5</width>
                <color>500000ff</color>
            </LineStyle>
            <PolyStyle>
                <color>400000ff</color>
                <fill>1</fill>
                <outline>1</outline>
            </PolyStyle>
        </Style>
    </xsl:template>
</xsl:stylesheet>