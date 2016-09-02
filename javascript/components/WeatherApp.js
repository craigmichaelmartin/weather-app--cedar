import xs from 'xstream';
import {h2, div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import ScaleDropdown from './Scale';
import LocationInput from './Location';

const model = function(scaleDropdownValue$, locationInputObj$, dayWeather$, hourWeather$) {
    return xs.combine(scaleDropdownValue$, locationInputObj$.combine, dayWeather$, hourWeather$)
        .map(([scaleState, locationStateCombine, dayWeather, hourWeather$]) => {
            return {scaleState, locationStateCombine, dayWeather, hourWeather$};
        });
};

const view = function(state$, scaleDropdownDOM, locationInputDOM) {
    return xs.combine(state$, scaleDropdownDOM, locationInputDOM)
        .map(([state, scaleVTree, locationVTree]) =>
            div([
                scaleVTree,
                h2(`Scale is ${state.scaleState.scale}`),
                locationVTree,
                h2(`Zip is ${state.locationStateCombine.zipTyping}`),
                h2(`ValidZip is ${state.locationStateCombine.validZip}`)
            ])
        );
};

const WeatherApp = function WeatherApp({DOM, HTTP}) {
    const scaleProps$ = xs.of({
        initial: 'english'
    });
    const locationProps$ = xs.of({
        initial: {
            zip: '44024',
            editMode: false
        }
    });
    const scaleDropdown = ScaleDropdown({DOM, props$: scaleProps$});
    const locationInput = LocationInput({DOM, props$: locationProps$});
    const getDayWeather$ = locationInput.stateObj.zipLegit.map((zip) => {
        const end = `${zip ? '' : 'geolookup/'}forecast10day/q/${zip || 'autoip'}.json`;
        const url = `//api.wunderground.com/api/3f6df2a3f0916b99/${end}`;
        return {
            url,
            category: 'day',
            method: 'GET'
        };
    });
    const getHourWeather$ = locationInput.stateObj.zipLegit.map((zip) => {
        const end = `${zip || 'autoip'}.json`;
        const url = `//api.wunderground.com/api/3f6df2a3f0916b99/hourly10day/q/${end}`;
        return {
            url,
            category: 'hour',
            method: 'GET'
        };
    });
    const getWeather$ = xs.merge(getDayWeather$, getHourWeather$);
    // Needs to be given to a DOM driver otherwise never gets called - reason unclear
    const dayWeather$ = HTTP.select('day').flatten()
        .map((res) => {
            return res.body.forecast.simpleforecast.forecastday;
        }).remember();
    const hourWeather$ = HTTP.select('hour').flatten()
        .map((res) => {
            return res.body.hourly_forecast;
        }).remember();
    const state$ = model(scaleDropdown.value, locationInput.stateObj, dayWeather$, hourWeather$);
    const vtree$ = view(state$, scaleDropdown.DOM, locationInput.DOM);
    return {
        DOM: vtree$,
        HTTP: getWeather$
    };
};

const IsolatedWeatherApp = function (sources) {
    return isolate(WeatherApp)(sources);
};

export default IsolatedWeatherApp;
