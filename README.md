[![Build Status](https://travis-ci.org/craigmichaelmartin/weather-app--cedar.svg?branch=master)](https://travis-ci.org/craigmichaelmartin/weather-app--cedar)

##### A simple javascript weather web app  

using the latest EcmaScript 2015 (ES6) additions,  
transpiled with Babel,  
moduled with ES6 modules and bundled with Browersify,  
built with the reactive and stream-based CycleJS framework,  
styled with SASS and Bootstrap 4 (Alpha)  
within the BEM inspired SUITCSS methodology,  
enhanced with Font Awesome vector icons,  
tested with Karma, Mocha, Chai, and Sinon,  
using PhantomJS, Chrome, Firefox, and Safari,  
tooled with npm for package management,  
and npm scripts for tasks involving  
ESLint, Uglify, Autoprefixer, CSScomb,  
CSSLint, CSSMin, Clean-css, Http-server, and more.

#### Outstanding TODOs:

- [ ] implement tests (all the tests for the all the cases exist, but they were ported directly from weather-app--birch and have not been touch, so they need to be updated)
- [ ] allow chart to handle negative values
- [ ] implement error messaging for invalid input (from url)
- [ ] clean up left over css from birch (and perhaps try a radically different methodology - though I love the BEM derivative SUIT)
- [ ] hook up to ci

#### Build Locally

[Clone](http://git-scm.com/docs/git-clone) or [download](https://github.com/craigmichaelmartin/weather-app--cedar/archive/master.zip) this repo.

```sh
git clone https://github.com/craigmichaelmartin/weather-app--cedar.git && cd weather-app--cedar
```

Make sure [Node.js](http://nodejs.org/) and [npm](https://www.npmjs.org/) are
[installed](http://nodejs.org/download/).

```sh
npm run demo
```

Once that is finished, your browser will open to the app.

#### View Hosted

Check out the hosted github [page](//craigmichaelmartin.github.io/weather-app--cedar).
