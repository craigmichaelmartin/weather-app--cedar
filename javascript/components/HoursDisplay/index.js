import xs from 'xstream';
import isolate from '@cycle/isolate';
import view from './view';

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
    const initialHour$ = props$.map((props) => props.hour).take(1);
    const whichHour$ = xs.merge(initialHour$, changeObj$.whichHour).remember();
    const hoursActive$ = xs.merge(whichHour$.mapTo(true), whichDay$.mapTo(false), initialHour$.map((a) => !!a)).remember();
    const combine$ = xs.combine(changeObj$.hours, whichHour$, scale$, whichDay$, hoursActive$).remember()
        .map(([hours, whichHour, scale, whichDay, hoursActive]) => {
            return {hours, whichHour, scale, whichDay, hoursActive};
        });
    return {
        combine: combine$,
        whichHour: whichHour$
    };
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
