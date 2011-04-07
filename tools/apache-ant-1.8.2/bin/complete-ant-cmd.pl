#!/usr/bin/perl
#
#  Licensed to the Apache Software Foundation (ASF) under one or more
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
# A script to allow Bash or Z-Shell to complete an Ant command-line.  
#
# To install for Bash 2.0 or better, add the following to ~/.bashrc:
# 
#     $ complete -C complete-ant-cmd ant build.sh
#
# To install for Z-Shell 2.5 or better, add the following to ~/.zshrc:
#
#     function ant_complete () {
#         local args_line args
#         read -l args_line
#         set -A args $args_line
#         set -A reply $(COMP_LINE=$args_line complete-ant-cmd ${args[1]} $1)
#     }
#     compctl -K ant_complete ant build.sh
#     
# @author Mike Williams <mikew@cortexebusiness.com.au>

my $cmdLine = $ENV{'COMP_LINE'};
my $antCmd = $ARGV[0];
my $word = $ARGV[1];

my @completions;
if ($word =~ /^-/) {
    list( restrict( $word, getArguments() ));
} elsif ($cmdLine =~ /-(f|buildfile)\s+\S*$/) {
    list( getBuildFiles($word) );
} else {
    list( restrict( $word, getTargets() ));
}

exit(0);

sub list {
    for (@_) {
        print "$_\n";
    }
}

sub restrict {
    my ($word, @completions) = @_;
    grep( /^\Q$word\E/, @completions );
}

sub getArguments {
    qw(-buildfile -debug -emacs -f -find -help -listener -logfile 
       -logger -projecthelp -quiet -verbose -version); 
}


sub getBuildFiles {
    my ($word) = @_;
    grep( /\.xml$/, glob( "$word*" ));
}

sub getTargets {

    # Look for build-file
    my $buildFile = 'build.xml';
    if ($cmdLine =~ /-(f|buildfile)\s+(\S+)/) {
        $buildFile = $2;
    }
    return () unless (-f $buildFile);

    # Run "ant -projecthelp" to list targets.  Keep a cache of results in a
    # cache-file.
    my $cacheFile = $buildFile;
    $cacheFile =~ s|(.*/)?(.*)|${1}.ant-targets-${2}|;
    if ((!-e $cacheFile) || (-z $cacheFile) || (-M $buildFile) < (-M $cacheFile)) {
        open( CACHE, '>'.$cacheFile ) || die "can\'t write $cacheFile: $!\n";
        open( HELP, "$antCmd -projecthelp -f '$buildFile'|" ) || return(); 
        my %targets;
        while( <HELP> ) {
            if (/^\s+(\S+)/) {
                $targets{$1}++;
            }
        }
        my @targets = sort keys %targets;
        for (@targets) { print CACHE "$_\n"; }
        return @targets;
    }
    
    # Read the target-cache
    open( CACHE, $cacheFile ) || die "can\'t read $cacheFile: $!\n";
    my @targets;
    while (<CACHE>) {
        chop;
        s/\r$//;  # for Cygwin
        push( @targets, $_ );
    }
    close( CACHE );
    @targets;

}



