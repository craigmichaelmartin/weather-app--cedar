import xs from 'xstream';
import {div, label, span} from '@cycle/dom';

export default (props$, state$) =>
    xs.combine(props$, state$).map(([props, state]) =>
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
