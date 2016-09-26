import xs from 'xstream';
import _ from 'underscore';

export default (hourWeather$, whichHour$) =>
    xs.combine(hourWeather$, whichHour$).remember()
        .map(([hours]) => {
            const currentHour = new Date().getHours() + 1;
            const current = _.find(hours, {hour: currentHour});
            return {condition: current.condition};
        });

