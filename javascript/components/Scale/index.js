import isolate from '@cycle/isolate';
import view from './view';
import model from './model';
import intent from './intent';

const ScaleDropdown = ({DOM, props$}) => {
    const change$ = intent(DOM);
    const {state$, scale$} = model({change$, props$});
    const vtree$ = view(state$);
    return {DOM: vtree$, scale$};
};

const IsolatedScaleDropdown = (sources) => isolate(ScaleDropdown)(sources);

export default IsolatedScaleDropdown;
