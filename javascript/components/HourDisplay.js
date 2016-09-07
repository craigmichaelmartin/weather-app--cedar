import xs from 'xstream';
import _ from 'lodash';
import {div, span} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {getScaledTemperatureDegreeUnit} from '../util/temperature';
import {getDateSentence} from '../util/date';
import {getScaledLength} from '../util/length';
import {getScaledSpeedUnit} from '../util/speed';

const intent = function({HTTPSource}) {
    return HTTPSource;
    // return HTTPSource.select('hour').flatten()
    //     .map((res) => {
    //         console.log(res.body.hourly_forecast);
    //         return res.body.hourly_forecast;
    //     }).remember();
};

const model = function(hour$, scale$) {
    const combine$ = xs.combine(hour$, scale$).remember()
        .map(([hours, scale]) => {
            return {hours, scale};
        });
    return combine$;
};

const hourAttributes = [
    {label: 'Conditions', name: 'condition'},
    {label: 'Temperature', name: 'temperature', transform: getScaledTemperatureDegreeUnit},
    {label: 'Feels like', name: 'feelsLike', transform: getScaledTemperatureDegreeUnit},
    {label: 'Humidity', name: 'humidity', transform: getScaledTemperatureDegreeUnit},
    {label: 'Dew Point', name: 'dewpoint', transform: getScaledTemperatureDegreeUnit},
    // {label: 'wind', name: ['windSpeed', 'windDirection']},
    {label: 'wind', name: 'windSpeed'},
    {label: 'Precipitation', name: 'precipitation', transform: getScaledLength},
    {label: 'Heat Index', name: 'heatIndex', transform: getScaledTemperatureDegreeUnit}
];

const view = function(state$) {
    return state$.map((state) => {
        const current = state.hours[0]; // TODO: hardcoded
        return div('.HourDisplay', _.map(hourAttributes, (attr) => {
            return div('row', [
                div('.col-xs-5', [
                    span(attr.label)
                ]),
                div('.col-xs-5', [
                    span(`${attr.transform
                        ? attr.transform(state.scale.scale, current[attr.name])
                        : current[attr.name]}`)
                ])
            ]);
        }));
    });
};

// TODO: probably make a generic display between this and day display
// and inject whatever props are necessary to differentiate
const HourDisplay = function(sources) {
    const change$ = intent({HTTPSource: sources.HTTP});
    const state$ = model(change$, sources.scaleState);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
};

const IsolatedHourDisplay = function (sources) {
    return isolate(HourDisplay)(sources);
};

export default IsolatedHourDisplay;
