<?xml version="1.0"?>
<xsl:stylesheet  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
  xmlns:lxslt="http://xml.apache.org/xslt"
  xmlns:redirect="org.apache.xalan.lib.Redirect"
  extension-element-prefixes="redirect">
<xsl:output method="html" indent="yes" encoding="US-ASCII"/>
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
<!--

 Sample stylesheet to be used with JDepend XML output.

 It creates a set of HTML files a la javadoc where you can browse easily
 through all packages and classes.

 @author <a href="mailto:jtulley@novell.com">Jeff Tulley</a>

  -->
<xsl:param name="output.dir" select="'.'"/>

<xsl:template match="JDepend">
   <!-- create the index.html -->
   <redirect:write file="{$output.dir}/index.html">
      <xsl:call-template name="index.html"/>
   </redirect:write>

  <!-- create the stylesheet.css -->
  <redirect:write file="{$output.dir}/stylesheet.css">
    <xsl:call-template name="stylesheet.css"/>
   </redirect:write>

   <!-- create the overview-packages.html at the root -->
  <redirect:write file="{$output.dir}/overview-summary.html">
    <xsl:apply-templates select="." mode="overview.packages"/>
  </redirect:write>

   <!-- create the overview-packages.html at the root -->
   <redirect:write file="{$output.dir}/overview-packages.html">
    <xsl:apply-templates select="." mode="packages.details"/>
  </redirect:write>

   <!-- create the overview-cycles.html at the root -->
   <redirect:write file="{$output.dir}/overview-cycles.html">
    <xsl:apply-templates select="." mode="cycles.details"/>
  </redirect:write>

   <!-- create the overview-cycles.html at the root -->
   <redirect:write file="{$output.dir}/overview-explanations.html">
    <xsl:apply-templates select="." mode="explanations"/>
  </redirect:write>

  <!-- create the all-packages.html at the root -->
   <redirect:write file="{$output.dir}/all-packages.html">
    <xsl:apply-templates select="Packages" mode="all.packages"/>
  </redirect:write>

  <!-- create the all-cycles.html at the root -->
  <redirect:write file="{$output.dir}/all-cycles.html">
    <xsl:apply-templates select="Cycles" mode="all.cycles"/>
  </redirect:write>
</xsl:template>


<xsl:template name="index.html">
<html>
   <head>
      <title>JDepend Analysis</title>
   </head>
      <frameset cols="20%,80%">
         <frameset rows="30%,70%">
            <frame src="all-packages.html" name="packageListFrame"/>
            <frame src="all-cycles.html" name="classListFrame"/>
         </frameset>
         <frame src="overview-summary.html" name="classFrame"/>
      </frameset>
      <noframes>
         <h2>Frame Alert</h2>
         <p>
            This document is designed to be viewed using the frames feature. If you see this message, you are using a non-frame-capable web client.
         </p>
      </noframes>
</html>
</xsl:template>

<!-- this is the stylesheet css to use for nearly everything -->
<xsl:template name="stylesheet.css">
   <style type="text/css">
    body {
    font:normal 68% verdana,arial,helvetica;
    color:#000000;
    }
    table tr td, tr th {
      font-size: 68%;
    }
    table.details tr th{
    font-weight: bold;
    text-align:left;
    background:#a6caf0;
    }
    table.details tr td{
    background:#eeeee0;
    }

    p {
    line-height:1.5em;
    margin-top:0.5em; margin-bottom:1.0em;
    margin-left:2em;
    margin-right:2em;
    }
    h1 {
    margin: 0px 0px 5px; font: 165% verdana,arial,helvetica
    }
    h2 {
    margin-top: 1em; margin-bottom: 0.5em; font: bold 125% verdana,arial,helvetica
    }
    h3 {
    margin-bottom: 0.5em; font: bold 115% verdana,arial,helvetica
    }
    h4 {
    margin-bottom: 0.5em; font: bold 100% verdana,arial,helvetica
    }
    h5 {
    margin-bottom: 0.5em; font: bold 100% verdana,arial,helvetica
    }
    h6 {
    margin-bottom: 0.5em; font: bold 100% verdana,arial,helvetica
    }
    .Error {
    font-weight:bold; color:red;
    }
    .Failure {
    font-weight:bold; color:purple;
    }
    .Properties {
    text-align:right;
    }
  </style>
</xsl:template>

<xsl:template match="JDepend" mode="overview.packages">
   <html>
      <head>
         <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
      </head>
      <body>
         <xsl:call-template name="pageHeader"/>
  <table width="100%"><tr align="left"><h2>Summary</h2><td>
  </td><td align="right">
  [summary]
  [<a href="overview-packages.html">packages</a>]
  [<a href="overview-cycles.html">cycles</a>]
  [<a href="overview-explanations.html">explanations</a>]
   </td></tr></table>
         <table width="100%" class="details">
            <tr>
               <th>Package</th>
               <th>Total Classes</th>
               <th><a href="overview-explanations.html#EXnumber">Abstract Classes</a></th>
               <th><a href="overview-explanations.html#EXnumber">Concrete Classes</a></th>
               <th><a href="overview-explanations.html#EXafferent">Afferent Couplings</a></th>
               <th><a href="overview-explanations.html#EXefferent">Efferent Couplings</a></th>
               <th><a href="overview-explanations.html#EXabstractness">Abstractness</a></th>
               <th><a href="overview-explanations.html#EXinstability">Instability</a></th>
               <th><a href="overview-explanations.html#EXdistance">Distance</a></th>

            </tr>
            <xsl:for-each select="./Packages/Package">
               <xsl:if test="count(error) = 0">
                  <tr>
                     <td align="left">
                        <a>
                           <xsl:attribute name="href">overview-packages.html#PK<xsl:value-of select="@name"/>
                           </xsl:attribute>
                           <xsl:value-of select="@name"/>
                        </a>
                     </td>
                     <td align="right"><xsl:value-of select="Stats/TotalClasses"/></td>
                     <td align="right"><xsl:value-of select="Stats/AbstractClasses"/></td>
                     <td align="right"><xsl:value-of select="Stats/ConcreteClasses"/></td>
                     <td align="right"><xsl:value-of select="Stats/Ca"/></td>
                     <td align="right"><xsl:value-of select="Stats/Ce"/></td>
                     <td align="right"><xsl:value-of select="Stats/A"/></td>
                     <td align="right"><xsl:value-of select="Stats/I"/></td>
                     <td align="right"><xsl:value-of select="Stats/D"/></td>
                  </tr>
               </xsl:if>
            </xsl:for-each>
            <xsl:for-each select="./Packages/Package">
               <xsl:if test="count(error) &gt; 0">
                  <tr>
                     <td align="left">
                        <xsl:value-of select="@name"/>
                     </td>
                     <td align="left" colspan="8"><xsl:value-of select="error"/></td>
                  </tr>
               </xsl:if>
            </xsl:for-each>
         </table>
      </body>
   </html>
</xsl:template>

<xsl:template match="JDepend" mode="packages.details">
   <html>
      <head>
          <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
      </head>
      <body>
         <xsl:call-template name="pageHeader"/>
  <table width="100%"><tr align="left"><h2>Packages</h2><td>
  </td><td align="right">
  [<a href="overview-summary.html">summary</a>]
  [packages]
  [<a href="overview-cycles.html">cycles</a>]
  [<a href="overview-explanations.html">explanations</a>]
   </td></tr></table>

  <xsl:for-each select="./Packages/Package">
    <xsl:if test="count(error) = 0">
      <h3><a><xsl:attribute name="name">PK<xsl:value-of select="@name"/></xsl:attribute>
      <xsl:value-of select="@name"/></a></h3>

      <table width="100%"><tr>
        <td><a href="overview-explanations.html#EXafferent">Afferent Couplings</a>: <xsl:value-of select="Stats/Ca"/></td>
        <td><a href="overview-explanations.html#EXefferent">Efferent Couplings</a>: <xsl:value-of select="Stats/Ce"/></td>
        <td><a href="overview-explanations.html#EXabstractness">Abstractness</a>: <xsl:value-of select="Stats/A"/></td>
        <td><a href="overview-explanations.html#EXinstability">Instability</a>: <xsl:value-of select="Stats/I"/></td>
        <td><a href="overview-explanations.html#EXdistance">Distance</a>: <xsl:value-of select="Stats/D"/></td>
      </tr></table>

      <table width="100%" class="details">
        <tr>
          <th>Abstract Classes</th>
          <th>Concrete Classes</th>
          <th>Used by Packages</th>
          <th>Uses Packages</th>
        </tr>
        <tr>
          <td valign="top" width="25%">
          <xsl:if test="count(AbstractClasses/Class)=0">
              <i>None</i>
            </xsl:if>
            <xsl:for-each select="AbstractClasses/Class">
              <xsl:value-of select="node()"/><br/>
            </xsl:for-each>
          </td>
          <td valign="top" width="25%">
            <xsl:if test="count(ConcreteClasses/Class)=0">
              <i>None</i>
            </xsl:if>
            <xsl:for-each select="ConcreteClasses/Class">
              <xsl:value-of select="node()"/><br/>
            </xsl:for-each>
          </td>
          <td valign="top" width="25%">
            <xsl:if test="count(UsedBy/Package)=0">
              <i>None</i>
            </xsl:if>
            <xsl:for-each select="UsedBy/Package">
              <a>
                        <xsl:attribute name="href">overview-packages.html#PK<xsl:value-of select="node()"/></xsl:attribute>
                <xsl:value-of select="node()"/>
              </a><br/>
            </xsl:for-each>
          </td>
          <td valign="top" width="25%">
            <xsl:if test="count(DependsUpon/Package)=0">
              <i>None</i>
            </xsl:if>
            <xsl:for-each select="DependsUpon/Package">
              <a>
                        <xsl:attribute name="href">overview-packages.html#PK<xsl:value-of select="node()"/></xsl:attribute>
                <xsl:value-of select="node()"/>
              </a><br/>
            </xsl:for-each>
          </td>
        </tr>
      </table>
    </xsl:if>
  </xsl:for-each>
  <!-- this is often a long listing; provide a lower navigation table also -->
  <table width="100%"><tr align="left"><td></td><td align="right">
  [<a href="overview-summary.html">summary</a>]
  [packages]
  [<a href="overview-cycles.html">cycles</a>]
  [<a href="overview-explanations.html">explanations</a>]
   </td></tr></table>
      </body>
   </html>
</xsl:template>

<xsl:template match="JDepend" mode="cycles.details">
   <html>
      <head>
         <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
      </head>
      <body>
         <xsl:call-template name="pageHeader"/>
  <table width="100%"><tr align="left"><h2>Cycles</h2><td>
  </td><td align="right">
  [<a href="overview-summary.html">summary</a>]
  [<a href="overview-packages.html">packages</a>]
  [cycles]
  [<a href="overview-explanations.html">explanations</a>]
   </td></tr></table>
  <!--<table width="100%"><tr><td>
  </td><td align="right">
    [<a href="#NVsummary">summary</a>]
  [<a href="#NVpackages">packages</a>]
  [<a href="#NVcycles">cycles</a>]
   [<a href="#NVexplanations">explanations</a>]
  </td></tr></table> -->

  <xsl:if test="count(Cycles/Package) = 0">
    <p>There are no cyclic dependancies.</p>
  </xsl:if>
  <xsl:for-each select="Cycles/Package">
     <h3><a><xsl:attribute name="name">#CY<xsl:value-of select="@Name"/></xsl:attribute><xsl:value-of select="@Name"/></a></h3><p>
    <xsl:for-each select="Package">
      <xsl:value-of select="."/><br/>
    </xsl:for-each></p>
  </xsl:for-each>
  <!-- this is often a long listing; provide a lower navigation table also -->
  <table width="100%"><tr align="left"><td></td><td align="right">
  [<a href="overview-summary.html">summary</a>]
  [<a href="overview-packages.html">packages</a>]
  [cycles]
  [<a href="overview-explanations.html">explanations</a>]
   </td></tr></table>
  </body>
  </html>
</xsl:template>

<xsl:template match="JDepend" mode="explanations">
   <html>
      <head>
         <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
      </head>
      <body>
         <xsl:call-template name="pageHeader"/>

  <table width="100%"><tr align="left"><h2>Explanations</h2><td>
  </td><td align="right">
  [<a href="overview-summary.html">summary</a>]
  [<a href="overview-packages.html">packages</a>]
  [<a href="overview-cycles.html">cycles</a>]
  [explanations]
   </td></tr></table>

  <p>The following explanations are for quick reference and are lifted directly from the original <a href="http://www.clarkware.com/software/JDepend.html">JDepend documentation</a>.</p>

  <h3><a name="EXnumber">Number of Classes</a></h3>
    <p>The number of concrete and abstract classes (and interfaces) in the package is an indicator of the extensibility of the package.</p>
  <h3><a name="EXafferent">Afferent Couplings</a></h3>
    <p>The number of other packages that depend upon classes within the package is an indicator of the package's responsibility. </p>
  <h3><a name="EXefferent">Efferent Couplings</a></h3>
    <p>The number of other packages that the classes in the package depend upon is an indicator of the package's independence. </p>
  <h3><a name="EXabstractness">Abstractness</a></h3>
    <p>The ratio of the number of abstract classes (and interfaces) in the analyzed package to the total number of classes in the analyzed package. </p>
    <p>The range for this metric is 0 to 1, with A=0 indicating a completely concrete package and A=1 indicating a completely abstract package. </p>
  <h3><a name="EXinstability">Instability</a></h3>
    <p>The ratio of efferent coupling (Ce) to total coupling (Ce / (Ce + Ca)). This metric is an indicator of the package's resilience to change. </p>
    <p>The range for this metric is 0 to 1, with I=0 indicating a completely stable package and I=1 indicating a completely instable package. </p>
  <h3><a name="EXdistance">Distance</a></h3>
    <p>The perpendicular distance of a package from the idealized line A + I = 1. This metric is an indicator of the package's balance between abstractness and stability. </p>
    <p>A package squarely on the main sequence is optimally balanced with respect to its abstractness and stability. Ideal packages are either completely abstract and stable (x=0, y=1) or completely concrete and instable (x=1, y=0). </p>
    <p>The range for this metric is 0 to 1, with D=0 indicating a package that is coincident with the main sequence and D=1 indicating a package that is as far from the main sequence as possible. </p>

      </body>
   </html>
</xsl:template>


<!--
Creates an html file that contains a link to all package links in overview-packages.html.
  @bug there will be a problem here, I don't know yet how to handle unnamed package :(
-->
<xsl:template match="JDepend/Packages" mode="all.packages">
  <html>
    <head>
      <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
    </head>
    <body>
  <table width="100%"><tr align="left"><td></td><td nowrap="nowrap" align="right">
  [<a href="overview-summary.html" target="classFrame">summary</a>]
  [<a href="overview-packages.html" target="classFrame">packages</a>]
  [<a href="overview-cycles.html" target="classFrame">cycles</a>]
  [<a href="overview-explanations.html" target="classFrame">explanations</a>]
   </td></tr></table>
      <h2>Packages</h2>
        <table width="100%">
          <xsl:apply-templates select="Package[count(error)=0]" mode="all.packages.link">
            <xsl:sort select="@name"/>
          </xsl:apply-templates>
          <xsl:apply-templates select="Package[count(error) &gt; 0]" mode="all.packages.nolink">
            <xsl:sort select="@name"/>
          </xsl:apply-templates>
        </table>
    </body>
  </html>
</xsl:template>

<xsl:template match="JDepend/Packages/Package" mode="all.packages.link">
  <tr>
    <td nowrap="nowrap">
         <a href="overview-packages.html#PK{@name}" target="classFrame">
        <xsl:value-of select="@name"/>
      </a>
    </td>
  </tr>
</xsl:template>

<!--
I do not know JDepend enough to know if every error results in a non-analyzed package,
but that is how I am presenting it to the viewer.  This may need to change.
  @bug there will be a problem here, I don't know yet how to handle unnamed package :(
-->
<xsl:template match="JDepend/Packages/Package" mode="all.packages.nolink">
  <tr>
    <td nowrap="nowrap">
       Not Analyzed: <xsl:value-of select="@name"/>
    </td>
  </tr>
</xsl:template>

<!--
Creates an html file that contains a link to all package links in overview-cycles.html.
  @bug there will be a problem here, I don't know yet how to handle unnamed package :(
-->
<xsl:template match="JDepend/Cycles" mode="all.cycles">
  <html>
    <head>
      <link rel="stylesheet" type="text/css" href="stylesheet.css"/>
    </head>
    <body>
  <table width="100%"><tr align="left"><td></td><td nowrap="nowrap" align="right">
  [<a href="overview-summary.html" target="classFrame">summary</a>]
  [<a href="overview-packages.html" target="classFrame">packages</a>]
  [<a href="overview-cycles.html" target="classFrame">cycles</a>]
  [<a href="overview-explanations.html" target="classFrame">explanations</a>]
   </td></tr></table>
      <h2>Cycles</h2>
        <table width="100%">
           <xsl:apply-templates select="Package" mode="all.cycles">
            <xsl:sort select="@Name"/>
          </xsl:apply-templates>
        </table>
    </body>
  </html>
</xsl:template>

<xsl:template match="JDepend/Cycles/Package" mode="all.cycles">
  <tr>
    <td nowrap="nowrap">
         <a href="overview-cycles.html#CY{@Name}" target="classFrame"><xsl:value-of select="@Name"/></a>
    </td>
  </tr>
</xsl:template>

<!-- Page HEADER -->
<xsl:template name="pageHeader">
   <h1>JDepend Analysis</h1>
  <table width="100%">
  <tr>
    <td align="left"></td>
      <td align="right">Designed for use with <a href="http://www.clarkware.com/software/JDepend.html">JDepend</a> and <a href="http://jakarta.apache.org">Ant</a>.</td>
  </tr>
  </table>
  <hr size="1"/>
</xsl:template>

</xsl:stylesheet>
