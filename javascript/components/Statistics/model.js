import xs from 'xstream';

export default (day$, hour$, scale$, whichDay$, whichHour$) => {
    const whichStats$ = xs.merge(
        whichHour$.mapTo('hour'), whichDay$.mapTo('day')).remember();
    return xs.combine(day$, hour$, scale$, whichDay$, whichHour$, whichStats$)
        .remember()
        .map(([days, hours, scale, whichDay, whichHour, whichStats]) =>
            ({days, hours, scale, whichDay, whichHour, whichStats})
        );
};
