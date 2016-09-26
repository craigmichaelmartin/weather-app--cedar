import isolate from '@cycle/isolate';
import view from './view';
import model from './model';

const Statistics = function(sources) {
    const state$ = model(
        sources.dayHTTP, sources.hourHTTP, sources.scaleState,
        sources.whichDay, sources.whichHour
    );
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
};

const IsolatedStatistics = function (sources) {
    return isolate(Statistics)(sources);
};

export default IsolatedStatistics;
