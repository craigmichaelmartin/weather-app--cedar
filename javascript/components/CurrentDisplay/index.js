import isolate from '@cycle/isolate';
import view from './view';
import model from './model';

const CurrentDisplay = ({hours$, scale$}) => {
    const state$ = model({hours$, scale$});
    const vtree$ = view(state$);
    return {DOM: vtree$};
};

const IsolatedCurrentDisplay = (sources) => isolate(CurrentDisplay)(sources);

export default IsolatedCurrentDisplay;
