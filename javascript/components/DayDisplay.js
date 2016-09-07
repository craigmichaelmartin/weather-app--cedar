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
    // return HTTPSource.select('day').flatten()
    //     .map((res) => {
    //         console.log(res.body.forecast.simpleforecast.forecastday);
    //         return res.body.forecast.simpleforecast.forecastday;
    //     }).remember();
};

const model = function(day$, scale$) {
    const combine$ = xs.combine(day$, scale$).remember()
        .map(([days, scale]) => {
            return {days, scale};
        });
    return combine$;
};

const dayAttributes = [
    {label: 'Conditions', name: 'condition'},
    {label: 'Low', name: 'low', transform: getScaledTemperatureDegreeUnit},
    {label: 'High', name: 'high', transform: getScaledTemperatureDegreeUnit},
    {label: 'Snowfall', name: 'totalSnow', transform: getScaledLength},
    {label: 'Humidity', name: 'averageHumidity', transform: getScaledTemperatureDegreeUnit},
    // {label: 'wind', name: ['windSpeed', 'windDirection']},
    {label: 'wind', name: 'averageWind', transform: getScaledTemperatureDegreeUnit},
    {label: 'Precipitation', name: 'precipitation', transform: getScaledLength}
];

const view = function(state$) {
    return state$.map((state) => {
        const current = state.days[0]; // TODO: hardcoded
        return div('.DayDisplay', _.map(dayAttributes, (attr) => {
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

// TODO: probably make a generic display between this and hour display
// and inject whatever props are necessary to differentiate
const DayDisplay = function(sources) {
    const change$ = intent({HTTPSource: sources.HTTP});
    const state$ = model(change$, sources.scaleState);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
};

const IsolatedDayDisplay = function (sources) {
    return isolate(DayDisplay)(sources);
};

export default IsolatedDayDisplay;
