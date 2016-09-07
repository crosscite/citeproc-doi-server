# Overview

citeproc-doi-server is a simple server, which formats a DOI's metadata in various styles.

It uses content negotiation to get the "application/vnd.citationstyles.csl+json" representation of a DOI.
With the default dx.doi.org resolver this is supported by all DataCite and CrossRef DOIs.

# Usage

By default the server listen on localhost:8000.

## User Interface

On `/` there is a simple web formular to format a DOI with given style and language.

## API

You can format a given DOI via

```
    GET /format?doi=<doi>&style=<style>&lang=<locale>
```

or format a given citeproc text via

```
    POST /format?style=<style>&lang=<lang>
```

This requires a body with `Content-Type:application/vnd.citationstyles.csl+json`.

The `style` and `lang` parameters are optional. A list of allowed values is given by

```
    GET /styles
```

respectively

```
    GET /locales
```

# Installation

## Cloning this repository

The CSL styles and locales are added as a git submodule. So to clone this repos you should do

    git clone --recursive git://....

or in case you already have cloned non-recursivly:

    git submodule init
    git submodule update

## Node.js on ubuntu:

Installing latest (`v0.10.46`) node.js on ubuntu:

```shell
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs npm
npm config set prefix /usr/local
```


## Configuration

Copy `config.json.example` to `config.json` and change it to your needs.

## Running

### Local

Do `npm install` once to install all required modules. Then run it via

    npm start

### Global

Do `sudo npm install -g` to install everyting to `/usr/local/`. Then run it via

    /usr/local/bin/citeproc-doi-server

# Using Docker

This repository contains **Dockerfile** of [Crosscite website](http://redis.io/) for [Docker](https://www.docker.com/)'s [automated build](https://registry.hub.docker.com/u/dockerfile/redis/) published to the public [Docker Hub Registry](https://registry.hub.docker.com/).


### Base Docker Image

* [phusion/passenger-nodejs](https://hub.docker.com/r/phusion/passenger-nodejs/)


### Installation

1. Install [Docker](https://www.docker.com/).

2. Download [automated build](https://registry.hub.docker.com/u/dockerfile/redis/) from public [Docker Hub Registry](https://registry.hub.docker.com/): `docker pull dockerfile/redis`

   (alternatively, you can build an image from Dockerfile: `docker build -t="crosscite/citeproc-doi-server" github.com/dockerfile/redis`)


### Usage

#### Run `citeproc-doi-server`

    docker run -p 8080:80 crosscite/citeproc-doi-server
