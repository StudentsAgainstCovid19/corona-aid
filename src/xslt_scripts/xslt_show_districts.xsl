<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="districts">
        <?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
            <Document>
                <Style id="transBluePoly">
                    <LineStyle>
                        <width>5</width>
                        <color>500000ff</color>
                    </LineStyle>
                    <PolyStyle>
                        <color>4000ff00</color>
                        <fill>1</fill>
                        <outline>1</outline>
                    </PolyStyle>
                </Style>
                <xsl:apply-templates select="district"/>
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
        #transBluePoly
    </xsl:template>

    <xsl:template name="point">
        <xsl:value-of select="lon"/>, <xsl:value-of select="lat"/>, 0
    </xsl:template>

</xsl:stylesheet>