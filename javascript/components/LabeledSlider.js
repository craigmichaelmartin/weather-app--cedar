import xs from 'xstream';
import {div, input, label} from '@cycle/dom';
import isolate from '@cycle/isolate';

const intent = function(DOMSource) {
    return DOMSource.select('.slider').events('input')
        .map((ev) => ev.target.value);
};

const model = function(newValue$, props$) {
    const initialValue$ = props$.map((props) => props.initial).take(1);
    return xs.merge(initialValue$, newValue$).remember();
};

const view = function(props$, state$) {
    return xs.combine(props$, state$).map(([props, state]) =>
        div('.labeled-slider', [
            label('.label', `${props.label}: ${state}${props.unit}`),
            input('.slider', {
                attrs: {type: 'range', min: props.min, max: props.max, state}
            })
        ])
    );
};

const LabeledSlider = function(sources) {
    const change$ = intent(sources.DOM);
    const state$ = model(change$, sources.props$);
    const vtree$ = view(sources.props$, state$);
    return {
        DOM: vtree$,
        value: state$
    };
};

const IsolatedLabeledSlider = function (sources) {
    return isolate(LabeledSlider)(sources);
};

export default IsolatedLabeledSlider;
