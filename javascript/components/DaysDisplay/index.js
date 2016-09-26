import xs from 'xstream';
import isolate from '@cycle/isolate';
import view from './view';

const intent = function({HTTPSource, DOMSource}) {
    const whichDay$ = DOMSource.select('.js-day').events('click')
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
    const initialDay$ = props$.map((props) => props.day).take(1);
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
