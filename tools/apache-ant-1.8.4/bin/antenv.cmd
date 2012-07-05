/* 
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
*/

'@echo off'
call RxFuncAdd "SysLoadFuncs", "RexxUtil", "SysLoadFuncs"
call SysLoadFuncs

/* Prepare the parameters for later use */
parse arg argv
mode = ''
args = ''
opts = ''
cp = ''
lcp = ''

do i = 1 to words(argv)
  param = word(argv, i)
  select
    when param='-lcp' then mode = 'l'
    when param='-cp' | param='-classpath' then mode = 'c'
    when abbrev('-opts', param, 4) then mode = 'o'
    when abbrev('-args', param, 4) then mode = 'a'
  otherwise
    select
      when mode = 'a' then args = space(args param, 1)
      when mode = 'c' then cp = space(cp param, 1)
      when mode = 'l' then lcp = space(lcp param, 1)
      when mode = 'o' then opts = space(opts param, 1)
    otherwise
      say 'Option' param 'ignored'
    end
  end
end

env="OS2ENVIRONMENT"
antconf = _getenv_('antconf' 'antconf.cmd')
runrc = _getenv_('runrc')
interpret 'call "' || runrc || '"' '"' || antconf || '"' 'ETC'
ANT_HOME = value('ANT_HOME',,env)
JAVA_HOME = value('JAVA_HOME',,env)
classpath = value('CLASSPATH',,env)
classes = stream(JAVA_HOME || "\lib\classes.zip", "C", "QUERY EXISTS")
if classes \= '' then classpath = prepend(classpath classes)
classes = stream(JAVA_HOME || "\lib\tools.jar", "C", "QUERY EXISTS")
if classes \= '' then classpath = prepend(classpath classes)

classpath = prepend(classpath ANT_HOME || '\lib\ant-launcher.jar')
'SET CLASSPATH=' || classpath

/* Setting classpathes, options and arguments */
envset = _getenv_('envset')
if cp\=''   then interpret 'call "' || envset || '"' '"; CLASSPATH"' '"' || cp || '"'
if lcp\=''  then interpret 'call "' || envset || '"' '"; LOCALCLASSPATH"' '"' || lcp || '"'
if opts\='' then interpret 'call "' || envset || '"' '"-D ANT_OPTS"' '"' || opts || '"'
if args\='' then interpret 'call "' || envset || '"' '"ANT_ARGS"' '"' || args || '"'

exit 0

addpath: procedure
parse arg path elem
if elem = '' then do
  if path\='' & right(path, 1)\=';' then path = path || ';'
  return path
end
if substr(path, length(path)) = ';' then glue = ''
else glue = ';'
if pos(translate(elem), translate(path)) = 0 then path = path || glue || elem || ';'
return path

prepend: procedure
parse arg path elem
if elem = '' then do
  if path\='' & right(path, 1)\=';' then path = path || ';'
  return path
end
if pos(translate(elem), translate(path)) = 0 then path = elem || ';' || path
return path

_getenv_: procedure expose env
parse arg envar default
if default = '' then default = envar
var = value(translate(envar),,env)
if var = '' then var = default
return var
