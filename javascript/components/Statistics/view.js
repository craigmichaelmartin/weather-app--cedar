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
    {label: 'Wind', name: ['averageWind', 'averageWindDirection'], transform: getScaledSpeedUnit},
    {label: 'Precipitation', name: 'precipitation', transform: getScaledLength}
];

const hourAttributes = [
    {label: 'Conditions', name: 'condition'},
    {label: 'Temperature', name: 'temperature', transform: getScaledTemperatureDegreeUnit},
    {label: 'Feels like', name: 'feelsLike', transform: getScaledTemperatureDegreeUnit},
    {label: 'Humidity', name: 'humidity', transform: getScaledTemperatureDegreeUnit},
    {label: 'Dew Point', name: 'dewpoint', transform: getScaledTemperatureDegreeUnit},
    {label: 'Wind', name: ['windSpeed', 'windDirection'], transform: getScaledSpeedUnit},
    {label: 'Precipitation', name: 'precipitation', transform: getScaledLength},
    {label: 'Heat Index', name: 'heatIndex', transform: getScaledTemperatureDegreeUnit}
];

const getDescription = (scale, transform, name, hour) => {
    const transforms = _.isArray(transform) ? transform : [transform];
    const names = _.isArray(name) ? name : [name];
    return names.reduce((desc, n, index) => {
        const t = transforms[index];
        return `${desc} ${_.isFunction(t) ? t(scale, hour[n]) : hour[n]}`;
    }, '');
};

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
            ... _.map(attributes, (attr) =>
                div('.row', [
                    div('.col-xs-5', [
                        span(attr.label)
                    ]),
                    div('.col-xs-5', [
                        span(`${getDescription(state.scale, attr.transform, attr.name, current)}`)
                    ])
                ])
            )
        ]);
    });
