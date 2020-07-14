<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output
        method="html"
        version="1.0"
        encoding="utf-8"/>
    <xsl:template name="div_classtag_template">
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

    <xsl:template name="wellbeing_desc">
        <xsl:param name="wellbeing"/>
        <xsl:choose>
            <xsl:when test="$wellbeing = 1">Sehr schlecht</xsl:when>
            <xsl:when test="$wellbeing = 2">Schlecht</xsl:when>
            <xsl:when test="$wellbeing = 3">Mittelmäßig</xsl:when>
            <xsl:when test="$wellbeing = 4">Gut</xsl:when>
            <xsl:otherwise>Sehr gut</xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="/">
        <div class="call_list_header">
            <h1>Anrufsliste</h1>
        </div>
        <div class="separator"></div>
        <div class = "call_list_content">
            <xsl:apply-templates select="infected/person">
                <!-- fill call list -->
                <xsl:sort select="done" data-type="number"/>
                <xsl:sort select="priority" order="descending" data-type="number"/>
            </xsl:apply-templates>
        </div>

    </xsl:template>


    <xsl:template match="person"> <!-- fill call list -->
        <xsl:variable name="div_classtag">
            <xsl:call-template name="div_classtag_template">
                <xsl:with-param name="called" select="calledbool"/>
                <xsl:with-param name="prio" select="priority"/>
            </xsl:call-template>
        </xsl:variable>


        <xsl:variable name="wellbeing_desc">
            <xsl:call-template name="wellbeing_desc">
                <xsl:with-param name="wellbeing" select="subjectiveWellbeing"/>
            </xsl:call-template>
        </xsl:variable>
        <div>
            <xsl:attribute name="onmouseenter">cumulativeOffset(this)</xsl:attribute>
            <xsl:attribute name="class">call_list_element<xsl:if test="locked = 'true'">
                hidden_box
            </xsl:if>
            </xsl:attribute>

            <div tabindex="0">

                <xsl:attribute name="class">
                    <xsl:choose>
                        <xsl:when test="done = 1">done_call_box</xsl:when>
                        <xsl:otherwise><xsl:value-of select="$div_classtag"/></xsl:otherwise>
                    </xsl:choose> call_box</xsl:attribute>


                <xsl:attribute name="onclick">tryAcquireLock(<xsl:value-of select="id"/>)</xsl:attribute>

                <h2>Name: </h2>
                <span><xsl:value-of select="concat(lastname, ', ', firstnames)"/></span>
                <h2>Zustand:  </h2>
                <span>
                    <xsl:value-of select="$wellbeing_desc"/>
                </span>

                <span>
                    <xsl:attribute name="class">tooltiptext</xsl:attribute>
                    <xsl:value-of select="$wellbeing_desc"/>
                </span>

                <h2>Tel.:</h2>
                <span><xsl:value-of select="phone"/></span>
                <xsl:if test="$div_classtag = 'calledAlready'">
                    <h2>Letzter Versuch: </h2>
                    <span>Heute, <xsl:value-of select="lastcall"/> Uhr</span>
                </xsl:if>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>