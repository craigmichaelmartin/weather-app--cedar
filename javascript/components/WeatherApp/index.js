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
        whichDay$, whichHour$, isHoursActive$) {
    return xs.combine(scaleDropdownValue$, locationInputState$, whichDay$, whichHour$, isHoursActive$)
        .map(([scaleState, locationState, whichDay, whichHour, isHoursActive]) =>
            `/${locationState.validZip}/${whichDay}${isHoursActive ? `/${whichHour}` : ''}/${scaleState.scale}`
        );
};

const WeatherApp = function WeatherApp({DOM, HTTP, history}) {
    const dayWeather$ = HTTP.select('day').flatten()
        .map((res) =>
            _.map(res.body.forecast.simpleforecast.forecastday, parseDays)
        ).remember();
    const hourWeather$ = HTTP.select('hour').flatten()
        .map((res) => _.map(res.body.hourly_forecast, parseHours)).remember();
    const weatherBack$ = xs.merge(dayWeather$, hourWeather$).mapTo(true);
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
        dayWeather: dayWeather$,
        DOM,
        scaleState: scaleDropdown.value,
        props: props$
    });
    const hoursDisplay = HoursDisplay({
        hourWeather: hourWeather$,
        DOM,
        scaleState: scaleDropdown.value,
        props: props$,
        whichDay: daysDisplay.whichDay$
    });
    const currentDisplay = CurrentDisplay({
        hourWeather: hourWeather$,
        scaleState: scaleDropdown.value,
        whichHour: hoursDisplay.whichHour$
    });
    const statistics = Statistics({
        hourWeather: hourWeather$,
        dayWeather: dayWeather$,
        scaleState: scaleDropdown.value,
        whichHour: hoursDisplay.whichHour$,
        whichDay: daysDisplay.whichDay$,
        isHoursActive: hoursDisplay.isHoursActive$
    });
    const state$ = model(hourWeather$, hoursDisplay.whichHour$);
    const vtree$ = view(
        state$, scaleDropdown.DOM, locationInput.DOM, daysDisplay.DOM,
        hoursDisplay.DOM, currentDisplay.DOM, statistics.DOM
    );
    const history$ = modelHistory(
        scaleDropdown.value, locationInput.state$, daysDisplay.whichDay$,
        hoursDisplay.whichHour$, hoursDisplay.isHoursActive$
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
