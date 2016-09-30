import {div, span, input} from '@cycle/dom';
import {isValidZip} from '../../util/zip';
import _ from 'lodash';

export default (state$) =>
    state$.map((state) =>
        div('.js-locationContainer Location', [
            div('.Location--editMode', {style: {display: state.editMode ? 'block' : 'none'}}, [
                span('.js-locationMarkerIcon .Location-marker .fa .fa-map-marker .hidden-xs-down'),
                input('.js-locationInput .form-group .form-control .Location-edit', {
                    attrs: _.omit({
                        value: state.zipTyping,
                        autofocus: true,
                        onfocus: 'this.value = this.value;',
                        invalid: !isValidZip(state.zipTyping) || void 0
                    }, _.isUndefined),
                    class: {
                        'is-valid': isValidZip(state.zipTyping),
                        'is-invalid': !isValidZip(state.zipTyping)
                    }
                }),
                span('.js-locationCancelIcon .fa .fa-times-circle-o')
            ]),
            div('.Location--displayMode', {style: {display: state.editMode ? 'none' : 'block'}}, [
                span('.js-locationMarkerIcon .Location-marker .fa .fa-map-marker .hidden-xs-down'),
                span('.js-locationDisplay .Location-display .js-display', state.validZip),
                ...(state.isLoading ? [
                    span('.Location-spinner .fa .fa-circle-o-notch .fa-spin')
                ] : [
                    span('.js-locationEditIcon .Location-pencil .fa .fa-pencil .hidden-xs-down')
                ])
            ])
        ])
    );
