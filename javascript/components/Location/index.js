import isolate from '@cycle/isolate';
import view from './view';
import model from './model';

const intent = function(DOMSource) {
    const zipTyping$ = DOMSource.select('.js-locationInput')
        .events('keyup').map((ev) => ev.target.value);
    const displayClick$ = DOMSource.select('.js-locationDisplay')
        .events('click').map(() => true);
    const inputBlur$ = DOMSource.select('.js-locationInput')
        .events('blur').map(() => false);
    const editIconClick$ = DOMSource.select('.js-locationEditIcon')
        .events('click').map(() => true);
    const mapIconClick$ = DOMSource.select('.js-locationMarkerIcon')
        .events('click').map(() => true);
    const cancelIconClick$ = DOMSource.select('.js-locationCancelIcon')
        .events('click').map(() => false);
    const zipFiveLetters$ = DOMSource.select('.js-locationInput')
        .events('keyup').map((ev) => ev.target.value.length !== 5);
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
