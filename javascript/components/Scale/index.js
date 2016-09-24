import xs from 'xstream';
import {div, label, span} from '@cycle/dom';
import isolate from '@cycle/isolate';

const intent = function(DOMSource) {
    return DOMSource.select('.js-scale').events('click')
        .map((ev) => ({scale: ev.currentTarget.dataset.value}));
};

const model = function(newValue$, props$) {
    const initialValue$ = props$.map((props) => ({scale: props.scale})).take(1);
    return xs.merge(initialValue$, newValue$).remember();
};

const view = function(props$, state$) {
    return xs.combine(props$, state$).map(([props, state]) =>
        // div('.scale js-scale btn-group', {attrs: {'data-toggle': 'buttons'}}, [
        //     label(`.btn btn-primary scale-button js-english ${if (props.scale === 'english') {'active'}`, [
        //         input('.js-scaleInput', {attrs: {type: 'radio', autocomplete: 'off'}}
        div('.Scales .btn-group', [
            label('.Scales-item .btn .btn-primary .js-scale', {
                attrs: {
                    'data-value': 'english'
                },
                class: {
                    active: state.scale === 'english'
                }
            }, [
                span('.Scales-text .hidden-xs-down', 'English'),
                span('.Scales-text .visible-sm-down .hidden-sm-up', '°F')
            ]),
            label('.Scales-item .btn .btn-primary .js-scale', {
                attrs: {
                    'data-value': 'metric'
                },
                class: {
                    active: state.scale === 'metric'
                }
            }, [
                span('.Scales-text .hidden-xs-down', 'Metric'),
                span('.Scales-text .visible-sm-down .hidden-sm-up', '°C')
            ])
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
