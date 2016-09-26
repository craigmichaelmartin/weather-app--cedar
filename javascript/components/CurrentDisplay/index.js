import isolate from '@cycle/isolate';
import view from './view';
import model from './model';

const intent = function({HTTPSource}) {
    return HTTPSource;
    // return HTTPSource.select('hour').flatten()
    //     .map((res) => {
    //         return res.body.hourly_forecast;
    //     }).remember();
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
