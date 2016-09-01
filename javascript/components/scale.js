import xs from 'xstream';
import {div, span} from '@cycle/dom';
import isolate from '@cycle/isolate';

const intent = function(DOMSource) {
    return DOMSource.select('.js-scale').events('click')
        .map((ev) => ({scale: ev.target.dataset.value}));
};

const model = function(newValue$, props$) {
    const initialValue$ = props$.map((props) => ({scale: props.initial})).take(1);
    return xs.merge(initialValue$, newValue$).remember();
};

const view = function(props$, state$) {
    return xs.combine(props$, state$).map(([props, state]) =>
        // div('.scale js-scale btn-group', {attrs: {'data-toggle': 'buttons'}}, [
        //     label(`.btn btn-primary scale-button js-english ${if (props.scale === 'english') {'active'}`, [
        //         input('.js-scaleInput', {attrs: {type: 'radio', autocomplete: 'off'}}
        div('.scales', [
            span(`.scale .js-scale ${state.scale === 'english' ? 'is-active' : ''}`, {attrs: {'data-value': 'english'}}, ['English']),
            span(`.scale .js-scale ${state.scale === 'metric' ? 'is-active' : ''}`, {attrs: {'data-value': 'metric'}}, ['Metric'])
        ])
    );
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
