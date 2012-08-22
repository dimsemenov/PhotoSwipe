#!/usr/bin/python
# Licensed to the Apache Software Foundation (ASF) under one or more
#  contributor license agreements.  See the NOTICE file distributed with
#  this work for additional information regarding copyright ownership.
#  The ASF licenses this file to You under the Apache License, Version 2.0
#  (the "License"); you may not use this file except in compliance with
#  the License.  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#

"""

 runant.py

    This script is a translation of the runant.pl written by Steve Loughran.
    It runs ant with/out arguments, it should be quite portable (thanks to
    the python os library)
    This script has been tested with Python2.0/Win2K

 created:         2001-04-11
 author:          Pierre Dittgen pierre.dittgen@criltelecom.com

 Assumptions:

 - the "java" executable/script is on the command path
"""
import os, os.path, string, sys

# Change it to 1 to get extra debug information
debug = 0

#######################################################################

# If ANT_HOME is not set default to script's parent directory
if os.environ.has_key('ANT_HOME'):
    ANT_HOME = os.environ['ANT_HOME']
else:
    ANT_HOME = os.path.dirname(os.path.dirname(os.path.abspath(sys.argv[0])))

# set ANT_LIB location
ANT_LIB = os.path.join(ANT_HOME, 'lib')

# set JAVACMD (check variables JAVACMD and JAVA_HOME)
JAVACMD = None
if not os.environ.has_key('JAVACMD'):
    if os.environ.has_key('JAVA_HOME'):
        if not os.path.exists(os.environ['JAVA_HOME']):
            print "Warning: JAVA_HOME is not defined correctly."
        else:
            JAVACMD = os.path.join(os.environ['JAVA_HOME'], 'bin', 'java')
    else:
        print "Warning: JAVA_HOME not set."
else:
    JAVACMD = os.environ['JAVACMD']
if not JAVACMD:
    JAVACMD = 'java'

launcher_jar = os.path.join(ANT_LIB, 'ant-launcher.jar')
if not os.path.exists(launcher_jar):
    print 'Warning: Unable to locate ant-launcher.jar. Expected to find it in %s' % \
        ANT_LIB

# Build up standard classpath (LOCALCLASSPATH)
LOCALCLASSPATH = launcher_jar
if os.environ.has_key('LOCALCLASSPATH'):
    LOCALCLASSPATH += os.pathsep + os.environ['LOCALCLASSPATH']

ANT_OPTS = ""
if os.environ.has_key('ANT_OPTS'):
    ANT_OPTS = os.environ['ANT_OPTS']

OPTS = ""
if os.environ.has_key('JIKESPATH'):
    OPTS = '-Djikes.class.path=\"%s\"' % os.environ['JIKESPATH']

ANT_ARGS = ""
if os.environ.has_key('ANT_ARGS'):
    ANT_ARGS = os.environ['ANT_ARGS']

CLASSPATH = ""
if os.environ.has_key('CLASSPATH'):
    CLASSPATH = "-lib " + os.environ['CLASSPATH']

# Builds the commandline
cmdline = ('%s %s -classpath %s -Dant.home=%s %s ' + \
    'org.apache.tools.ant.launch.Launcher %s %s %s') \
     % (JAVACMD, ANT_OPTS, LOCALCLASSPATH, ANT_HOME, OPTS, ANT_ARGS, \
        CLASSPATH, string.join(sys.argv[1:], ' '))

if debug:
    print '\n%s\n\n' % (cmdline)
sys.stdout.flush()

# Run the biniou!
os.system(cmdline)
