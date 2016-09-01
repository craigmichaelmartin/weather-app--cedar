import xs from 'xstream';
import {h2, div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import ScaleDropdown from './Scale';
import LocationInput from './Location';

const model = function(scaleDropdownValue$, locationInputCombine$) {
    return xs.combine(scaleDropdownValue$, locationInputCombine$)
        .map(([scaleState, locationStateCombine]) => {
            return {scaleState, locationStateCombine};
        });
};

const view = function(state$, scaleDropdownDOM, locationInputDOM) {
    return xs.combine(state$, scaleDropdownDOM, locationInputDOM)
        .map(([state, scaleVTree, locationVTree]) =>
            div([
                scaleVTree,
                h2(`Scale is ${state.scaleState.scale}`),
                locationVTree,
                h2(`Zip is ${state.locationStateCombine.zipTyping}`),
                h2(`ValidZip is ${state.locationStateCombine.validZip}`)
            ])
        );
};

const WeatherApp = function WeatherApp({DOM}) {
    const scaleProps$ = xs.of({
        initial: 'english'
    });
    const locationProps$ = xs.of({
        initial: {
            zip: '44024',
            editMode: false
        }
    });
    const scaleDropdown = ScaleDropdown({DOM, props$: scaleProps$});
    const locationInput = LocationInput({DOM, props$: locationProps$});
    const state$ = model(scaleDropdown.value, locationInput.stateObj.combine);
    const vtree$ = view(state$, scaleDropdown.DOM, locationInput.DOM);
    // const getWeather = locationInput.value
    return {
        DOM: vtree$
    };
};

const IsolatedWeatherApp = function (sources) {
    return isolate(WeatherApp)(sources);
};

export default IsolatedWeatherApp;
