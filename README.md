# generator-imatviyenko-dwapp [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Yeomen generator for Docker Swarm enabled Express/Pug web application template

## Template description
The generated web application template has the following features:
- based on Express framework with Pug view engine;
- ready scripts for deploying to Docker Swarm and for creating Docker secrets;
- https binding only, uses several techniques available in the helmet and csurf npm modules for mitigating common web security risk;
- supports http basic and SAML authentication schemes via the passport framework out of the box;
- can be run in the development mode on the local node.js instance without Docker;
- uses a verbose custom JSON logging format with Correlation ID tracking and optionally redirects logs from running Docker containers to fluentd forwarders on Docker hosts for further processing in MS Azure Logs Analytics.


## Installation

First, install [Yeoman](http://yeoman.io) and generator-imatviyenko-dwapp using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-imatviyenko-dwapp
```

Then generate your new project:

```bash
yo imatviyenko-dwapp
```

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).


## License

MIT © [Ivan Matviyenko](https://medium.com/@ivan.matviyenko)


[npm-image]: https://badge.fury.io/js/generator-imatviyenko-dwapp.svg
[npm-url]: https://npmjs.org/package/generator-imatviyenko-dwapp
[travis-image]: https://travis-ci.org/imatviyenko/generator-imatviyenko-dwapp.svg?branch=master
[travis-url]: https://travis-ci.org/imatviyenko/generator-imatviyenko-dwapp
[daviddm-image]: https://david-dm.org/imatviyenko/generator-imatviyenko-dwapp.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/imatviyenko/generator-imatviyenko-dwapp
