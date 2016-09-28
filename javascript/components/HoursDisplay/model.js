import xs from 'xstream';

export default (change$, hourWeather, scale$, props$, whichDay$) => {
    const initialHour$ = props$.map((props) => props.hour).take(1);
    const whichHour$ = xs.merge(initialHour$, change$).remember();
    const isHoursActive$ = xs.merge(
            whichHour$.mapTo(true), whichDay$.mapTo(false),
            initialHour$.map((a) => !!a))
        .remember();
    const state$ = xs.combine(hourWeather, whichHour$, scale$,
            whichDay$, isHoursActive$)
        .remember()
        .map(([hours, whichHour, scale, whichDay, isHoursActive]) =>
            ({hours, whichHour, scale, whichDay, isHoursActive})
        );
    return {state$, whichHour$, isHoursActive$};
};
