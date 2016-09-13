import xs from 'xstream';
import _ from 'lodash';
import {div, span, img} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {getScaledTemperatureDegreeUnit} from '../util/temperature';

const intent = function({HTTPSource, DOMSource}) {
    const whichHour$ = DOMSource.select('.HoursDisplay-hour').events('click')
        .map((ev) => +ev.currentTarget.dataset.hour);
    const hours$ = HTTPSource;
    // const hours$ = HTTPSource.select('hour').flatten()
    //     .map((res) => {
    //         return _.map(res.body.hourly_forecast, parseHours);
    //     }).remember();
    return {
        whichHour: whichHour$,
        hours: hours$
    };
};

const model = function(changeObj$, scale$, props$, whichDay$) {
    const initialHour$ = props$.map((props) => props.initial.hour).take(1);
    const whichHour$ = xs.merge(initialHour$, changeObj$.whichHour).remember();
    const combine$ = xs.combine(changeObj$.hours, whichHour$, scale$, whichDay$).remember()
        .map(([hours, whichHour, scale, whichDay]) => {
            return {hours, whichHour, scale, whichDay};
        });
    return {
        combine: combine$,
        whichHour: whichHour$
    };
};

const view = function(state$) {
    return state$.map((state) => {
        return div('.HoursDisplay', _.map(_.filter(state.hours, {day: state.whichDay}), (hour) => {
            return div('.col-lg-1 .col-md-2 .HoursDisplay-hour .js-hour', {
                class: {
                    'is-active': state.whichHour === hour.hour
                },
                style: {
                    'background-color': 'pink'
                },
                attrs: {
                    'data-hour': hour.hour
                }
            }, [
                div('.hour .row', `${hour.hour}`)
            ]);
        }));
    });
};

// TODO: probably make a generic display between this and hour display
// and inject whatever props are necessary to differentiate
const HoursDisplay = function(sources) {
    const changeObj$ = intent({HTTPSource: sources.HTTP, DOMSource: sources.DOM});
    const stateObj$ = model(changeObj$, sources.scaleState, sources.props, sources.whichDay);
    const vtree$ = view(stateObj$.combine);
    return {
        DOM: vtree$,
        whichHour: stateObj$.whichHour
    };
};

const IsolatedHoursDisplay = function (sources) {
    return isolate(HoursDisplay)(sources);
};

export default IsolatedHoursDisplay;
