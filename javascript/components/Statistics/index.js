import xs from 'xstream';
import isolate from '@cycle/isolate';
import view from './view';

const model = function(day$, hour$, scale$, whichDay$, whichHour$) {
    const whichStatistics$ = xs.merge(whichHour$.mapTo('hour'), whichDay$.mapTo('day')).remember();
    const combine$ = xs.combine(day$, hour$, scale$, whichDay$, whichHour$, whichStatistics$).remember()
        .map(([days, hours, scale, whichDay, whichHour, whichStatistics]) => {
            return {days, hours, scale, whichDay, whichHour, whichStatistics};
        });
    return combine$;
};

const Statistics = function(sources) {
    const state$ = model(sources.dayHTTP, sources.hourHTTP, sources.scaleState, sources.whichDay, sources.whichHour);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
};

const IsolatedStatistics = function (sources) {
    return isolate(Statistics)(sources);
};

export default IsolatedStatistics;
