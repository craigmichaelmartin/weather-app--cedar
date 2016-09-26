import xs from 'xstream';
import isolate from '@cycle/isolate';
import view from './view';

const intent = function(DOMSource) {
    return DOMSource.select('.js-scale').events('click')
        .map((ev) => ({scale: ev.currentTarget.dataset.value}));
};

const model = function(newValue$, props$) {
    const initialValue$ = props$.map((props) => ({scale: props.scale})).take(1);
    return xs.merge(initialValue$, newValue$).remember();
};

const ScaleDropdown = function(sources) {
    const change$ = intent(sources.DOM);
    const state$ = model(change$, sources.props$);
    const vtree$ = view(sources.props$, state$);
    return {
        DOM: vtree$,
        value: state$
    };
};

const IsolatedScaleDropdown = function (sources) {
    return isolate(ScaleDropdown)(sources);
};

export default IsolatedScaleDropdown;
