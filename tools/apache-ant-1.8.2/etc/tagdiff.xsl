<?xml version="1.0"?>
<!--
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
-->
<!-- a stylesheet to display changelogs ala netbeans -->
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0">
  <xsl:param name="title"/>
  <xsl:param name="module"/>
  <xsl:param name="cvsweb"/>

  <xsl:output method="html" indent="yes"/>

  <!-- Copy standard document elements.  Elements that
       should be ignored must be filtered by apply-templates
       tags. -->
  <xsl:template match="*">
    <xsl:copy>
      <xsl:copy-of select="attribute::*[. != '']"/>
      <xsl:apply-templates/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="tagdiff">
    <html>
      <head>
        <title><xsl:value-of select="$title"/></title>
        <style type="text/css">
          body, p {
          font-family: verdana,arial,helvetica;
          font-size: 80%;
          color:#000000;
          }
	  .dateAndAuthor {
          font-family: verdana,arial,helvetica;
          font-size: 80%;
          font-weight: bold;
          text-align:left;
          background:#a6caf0;
	  }
          tr, td{
          font-family: verdana,arial,helvetica;
          font-size: 80%;
          background:#eeeee0;
          }	  
	  </style> 
      </head>
      <body link="#000000" alink="#000000" vlink="#000000" text="#000000">       
          <h1>
            <a name="top"><xsl:value-of select="$title"/></a>
          </h1>
          Tagdiff between <xsl:value-of select="@startTag"/> <xsl:value-of select="@startDate"/> and
			<xsl:value-of select="@endTag"/> <xsl:value-of select="@endDate"/>
          <p align="right">Designed for use with <a href="http://ant.apache.org/">Ant</a>.</p>
          <hr size="2"/>
	<a name="TOP"/>
	<table width="100%">
		<tr>
			<td align="right">
				<a href="#New">New Files</a> |
				<a href="#Modified">Modified Files</a> |
				<a href="#Removed">Removed Files</a>
			</td>
		</tr>
	</table>
        <table border="0" width="100%" cellpadding="3" cellspacing="1">
		<xsl:call-template name="show-entries">
			<xsl:with-param name="title">New Files</xsl:with-param>
			<xsl:with-param name="anchor">New</xsl:with-param>
			<xsl:with-param name="entries" select=".//entry[file/revision][not(file/prevrevision)]"/>
		</xsl:call-template>

		<xsl:call-template name="show-entries">
			<xsl:with-param name="title">Modified Files</xsl:with-param>
			<xsl:with-param name="anchor">Modified</xsl:with-param>
			<xsl:with-param name="entries" select=".//entry[file/revision][file/prevrevision]"/>
		</xsl:call-template>

		<!-- change to entries select to address bug #36827 -->
		<xsl:call-template name="show-entries">
			<xsl:with-param name="title">Removed Files</xsl:with-param>
			<xsl:with-param name="anchor">Removed</xsl:with-param>
			<xsl:with-param name="entries" select=".//entry[not(file/revision)][file/prevrevision]"/>
		</xsl:call-template>
        </table>
        
      </body>
    </html>
  </xsl:template>

  <xsl:template name="show-entries">
	<xsl:param name="title"/>
	<xsl:param name="anchor"/>
	<xsl:param name="entries"/>
	<tr>
		<td colspan="2" class="dateAndAuthor">
			<a>
				<xsl:attribute name="name"><xsl:value-of select="$anchor"/></xsl:attribute>
				<xsl:value-of select="$title"/> - <xsl:value-of select="count($entries)"/> entries
			</a>
			<a href="#TOP">(back to top)</a>
		</td>
	</tr>
	<tr>
		<td width="20">
			<xsl:text>    </xsl:text>
		</td>
		<td>
		        <ul>
				<xsl:apply-templates select="$entries"/>
			</ul>
		</td>
	</tr>
  </xsl:template>  

  <xsl:template match="entry">
	<xsl:apply-templates select="file"/>
  </xsl:template>

  <xsl:template match="date">
    <i><xsl:value-of select="."/></i>
  </xsl:template>

  <xsl:template match="time">
    <i><xsl:value-of select="."/></i>
  </xsl:template>

  <xsl:template match="author">
    <i>
      <a>
        <xsl:attribute name="href">mailto:<xsl:value-of select="."/></xsl:attribute>
        <xsl:value-of select="."/>
      </a>
    </i>
  </xsl:template>

  <xsl:template match="file">
    <li>
      <a target="_new">
        <xsl:attribute name="href"><xsl:value-of select="$cvsweb"/><xsl:value-of select="$module" />/<xsl:value-of select="name" /></xsl:attribute>
        <xsl:value-of select="name" />
      </a>
      <xsl:if test="string-length(prevrevision) > 0 or string-length(revision) > 0">
      <xsl:text> </xsl:text>
      <a target="_new">
        <xsl:choose>
          <xsl:when test="string-length(prevrevision) = 0 ">
            <xsl:attribute name="href"><xsl:value-of select="$cvsweb"/><xsl:value-of select="$module" />/<xsl:value-of select="name" />?rev=<xsl:value-of select="revision" />&amp;content-type=text/x-cvsweb-markup</xsl:attribute>
          </xsl:when>
          <xsl:otherwise>
            <xsl:attribute name="href"><xsl:value-of select="$cvsweb"/><xsl:value-of select="$module" />/<xsl:value-of select="name" />?r1=<xsl:value-of select="revision" />&amp;r2=<xsl:value-of select="prevrevision"/>&amp;diff_format=h</xsl:attribute>
          </xsl:otherwise>
        </xsl:choose> (<xsl:if test="count(prevrevision) &gt; 0"> <xsl:value-of select="prevrevision"/> --&gt; </xsl:if> <xsl:value-of select="revision"/>)
      </a>
      </xsl:if>
    </li>
  </xsl:template>

  <!-- Any elements within a msg are processed,
       so that we can preserve HTML tags. -->
  <xsl:template match="msg">
    <b><xsl:apply-templates/></b>
  </xsl:template>
  
</xsl:stylesheet>
