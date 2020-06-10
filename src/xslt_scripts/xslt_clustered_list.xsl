<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <div id="clustered_list">
            <xsl:for-each select="infected/person">
                <xsl:sort select="priority" order="descending"></xsl:sort>
                <div class="list_div">
                    <xsl:attribute name="onclick">try_acquire_lock(<xsl:value-of select="id"></xsl:value-of>)</xsl:attribute>
                    <p>
                        <span>
                            <xsl:attribute name="class">wellbeing_imagespan</xsl:attribute>
                            <img>
                                <xsl:attribute name="class">wellbeing_indicator lowprio</xsl:attribute>
                                <xsl:attribute name="src">./assets/markers/high_prio.svg</xsl:attribute>
                            </img>
                        </span> <xsl:value-of select="lastname"></xsl:value-of>, <xsl:value-of select="firstnames"></xsl:value-of>
                    </p>
                </div>

            </xsl:for-each>
        </div>
    </xsl:template>
</xsl:stylesheet>