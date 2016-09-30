import isolate from '@cycle/isolate';
import view from './view';
import model from './model';
import intent from './intent';

const DaysDisplay = function(sources) {
    const change$ = intent({DOMSource: sources.DOM});
    const {state$, day$} = model(
        change$, sources.days, sources.scale, sources.props
    );
    const vtree$ = view(state$);
    return {DOM: vtree$, day$};
};

const IsolatedDaysDisplay = function (sources) {
    return isolate(DaysDisplay)(sources);
};

export default IsolatedDaysDisplay;
