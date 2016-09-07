========================
Exploring the test suite
========================

.. include:: substitutions.txt
|CCBYSA| `Frank Bennett <https://twitter.com/fgbjr>`_

------------------------

------------
Introduction
------------

The CSL test suite is an essential backdrop to |citeproc-js|
development. This chapter explains the basic features of the
``./test.py`` script that runs the suite.

---------------------------
Running individual fixtures
---------------------------

The processor ships with a set of local tests, and includes the
official CSL test fixtures as a submodule, in the following locations:

.. table:: CSL test fixture locations

   +------------------------------+-------------------------------------------------+
   | **Fixture type**             | **Relative path**                               |
   +------------------------------+-------------------------------------------------+
   | |citeproc-js| local tests    | ``./tests/fixtures/local``                      |
   +------------------------------+-------------------------------------------------+
   | Official CSL test suite      | ``./tests/fixtures/std/processor-tests/humans`` |
   +------------------------------+-------------------------------------------------+

Fixture filenames have two elements (a group name and a test name),
separated by an underscore and with a ``.txt`` extension. To run a
single test, provide the test name as the argument to the ``-s``
option. For cut-and-paste convenience, various forms of the name are
recognized::

     ./test.py -s name WesternSimple
     ./test.py -s name_WesternSimple
     ./test.py -s name_WesternSimple.txt

------------------------------
Alternative JavaScript engines
------------------------------

The Rhino JavaScript engine bundled with the processor sources is very
solid, but also very slow. For faster processing, install a standalone
JS engine compiled for your platform. In addition to Rhino, three
engines are supported:

.. table:: JavaScript Engine Info

   +--------------------+-------------+-----------------+----------------------------------------------+
   |                    |             |**Configuration**|                                              |
   |**Name**            |**Browser**  ||br| **Nickname**|**Default** **Command**                       |
   +--------------------+-------------+-----------------+----------------------------------------------+
   |  Rhino             |   (none)    |  ``rhino``      | java -client -jar ./rhino/js-1.7R3.jar -opt 8|
   +--------------------+-------------+-----------------+----------------------------------------------+
   | `Spidermonkey`__   |   Firefox   |  ``mozjs``      | js24                                         |
   +--------------------+-------------+-----------------+----------------------------------------------+
   | `V8`__             |Google Chrome|  ``v8``         | d8                                           |
   +--------------------+-------------+-----------------+----------------------------------------------+
   | `JavascriptCore`__ |   Safari    |  ``jsc``        | jsc                                          |
   +--------------------+-------------+-----------------+----------------------------------------------+

__ https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Build_Documentation

__ https://github.com/v8/v8/wiki/Building%20with%20Gyp

__ https://github.com/Lichtso/JSC-Standalone


Here are some numbers to give an idea of the relative performance of
the engines. The times are for a complete run of the test suite
on a 64-bit Ubuntu laptop that I use for development:

.. table:: Completion times for |citeproc-js| tests

   +---------------+----------------+
   |**Engine**     |**(seconds)**   |
   +---------------+----------------+
   |Rhino          |              55|
   +---------------+----------------+
   |Spidermonkey 24|              31|
   |               |                |
   +---------------+----------------+
   |V8             |              22|
   +---------------+----------------+
   |JavaScriptCore |              20|
   +---------------+----------------+

After installing an engine on your system (as a binary package, or by
compiling from scratch), check that it will run from the command line,
and then edit its ``command`` entry in the configuration file at
``./tests/config/test.cnf`` as required: [#]_

.. literalinclude:: ./test.cnf

.. [#] Note the use of a shell script for ``d8``, the standalone
       version of the Google Chrome V8 engine, which (apparently) must
       be run from the directory containing its binary.)

Once configured, an alternative engine can be run by giving its
nickname to the ``./test.py`` script::

    ./test.py -e jsc -r

---------------------------
Validating test-fixture CSL
---------------------------

The syntax of CSL styles is defined by a RELAX NG schema. In addition
to official CSL, the processor supports CSL-M, an extended version of
the language with a separate schema. Styles of the two types are
distinguished by the ``version`` attribute on the top-level
node:

.. table:: CSL versions

   +---------------+--------------+--------------------------------------------------------------------------------------+
   |**CSL** |br|   |**attribute** | **sample style node**                                                                |
   |**version**    ||br| **value**|                                                                                      |
   +---------------+--------------+--------------------------------------------------------------------------------------+
   | CSL 1.0       | 1.0          | ``<style xmlns="http://purl.org/net/xbiblio/csl" version="1.0" class="note"/>``      |
   +---------------+--------------+--------------------------------------------------------------------------------------+
   | CSL-M         | 1.1mlz1      | ``<style xmlns="http://purl.org/net/xbiblio/csl" version="1.1mlz1" class="note"/>``  |
   +---------------+--------------+--------------------------------------------------------------------------------------+

The bundled |jing| validator can be used to check that fixtures are
syntactically correct. To run the validator against all fixtures,
use the ``-c`` option with no argument::

    ./test.py -c

To test a single fixture, provide its name::

    ./test.py -c name_WesternSimple.txt

In its |jing| mode, the script does not explicitly report success
(apart from writing a progress dot to the console): it produces
chatter only if a test fails.
