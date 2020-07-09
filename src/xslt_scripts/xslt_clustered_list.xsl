<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


    <xsl:template name="priority_img_template">
        <xsl:param name="prio"/>
        <xsl:choose>
            <xsl:when test="round($prio) = 1 or round($prio) = 0">lower</xsl:when>
            <xsl:when test="round($prio) = 2">intermed</xsl:when>
            <xsl:when test="round($prio) = 3">high</xsl:when>
            <xsl:otherwise>veryhigh</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="/">
        <div id="clustered_list">
            <xsl:apply-templates select="infected/person">
                <!-- fill clustered list -->
                <xsl:sort select="done" order="ascending"/>
                <xsl:sort select="priority" order="descending"/>
            </xsl:apply-templates>
        </div>
    </xsl:template>

    <xsl:template match="infected/person">
        <!-- fill clustered list -->
        <xsl:variable name="priority_img">
            <xsl:call-template name="priority_img_template">
                <xsl:with-param name="prio" select="priority"/>
            </xsl:call-template>
        </xsl:variable>

        <div class="list_div">
            <xsl:attribute name="onclick">tryAcquireLock(<xsl:value-of select="id"/>)</xsl:attribute>
            <xsl:if test="done = 1">
                <xsl:attribute name="class">done_div</xsl:attribute>
            </xsl:if>
            <p>
                <span>
                    <xsl:attribute name="class">wellbeing_imagespan</xsl:attribute>
                    <img>
                        <xsl:attribute name="class">wellbeing_indicator</xsl:attribute>
                        <!-- Todo -->
                        <xsl:attribute name="alt">Wohlbefinden</xsl:attribute>
                        <xsl:attribute name="src">./assets/markers/<xsl:value-of select="$priority_img"/>_prio.svg</xsl:attribute>
                    </img>
                </span> <xsl:value-of select="lastname"/>, <xsl:value-of select="firstnames"/>
            </p>
        </div>
    </xsl:template>
</xsl:stylesheet>