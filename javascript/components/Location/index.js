import isolate from '@cycle/isolate';
import view from './view';
import model from './model';
import intent from './intent';

const LocationInput = function(sources) {
    const changeObj$ = intent(sources.DOM);
    const {state$, zipTyping$, zipLegit$, editMode$} =
        model(changeObj$, sources.props$, sources.autoZip$);
    const vtree$ = view(state$);
    return {DOM: vtree$, state$, zipTyping$, zipLegit$, editMode$};
};

const IsolatedLocationInput = function (sources) {
    return isolate(LocationInput)(sources);
};

export default IsolatedLocationInput;
