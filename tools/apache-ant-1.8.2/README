
                                 A     N     T
 

  What is it? 
  -----------
  
  Ant is a Java based build tool. In theory it is kind of like "make" 
  without makes wrinkles and with the full portability of pure java code.

  
  Why?
  ----
  
  Why another build tool when there is already make, gnumake, nmake, jam, 
  and others? Because all of those tools have limitations that its original 
  author couldn't live with when developing software across multiple platforms. 
  
  Make-like tools are inherently shell based. They evaluate a set of 
  dependencies and then execute commands not unlike what you would issue on a 
  shell. This means that you can easily extend these tools by using or writing 
  any program for the OS that you are working on. However, this also means that 
  you limit yourself to the OS, or at least the OS type such as Unix, that you 
  are working on.
  
  Makefiles are inherently evil as well. Anybody who has worked on them for any 
  time has run into the dreaded tab problem. "Is my command not executing 
  because I have a space in front of my tab!!!" said the original author of Ant 
  way too many times. Tools like Jam took care of this to a great degree, but 
  still use yet another format to use and remember.
  
  Ant is different. Instead a model where it is extended with shell based 
  commands, it is extended using Java classes. Instead of writing shell 
  commands, the configuration files are XML based calling out a target tree 
  where various tasks get executed. Each task is run by an object which 
  implements a particular Task interface.
  
  Granted, this removes some of the expressive power that is inherent by being 
  able to construct a shell command such as `find . -name foo -exec rm {}` but 
  it gives you the ability to be cross platform. To work anywhere and 
  everywhere. And hey, if you really need to execute a shell command, Ant has 
  an exec rule that allows different commands to be executed based on the OS 
  that it is executing on.

  The Latest Version
  ------------------

  Details of the latest version can be found on the Apache Ant
  Project web site <http://ant.apache.org/>.


  Documentation
  -------------

  Documentation is available in HTML format, in the docs/ directory.
  For information about building and installing Ant, see
  docs/manual/index.html


  Licensing
  ---------

  This software is licensed under the terms you may find in the file 
  named "LICENSE" in this directory.
  
  This distribution includes cryptographic software.  The country in 
  which you currently reside may have restrictions on the import, 
  possession, use, and/or re-export to another country, of 
  encryption software.  BEFORE using any encryption software, please 
  check your country's laws, regulations and policies concerning the
  import, possession, or use, and re-export of encryption software, to 
  see if this is permitted.  See <http://www.wassenaar.org/> for more
  information.

  The U.S. Government Department of Commerce, Bureau of Industry and
  Security (BIS), has classified this software as Export Commodity 
  Control Number (ECCN) 5D002.C.1, which includes information security
  software using or performing cryptographic functions with asymmetric
  algorithms.  The form and manner of this Apache Software Foundation
  distribution makes it eligible for export under the License Exception
  ENC Technology Software Unrestricted (TSU) exception (see the BIS 
  Export Administration Regulations, Section 740.13) for both object 
  code and source code.

  The following provides more details on the included cryptographic
  software:

  For the SSH family of tasks (<sshexec> and <scp>) Ant requires the
  JSch <http://www.jcraft.com/jsch/index.html> library as well as the
  Java Cryptography extensions
  <http://java.sun.com/javase/technologies/security/>.  Ant does not
  include these libraries itself, but is designed to use them.

  Thanks for using Ant.

                                          The Apache Ant Project
                                         <http://ant.apache.org/>
