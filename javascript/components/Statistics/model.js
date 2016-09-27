import xs from 'xstream';

export default (day$, hour$, scale$, whichDay$, whichHour$) => {
    const whichStatistics$ = xs.merge(
        whichHour$.mapTo('hour'), whichDay$.mapTo('day'));
    return xs.combine(whichHour$, whichStatistics$, whichDay$, day$,
            hour$, scale$)
        .remember()
        .map(([whichHour, whichStatistics, whichDay, days, hours, scale]) =>
            ({whichHour, whichStatistics, whichDay, days, hours, scale})
        );
};
