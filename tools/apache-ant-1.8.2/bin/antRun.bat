@echo off

REM  Licensed to the Apache Software Foundation (ASF) under one or more
REM  contributor license agreements.  See the NOTICE file distributed with
REM  this work for additional information regarding copyright ownership.
REM  The ASF licenses this file to You under the Apache License, Version 2.0
REM  (the "License"); you may not use this file except in compliance with
REM  the License.  You may obtain a copy of the License at
REM 
REM      http://www.apache.org/licenses/LICENSE-2.0
REM 
REM  Unless required by applicable law or agreed to in writing, software
REM  distributed under the License is distributed on an "AS IS" BASIS,
REM  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
REM  See the License for the specific language governing permissions and
REM  limitations under the License.

if "%OS%"=="Windows_NT" @setlocal
if "%OS%"=="WINNT" @setlocal

if ""%1""=="""" goto runCommand

rem Change drive and directory to %1
if "%OS%"=="Windows_NT" goto nt_cd
if "%OS%"=="WINNT" goto nt_cd
cd ""%1""
goto end_cd
:nt_cd
cd /d ""%1""
:end_cd
shift

rem Slurp the command line arguments. This loop allows for an unlimited number
rem of arguments (up to the command line limit, anyway).
set ANT_RUN_CMD=%1
if ""%1""=="""" goto runCommand
shift
:loop
if ""%1""=="""" goto runCommand
set ANT_RUN_CMD=%ANT_RUN_CMD% %1
shift
goto loop

:runCommand
rem echo %ANT_RUN_CMD%
%ANT_RUN_CMD%

if "%OS%"=="Windows_NT" @endlocal
if "%OS%"=="WINNT" @endlocal

