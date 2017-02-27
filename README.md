# @kgarza/citeproc-doi [![Build Status](https://travis-ci.org/crosscite/citeproc-doi-server.png?branch=master)](https://travis-ci.org/crosscite/citeproc-doi-server)

Nodejs server for formatted citation of dois

## Installation

```sh
npm install @kgarza/citeproc-doi --save
```


## Tests

```sh
npm install
npm test
```
```

> @kgarza/citeproc-doi@0.0.1 test /Users/Kristian/datacite/citeproc-doi-server
> node spec/test.js
Garza, Kristian, Carole Goble, John Brooke, and Caroline Jay. 2015. ‘Framing the Community Data System Interface’. Proceedings of the 2015 British HCI Conference on - British HCI ’15. Association for Computing Machinery (ACM). doi:10.1145/2783446.2783605.
Garza, Kristian, Carole Goble, John Brooke, and Caroline Jay. 2015. ‘Framing the Community Data System Interface’. Proceedings of the 2015 British HCI Conference on - British HCI ’15. Association for Computing Machinery (ACM). doi:10.1145/2783446.2783605.
Garza, K., Goble, C., Brooke, J., & Jay, C. (2015). Framing the community data system interface. Proceedings of the 2015 British HCI Conference on - British HCI ’15. Association for Computing Machinery (ACM). https://doi.org/10.1145/2783446.2783605

```

## Dependencies

- [connect](https://github.com/senchalabs/connect): High performance middleware framework
- [jsdom](https://github.com/tmpvar/jsdom): A javascript implementation of the W3C DOM
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [request](https://github.com/mikeal/request): Simplified HTTP request client.
- [should](https://github.com/shouldjs/should.js): test framework agnostic BDD-style assertions

## Dev Dependencies

- [should](https://github.com/shouldjs/should.js): test framework agnostic BDD-style assertions


## License

ISC
