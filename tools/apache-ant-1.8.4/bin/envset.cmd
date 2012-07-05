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

SET environment variables
First optional parameter:
   ;     parameters are considered parts of a path variable, semicolons are
         appended to each element if not already present
   -D    parameters are properties for Java or Makefile etc., -D will be
         prepended and the parameters will be separated by a space
   =D    the same as above but equal sign is not required
   ,     parameters should be comma separated in the environment variable
   -     parameters should be separated by the next parameter
   Other values mean that the first parameter is missing and the environment
   variable will be set to the space separated parameters

Second parameter: name of the environment variable

Next parameters: values
; implies that the equal sign is considered a part of the parameter and is
not interpreted

-D requires parameters in the form name=value. If the equal sign is not found,
the parameters are changed to name=expanded_name

Other options have optional equal sign. If it is found, only the part after
the equal sign will be oprionally expanded.

If the parameter is the minus sign, the next parameter will not be expanded.
If the parameter is a single dot, it will be replaced with the value of the
environment variable as it existed before envset was invoked.

For other parameters the batch looks for the environment variable with the
same name (in uppercase). If it is found, it forms the expanded_name. If
the environment variable with such a name does not exist, the expanded_name
will hold the parameter name without case conversion.
*/

parse arg mode envar args

equal = 0
sep = ' '

/* Parse command line parameters */
select
  when mode='-' then do
    sep = envar
    parse var args envar args
  end
  when mode=';' then do
    sep = ''
    equal = -1
  end
  when mode='-D' then equal = 1
  when mode='=D' then mode = '-D'
  when mode=',' then sep = ','
otherwise
  args = envar args
  envar = mode
  mode = ''
end

env = 'OS2ENVIRONMENT'
envar = translate(envar)
orig = value(envar,,env)
newval = ''
expand = 1

/* for each parameter... */
do i = 1 to words(args)
  if expand > 0 & word(args, i) = '-' then expand = 0
  else call addval word(args, i)
end

/* Optionally enclose path variable by quotes */
if mode = ';' & pos(' ', newval) > 0 then newval = '"' || newval || '"'

/* Set the new value, 'SET' cannot be used since it does not allow '=' */
x = value(envar, newval, env)
exit 0

addval: procedure expose sep equal orig expand newval mode env
parse arg var

if var = '.' then expvar = orig
else do
  if equal >= 0 then do
    parse var var name '=' val
    if val = '' then var = name
    else var = val
  end
  if expand = 0 then expvar = var
  else expvar = value(translate(var),,env)
  if expvar = '' then expvar = var
  if equal >= 0 then do
    if val = '' then do
      parse var expvar key '=' val
      if val <> '' then name = key
      else do
        if equal > 0 then val = key
        else name = key
      end
    end
    else val = expvar
    if pos(' ', val) > 0 | pos('=', val) > 0 then val = '"' || val || '"'
    if val = '' then expvar = name
    else expvar = name || '=' || val
  end
  if mode = '-D' then expvar = '-D' || expvar
  if mode = ';' then do
    if right(expvar, 1) <> ';' then expvar = expvar || ';'
  end
end

if newval = '' then newval = expvar
else newval = newval || sep || expvar
expand = 1
return
