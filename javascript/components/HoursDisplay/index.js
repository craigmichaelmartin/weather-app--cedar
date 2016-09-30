import isolate from '@cycle/isolate';
import view from './view';
import model from './model';

const intent = function({DOMSource}) {
    return DOMSource.select('.HoursChart-bar').events('click')
        .map((ev) => +ev.currentTarget.dataset.hour);
};

const HoursDisplay = function(sources) {
    const change$ = intent({DOMSource: sources.DOM});
    const {state$, hour$, isHoursActive$} = model(
        change$, sources.hours, sources.scale, sources.props,
        sources.day
    );
    const vtree$ = view(state$);
    return {DOM: vtree$, hour$, isHoursActive$};
};

const IsolatedHoursDisplay = function (sources) {
    return isolate(HoursDisplay)(sources);
};

export default IsolatedHoursDisplay;
