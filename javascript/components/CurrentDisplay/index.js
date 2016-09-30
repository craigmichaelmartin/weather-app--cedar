import isolate from '@cycle/isolate';
import view from './view';
import model from './model';

const CurrentDisplay = function(sources) {
    const state$ = model(sources.hours, sources.scale);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
};

const IsolatedCurrentDisplay = function (sources) {
    return isolate(CurrentDisplay)(sources);
};

export default IsolatedCurrentDisplay;
