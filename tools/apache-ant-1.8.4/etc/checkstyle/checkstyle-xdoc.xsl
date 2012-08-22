<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:lxslt="http://xml.apache.org/xslt"
    xmlns:redirect="org.apache.xalan.lib.Redirect"
    extension-element-prefixes="redirect">

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

    <xsl:output method="xml" indent="yes"/>
    <xsl:decimal-format decimal-separator="." grouping-separator="," />

    <xsl:param name="output.dir" select="'.'"/>
    <xsl:param name="basedir" select="'.'"/>

    <xsl:template match="checkstyle">
      <document>
        <properties>
          <title>Checkstyle Audit</title>
        </properties>

        <body>
          <xsl:apply-templates select="." mode="summary"/>
          <!-- File list part -->
          <xsl:apply-templates select="." mode="filelist"/>
          <xsl:apply-templates select="file[count(error) != 0]"/>
        </body>
      </document>
    </xsl:template>

    <xsl:template match="checkstyle" mode="filelist">
      <section name="Files">
        <table>
            <tr>
                <th>Name</th>
                <th>Errors</th>
            </tr>
            <xsl:apply-templates select="file[count(error) != 0]" mode="filelist">
                <xsl:sort select="count(error)" order="descending" data-type="number"/>
            </xsl:apply-templates>
        </table>
      </section>
    </xsl:template>

    <xsl:template match="file" mode="filelist">
        <tr>
            <xsl:call-template name="alternated-row"/>
            <td nowrap="nowrap">
                <a>
                    <xsl:attribute name="href">
                        <xsl:text>files</xsl:text><xsl:value-of select="substring-after(@name, $basedir)"/><xsl:text>.html</xsl:text>
                    </xsl:attribute>
                    <xsl:value-of select="substring-after(@name, $basedir)"/>
                </a>
            </td>
            <td><xsl:value-of select="count(error)"/></td>
        </tr>
    </xsl:template>

    <xsl:template match="file">
      <redirect:write file="{$output.dir}/files{substring-after(@name, $basedir)}.xml">
        <document>
          <properties>
            <title>Checkstyle Audit</title>
          </properties>

          <body>
            <section name="Details for {substring-after(@name, $basedir)}">
              <table>
                  <tr>
                      <th>Error Description</th>
                      <th>Line</th>
                  </tr>
                  <xsl:for-each select="error">
                      <tr>
                          <xsl:call-template name="alternated-row"/>
                          <td><a title="{@source}"><xsl:value-of select="@message"/></a></td>
                          <td><xsl:value-of select="@line"/></td>
                      </tr>
                  </xsl:for-each>
              </table>
            </section>
          </body>
        </document>
      </redirect:write>
    </xsl:template>

    <xsl:template match="checkstyle" mode="summary">
      <section name="Summary">
        <xsl:variable name="fileCount" select="count(file)"/>
        <xsl:variable name="errorCount" select="count(file/error)"/>
        <xsl:variable name="fileErrorCount" select="count(file[count(error) != 0])"/>
        <table>
            <tr>
                <th>Files</th>
                <th>Files With Errors</th>
                <th>Errors</th>
            </tr>
            <tr>
                <xsl:call-template name="alternated-row"/>
                <td><xsl:value-of select="$fileCount"/></td>
                <td><xsl:value-of select="$fileErrorCount"/></td>
                <td><xsl:value-of select="$errorCount"/></td>
            </tr>
        </table>
      </section>
    </xsl:template>

    <xsl:template name="alternated-row">
        <xsl:attribute name="class">
            <xsl:if test="position() mod 2 = 1">oddrow</xsl:if>
            <xsl:if test="position() mod 2 = 0">evenrow</xsl:if>
        </xsl:attribute>
    </xsl:template>
</xsl:stylesheet>

