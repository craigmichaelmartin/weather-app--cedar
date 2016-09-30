import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';

export default (days$, hours$, scale$, day$, hour$, isHoursActive$) => {
    const bothWhich$ = xs.combine(hour$, day$).remember()
        .map(([hour, day]) => ({hour, day}));
    const whichAndActive$ = bothWhich$.compose(sampleCombine(isHoursActive$))
        .map(([{day, hour}, isHoursActive]) =>
            ({day, hour, isHoursActive})
        );
    return xs.combine(whichAndActive$, days$, hours$, scale$)
        .remember()
        .map(([{day, hour, isHoursActive}, days, hours, scale]) =>
            ({isHoursActive, hour, day, days, hours, scale})
        );
};
