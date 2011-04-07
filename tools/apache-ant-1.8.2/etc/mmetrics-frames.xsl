<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
  xmlns:lxslt="http://xml.apache.org/xslt"
  xmlns:xalan="http://xml.apache.org/xalan"
  xmlns:redirect="org.apache.xalan.lib.Redirect"
  exclude-result-prefixes="xalan"
  extension-element-prefixes="redirect">
<xsl:output method="html" indent="yes" encoding="US-ASCII"/>
<xsl:decimal-format decimal-separator="." grouping-separator="," />
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
  @author Stephane Bailliez <a href="mailto:sbailliez@apache.org"/>
  -->
<xsl:param name="output.dir" select="'.'"/>

<!-- default max value for the metrics -->
<xsl:param name="vg.max" select="10"/>
<xsl:param name="loc.max" select="1000"/>
<xsl:param name="dit.max" select="10"/>
<xsl:param name="noa.max" select="250"/>
<xsl:param name="nrm.max" select="50"/>
<xsl:param name="nlm.max" select="250"/>
<xsl:param name="wmc.max" select="250"/>
<xsl:param name="rfc.max" select="50"/>
<xsl:param name="dac.max" select="10"/>
<xsl:param name="fanout.max" select="10"/>
<xsl:param name="cbo.max" select="15"/>
<xsl:param name="lcom.max" select="10"/>
<xsl:param name="nocl.max" select="10"/>


<!-- create a tree fragment to speed up processing -->
<xsl:variable name="doctree.var">
  <xsl:element name="classes">
    <xsl:for-each select=".//class">
      <xsl:element name="class">
        <xsl:attribute name="package">
          <xsl:value-of select="(ancestor::package)[last()]/@name"/>
        </xsl:attribute>
        <xsl:copy-of select="@*"/>
        <xsl:attribute name="name">
          <xsl:apply-templates select="." mode="class.name"/>
        </xsl:attribute>
        <xsl:copy-of select="method"/>
      </xsl:element>
    </xsl:for-each>
  </xsl:element>
</xsl:variable>

<xsl:variable name="doctree" select="xalan:nodeset($doctree.var)"/>

<xsl:template match="metrics">

  <!-- create the index.html -->
  <redirect:write file="{$output.dir}/index.html">
    <xsl:call-template name="index.html"/>
  </redirect:write>

  <!-- create the stylesheet.css -->
  <redirect:write file="{$output.dir}/stylesheet.css">
    <xsl:call-template name="stylesheet.css"/>
  </redirect:write>

  <redirect:write file="{$output.dir}/metrics-reference.html">
    <xsl:call-template name="metrics-reference.html"/>
  </redirect:write>

  <!-- create the overview-packages.html at the root -->
  <redirect:write file="{$output.dir}/overview-summary.html">
    <xsl:apply-templates select="." mode="overview.packages"/>
  </redirect:write>

  <!-- create the all-packages.html at the root -->
  <redirect:write file="{$output.dir}/overview-frame.html">
    <xsl:apply-templates select="." mode="all.packages"/>
  </redirect:write>

  <!-- create the all-classes.html at the root -->
  <redirect:write file="{$output.dir}/allclasses-frame.html">
    <xsl:apply-templates select="." mode="all.classes"/>
  </redirect:write>

  <!-- process all packages -->
  <xsl:apply-templates select=".//package"/>
</xsl:template>


<xsl:template match="package">
  <xsl:variable name="package.name" select="@name"/>
  <xsl:variable name="package.dir">
    <xsl:if test="not($package.name = 'unnamed package')"><xsl:value-of select="translate($package.name,'.','/')"/></xsl:if>
    <xsl:if test="$package.name = 'unnamed package'">.</xsl:if>
  </xsl:variable>
  <!-- create a classes-list.html in the package directory -->
  <redirect:write file="{$output.dir}/{$package.dir}/package-frame.html">
    <xsl:apply-templates select="." mode="classes.list"/>
  </redirect:write>

  <!-- create a package-summary.html in the package directory -->
  <redirect:write file="{$output.dir}/{$package.dir}/package-summary.html">
    <xsl:apply-templates select="." mode="package.summary"/>
  </redirect:write>

  <!-- for each class, creates a @name.html -->
  <!-- @bug there will be a problem with inner classes having the same name, it will be overwritten -->
  <xsl:for-each select="$doctree/classes/class[@package = current()/@name]">
      <!--Processing <xsl:value-of select="$class.name"/><xsl:text>&#10;</xsl:text> -->
    <redirect:write file="{$output.dir}/{$package.dir}/{@name}.html">
      <xsl:apply-templates select="." mode="class.details"/>
    </redirect:write>
  </xsl:for-each>
</xsl:template>

<!-- little trick to compute the classname for inner and non inner classes -->
<!-- this is all in one line to avoid CRLF in the name -->
<xsl:template match="class" mode="class.name">
    <xsl:if test="parent::class"><xsl:apply-templates select="parent::class" mode="class.name"/>.<xsl:value-of select="@name"/></xsl:if><xsl:if test="not(parent::class)"><xsl:value-of select="@name"/></xsl:if>
</xsl:template>


<xsl:template name="index.html">
<HTML>
  <HEAD><TITLE>Metrics Results.</TITLE></HEAD>
  <FRAMESET cols="20%,80%">
    <FRAMESET rows="30%,70%">
      <FRAME src="overview-frame.html" name="packageListFrame"/>
      <FRAME src="allclasses-frame.html" name="classListFrame"/>
    </FRAMESET>
    <FRAME src="overview-summary.html" name="classFrame"/>
  </FRAMESET>
  <noframes>
    <H2>Frame Alert</H2>
    <P>
    This document is designed to be viewed using the frames feature. If you see this message, you are using a non-frame-capable web client.
    </P>
  </noframes>
</HTML>
</xsl:template>

<!-- this is the stylesheet css to use for nearly everything -->
<xsl:template name="metrics-reference.html">
<html>
<head>
<link title="Style" type="text/css" rel="stylesheet" href="stylesheet.css"/>
</head>
<body style="text-align:justify;">
<h2>Metrics Reference</h2>
<a href="#V(G)">V(G)</a> |
<a href="#LOC">LOC</a> |
<a href="#DIT">DIT</a> |
<a href="#NOA">NOA</a> |
<a href="#NRM">NRM</a> |
<a href="#NLM">NLM</a> |
<a href="#WMC">WMC</a> |
<a href="#RFC">RFC</a> |
<a href="#DAC">DAC</a> |
<a href="#FANOUT">FANOUT</a> |
<a href="#CBO">CBO</a> |
<a href="#LCOM">LCOM</a> |
<a href="#NOC">NOC</a>

<a name="V(G)"/>
<h3>Cyclomatic Complexity - V(G)</h3>
This metric was introduced in the 1970s to measure the amount of control
flow complexity or branching complexity in a module such as a
subroutine. It gives the number of paths that may be taken through the
code, and was initially developed to give some measure of the cost of
producing a test case for the module by executing each path.
<p/>
Methods with a high cyclomatic complexity tend to be more difficult to
understand and maintain. In general the more complex the methods of an
application, the more difficult it will be to test it, and this will adversely
affect its reliability.
<p/>
V(G) is a measure of the control flow complexity of a method or
constructor.  It counts the number of branches in the body of the method,
defined as:
<ul>
<li>while statements;</li>
<li>if statements;</li>
<li>for statements.</li>
</ul>

The metric can also be configured to count each case of a switch
statement as well.

<a name="LOC"/>
<h3>Lines of Code - LOC</h3>

This is perhaps the simplest of all the metrics to define and compute.
Counting lines has a long history as a software metric dating from before
the rise of structured programming, and it is still in widespread use today.
The size of a method affects the ease with which it can be understood, its
reusability and its maintainability. There are a variety of ways that the size
can be calculated. These include counting all the lines of code, the number
of statements, the blank lines of code, the lines of commentary, and the
lines consisting only of syntax such as block delimiters.
<p/>
This metric can also be used for sizing other constructs as well, for
example, the overall size of a Java class or package can be measured by
counting the number of source lines it consists of.
<p/>
LOC can be used to determine the size of a compilation unit (source file),
class or interface, method, constructor, or field.  It can be configured to
ignore:
<ul>
<li>blank lines;</li>
<li>lines consisting only of comments;</li>
<li>lines consisting only of opening and closing braces.</li>
</ul>

<a name="DIT"/>
<h3>Depth of Inheritance Hierarchy - DIT</h3>

This metric calculates how far down the inheritance hierarchy a class is
declared. In Java all classes have java.lang.Object as their ultimate
superclass, which is defined to have a depth of 1. So a class that
immediately extends java.lang.Object has a metric value of 2; any of its
subclasses will have a value of 3, and so on.
<p/>
A class that is deep within the tree inherits more methods and state
variables, thereby increasing its complexity and making it difficult to
predict its behavior. It can be harder to understand a system with many
inheritance layers.
<p/>
DIT is defined for classes and interfaces:
<ul>
<li>all interface types have a depth of 1;</li>
<li>the class java.lang.Object has a depth of 1;</li>
<li>all other classes have a depth of 1 + the depth of their super class.</li>
</ul>

<a name="NOA"/>
<h3>Number of Attributes - NOA</h3>

The number of distinct state variables in a class serves as one measure of
its complexity. The more state a class represents the more difficult it is to
maintain invariants for it. It also hinders comprehensibility and reuse.
<p/>
In Java, state can be exposed to subclasses through protected fields, which
entails that the subclass also be aware of and maintain any invariants. This
interference with the class's data encapsulation can be a source of defects
and hidden dependencies between the state variables.
<p/>
NOA is defined for classes and interfaces.  It counts the number of fields
declared in the class or interface.

<a name="NRM"/>
<h3>Number of Remote Methods - NRM</h3>

NRM is defined for classes.  A remote method call is defined as an
invocation of a method that is not declared in any of:
<ul>
<li>the class itself;</li>
<li>a class or interface that the class extends or implements;</li>
<li>a class or method that extends the class.</li>
</ul>

The value is the count of all the remote method calls in all of the methods
and constructors of the class.

<a name="NLM"/>
<h3>Number of Local Methods - NLM</h3>

NLM is defined for classes and interfaces.  A local method is defined as a
method that is declared in the class or interface. NLM can be configured to
include the local methods of all of the class's superclasses.  Methods with
public, protected, package and private visibility can be independently
counted by setting configuration parameters.

<a name="WMC"/>
<h3>Weighted Methods per Class - WMC</h3>

If the number of methods in a class can be determined during the design
and modeling phase of a project, it can be used as a predictor of how
much time and effort is needed to develop, debug and maintain it. This
metric can be further refined by incorporating a weighting for the
complexity of each method. The usual weighting is given by the cyclomatic
complexity of the method.
<p/>
The subclasses of a class inherit all of its public and protected methods,
and possibly its package methods as well, so the number of methods a
class has directly impacts the complexity of its subclasses. Classes with
large numbers of methods are often specific to a particular application,
reducing the ability to reuse them.
<p/>
The definition of WMC is based upon NLM, and it provides the same
configuration parameters for counting inherited methods and of varying
visibility. The main difference is that NLM always counts each method as 1,
whereas WMC will weight each method. There are two weighting schemes:
<ul>
<li>V(G) the cyclomatic complexity of the method is used as its weight.
   Methods from class files are given a V(G) of 1.</li>
<li>the arity, or the number of parameters of the method are used to
   determine the weight.</li>
</ul>

<a name="RFC"/>
<h3>Response For Class - RFC</h3>

The response set of a class is the set of all methods that can be invoked as
a result of a message sent to an object of the class. This includes methods
in the class's inheritance hierarchy and methods that can be invoked on
other objects. The Response For Class metric is defined to be size of the
response set for the class. A class which provides a larger response set is
considered to be more complex than one with a smaller response set.
<p/>
One reason for this is that if a method call on a class can result in a large
number of different method calls on the target and other classes, then it
can be harder to test the behavior of the class and debug problems. It will
typically require a deeper understanding of the potential interactions that
objects of the class can have with the rest of the system.
<p/>
RFC is defined as the sum of NLM and NRM for the class.  The local methods
include all of the public, protected, package and private methods, but not
methods declared only in a superclass.

<a name="DAC"/>
<h3>Data Abstraction Coupling - DAC</h3>

DAC is defined for classes and interfaces.  It counts the number of reference
types that are used in the field declarations of the class or interface.  The
component types of arrays are also counted.  Any field with a type that is
either a supertype or a subtype of the class is not counted.

<a name="FANOUT"/>
<h3>Fan Out - FANOUT</h3>

FANOUT is defined for classes and interfaces, constructors and methods. It
counts the number of reference types that are used in:
<ul>
<li>field declarations;</li>
<li>formal parameters and return types;</li>
<li>throws declarations;</li>
<li>local variables.</li>
</ul>

The component types of arrays are also counted. Any type that is either a
supertype or a subtype of the class is not counted.

<a name="CBO"/>
<h3>Coupling Between Objects - CBO</h3>

When one object or class uses another object or class they are said to be
coupled. One major source of coupling is that between a superclass and a
subclass. A coupling is also introduced when a method or field in another
class is accessed, or when an object of another class is passed into or out
of a method invocation. Coupling Between Objects is a measure of the
non-inheritance coupling between two objects.
<p/>
A high value of coupling reduces the modularity of the class and makes
reuse more difficult. The more independent a class is the more likely it is
that it will be possible to reuse it in another part of the system. When a
class is coupled to another class it becomes sensitive to changes in that
class, thereby making maintenance for difficult. In addition, a class that is
overly dependent on other classes can be difficult to understand and test in
isolation.
<p/>
CBO is defined for classes and interfaces, constructors and methods. It
counts the number of reference types that are used in:
<ul>
<li>field declarations</li>
<li>formal parameters and return types</li>
<li>throws declarations</li>
<li>local variables</li>
</ul>

It also counts:
<ul>
<li>types from which field and method selections are made</li>
</ul>

The component types of arrays are also counted. Any type that is either a
supertype or a subtype of the class is not counted.

<a name="LCOM"/>
<h3>Lack of Cohesion Of Methods - LCOM</h3>

The cohesion of a class is the degree to which its methods are related to
each other. It is determined by examining the pattern of state variable
accesses within the set of methods. If all the methods access the same state
variables then they have high cohesion; if they access disjoint sets of
variables then the cohesion is low. An extreme example of low cohesion
would be if none of the methods accessed any of the state variables.

If a class exhibits low method cohesion it indicates that the design of the
class has probably been partitioned incorrectly, and could benefit by being
split into more classes with individually higher cohesion. On the other
hand, a high value of cohesion (a low lack of cohesion) implies that the
class is well designed. A cohesive class will tend to provide a high degree
of encapsulation, whereas a lack of cohesion decreases encapsulation and
increases complexity.
<p/>
Another form of cohesion that is useful for Java programs is cohesion
between nested and enclosing classes. A nested class that has very low
cohesion with its enclosing class would probably better designed as a peer
class rather than a nested class.
<p/>
LCOM is defined for classes. Operationally, LCOM takes each pair of
methods in the class and determines the set of fields they each access. If
they have disjoint sets of field accesses increase the count P by one. If they
share at least one field access then increase Q by one. After considering
each pair of methods,
LCOM = (P > Q) ? (P - Q) : 0
<p/>
Indirect access to fields via local methods can be considered by setting a
metric configuration parameter.

<a name="NOC"/>
<h3>Number Of Classes - NOC</h3>

The overall size of the system can be estimated by calculating the number
of classes it contains. A large system with more classes is more complex
than a smaller one because the number of potential interactions between
objects is higher. This reduces the comprehensibility of the system which
in turn makes it harder to test, debug and maintain.
<p/>
If the number of classes in the system can be projected during the initial
design phase of the project it can serve as a base for estimating the total
effort and cost of developing, debugging and maintaining the system.
<p/>
The NOC metric can also usefully be applied at the package and class level
as well as the total system.
<p/>
NOCL is defined for class and interfaces. It counts the number of classes or
interfaces that are declared. This is usually 1, but nested class declarations
will increase this number.
</body>
</html>
</xsl:template>

<!-- this is the stylesheet css to use for nearly everything -->
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
    .a td {
      background: #efefef;
    }
    .b td {
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
    .Error {
      font-weight:bold; color:red;
    }

</xsl:template>

<!-- print the metrics of the class -->
<xsl:template match="class" mode="class.details">
  <!--xsl:variable name="package.name" select="(ancestor::package)[last()]/@name"/-->
  <xsl:variable name="package.name" select="@package"/>
  <HTML>
    <HEAD>
      <xsl:call-template name="create.stylesheet.link">
        <xsl:with-param name="package.name" select="$package.name"/>
      </xsl:call-template>
    </HEAD>
    <BODY>
      <xsl:call-template name="pageHeader"/>

      <H3>Class <xsl:if test="not($package.name = 'unnamed package')"><xsl:value-of select="$package.name"/>.</xsl:if><xsl:value-of select="@name"/></H3>
      <table class="log" border="0" cellpadding="5" cellspacing="2" width="100%">
        <xsl:call-template name="all.metrics.header"/>
        <xsl:apply-templates select="." mode="print.metrics"/>
      </table>

      <H3>Methods</H3>
      <table class="log" border="0" cellpadding="5" cellspacing="2" width="100%">
        <xsl:call-template name="method.metrics.header"/>
        <xsl:apply-templates select="method" mode="print.metrics"/>
      </table>

      <xsl:call-template name="pageFooter"/>
    </BODY>
  </HTML>
</xsl:template>


<!-- list of classes in a package -->
<xsl:template match="package" mode="classes.list">
  <HTML>
    <HEAD>
      <xsl:call-template name="create.stylesheet.link">
        <xsl:with-param name="package.name" select="@name"/>
      </xsl:call-template>
    </HEAD>
    <BODY>
      <table width="100%">
        <tr>
          <td nowrap="nowrap">
            <H2><a href="package-summary.html" target="classFrame"><xsl:value-of select="@name"/></a></H2>
          </td>
        </tr>
      </table>

      <H2>Classes</H2>
      <TABLE WIDTH="100%">
        <!-- xalan-nodeset:nodeset for Xalan 1.2.2 -->
            <xsl:for-each select="$doctree/classes/class[@package = current()/@name]">
                <xsl:sort select="@name"/>
          <tr>
            <td nowrap="nowrap">
              <a href="{@name}.html" target="classFrame"><xsl:value-of select="@name"/></a>
            </td>
          </tr>
            </xsl:for-each>
      </TABLE>
    </BODY>
  </HTML>
</xsl:template>


<!--
  Creates an all-classes.html file that contains a link to all package-summary.html
  on each class.
-->
<xsl:template match="metrics" mode="all.classes">
  <html>
    <head>
      <xsl:call-template name="create.stylesheet.link">
        <xsl:with-param name="package.name" select="''"/>
      </xsl:call-template>
    </head>
    <body>
      <h2>Classes</h2>
      <table width="100%">
          <xsl:for-each select="$doctree/classes/class">
              <xsl:sort select="@name"/>
              <xsl:apply-templates select="." mode="all.classes"/>
          </xsl:for-each>
      </table>
    </body>
  </html>
</xsl:template>

<xsl:template match="class" mode="all.classes">
    <xsl:variable name="package.name" select="@package"/>
    <xsl:variable name="class.name" select="@name"/>
  <tr>
    <td nowrap="nowrap">
      <a target="classFrame">
        <xsl:attribute name="href">
          <xsl:if test="not($package.name='unnamed package')">
            <xsl:value-of select="translate($package.name,'.','/')"/><xsl:text>/</xsl:text>
          </xsl:if>
          <xsl:value-of select="$class.name"/><xsl:text>.html</xsl:text>
        </xsl:attribute>
        <xsl:value-of select="$class.name"/>
      </a>
    </td>
  </tr>
</xsl:template>

<!--
  Creates an html file that contains a link to all package-summary.html files on
  each package existing on testsuites.
  @bug there will be a problem here, I don't know yet how to handle unnamed package :(
-->
<xsl:template match="metrics" mode="all.packages">
  <html>
    <head>
      <xsl:call-template name="create.stylesheet.link">
        <xsl:with-param name="package.name" select="./package/@name"/>
      </xsl:call-template>
    </head>
    <body>
      <h2><a href="overview-summary.html" target="classFrame">Home</a></h2>
      <h2>Packages</h2>
        <table width="100%">
          <xsl:apply-templates select=".//package[not(./@name = 'unnamed package')]" mode="all.packages">
            <xsl:sort select="@name"/>
          </xsl:apply-templates>
        </table>
    </body>
  </html>
</xsl:template>

<xsl:template match="package" mode="all.packages">
  <tr>
    <td nowrap="nowrap">
      <a href="{translate(@name,'.','/')}/package-summary.html" target="classFrame">
        <xsl:value-of select="@name"/>
      </a>
    </td>
  </tr>
</xsl:template>


<xsl:template match="metrics" mode="overview.packages">
  <html>
    <head>
      <xsl:call-template name="create.stylesheet.link">
        <xsl:with-param name="package.name" select="''"/>
      </xsl:call-template>
    </head>
    <body onload="open('allclasses-frame.html','classListFrame')">
    <xsl:call-template name="pageHeader"/>
    <h3>Summary</h3>
    <table class="log" border="0" cellpadding="5" cellspacing="2" width="100%">
    <tr>
      <th><a href="metrics-reference.html#V(G)">V(G)</a></th>
      <th><a href="metrics-reference.html#LOC">LOC</a></th>
      <th><a href="metrics-reference.html#DIT">DIT</a></th>
      <th><a href="metrics-reference.html#NOA">NOA</a></th>
      <th><a href="metrics-reference.html#NRM">NRM</a></th>
      <th><a href="metrics-reference.html#NLM">NLM</a></th>
      <th><a href="metrics-reference.html#WMC">WMC</a></th>
      <th><a href="metrics-reference.html#RFC">RFC</a></th>
      <th><a href="metrics-reference.html#DAC">DAC</a></th>
      <th><a href="metrics-reference.html#FANOUT">FANOUT</a></th>
      <th><a href="metrics-reference.html#CBO">CBO</a></th>
      <th><a href="metrics-reference.html#LCOM">LCOM</a></th>
      <th><a href="metrics-reference.html#NOCL">NOCL</a></th>
    </tr>
    <xsl:apply-templates select="." mode="print.metrics"/>
    </table>
    <table border="0" width="100%">
    <tr>
    <td style="text-align: justify;">
    Note: Metrics evaluate the quality of software by analyzing the program source and quantifying
    various kind of complexity. Complexity is a common source of problems and defects in software.
    High complexity makes it more difficult to develop, understand, maintain, extend, test and debug
    a program.
    <p/>
    The primary use of metrics is to focus your attention on those parts of code that potentially are
    complexity hot spots. Once the complex areas your program have been uncovered, you can take remedial
    actions.
    For additional information about metrics and their meaning, please consult
    Metamata Metrics manual.
    </td>
    </tr>
    </table>

    <h3>Packages</h3>
    <table border="0" cellpadding="5" cellspacing="2" width="100%">
      <xsl:call-template name="all.metrics.header"/>
      <xsl:for-each select=".//package[not(@name = 'unnamed package')]">
        <xsl:sort select="@name" order="ascending"/>
        <xsl:apply-templates select="." mode="print.metrics"/>
      </xsl:for-each>
    </table>
    <!-- @bug there could some classes at this level (classes in unnamed package) -->
    <xsl:call-template name="pageFooter"/>
    </body>
    </html>
</xsl:template>

<xsl:template match="package" mode="package.summary">
  <HTML>
    <HEAD>
      <xsl:call-template name="create.stylesheet.link">
        <xsl:with-param name="package.name" select="@name"/>
      </xsl:call-template>
    </HEAD>
    <body onload="open('package-frame.html','classListFrame')">
      <xsl:call-template name="pageHeader"/>
      <!-- create an anchor to this package name -->
      <h3>Package <xsl:value-of select="@name"/></h3>

      <table class="log" border="0" cellpadding="5" cellspacing="2" width="100%">
        <xsl:call-template name="all.metrics.header"/>
        <xsl:apply-templates select="." mode="print.metrics"/>
      </table>

      <table border="0" width="100%">
      <tr>
      <td style="text-align: justify;">
      Note: Metrics evaluate the quality of software by analyzing the program source and quantifying
      various kind of complexity. Complexity is a common source of problems and defects in software.
      High complexity makes it more difficult to develop, understand, maintain, extend, test and debug
      a program.
      <p/>
      The primary use of metrics is to focus your attention on those parts of code that potentially are
      complexity hot spots. Once the complex areas your program have been uncovered, you can take remedial
      actions.
      For additional information about metrics and their meaning, please consult
      Metamata Metrics manual.
      </td>
      </tr>
      </table>

      <xsl:variable name="classes-in-package" select="$doctree/classes/class[@package = current()/@name]"/>
      <xsl:if test="count($classes-in-package) &gt; 0">
        <H3>Classes</H3>
        <table class="log" border="0" cellpadding="5" cellspacing="2" width="100%">
          <xsl:call-template name="all.metrics.header"/>
          <xsl:for-each select="$classes-in-package">
                <xsl:sort select="@name"/>
                <xsl:apply-templates select="." mode="print.metrics"/>
          </xsl:for-each>
        </table>
      </xsl:if>

      <xsl:call-template name="pageFooter"/>
    </body>
  </HTML>
</xsl:template>


<!--
    transform string like a.b.c to ../../../
    @param path the path to transform into a descending directory path
-->
<xsl:template name="path">
  <xsl:param name="path"/>
  <xsl:if test="contains($path,'.')">
    <xsl:text>../</xsl:text>
    <xsl:call-template name="path">
      <xsl:with-param name="path"><xsl:value-of select="substring-after($path,'.')"/></xsl:with-param>
    </xsl:call-template>
  </xsl:if>
  <xsl:if test="not(contains($path,'.')) and not($path = '')">
    <xsl:text>../</xsl:text>
  </xsl:if>
</xsl:template>


<!-- create the link to the stylesheet based on the package name -->
<xsl:template name="create.stylesheet.link">
  <xsl:param name="package.name"/>
  <LINK REL ="stylesheet" TYPE="text/css" TITLE="Style"><xsl:attribute name="href"><xsl:if test="not($package.name = 'unnamed package')"><xsl:call-template name="path"><xsl:with-param name="path" select="$package.name"/></xsl:call-template></xsl:if>stylesheet.css</xsl:attribute></LINK>
</xsl:template>


<!-- Page Header -->
<xsl:template name="pageHeader">

  <!-- jakarta logo -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td class="bannercell" rowspan="2">
      <a href="http://jakarta.apache.org/">
      <img src="http://jakarta.apache.org/images/jakarta-logo.gif" alt="http://jakarta.apache.org" align="left" border="0"/>
      </a>
    </td>
    <td style="text-align:right"><h2>Source Code Metrics</h2></td>
    </tr>
    <tr>
    <td style="text-align:right">Designed for use with <a href='http://www.webgain.com/products/quality_analyzer/'>Webgain QA/Metamata Metrics</a> and <a href='http://jakarta.apache.org'>Ant</a>.</td>
    </tr>
  </table>
  <hr size="1"/>
</xsl:template>

<!-- Page Footer -->
<xsl:template name="pageFooter">
</xsl:template>

<!-- class header -->
<xsl:template name="all.metrics.header">
  <tr>
    <th width="80%">Name</th>
    <th nowrap="nowrap">V(G)</th>
    <th>LOC</th>
    <th>DIT</th>
    <th>NOA</th>
    <th>NRM</th>
    <th>NLM</th>
    <th>WMC</th>
    <th>RFC</th>
    <th>DAC</th>
    <th>FANOUT</th>
    <th>CBO</th>
    <th>LCOM</th>
    <th>NOCL</th>
  </tr>
</xsl:template>

<!-- method header -->
<xsl:template name="method.metrics.header">
  <tr>
    <th width="80%">Name</th>
    <th nowrap="nowrap">V(G)</th>
    <th>LOC</th>
    <th>FANOUT</th>
    <th>CBO</th>
  </tr>
</xsl:template>

<!-- method information -->
<xsl:template match="method" mode="print.metrics">
  <tr>
    <xsl:call-template name="alternate-row"/>
    <td><xsl:apply-templates select="@name"/></td>
    <td><xsl:apply-templates select="@vg"/></td>
    <td><xsl:apply-templates select="@loc"/></td>
    <td><xsl:apply-templates select="@fanout"/></td>
    <td><xsl:apply-templates select="@cbo"/></td>
  </tr>
</xsl:template>

<!-- class information -->
<xsl:template match="class" mode="print.metrics">
  <tr>
    <xsl:call-template name="alternate-row"/>
    <td><a href="{@name}.html"><xsl:value-of select="@name"/></a></td>
    <td><xsl:apply-templates select="@vg"/></td>
    <td><xsl:apply-templates select="@loc"/></td>
    <td><xsl:apply-templates select="@dit"/></td>
    <td><xsl:apply-templates select="@noa"/></td>
    <td><xsl:apply-templates select="@nrm"/></td>
    <td><xsl:apply-templates select="@nlm"/></td>
    <td><xsl:apply-templates select="@wmc"/></td>
    <td><xsl:apply-templates select="@rfc"/></td>
    <td><xsl:apply-templates select="@dac"/></td>
    <td><xsl:apply-templates select="@fanout"/></td>
    <td><xsl:apply-templates select="@cbo"/></td>
    <td><xsl:apply-templates select="@lcom"/></td>
    <td><xsl:apply-templates select="@nocl"/></td>
  </tr>
</xsl:template>

<xsl:template match="file|package" mode="print.metrics">
  <tr>
    <xsl:call-template name="alternate-row"/>
    <td>
    <a href="{translate(@name,'.','/')}/package-summary.html" target="classFrame">
    <xsl:value-of select="@name"/>
    </a>
    </td>
    <td><xsl:apply-templates select="@vg"/></td>
    <td><xsl:apply-templates select="@loc"/></td>
    <td><xsl:apply-templates select="@dit"/></td>
    <td><xsl:apply-templates select="@noa"/></td>
    <td><xsl:apply-templates select="@nrm"/></td>
    <td><xsl:apply-templates select="@nlm"/></td>
    <td><xsl:apply-templates select="@wmc"/></td>
    <td><xsl:apply-templates select="@rfc"/></td>
    <td><xsl:apply-templates select="@dac"/></td>
    <td><xsl:apply-templates select="@fanout"/></td>
    <td><xsl:apply-templates select="@cbo"/></td>
    <td><xsl:apply-templates select="@lcom"/></td>
    <td><xsl:apply-templates select="@nocl"/></td>
  </tr>
</xsl:template>

<xsl:template match="metrics" mode="print.metrics">
  <tr>
    <xsl:call-template name="alternate-row"/>
      <!-- the global metrics is the top package metrics -->
    <td><xsl:apply-templates select="./package/@vg"/></td>
    <td><xsl:apply-templates select="./package/@loc"/></td>
    <td><xsl:apply-templates select="./package/@dit"/></td>
    <td><xsl:apply-templates select="./package/@noa"/></td>
    <td><xsl:apply-templates select="./package/@nrm"/></td>
    <td><xsl:apply-templates select="./package/@nlm"/></td>
    <td><xsl:apply-templates select="./package/@wmc"/></td>
    <td><xsl:apply-templates select="./package/@rfc"/></td>
    <td><xsl:apply-templates select="./package/@dac"/></td>
    <td><xsl:apply-templates select="./package/@fanout"/></td>
    <td><xsl:apply-templates select="./package/@cbo"/></td>
    <td><xsl:apply-templates select="./package/@lcom"/></td>
    <td><xsl:apply-templates select="./package/@nocl"/></td>
  </tr>
</xsl:template>

<!-- alternated row style -->
<xsl:template name="alternate-row">
<xsl:attribute name="class">
  <xsl:if test="position() mod 2 = 1">a</xsl:if>
  <xsl:if test="position() mod 2 = 0">b</xsl:if>
</xsl:attribute>
</xsl:template>


<!-- how to display the metrics with their max value -->
<!-- @todo the max values must be external to the xsl -->

  <xsl:template match="@vg">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$vg.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@loc">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$loc.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@dit">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$dit.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@noa">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$noa.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@nrm">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$nrm.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@nlm">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$nlm.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@wmc">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$wmc.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@rfc">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$rfc.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@dac">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$dac.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@fanout">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$fanout.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@cbo">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$cbo.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@lcom">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$lcom.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="@nocl">
    <xsl:call-template name="display-value">
      <xsl:with-param name="value" select="current()"/>
      <xsl:with-param name="max" select="$nocl.max"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="display-value">
    <xsl:param name="value"/>
    <xsl:param name="max"/>
    <xsl:if test="$value > $max">
      <xsl:attribute name="class">Error</xsl:attribute>
    </xsl:if>
    <xsl:value-of select="$value"/>
  </xsl:template>

</xsl:stylesheet>

