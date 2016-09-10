import xs from 'xstream';
import _ from 'lodash';
import {div, span, img} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {getScaledTemperatureDegreeUnit} from '../util/temperature';

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

const view = function(state$) {
    return state$.map((state) => {
        return div('.DaysDisplay', _.map(state.days, (day) => {
            return div('.col-lg-1 .col-md-2', [
                div('.js-day .day .row', [
                    div('.col-md-10 .col-xs-3', [
                        div('.day-label', day.weekdayShort)
                    ]),
                    div('.col-md-10 .col-xs-3', [
                        img('.day-image', {attrs: {src: day.iconUrl}})
                    ]),
                    div('.col-md-5 .col-xs-2', [
                        span('.day-temperature .day-temperature-high .js-dayHighTemperature',
                            getScaledTemperatureDegreeUnit(state.scale.scale, day.high)
                        )
                    ]),
                    div('.col-md-5 .col-xs-2', [
                        span('.day-temperature .day-temperature-low .js-dayLowTemperature',
                            getScaledTemperatureDegreeUnit(state.scale.scale, day.low)
                        )
                    ])
                ])
            ]);
        }));
    });
};

// TODO: probably make a generic display between this and hour display
// and inject whatever props are necessary to differentiate
const DaysDisplay = function(sources) {
    const change$ = intent({HTTPSource: sources.HTTP});
    const state$ = model(change$, sources.scaleState);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
};

const IsolatedDaysDisplay = function (sources) {
    return isolate(DaysDisplay)(sources);
};

export default IsolatedDaysDisplay;
