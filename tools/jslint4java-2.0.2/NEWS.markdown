Revision history for jslint4java
================================

2.0.2 (2012-01-05)
------------------

 * Update to JSLint 2012-02-03.
   - This removes the `adsafe`, `confusion` and `safe` options.
   - This adds the `anon` option.

2.0.1 (2011-10-19)
------------------

 * issue 62: Set default indent correctly.
 * issue 64: Make the maven plugin work with older maven versions.
 * issue 65: Don't blow up when the maven plugin writes a report.
 * Update to JSLint 2011-10-17.

2.0.0 (2011-06-12)
------------------

 * Add a maven plugin.
 * Update to JSLint 2011-07-11.
   - The nature of the boolean options has been inverted--beware!
     - `bitwise` now enables the use of bitwise operators.
     - `newcap` now means “ignore capitalisation of constructors”
     - `plusplus` now means “incr” and “decr” operators are tolerated.
     - `regexp` now means allow the use of “.” in regexes.
     - `undef` now means you can declare variables out of order.
     - `white` now means acceptance of non-compliant whitespace.
   - New options:
     - `sloppy`, which is the inverse of `strict`.
     - `confusion`, allows inconsistent types.
     - `vars`, to tolerate multiple `var` declarations per function (replaces `onevar`).
     - `eqeq`, to tolerate "==" and "!=".
     - `node`, to predefine node.js globals.
     - `properties`, to require declaration of all properties.
     - `unparam`, to allow unused parameters.
  - Removed options:
     - `onevar`
     - `strict`
 * The goodParts() api has been removed (it's the default now).
 * issue 57: cope with a BOM in files.

1.4.7 (2011-03-08)
------------------

 * Add OSGI bundle headers.
 * issue 52: Add checkstyle xml formatter.
 * issue 53: No files passed to the ant task is no longer an error (just an info message).
 * Update to JSLint 2011-03-07.
   * This adds the `continue` option, whilst removing `eqeqeq`, `immed` and `laxbreak` options.
   * JSLints interpretation of line and column numbers has changed.  I've tried to keep up.  Please [file a bug](http://code.google.com/p/jslint4java/issues) if errors aren't reported at the expected place.

1.4.6 (2011-01-02)
------------------

 * Update to JSLint 2010-12-23.
   * This outlaws a top-level "use strict"—stick it in a function instead.

1.4.5 (2011-01-02)
------------------

 * issue 47: Make thread safe.
 * issue 46: Clean API for JSLintBuilder.fromDefault().
 * issue 48: Kill JSLintBuilder.create()

1.4.4 (2010-11-08)
------------------

 * issue 45: Add support for “maxlen” option.  Thanks to pigulla for spotting.
 * Update dependencies:
   * rhino 1.7R2
   * JCommander 1.11

1.4.3 (2010-10-28)
------------------

 * issue 43: allow access to reports form the command line.
   * Thanks to rharding and stigkj for their assistance.
 * issue 44: stop IllegalAccessException warning from being emitted.
 * Update to JSLint 2010-10-26.

1.4.2 (2010-09-13)
------------------

 * issue 42: numeric keys throw exception.
 * Update JSLint to 2010-09-09.
 * Update to JCommander 1.7.
   * **[INCOMPATIBILITY]** This version is able to work with Java 5, so that is now the minimum version again.

1.4.1 (2010-08-05)
------------------

 * issue 40: StringIndexOutOfBoundsException on XmlResultFormatter.

1.4 (2010-07-27)
----------------

 * issue 35: Removed embedded JUnit.
 * issue 30: Add a "report" formatter to the ant task.
   * Also available on the command line with `--report`
 * issue 37: add a `--encoding` flag for specifying the encoding files on the command line.
 * issue 36: add a JUnit XML formatter.
 * issue 26: add support for `.data()` call in JSLINT.
   * This is only available in the Java API right now.
 * issue 39: add failureproperty to the ant task.
 * Use JCommander for flag processing.
   * **[INCOMPATIBILITY]** This means that command line option parsing has changed slightly.  You now have to say `--indent 2` instead of `--indent=2`.
   * **[INCOMPATIBILITY]** The minimum version of Java is now 6.
 * Update to JSLint 2010-07-14.
   * Adds options: es5, windows.
   * Removes options: sidebar.

1.3.3 (2009-12-02)
------------------

 * issue 8: add support for predef option.
 * Update to JSLint 2009-11-22
   * Adds "devel" option.

1.3.2 (2009-11-12)
------------------

 * issue 18: add support for external jslint.js.
 * issue 29: pretty up the docs some.
 * issue 32: clear up some non-partable tests.
 * Update to JSLint 2009-10-04.
   * Adds maxerr option.

1.3.1 (2009-07-30)
------------------

 * issue 21: Emit full filename in ant errors.
 * issue 22: Correct line & column numbers to be 1-based.
 * issue 23: State total error count in build failure message.
 * issue 24: make output more like javac for easier NetBeans parsing. (thanks, Ari Shamash!)
 * Update to JSLint 2009-07-25.

1.3 (2009-07-23)
----------------

 * **[INCOMPATIBILITY]** Rename package from net.happygiraffe.jslint to com.googlecode.jslint4java.  This means that the antlib url is now `antlib:com.googlecode.jslint4java`.
 * Add support for the indent option.
 * Switch build to maven.
 * Update to JSLint 2009-07-08.

1.2.1 (2008-09-07)
------------------

 * Recompile with Java 5.

1.2 (2008-09-07)
----------------

 * **[INCOMPATIBILITY]** Rewrite the ant task so that it always uses filesets.
 * **[INCOMPATIBILITY]** Rewrite the ant task so that it always uses filesets.
 * **[INCOMPATIBILITY]** Move antlib to be antlib:net.happygiraffe.jslint.
 * Update to JSLint 2008-09-04.
 * Add a `report()` call to get at `JSLINT.report()`.
 * Add in a formatter subelement to the jslint ant task.  Output can now be in either XML or plain text and may be written to a file.
 * **[INCOMPATIBILITY]** Default to failing the build if all files do not pass JSLint.  Add a haltonfailure attribute to disable this.

1.1 (2007-07-30)
----------------

 * Update to JSLint 2007-07-29.
 * Fixed Issue 1, a NullPointerException when encountering a fatal error.  Many thanks to Rod McChesney for pointing this out.
 * Added an Ant task to run JSLint as part of the build.  See the javadoc for details.
 * Added a Ruby script to automatically extract options & descriptions from JSLint.
 * All option descriptions now start with upper case.
 * Added a proper distribution (& src dist) to the build script.
 * Added a `resetOptions()` call to JSLint.
 * Switch to a more normal Rhino function call in JSLint.lint().

1.0 (2007-07-16)
----------------

 * original version
