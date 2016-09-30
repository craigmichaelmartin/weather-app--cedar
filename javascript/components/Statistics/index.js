import isolate from '@cycle/isolate';
import view from './view';
import model from './model';

const Statistics = function({days$, hours$, scale$, day$, hour$, isHoursActive$}) {
    const state$ = model(days$, hours$, scale$, day$, hour$, isHoursActive$);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
};

const IsolatedStatistics = function (sources) {
    return isolate(Statistics)(sources);
};

export default IsolatedStatistics;
