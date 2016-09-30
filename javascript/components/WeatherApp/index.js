import xs from 'xstream';
import _ from 'underscore';
import isolate from '@cycle/isolate';
import view from './view';
import model from './model';
import ScaleDropdown from '../Scale/index';
import LocationInput from '../Location/index';
import DaysDisplay from '../DaysDisplay/index';
import HoursDisplay from '../HoursDisplay/index';
import CurrentDisplay from '../CurrentDisplay/index';
import Statistics from '../Statistics/index';
import parseDays from '../../util/parseDays';
import parseHours from '../../util/parseHours';
import parsedPropValues from '../../util/parsedPropValues';

const modelHistory = function(scaleDropdownValue$, locationInputState$,
        day$, hour$, isHoursActive$) {
    return xs.combine(scaleDropdownValue$, locationInputState$, day$, hour$, isHoursActive$)
        .map(([scale, locationState, day, hour, isHoursActive]) =>
            `/${locationState.validZip}/${day}${isHoursActive ? `/${hour}` : ''}/${scale.scale}`
        );
};

const WeatherApp = function WeatherApp({DOM, HTTP, history}) {
    const days$ = HTTP.select('day').flatten()
        .map((res) =>
            _.map(res.body.forecast.simpleforecast.forecastday, parseDays)
        ).remember();
    const hours$ = HTTP.select('hour').flatten()
        .map((res) => _.map(res.body.hourly_forecast, parseHours)).remember();
    const weatherBack$ = xs.merge(days$, hours$).mapTo(true);
    const autoZip$ = HTTP.select('day').flatten()
        .map((res) => res.body.location && res.body.location.zip)
        .remember().take(1);
    const props$ = history.map((hist) => parsedPropValues(hist.pathname));
    const scaleDropdown = ScaleDropdown({DOM, props$});
    const locationInput = LocationInput({DOM, props$, autoZip$, weatherBack$});
    const getDayWeather$ = locationInput.zipLegit$.map((zip) => {
        const end = `${zip ? '' : 'geolookup/'}forecast10day/q/${zip || 'autoip'}.json`;
        const url = `//api.wunderground.com/api/3f6df2a3f0916b99/${end}`;
        return {
            url,
            category: 'day',
            method: 'GET'
        };
    });
    const getHourWeather$ = locationInput.zipLegit$.map((zip) => {
        const end = `${zip || 'autoip'}.json`;
        const url = `//api.wunderground.com/api/3f6df2a3f0916b99/hourly10day/q/${end}`;
        return {
            url,
            category: 'hour',
            method: 'GET'
        };
    });
    const getWeather$ = xs.merge(getDayWeather$, getHourWeather$);
    const daysDisplay = DaysDisplay({
        days: days$,
        DOM,
        scale: scaleDropdown.value,
        props: props$
    });
    const hoursDisplay = HoursDisplay({
        hours: hours$,
        DOM,
        scale: scaleDropdown.value,
        props: props$,
        day: daysDisplay.day$
    });
    const currentDisplay = CurrentDisplay({
        hours: hours$,
        scale: scaleDropdown.value,
        hour: hoursDisplay.hour$
    });
    const statistics = Statistics({
        hours: hours$,
        days: days$,
        scale: scaleDropdown.value,
        hour: hoursDisplay.hour$,
        day: daysDisplay.day$,
        isHoursActive: hoursDisplay.isHoursActive$
    });
    const state$ = model(hours$, hoursDisplay.hour$);
    const vtree$ = view(
        state$, scaleDropdown.DOM, locationInput.DOM, daysDisplay.DOM,
        hoursDisplay.DOM, currentDisplay.DOM, statistics.DOM
    );
    const history$ = modelHistory(
        scaleDropdown.value, locationInput.state$, daysDisplay.day$,
        hoursDisplay.hour$, hoursDisplay.isHoursActive$
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
