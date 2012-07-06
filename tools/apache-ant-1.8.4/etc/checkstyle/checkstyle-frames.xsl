<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
    xmlns:lxslt="http://xml.apache.org/xslt"
    xmlns:redirect="http://xml.apache.org/xalan/redirect"
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

    <xsl:output method="html" indent="yes" encoding="US-ASCII"/>
    <xsl:decimal-format decimal-separator="." grouping-separator="," />

    <xsl:param name="output.dir" select="'.'"/>
    <xsl:param name="basedir" select="'.'"/>

    <xsl:template match="checkstyle">
        <!-- create the index.html -->
        <redirect:write file="{$output.dir}/index.html">
            <xsl:call-template name="index.html"/>
        </redirect:write>

        <!-- create the stylesheet.css -->
        <redirect:write file="{$output.dir}/stylesheet.css">
            <xsl:call-template name="stylesheet.css"/>
        </redirect:write>

        <!-- create the overview-summary.html at the root -->
        <redirect:write file="{$output.dir}/overview-frame.html">
            <xsl:apply-templates select="." mode="overview"/>
        </redirect:write>

        <!-- create the all-classes.html at the root -->
        <redirect:write file="{$output.dir}/allclasses-frame.html">
            <xsl:apply-templates select="." mode="all.classes"/>
        </redirect:write>

        <!-- process all files -->
        <xsl:apply-templates select="file[count(error) != 0]"/>
    </xsl:template>

    <xsl:template name="index.html">
        <html>
            <head>
                <title>CheckStyle Audit</title>
            </head>
            <frameset cols="20%,80%">
                <frame src="allclasses-frame.html" name="fileListFrame"/>
                <frame src="overview-frame.html" name="fileFrame"/>
            </frameset>
            <noframes>
                <h2>Frame Alert</h2>
                <p>
                    This document is designed to be viewed using the frames feature.
                    If you see this message, you are using a non-frame-capable web client.
                </p>
            </noframes>
        </html>
    </xsl:template>

    <xsl:template name="pageHeader">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td class="text-align:right"><h2>CheckStyle Audit</h2></td>
            </tr>
            <tr>
                <td class="text-align:right">Designed for use with
                  <a href='http://checkstyle.sourceforge.net/'>CheckStyle</a> and
                  <a href='http://ant.apache.org/'>Ant</a>.</td>
            </tr>
        </table>
        <hr size="1"/>
    </xsl:template>

    <xsl:template match="checkstyle" mode="overview">
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
            </head>
            <body>
                <!-- page header -->
                <xsl:call-template name="pageHeader"/>

                <!-- Summary part -->
                <xsl:apply-templates select="." mode="summary"/>
                <hr size="1" width="100%" align="left"/>

                <!-- File list part -->
                <xsl:apply-templates select="." mode="filelist"/>
            </body>
        </html>
    </xsl:template>

    <xsl:template name="stylesheet.css">
        .bannercell {
        border: 0px;
        padding: 0px;
        }
        body {
        margin-left: 10;
        margin-right: 10;
        font:normal 80% arial,helvetica,sanserif;
        background-color:#FFFFFF;
        color:#000000;
        }
        .oddrow td {
        background: #efefef;
        }
        .evenrow td {
        background: #fff;
        }
        th, td {
        text-align: left;
        vertical-align: top;
        }
        th {
        font-weight:bold;
        background: #ccc;
        color: black;
        }
        table, th, td {
        font-size:100%;
        border: none
        }
        table.log tr td, tr th {

        }
        h2 {
        font-weight:bold;
        font-size:140%;
        margin-bottom: 5;
        }
        h3 {
        font-size:100%;
        font-weight:bold;
        background: #525D76;
        color: white;
        text-decoration: none;
        padding: 5px;
        margin-right: 2px;
        margin-left: 2px;
        margin-bottom: 0;
        }
    </xsl:template>

    <!--
    Creates an all-classes.html file that contains a link to all files.
    -->
    <xsl:template match="checkstyle" mode="all.classes">
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
            </head>
            <body>
                <h2>Files</h2>
                <p>
                    <table width="100%">
                        <!-- For each file create its part -->
                        <xsl:apply-templates select="file[count(error) != 0]" mode="all.classes">
                            <xsl:sort select="substring-after(@name, $basedir)"/>
                        </xsl:apply-templates>
                    </table>
                </p>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="checkstyle" mode="filelist">
        <h3>Files</h3>
        <table class="log" border="0" cellpadding="5" cellspacing="2" width="100%">
            <tr>
                <th>Name</th>
                <th>Errors</th>
            </tr>
            <xsl:apply-templates select="file[count(error) != 0]" mode="filelist">
                <xsl:sort select="count(error)" order="descending" data-type="number"/>
            </xsl:apply-templates>
        </table>
    </xsl:template>

    <xsl:template match="file" mode="filelist">
        <tr>
            <xsl:call-template name="alternated-row"/>
            <td nowrap="nowrap">
                <a>
                    <xsl:attribute name="href">
                        <xsl:text>files/</xsl:text><xsl:value-of select="substring-after(@name, $basedir)"/><xsl:text>.html</xsl:text>
                    </xsl:attribute>
                    <xsl:value-of select="substring-after(@name, $basedir)"/>
                </a>
            </td>
            <td><xsl:value-of select="count(error)"/></td>
        </tr>
    </xsl:template>

    <xsl:template match="file" mode="all.classes">
        <tr>
            <td nowrap="nowrap">
                <a target="fileFrame">
                    <xsl:attribute name="href">
                        <xsl:text>files/</xsl:text><xsl:value-of select="substring-after(@name, $basedir)"/><xsl:text>.html</xsl:text>
                    </xsl:attribute>
                    <xsl:value-of select="substring-after(@name, $basedir)"/>
                </a>
            </td>
        </tr>
    </xsl:template>

    <!--
    transform string like a/b/c to ../../../
    @param path the path to transform into a descending directory path
    -->
    <xsl:template name="path">
        <xsl:param name="path"/>

        <!-- Convert a windows path '\' to a unix path '/' for further processing. -->
        <xsl:variable name="path2" select="translate($path,'\','/')"/>

        
        <xsl:if test="contains($path2,'/')">
            <xsl:text>../</xsl:text>
            <xsl:call-template name="path">
                <xsl:with-param name="path"><xsl:value-of select="substring-after($path2,'/')"/></xsl:with-param>
            </xsl:call-template>
        </xsl:if>
        <xsl:if test="not(contains($path2,'/')) and not($path2 = '')">
            <xsl:text>../</xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template match="file">
        <redirect:write file="{$output.dir}/files/{substring-after(@name, $basedir)}.html">
            <html>
                <head>
                    <link rel="stylesheet" type="text/css">
                        <xsl:attribute name="href"><xsl:call-template name="path"><xsl:with-param name="path" select="substring-after(@name, $basedir)"/></xsl:call-template><xsl:text>stylesheet.css</xsl:text></xsl:attribute>
                    </link>
                </head>
                <body>
                    <xsl:call-template name="pageHeader"/>
                    <h3>File <xsl:value-of select="substring-after(@name, $basedir)"/></h3>
                    <table class="log" border="0" cellpadding="5" cellspacing="2" width="100%">
                        <tr>
                            <th>Error Description</th>
                            <th>Line:Column</th>
                        </tr>
                        <xsl:for-each select="error">
                            <tr>
                                <xsl:call-template name="alternated-row"/>
                                <td><a title="{@source}"><xsl:value-of select="@message"/></a></td>
                                <td align="center"><xsl:value-of select="@line"/><xsl:if test="@column">:<xsl:value-of select="@column"/></xsl:if></td>
                            </tr>
                        </xsl:for-each>
                    </table>
                </body>
            </html>
        </redirect:write>
    </xsl:template>

    <xsl:template match="checkstyle" mode="summary">
        <h3>Summary</h3>
        <xsl:variable name="fileCount" select="count(file)"/>
        <xsl:variable name="errorCount" select="count(file/error)"/>
        <xsl:variable name="fileErrorCount" select="count(file[count(error) != 0])"/>
        <table class="log" border="0" cellpadding="5" cellspacing="2" width="100%">
            <tr>
                <th>Total Files</th>
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
    </xsl:template>

    <xsl:template name="alternated-row">
        <xsl:attribute name="class">
            <xsl:if test="position() mod 2 = 1">oddrow</xsl:if>
            <xsl:if test="position() mod 2 = 0">evenrow</xsl:if>
        </xsl:attribute>
    </xsl:template>
</xsl:stylesheet>