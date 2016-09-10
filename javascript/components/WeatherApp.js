import xs from 'xstream';
import _ from 'underscore';
import {h2, div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import ScaleDropdown from './Scale';
import LocationInput from './Location';
import HourDisplay from './HourDisplay';
import DayDisplay from './DayDisplay';
import DaysDisplay from './DaysDisplay';

const model = function(scaleDropdownValue$, locationInputObj$, dayWeather$, hourWeather$) {
    return xs.combine(scaleDropdownValue$, locationInputObj$.combine, dayWeather$, hourWeather$)
        .map(([scaleState, locationStateCombine, dayWeather, hourWeather]) => {
            return {scaleState, locationStateCombine, dayWeather, hourWeather};
        });
};

const view = function(state$, scaleDropdownDOM, locationInputDOM, hourDisplayDOM, dayDisplayDOM, daysDisplayDOM) {
    return xs.combine(state$, scaleDropdownDOM, locationInputDOM, hourDisplayDOM, dayDisplayDOM, daysDisplayDOM)
        .map(([state, scaleVTree, locationVTree, hourVTree, dayVTree, daysVTree]) => {
            return div([
                scaleVTree,
                h2(`Scale is ${state.scaleState.scale}`),
                locationVTree,
                h2(`Zip is ${state.locationStateCombine.zipTyping}`),
                h2(`ValidZip is ${state.locationStateCombine.validZip}`),
                hourVTree,
                dayVTree,
                daysVTree
            ]);
        });
};

const parseDays = function (results) {
    return _.mapObject({
        condition: results.conditions,
        iconUrl: results.icon_url,
        iconAlt: results.icon,
        high: results.high.fahrenheit,
        low: results.low.fahrenheit,
        monthname: results.date.monthname,
        weekday: results.date.weekday,
        weekdayShort: results.date.weekday_short,
        day: +results.date.day,
        totalSnow: results.snow_allday.in,
        averageHumidity: results.avehumidity,
        averageWindDirection: results.avewind.dir,
        averageWind: results.avewind.mph,
        precipitation: results.qpf_allday.in
    }, (val) => {
        if (val === '-9999' || val === '-999') {
            return void 0;
        }
        return val;
    });
};

const parseHours = function (results) {
    return _.mapObject({
        monthname: results.FCTTIME.month_name,
        weekday: results.FCTTIME.weekday_name,
        weekdayShort: results.FCTTIME.weekday_name_abbrev,
        day: +results.FCTTIME.mday,
        hour: +results.FCTTIME.hour, // 24 hour clock
        condition: results.condition,
        feelsLike: results.feelslike.english,
        humidity: results.humidity,
        iconUrl: results.icon_url,
        iconAlt: results.icon,
        temperature: results.temp.english,
        dewpoint: results.dewpoint.english,
        heatIndex: results.heatindex.english,
        windDirection: results.wdir.dir,
        windSpeed: results.wspd.english,
        precipitation: results.qpf.english
    }, (val) => {
        if (val === '-9999' || val === '-999') {
            return void 0;
        }
        return val;
    });
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
            return _.map(res.body.forecast.simpleforecast.forecastday, parseDays);
        }).remember();
    // Unclear to me why I must select from HTTP here,
    // as opposed to pass HTTP to hourDisplay and do there there
    const hourWeather$ = HTTP.select('hour').flatten()
        .map((res) => {
            return _.map(res.body.hourly_forecast, parseHours);
        }).remember();
    const hourDisplay = HourDisplay({HTTP: hourWeather$, scaleState: scaleDropdown.value});
    const dayDisplay = DayDisplay({HTTP: dayWeather$, scaleState: scaleDropdown.value});
    const daysDisplay = DaysDisplay({HTTP: dayWeather$, scaleState: scaleDropdown.value});
    const state$ = model(scaleDropdown.value, locationInput.stateObj, dayWeather$, hourWeather$);
    const vtree$ = view(state$, scaleDropdown.DOM, locationInput.DOM, hourDisplay.DOM, dayDisplay.DOM, daysDisplay.DOM);
    return {
        DOM: vtree$,
        HTTP: getWeather$
    };
};

const IsolatedWeatherApp = function (sources) {
    return isolate(WeatherApp)(sources);
};

export default IsolatedWeatherApp;
