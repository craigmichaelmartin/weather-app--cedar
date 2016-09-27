import xs from 'xstream';

export default (change$, dayWeather$, scale$, props$) => {
    const initialDay$ = props$.map((props) => props.day).take(1);
    const whichDay$ = xs.merge(initialDay$, change$).remember();
    const state$ = xs.combine(dayWeather$, whichDay$, scale$).remember()
        .map(([days, whichDay, scale]) => ({days, whichDay, scale}));
    return {state$, whichDay$};
};
