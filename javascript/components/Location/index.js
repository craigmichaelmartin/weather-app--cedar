import xs from 'xstream';
import isolate from '@cycle/isolate';
import view from './view';

const intent = function(DOMSource) {
    const zipTyping$ = DOMSource.select('.js-locationInput').events('keyup')
        .map((ev) => ev.target.value);
    const displayClick$ = DOMSource.select('.js-locationDisplay').events('click')
        .map(() => true);
    const inputBlur$ = DOMSource.select('.js-locationInput').events('blur')
        .map(() => false);
    const editIconClick$ = DOMSource.select('.js-locationEditIcon').events('click')
        .map(() => true);
    const mapIconClick$ = DOMSource.select('.js-locationMarkerIcon').events('click')
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
        mapIconClick: mapIconClick$,
        cancelIconClick: cancelIconClick$,
        zipFiveLetters: zipFiveLetters$
    };
};

const model = function(obj$, props$, autoZip$) {
    // Could I just use startWith and pass the value, instead of creating a
    // one value stream to pass in, mapping it, and taking the single value?
    const initialZipTyping$ = props$.map((props) => props.zip).take(1);
    const initialZipLegit$ = props$.map((props) => props.zip).take(1); // unclear why I can not reuse initialZipTyping$
    const initialMode$ = props$.map((props) => props.editMode).take(1);
    const validZip$ = obj$.zipTyping.filter((zip) => zip.length === 5);
    const zipTyping$ = xs.merge(initialZipTyping$, obj$.zipTyping).remember();
    const zipLegit$ = xs.merge(initialZipLegit$, validZip$).remember();
    const editMode$ = xs.merge(
        initialMode$, obj$.displayClick, obj$.inputBlur, obj$.editIconClick,
        obj$.mapIconClick, obj$.cancelIconClick, obj$.zipFiveLetters
    ).remember();
    const combine$ = xs.combine(zipTyping$, zipLegit$, editMode$, autoZip$).remember()
        .map(([zipTyping, validZip, editMode, autoZip]) => {
            return {zipTyping: zipTyping || autoZip, validZip: validZip || autoZip, editMode};
        });
    return {
        combine: combine$,
        zipTyping: zipTyping$,
        zipLegit: zipLegit$,
        editMode: editMode$
    };
};

const LocationInput = function(sources) {
    const changeObj$ = intent(sources.DOM);
    const stateObj$ = model(changeObj$, sources.props$, sources.autoZip$);
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
