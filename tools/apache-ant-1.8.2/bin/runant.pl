#!/usr/bin/perl
#
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
#######################################################################
#
# runant.pl
#
# wrapper script for invoking ant in a platform with Perl installed
# this may include cgi-bin invocation, which is considered somewhat daft.
# (slo: that should be a separate file which can be derived from this
# and returns the XML formatted output)
#
# the code is not totally portable due to classpath and directory splitting
# issues. oops. (NB, use File::Spec::Functions  will help and the code is
# structured for the catfile() call, but because of perl version funnies
# the code is not included. 
#
# created:         2000-8-24
# author:          Steve Loughran steve_l@sourceforge.net
#######################################################################
#
# Assumptions:
#
# - the "java" executable/script is on the command path
# - ANT_HOME has been set
# - target platform uses ":" as classpath separator or perl indicates it is dos/win32
# - target platform uses "/" as directory separator.

#be fussy about variables
use strict;

#platform specifics (disabled)
#use File::Spec::Functions;

#turn warnings on during dev; generates a few spurious uninitialised var access warnings
#use warnings;

#and set $debug to 1 to turn on trace info
my $debug=1;

#######################################################################
#
# check to make sure environment is setup
#

my $HOME = $ENV{ANT_HOME};
if ($HOME eq "")
        {
    die "\n\nANT_HOME *MUST* be set!\n\n";
        }

my $JAVACMD = $ENV{JAVACMD};
$JAVACMD = "java" if $JAVACMD eq "";

my $onnetware = 0;
if ($^O eq "NetWare")
{
  $onnetware = 1;
}

my $oncygwin = ($^O eq "cygwin");

#ISSUE: what java wants to split up classpath varies from platform to platform 
#and perl is not too hot at hinting which box it is on.
#here I assume ":" 'cept on win32, dos, and netware. Add extra tests here as needed.
my $s=":";
if(($^O eq "MSWin32") || ($^O eq "dos") || ($^O eq "cygwin") ||
   ($onnetware == 1))
        {
        $s=";";
        }

#build up standard classpath
my $localpath = "$HOME/lib/ant-launcher.jar";
#set JVM options and Ant arguments, if any
my @ANT_OPTS=split(" ", $ENV{ANT_OPTS});
my @ANT_ARGS=split(" ", $ENV{ANT_ARGS});

#jikes
if($ENV{JIKESPATH} ne "")
        {
        push @ANT_OPTS, "-Djikes.class.path=$ENV{JIKESPATH}";
        }

#construct arguments to java
my @ARGS;
push @ARGS, @ANT_OPTS;

my $CYGHOME = "";

my $classpath=$ENV{CLASSPATH};
if ($oncygwin == 1) {
  $localpath = `cygpath --path --windows $localpath`;
  chomp ($localpath);
  if (! $classpath eq "")
  {
    $classpath = `cygpath --path --windows "$classpath"`;
    chomp ($classpath);
  }
  $HOME = `cygpath --path --windows $HOME`;
  chomp ($HOME);
  $CYGHOME = `cygpath --path --windows $ENV{HOME}`;
  chomp ($CYGHOME);
}
push @ARGS, "-classpath", "$localpath";
push @ARGS, "-Dant.home=$HOME";
if ( ! $CYGHOME eq "" )
{
  push @ARGS, "-Dcygwin.user.home=\"$CYGHOME\""
}
push @ARGS, "org.apache.tools.ant.launch.Launcher", @ANT_ARGS;
push @ARGS, @ARGV;
if (! $classpath eq "")
{
  if ($onnetware == 1)
  {
    # make classpath literally $CLASSPATH
    # this is to avoid pushing us over the 512 character limit
    # even skip the ; - that is already in $localpath
    push @ARGS, "-lib", "\$CLASSPATH";
  }
  else
  {
    push @ARGS, "-lib", "$classpath";
  }
}
print "\n $JAVACMD @ARGS\n\n" if ($debug);

my $returnValue = system $JAVACMD, @ARGS;
if ($returnValue eq 0)
        {
        exit 0;
        }
else
        {
        # only 0 and 1 are widely recognized as exit values
        # so change the exit value to 1
        exit 1;
        }
