import _ from 'lodash';
import {div} from '@cycle/dom';
import {getScaledTemperatureDegreeUnit} from '../../util/temperature';

export default (state$) =>
    state$.map((state) => {
        const current = _.find(state.hours, {hour: state.currentHour});
        return div('.CurrentDisplay', [
            div('.CurrentDisplay-conditions',
                `${getScaledTemperatureDegreeUnit(state.scale, current.temperature)} ${current.condition}`)
        ]);
    });
