===============
Getting started
===============

.. include:: substitutions.txt
|CCBYSA| `Frank Bennett <https://twitter.com/fgbjr>`_

------------------------

------------
Introduction
------------

The Citation Style Language (CSL) is a powerful machine-readable
schema for describing citation formats. The |citeproc-js| processor is
a JavaScript implementation of CSL, with extended features to support
legal styles and multilingual citations. This chapter explains how to
obtain the processor sources and test the installation.

-------------------
System requirements
-------------------

The items below are required to download and test the processor.
In deployment environments, only JavaScript is required.

git
   The |citeproc-js| sources live in GitHub, so you should have
   |git| installed locally to obtain the sources.

Python
   The ``test.py`` script that runs the test suite is written in
   |python|. Both Python 2.7 and Python 3.5 are supported.

.. _javascript-engines:

Java
   The |rhino| JavaScript interpreter and the |jing| XML validator included
   in the processor sources depend on Java.

---------------------
Obtaining the sources
---------------------

Use this incantation at the command line to fetch the sources and
enter the project directory::

    git clone --recursive https://github.com/Juris-M/citeproc-js.git
    cd citeproc-js

If you forget the ``--recursive`` option, you can follow up by
fetching the submodules with this::

    git submodule update --init --remote

----------------------
Running the test suite
----------------------

To confirm that everything is working nicely, run the test suite
with the default intepreter::

    ./test.py -r

The test run should complete without errors.
