import isolate from '@cycle/isolate';
import view from './view';
import model from './model';

const Statistics = function(sources) {
    const state$ = model(
        sources.days, sources.hours, sources.scale,
        sources.day, sources.hour, sources.isHoursActive
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
