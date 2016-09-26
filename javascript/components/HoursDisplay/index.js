import isolate from '@cycle/isolate';
import view from './view';
import model from './model';

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

const HoursDisplay = function(sources) {
    const changeObj$ = intent({HTTPSource: sources.HTTP, DOMSource: sources.DOM});
    const stateObj$ = model(
        changeObj$, sources.scaleState, sources.props, sources.whichDay
    );
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
