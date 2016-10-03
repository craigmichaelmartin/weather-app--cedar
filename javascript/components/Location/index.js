import isolate from '@cycle/isolate';
import view from './view';
import model from './model';
import intent from './intent';

const LocationInput = ({DOM, props$, autoZip$, weatherBack$}) => {
    const changeObj$ = intent(DOM);
    const {state$, zipTyping$, zipLegit$, editMode$} =
        model({changeObj$, props$, autoZip$, weatherBack$});
    const vtree$ = view(state$);
    return {DOM: vtree$, state$, zipTyping$, zipLegit$, editMode$};
};

const IsolatedLocationInput = (sources) => isolate(LocationInput)(sources);

export default IsolatedLocationInput;
