import xs from 'xstream';

export default (newValue$, props$) => {
    const initialValue$ = props$.map((props) => props.scale).take(1);
    const scale$ = xs.merge(initialValue$, newValue$).remember();
    const state$ = scale$.map((scale) => ({scale}));
    return {scale$, state$};
};
