import xs from 'xstream';
import _ from 'underscore';

export default (hours$, hour$) =>
    xs.combine(hours$, hour$).remember()
        .map(([hours]) => {
            const currentHour = new Date().getHours() + 1;
            const current = _.find(hours, {hour: currentHour});
            return {condition: current.condition};
        });

