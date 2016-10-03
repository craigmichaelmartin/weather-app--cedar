import xs from 'xstream';

export default ({change$, hours$, scale$, props$, day$}) => {
    const initialHour$ = props$.map((props) => props.hour).take(1);
    const hour$ = xs.merge(initialHour$, change$).remember();
    const isHoursActive$ = xs.merge(
            hour$.mapTo(true), day$.mapTo(false),
            initialHour$.map((a) => !!a))
        .remember();
    const state$ = xs.combine(hours$, hour$, scale$,
            day$, isHoursActive$)
        .remember()
        .map(([hours, hour, scale, day, isHoursActive]) =>
            ({hours, hour, scale, day, isHoursActive})
        );
    return {state$, hour$, isHoursActive$};
};
