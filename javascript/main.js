import 'es5-shim';
import 'babel-polyfill';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import {createHashHistory} from 'history';
import {makeHistoryDriver} from '@cycle/history';
import WeatherApp from './components/WeatherApp/index';

// uses hash history for hosting on gh-pages
run(WeatherApp, {
    DOM: makeDOMDriver('.js-weatherApp'),
    HTTP: makeHTTPDriver(),
    history: makeHistoryDriver(createHashHistory())
});
