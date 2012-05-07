# Overview

## Cloning this repository

The CSL styles and locales are added as a git submodule. So to clone this repos you should do

    git clone --recursive git://....

or in case you already have cloned non-recursivly:

    git submodule init
    git submodule update

# Installation

## Node.js on ubuntu:

Installing latest node.js on ubuntu:

    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs npm
    npm config set prefix /usr/local

## Configuration

Copy `config.json.example` to `config.json` and change it to your needs.

## Running

### Local

Do `npm install` once to install all required modules. Then run it via

    npm start

### Global

Do `sudo npm install -g` to install everyting to `/usr/local/`. Then run it via

    /usr/local/bin/citeproc-doi-server

