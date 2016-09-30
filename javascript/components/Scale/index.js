import isolate from '@cycle/isolate';
import view from './view';
import model from './model';
import intent from './intent';

const ScaleDropdown = function(sources) {
    const change$ = intent(sources.DOM);
    const {state$, scale$} = model(change$, sources.props$);
    const vtree$ = view(sources.props$, state$);
    return {
        DOM: vtree$,
        scale$
    };
};

const IsolatedScaleDropdown = function (sources) {
    return isolate(ScaleDropdown)(sources);
};

export default IsolatedScaleDropdown;
