import _ from 'lodash';
import {ul, li, span} from '@cycle/dom';
import {getScaledTemperature} from '../../util/temperature';
import {getScaledTime} from '../../util/time';

export default (state$) =>
    state$.map((state) => {
        // Move these to appropriate place (model probs)
        const highTemp = _.maxBy(_.map(state.hours, 'temperature'), (t) => +t);
        const scaledHighTemp = getScaledTemperature(state.scale, highTemp);
        const lowTemp = _.minBy(_.map(state.hours, 'temperature'), (t) => +t);
        return ul('.HoursChart', _.map(_.filter(state.hours, {day: state.day}), (hourData) => {
            const scaledTemp = getScaledTemperature(state.scale, hourData.temperature);
            const presentationTime = getScaledTime(state.scale, hourData.hour, {hideMinutes: true});
            const presentationTemp = `${scaledTemp}°`;
            return li('.HoursChart-hour', [
                span('.HoursChart-bar .js-hour', {
                    class: {
                        'is-active': state.isHoursActive && state.hour === hourData.hour
                    },
                    style: {
                        height: `${scaledTemp / scaledHighTemp * 100}%`
                    },
                    attrs: {
                        'data-time': presentationTime,
                        'data-hour': hourData.hour,
                        'data-temp': presentationTemp
                    }
                })
            ]);
        }));
    });
