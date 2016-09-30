import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
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

const modelHistory = function({scale$, zipLegit$, day$, hour$, isHoursActive$}) {
    return xs.combine(scale$, zipLegit$, day$, hour$, isHoursActive$)
        .map(([scale, zipLegit, day, hour, isHoursActive]) =>
            `/${zipLegit}/${day}${isHoursActive ? `/${hour}` : ''}/${scale}`
        ).compose(dropRepeats());
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
    const {scale$, DOM: scaleDOM$} = ScaleDropdown({DOM, props$});
    const {zipLegit$, DOM: locationDOM$} =
        LocationInput({DOM, props$, autoZip$, weatherBack$});
    const getDayWeather$ = zipLegit$.map((zip) => {
        const end = `${zip ? '' : 'geolookup/'}forecast10day/q/${zip || 'autoip'}.json`;
        const url = `//api.wunderground.com/api/3f6df2a3f0916b99/${end}`;
        return {url, category: 'day', method: 'GET'};
    });
    const getHourWeather$ = zipLegit$.map((zip) => {
        const end = `${zip || 'autoip'}.json`;
        const url = `//api.wunderground.com/api/3f6df2a3f0916b99/hourly10day/q/${end}`;
        return {url, category: 'hour', method: 'GET'};
    });
    const getWeather$ = xs.merge(getDayWeather$, getHourWeather$);
    const {day$, DOM: daysDOM$} = DaysDisplay({DOM, props$, days$, scale$});
    const {hour$, isHoursActive$, DOM: hoursDOM$} =
        HoursDisplay({DOM, props$, hours$, scale$, day$});
    const {DOM: currentDOM$} = CurrentDisplay({hours$, scale$});
    const {DOM: statisticsDOM$} =
        Statistics({hours$, days$, scale$, hour$, day$, isHoursActive$});
    const state$ = model(hours$, hour$);
    const vtree$ = view(
        state$, scaleDOM$, locationDOM$, daysDOM$,
        hoursDOM$, currentDOM$, statisticsDOM$
    );
    const history$ =
        modelHistory({scale$, zipLegit$, day$, hour$, isHoursActive$});

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
