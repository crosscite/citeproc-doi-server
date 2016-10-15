# DOI Formating service (citeproc)

[![Build Status](https://travis-ci.org/crosscite/citeproc-doi-server.svg)](https://travis-ci.org/crosscite/citeproc-doi-server)
[![Docker Pulls](https://img.shields.io/docker/pulls/crosscite/citeproc-doi-server.svg)](https://hub.docker.com/r/crosscite/citeproc-doi-server/)

An online tool for formatting DOIs from a DataCite, CrossRef, mEDRA, and in various styles. It allows user to format DOIs bilbiographic information in the desired format. It uses content negotiation to get the "application/vnd.citationstyles.csl+json" representation of a DOI. With the default dx.doi.org resolver this is supported by all DataCite and CrossRef DOIs.


## Installation

Using Docker.

```
docker run -p 8000:80 crosscite/citeproc-doi-server
```

You can now point your browser to `http://localhost:8000` and use the application.

![Screenshot](https://raw.githubusercontent.com/crosscite/citeproc-doi-server/master/public/img/start.png)



### API

Additionally you can use the server as a API. You can format a given DOI via

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


## Development


Follow along via [Github Issues](https://github.com/crosscite/citeproc-doi-server/issues).

### Note on Patches/Pull Requests

* Fork the project
* Write tests for your new feature or a test that reproduces a bug
* Implement your feature or make a bug fix
* Do not mess with Rakefile, version or history
* Commit, push and make a pull request. Bonus points for topical branches.

## License
**citeproc-doi-server** is released under the [MIT License](LICENSE.md).
