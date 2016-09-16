import xs from 'xstream';
import _ from 'lodash';
import {div, span, img} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {getScaledTemperatureDegreeUnit} from '../util/temperature';

const intent = function({HTTPSource, DOMSource}) {
    const whichDay$ = DOMSource.select('.DaysDisplay-day').events('click')
        .map((ev) => +ev.currentTarget.dataset.day);
    const days$ = HTTPSource;
    // const days$ = HTTPSource.select('day').flatten()
    //     .map((res) => {
    //         return res.body.forecast.simpleforecast.forecastday;
    //     }).remember();
    return {
        whichDay: whichDay$,
        days: days$
    };
};

const model = function(changeObj$, scale$, props$) {
    const initialDay$ = props$.map((props) => props.initial.day).take(1);
    const whichDay$ = xs.merge(initialDay$, changeObj$.whichDay).remember();
    const combine$ = xs.combine(changeObj$.days, whichDay$, scale$).remember()
        .map(([days, whichDay, scale]) => {
            return {days, whichDay, scale};
        });
    return {
        combine: combine$,
        whichDay: whichDay$
    };
};

const view = function(state$) {
    return state$.map((state) => {
        return div('.DaysDisplay', _.map(state.days, (day) => {
            return div('.col-lg-1 .col-md-2 .DaysDisplay-day .js-day', {
                class: {
                    'is-active': state.whichDay === day.day
                },
                attrs: {
                    'data-day': day.day
                }
            }, [
                div('.day .row', [
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

const DaysDisplay = function(sources) {
    const changeObj$ = intent({HTTPSource: sources.HTTP, DOMSource: sources.DOM});
    const stateObj$ = model(changeObj$, sources.scaleState, sources.props);
    const vtree$ = view(stateObj$.combine);
    return {
        DOM: vtree$,
        whichDay: stateObj$.whichDay
    };
};

const IsolatedDaysDisplay = function (sources) {
    return isolate(DaysDisplay)(sources);
};

export default IsolatedDaysDisplay;
