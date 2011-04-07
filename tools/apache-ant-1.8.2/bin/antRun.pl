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
# antRun.pl
#
# wrapper script for invoking commands on a platform with Perl installed
# this is akin to antRun.bat, and antRun the SH script 
#
# created:         2001-10-18
# author:          Jeff Tulley jtulley@novell.com 
#######################################################################
#be fussy about variables
use strict;

#turn warnings on during dev; generates a few spurious uninitialised var access warnings
#use warnings;

#and set $debug to 1 to turn on trace info (currently unused)
my $debug=1;

#######################################################################
# change drive and directory to "%1"
my $ANT_RUN_CMD = @ARGV[0];

# assign current run command to "%2"
chdir (@ARGV[0]) || die "Can't cd to $ARGV[0]: $!\n";
if ($^O eq "NetWare") {
    # There is a bug in Perl 5 on NetWare, where chdir does not
    # do anything.  On NetWare, the following path-prefixed form should 
    # always work. (afaict)
    $ANT_RUN_CMD .= "/".@ARGV[1];
}
else {
    $ANT_RUN_CMD = @ARGV[1];
}

# dispose of the first two arguments, leaving only the command's args.
shift;
shift;

# run the command
my $returnValue = system $ANT_RUN_CMD, @ARGV;
if ($returnValue eq 0) {
    exit 0;
}
else {
    # only 0 and 1 are widely recognized as exit values
    # so change the exit value to 1
    exit 1;
}
