import isolate from '@cycle/isolate';
import view from './view';
import model from './model';
import intent from './intent';

const DaysDisplay = function(sources) {
    const change$ = intent({DOMSource: sources.DOM});
    const {state$, whichDay$} = model(
        change$, sources.dayWeather, sources.scaleState, sources.props
    );
    const vtree$ = view(state$);
    return {DOM: vtree$, whichDay$};
};

const IsolatedDaysDisplay = function (sources) {
    return isolate(DaysDisplay)(sources);
};

export default IsolatedDaysDisplay;
