<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

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

<xsl:output method="html" indent="yes"  encoding="US-ASCII"/>

<xsl:template match="JDepend">
    <html>
    <head>
        <title>JDepend Analysis</title>
        
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
        
        
    </head>
    <body>
    <!--h1>JDepend Report</h1>
    <ul>
    <xsl:for-each select="./Packages/Package">
                <xsl:sort select="@name"/>
        <li><xsl:value-of select="@name"/></li>
    </xsl:for-each>
    </ul-->
    
    <h1><a name="top">JDepend Analysis</a></h1>
    <p align="right">Designed for use with <a href="http://www.clarkware.com/software/JDepend.html">JDepend</a> and <a href="http://jakarta.apache.org">Ant</a>.</p>
    <hr size="2" />
    
    <table width="100%"><tr><td>
    <a name="NVsummary"><h2>Summary</h2></a>
    </td><td align="right">
    [<a href="#NVsummary">summary</a>]
    [<a href="#NVpackages">packages</a>]
    [<a href="#NVcycles">cycles</a>]
    [<a href="#NVexplanations">explanations</a>]
    </td></tr></table>
    
    <table width="100%" class="details">
        <tr>
            <th>Package</th>
            <th>Total Classes</th>
            <th><a href="#EXnumber">Abstract Classes</a></th>
            <th><a href="#EXnumber">Concrete Classes</a></th>
            <th><a href="#EXafferent">Afferent Couplings</a></th>
            <th><a href="#EXefferent">Efferent Couplings</a></th>
            <th><a href="#EXabstractness">Abstractness</a></th>
            <th><a href="#EXinstability">Instability</a></th>
            <th><a href="#EXdistance">Distance</a></th>
            
        </tr>
    <xsl:for-each select="./Packages/Package">
        <xsl:if test="count(error) = 0">
            <tr>
                <td align="left">
                    <a>
                    <xsl:attribute name="href">#PK<xsl:value-of select="@name"/>
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
    
    <table width="100%"><tr><td>
    <a name="NVpackages"><h2>Packages</h2></a>
    </td><td align="right">
    [<a href="#NVsummary">summary</a>]
    [<a href="#NVpackages">packages</a>]
    [<a href="#NVcycles">cycles</a>]
    [<a href="#NVexplanations">explanations</a>]
    </td></tr></table>
    
    <xsl:for-each select="./Packages/Package">
        <xsl:if test="count(error) = 0">
            <h3><a><xsl:attribute name="name">PK<xsl:value-of select="@name"/></xsl:attribute>
            <xsl:value-of select="@name"/></a></h3>
            
            <table width="100%"><tr>
                <td><a href="#EXafferent">Afferent Couplings</a>: <xsl:value-of select="Stats/Ca"/></td>
                <td><a href="#EXefferent">Efferent Couplings</a>: <xsl:value-of select="Stats/Ce"/></td>
                <td><a href="#EXabstractness">Abstractness</a>: <xsl:value-of select="Stats/A"/></td>
                <td><a href="#EXinstability">Instability</a>: <xsl:value-of select="Stats/I"/></td>
                <td><a href="#EXdistance">Distance</a>: <xsl:value-of select="Stats/D"/></td>
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
                                <xsl:attribute name="href">#PK<xsl:value-of select="node()"/></xsl:attribute>
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
                                <xsl:attribute name="href">#PK<xsl:value-of select="node()"/></xsl:attribute>
                                <xsl:value-of select="node()"/>
                            </a><br/>
                        </xsl:for-each>
                    </td>
                </tr>
            </table>
        </xsl:if>
    </xsl:for-each>
    
    <table width="100%"><tr><td>
    <a name="NVcycles"><h2>Cycles</h2></a>
    </td><td align="right">
    [<a href="#NVsummary">summary</a>]
    [<a href="#NVpackages">packages</a>]
    [<a href="#NVcycles">cycles</a>]
    [<a href="#NVexplanations">explanations</a>]
    </td></tr></table>
    
    <xsl:if test="count(Cycles/Package) = 0">
        <p>There are no cyclic dependancies.</p>
    </xsl:if>
    <xsl:for-each select="Cycles/Package">
        <h3><xsl:value-of select="@Name"/></h3><p>
        <xsl:for-each select="Package">
            <xsl:value-of select="."/><br/>
        </xsl:for-each></p>
    </xsl:for-each>
    
    <table width="100%"><tr><td>
    <a name="NVexplanations"><h2>Explanations</h2></a>
    </td><td align="right">
    [<a href="#NVsummary">summary</a>]
    [<a href="#NVpackages">packages</a>]
    [<a href="#NVcycles">cycles</a>]
    [<a href="#NVexplanations">explanations</a>]
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

</xsl:stylesheet>
