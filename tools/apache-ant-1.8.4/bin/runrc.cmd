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

   Run RC file, name is in the first arg, second arg is either PATH
   ENV  or -r or nothing 
*/

parse arg name path rest

if name = '' then do
  say 'RC file name is missing'
  exit 1
end

if rest \= '' then do
  say 'Too many parameters'
  exit 1
end

call runit name path
exit 0

runit: procedure
parse arg name path dir

if path \= '' & path \= '-r' then do
  dir = value(translate(path),,'OS2ENVIRONMENT')
  if dir = '' then return
  dir = translate(dir, '\', '/') /* change UNIX-like path to OS/2 */
end

if dir = '' then dir = directory()

if path = '-r' then do /* recursive call */
  subdir = filespec('path', dir)
  if subdir \= '\' then do
    subdir = left(subdir, length(subdir)-1)
    call runit name path filespec('drive', dir) || subdir
  end
end

/* Look for the file and run it */
if right(dir, 1) \= '\' then dir = dir || '\'
rcfile = stream(dir || name, 'c', 'query exists')
if rcfile \= '' then interpret 'call "' || rcfile || '"'

return
