import xs from 'xstream';

export default ({change$, days$, scale$, props$}) => {
    const initialDay$ = props$.map((props) => props.day).take(1);
    const day$ = xs.merge(initialDay$, change$).remember();
    const state$ = xs.combine(days$, day$, scale$).remember()
        .map(([days, day, scale]) => ({days, day, scale}));
    return {state$, day$};
};
