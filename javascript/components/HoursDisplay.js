import xs from 'xstream';
import _ from 'lodash';
import {div, img, ul, li, span} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {getScaledTemperatureDegreeUnit} from '../util/temperature';
import {getScaledTemperature} from '../util/temperature';
import {getScaledTime} from '../util/time';

const intent = function({HTTPSource, DOMSource}) {
    const whichHour$ = DOMSource.select('.HoursChart-bar').events('click')
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
        // Move these to appropriate place (model probs)
        const highTemp = _.maxBy(_.map(state.hours, 'temperature'), (t) => +t);
        const lowTemp = _.minBy(_.map(state.hours, 'temperature'), (t) => +t);
        return ul('.HoursChart', _.map(_.filter(state.hours, {day: state.whichDay}), (hour) => {
            const presentationTime = getScaledTime(state.scale.scale, hour.hour, {hideMinutes: true});
            const presentationTemp = `${hour.temperature}°`;
            return li('.HoursChart-hour', [
                span('.HoursChart-bar .js-hour', {
                    class: {
                        'is-active': state.whichHour === hour.hour
                    },
                    style: {
                        height: `${hour.temperature / highTemp * 100}%`
                    },
                    attrs: {
                        'data-time': presentationTime,
                        'data-hour': hour.hour,
                        'data-temp': presentationTemp
                    }
                })
            ]);
        }));
    });
};

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
