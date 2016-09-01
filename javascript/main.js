import 'es5-shim';
import 'babel-polyfill';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
// import {makeHTTPDriver} from '@cycle/http';
import WeatherApp from './components/WeatherApp';

run(WeatherApp, {
    DOM: makeDOMDriver('.js-weatherApp')
    // HTTP: makeHTTPDriver()
});
