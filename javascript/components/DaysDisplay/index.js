import isolate from '@cycle/isolate';
import view from './view';
import model from './model';
import intent from './intent';

const DaysDisplay = ({DOM, days$, scale$, props$}) => {
    const change$ = intent({DOMSource: DOM});
    const {state$, day$} = model({change$, days$, scale$, props$});
    const vtree$ = view(state$);
    return {DOM: vtree$, day$};
};

const IsolatedDaysDisplay = (sources) => isolate(DaysDisplay)(sources);

export default IsolatedDaysDisplay;
