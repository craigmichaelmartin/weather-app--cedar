import xs from 'xstream';
import _ from 'underscore';
import {h2, div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import ScaleDropdown from './Scale';
import LocationInput from './Location';
import DaysDisplay from './DaysDisplay';
import HoursDisplay from './HoursDisplay';
import CurrentDisplay from './CurrentDisplay';
import Statistics from './Statistics';

const model = function(scaleDropdownValue$, locationInputObj$, whichDay$, whichHour$) {
    return xs.combine(scaleDropdownValue$, locationInputObj$.combine, whichDay$, whichHour$)
        .map(([scaleState, locationState, whichDay, whichHour]) => {
            return `/${locationState.validZip}/${whichDay}${whichHour == null ? '' : `/${whichHour}`}/${scaleState.scale}`;
        });
};

// Returns a condition in the set {snowy, rainy, clear, cloudy}
const getConditionClass = (condition) => {
    if (/snow/i.test(condition)) {
        return 'is-snowy';
    }
    if (/rain|thunderstorm|showers/i.test(condition)) {
        return 'is-rainy';
    }
    if (/clear|sunny/i.test(condition)) {
        return 'is-clear';
    }
    return 'is-cloudy';
};

const view = function(state$, scaleDropdownDOM, locationInputDOM, daysDisplayDOM,
                      hoursDisplayDom, currentDisplayDom, statisticsDOM) {
    return xs.combine(state$, scaleDropdownDOM, locationInputDOM, daysDisplayDOM,
                      hoursDisplayDom, currentDisplayDom, statisticsDOM)
        .map(([state, scaleVTree, locationVTree, daysVTree,
               hoursVTree, conditionsVTree, statisticsVTree]) => {
            return div('.weatherApp', {
                class: {
                    [getConditionClass(state.condition)]: true
                }
            }, [
                div('.container-fluid', [
                    div('.row', [
                        div('.col-xs-10', [
                            scaleVTree,
                            locationVTree
                        ])
                    ]),
                    div('.row', [
                        div('.col-xs-10', [
                            conditionsVTree
                        ])
                    ]),
                    div('.row .u-paddingBottom'),
                    daysVTree,
                    div('.row .u-paddingBottom'),
                    div('.row', [
                        div('.col-xl-3 .col-xl-push-7', [
                            statisticsVTree
                        ]),
                        div('.col-xl-7 .col-xl-pull-3', [
                            hoursVTree
                        ])
                    ])
                ])
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

const isNumeric = function(thing) {
    const casted = +thing;
    return !_.isNaN(casted) && _.isNumber(casted);
};

const getPropValues = function(zip, day, hour, scale) {
    return {
        zip: +zip,
        day: +day || new Date().getDate(),
        hour: hour && isNumeric(hour) ? +hour : scale && isNumeric(scale) ? +scale : void 0,
        scale: scale ? scale : hour && !isNumeric(hour) ? hour : day && !isNumeric(day) ? day : 'english',
        editMode: false
    };
};

const getInitialValuesFromPathname = function(pathname) {
    const array = pathname.split('/');
    array.shift();
    return getPropValues(...array);
};

const WeatherApp = function WeatherApp({DOM, HTTP, history}) {
    // const initZip$ = HTTP.select('day').flatten().startWith({body: {location: {zip: '44024'}}})
    //     .map((res) => {
    //         return res.body.location.zip;
    //     }).remember().take(1);
    // const staticProps$ = history.map((hist) => {
    //     return getInitialValuesFromPathname(hist.pathname);
    // });
    // const props$ = xs.combine(staticProps$, initZip$).remember()
    //     .map(([staticProps, initZip]) => {
    //         if (staticProps.zip) return staticProps;
    //         return _.extend({}, staticProps, {zip: initZip});
    //     });
    const autoZip$ = HTTP.select('day').flatten()
        .map((res) => {
            return res.body.location && res.body.location.zip;
        }).remember().take(1);
    const props$ = history.map((hist) => {
        return getInitialValuesFromPathname(hist.pathname);
    });
    const scaleDropdown = ScaleDropdown({DOM, props$});
    const locationInput = LocationInput({DOM, props$, autoZip$});
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
    const daysDisplay = DaysDisplay({
        HTTP: dayWeather$,
        DOM,
        scaleState: scaleDropdown.value,
        props: props$
    });
    const hoursDisplay = HoursDisplay({
        HTTP: hourWeather$,
        DOM,
        scaleState: scaleDropdown.value,
        props: props$,
        whichDay: daysDisplay.whichDay
    });
    const currentDisplay = CurrentDisplay({
        HTTP: hourWeather$,
        scaleState: scaleDropdown.value,
        whichHour: hoursDisplay.whichHour
    });
    const statistics = Statistics({
        hourHTTP: hourWeather$,
        dayHTTP: dayWeather$,
        scaleState: scaleDropdown.value,
        whichHour: hoursDisplay.whichHour,
        whichDay: daysDisplay.whichDay
    });
    const state$ = xs.combine(hourWeather$, hoursDisplay.whichHour).remember()
        .map(([hours]) => {
            const currentHour = new Date().getHours() + 1;
            const current = _.find(hours, {hour: currentHour});
            return {condition: current.condition};
        });
    const vtree$ = view(
        state$, scaleDropdown.DOM, locationInput.DOM, daysDisplay.DOM,
        hoursDisplay.DOM, currentDisplay.DOM, statistics.DOM
    );
    const history$ = model(
        scaleDropdown.value, locationInput.stateObj, daysDisplay.whichDay,
        hoursDisplay.whichHour
    );

    return {
        DOM: vtree$,
        HTTP: getWeather$,
        history: history$
    };
};

const IsolatedWeatherApp = function (sources) {
    return isolate(WeatherApp)(sources);
};

export default IsolatedWeatherApp;
