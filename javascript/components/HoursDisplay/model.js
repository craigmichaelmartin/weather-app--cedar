import xs from 'xstream';

export default (changeObj$, scale$, props$, whichDay$) => {
    const initialHour$ = props$.map((props) => props.hour).take(1);
    const whichHour$ = xs.merge(initialHour$, changeObj$.whichHour).remember();
    const hoursActive$ = xs.merge(
            whichHour$.mapTo(true), whichDay$.mapTo(false),
            initialHour$.map((a) => !!a))
        .remember();
    const combine$ = xs.combine(changeObj$.hours, whichHour$, scale$,
            whichDay$, hoursActive$)
        .remember()
        .map(([hours, whichHour, scale, whichDay, hoursActive]) =>
            ({hours, whichHour, scale, whichDay, hoursActive})
        );
    return {
        combine: combine$,
        whichHour: whichHour$
    };
};
