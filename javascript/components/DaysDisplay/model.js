import xs from 'xstream';

export default (changeObj$, scale$, props$) => {
    const initialDay$ = props$.map((props) => props.day).take(1);
    const whichDay$ = xs.merge(initialDay$, changeObj$.whichDay).remember();
    const combine$ = xs.combine(changeObj$.days, whichDay$, scale$).remember()
        .map(([days, whichDay, scale]) => ({days, whichDay, scale}));
    return {
        combine: combine$,
        whichDay: whichDay$
    };
};
