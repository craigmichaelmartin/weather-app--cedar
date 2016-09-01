import xs from 'xstream';
import {div, span, input} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {isValidZip} from '../util/zip';
import _ from 'lodash';

const intent = function(DOMSource) {
    const zipTyping$ = DOMSource.select('.js-locationInput').events('keyup')
        .map((ev) => ev.target.value);
    const displayClick$ = DOMSource.select('.js-locationDisplay').events('click')
        .map(() => true);
    const inputBlur$ = DOMSource.select('.js-locationInput').events('blur')
        .map(() => false);
    const editIconClick$ = DOMSource.select('.js-locationEditIcon').events('click')
        .map(() => true);
    const cancelIconClick$ = DOMSource.select('.js-locationCancelIcon').events('click')
        .map(() => false);
    const zipFiveLetters$ = DOMSource.select('.js-locationInput').events('keyup')
        .map((ev) => ev.target.value.length !== 5);
    return {
        zipTyping: zipTyping$,
        displayClick: displayClick$,
        inputBlur: inputBlur$,
        editIconClick: editIconClick$,
        cancelIconClick: cancelIconClick$,
        zipFiveLetters: zipFiveLetters$
    };
};

const model = function(obj$, props$) {
    const initialZipTyping$ = props$.map((props) => props.initial.zip).take(1);
    const initialZipLegit$ = props$.map((props) => props.initial.zip).take(1); // unclear why I can not reuse initialZipTyping$
    const initialMode$ = props$.map((props) => props.initial.editMode).take(1);
    const validZip$ = obj$.zipTyping.filter((zip) => zip.length === 5);
    const zipTyping$ = xs.merge(initialZipTyping$, obj$.zipTyping).remember();
    const zipLegit$ = xs.merge(initialZipLegit$, validZip$).remember();
    const editMode$ = xs.merge(
        initialMode$, obj$.displayClick, obj$.inputBlur,
        obj$.editIconClick, obj$.cancelIconClick, obj$.zipFiveLetters
    ).remember();
    const combine$ = xs.combine(zipTyping$, zipLegit$, editMode$).remember()
        .map(([zipTyping, validZip, editMode]) => {
            return {zipTyping, validZip, editMode};
        });
    return {
        combine: combine$,
        zipTyping: zipTyping$,
        zipLegit: zipLegit$,
        editMode: editMode$
    };
};

const view = function(state$) {
    return state$.map((state) => {
        return div('.js-locationContainer', [
            div('.edit-mode', {style: {display: state.editMode ? 'block' : 'none'}}, [
                input('.js-locationInput', {
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
                span('.js-locationCancelIcon', '(x)')
            ]),
            div('.display-mode', {style: {display: state.editMode ? 'none' : 'block'}}, [
                span('.js-locationDisplay', state.validZip),
                span('.js-locationEditIcon', '(i)')
            ])
        ]);
    });
};

const LocationInput = function(sources) {
    const changeObj$ = intent(sources.DOM);
    const stateObj$ = model(changeObj$, sources.props$);
    const vtree$ = view(stateObj$.combine);
    return {
        DOM: vtree$,
        stateObj: stateObj$
    };
};

const IsolatedLocationInput = function (sources) {
    return isolate(LocationInput)(sources);
};

export default IsolatedLocationInput;
