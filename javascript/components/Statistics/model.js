import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';

export default (day$, hour$, scale$, whichDay$, whichHour$, isHoursActive$) => {
    const bothWhich$ = xs.combine(whichHour$, whichDay$).remember()
        .map(([whichHour, whichDay]) => ({whichHour, whichDay}));
    const whichAndActive$ = bothWhich$.compose(sampleCombine(isHoursActive$))
        .map(([{whichDay, whichHour}, isHoursActive]) =>
            ({whichDay, whichHour, isHoursActive})
        );
    return xs.combine(whichAndActive$, day$, hour$, scale$)
        .remember()
        .map(([{whichDay, whichHour, isHoursActive}, days, hours, scale]) =>
            ({isHoursActive, whichHour, whichDay, days, hours, scale})
        );
};
