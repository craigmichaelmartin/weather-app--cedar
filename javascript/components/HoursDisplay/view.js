import _ from 'lodash';
import {ul, li, span} from '@cycle/dom';
import {getScaledTemperature} from '../../util/temperature';
import {getScaledTime} from '../../util/time';

export default (state$) =>
    state$.map((state) => {
        // Move these to appropriate place (model probs)
        const highTemp = _.maxBy(_.map(state.hours, 'temperature'), (t) => +t);
        const scaledHighTemp = getScaledTemperature(state.scale.scale, highTemp);
        const lowTemp = _.minBy(_.map(state.hours, 'temperature'), (t) => +t);
        return ul('.HoursChart', _.map(_.filter(state.hours, {day: state.whichDay}), (hour) => {
            const scaledTemp = getScaledTemperature(state.scale.scale, hour.temperature);
            const presentationTime = getScaledTime(state.scale.scale, hour.hour, {hideMinutes: true});
            const presentationTemp = `${scaledTemp}°`;
            return li('.HoursChart-hour', [
                span('.HoursChart-bar .js-hour', {
                    class: {
                        'is-active': state.hoursActive && state.whichHour === hour.hour
                    },
                    style: {
                        height: `${scaledTemp / scaledHighTemp * 100}%`
                    },
                    attrs: {
                        'data-time': presentationTime,
                        'data-hour': hour.hour,
                        'data-temp': presentationTemp
                    }
                })
            ]);
        }));
    });
