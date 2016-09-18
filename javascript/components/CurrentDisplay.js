import xs from 'xstream';
import _ from 'lodash';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {getScaledTemperatureDegreeUnit} from '../util/temperature';

const intent = function({HTTPSource}) {
    return HTTPSource;
    // return HTTPSource.select('hour').flatten()
    //     .map((res) => {
    //         return res.body.hourly_forecast;
    //     }).remember();
};

const model = function(hour$, scale$, whichHour$) {
    const combine$ = xs.combine(hour$, scale$, whichHour$).remember()
        .map(([hours, scale, whichHour]) => {
            return {hours, scale, whichHour};
        });
    return combine$;
};

const view = function(state$) {
    return state$.map((state) => {
        const current = _.find(state.hours, {hour: state.whichHour});
        return div('.CurrentDisplay', [
            div('.CurrentDisplay-conditions',
                `${getScaledTemperatureDegreeUnit(state.scale.scale, current.temperature)} ${current.condition}`)
        ]);
    });
};

const CurrentDisplay = function(sources) {
    const change$ = intent({HTTPSource: sources.HTTP});
    const state$ = model(change$, sources.scaleState, sources.whichHour);
    const vtree$ = view(state$);
    return {
        DOM: vtree$
    };
};

const IsolatedCurrentDisplay = function (sources) {
    return isolate(CurrentDisplay)(sources);
};

export default IsolatedCurrentDisplay;
