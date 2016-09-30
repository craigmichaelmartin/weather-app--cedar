import _ from 'lodash';
import {div, span} from '@cycle/dom';
import {getScaledTemperatureDegreeUnit} from '../../util/temperature';
import {getDateSentence} from '../../util/date';
import {getScaledLength} from '../../util/length';
import {getScaledSpeedUnit} from '../../util/speed';

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

export default (state$) =>
    state$.map((state) => {
        const current = state.isHoursActive && state.hour != null
            ? _.find(state.hours, {hour: state.hour, day: state.day})
            : _.find(state.days, {day: state.day});
        const attributes = state.isHoursActive
            ? hourAttributes
            : dayAttributes;
        return div('.Statistics', [
            div('.row', [
                div('.col-xs-10 .Statistics-header',
                    `${getDateSentence(state.scale, current.weekday, current.monthname, current.day, current.hour)}`
                )
            ]),
            ... _.map(attributes, (attr) => {
                return div('.row', [
                    div('.col-xs-5', [
                        span(attr.label)
                    ]),
                    div('.col-xs-5', [
                        span(`${attr.transform
                            ? attr.transform(state.scale, current[attr.name])
                            : current[attr.name]}`)
                    ])
                ]);
            })
        ]);
    });
