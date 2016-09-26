import xs from 'xstream';
import isolate from '@cycle/isolate';
import view from './view';

const intent = function({HTTPSource}) {
    return HTTPSource;
    // return HTTPSource.select('hour').flatten()
    //     .map((res) => {
    //         return res.body.hourly_forecast;
    //     }).remember();
};

const model = function(hour$, scale$) {
    const combine$ = xs.combine(hour$, scale$).remember()
        .map(([hours, scale]) => {
            const currentHour = new Date().getHours() + 1;
            return {hours, scale, currentHour};
        });
    return combine$;
};

const CurrentDisplay = function(sources) {
    const change$ = intent({HTTPSource: sources.HTTP});
    const state$ = model(change$, sources.scaleState);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
};

const IsolatedCurrentDisplay = function (sources) {
    return isolate(CurrentDisplay)(sources);
};

export default IsolatedCurrentDisplay;
