import xs from 'xstream';
import {h2, div} from '@cycle/dom';
import LabeledSlider from './LabeledSlider';
import ScaleDropdown from './Scale';
import LocationInput from './Location';

const model = function(weightSliderValue$, heightSliderValue$, scaleDropdownValue$, locationInputValue$) {
    return xs.combine(weightSliderValue$, heightSliderValue$, scaleDropdownValue$, locationInputValue$)
        .map(([weight, height, scaleState, locationState]) => {
            const heightMeters = height * 0.01;
            const bmi = Math.round(weight / (heightMeters * heightMeters));
            return {bmi, scaleState, locationState};
        });
};

const view = function(state$, weightSliderDOM, heightSliderDOM, scaleDropdownDOM, locationInputDOM) {
    return xs.combine(state$, weightSliderDOM, heightSliderDOM, scaleDropdownDOM, locationInputDOM)
        .map(([state, weightVTree, heightVTree, scaleVTree, locationVTree]) =>
            div([
                weightVTree,
                heightVTree,
                h2(`BMI is ${state.bmi}`),
                scaleVTree,
                h2(`Scale is ${state.scaleState.scale}`),
                locationVTree,
                h2(`Zip is ${state.locationState.zipTyping}`),
                h2(`ValidZip is ${state.locationState.validZip}`)
            ])
        );
};

const BmiCalculator = function BmiCalculator({DOM}) {
    const weightProps$ = xs.of({
        label: 'Weight', unit: 'kg', min: 40, initial: 70, max: 140
    });
    const heightProps$ = xs.of({
        label: 'Height', unit: 'cm', min: 140, initial: 170, max: 210
    });
    const scaleProps$ = xs.of({
        initial: 'english'
    });
    const locationProps$ = xs.of({
        initial: {
            zip: '44024',
            editMode: false
        }
    });
    const weightSlider = LabeledSlider({DOM, props$: weightProps$});
    const heightSlider = LabeledSlider({DOM, props$: heightProps$});
    const scaleDropdown = ScaleDropdown({DOM, props$: scaleProps$});
    const locationInput = LocationInput({DOM, props$: locationProps$});
    const bmiState$ = model(weightSlider.value, heightSlider.value, scaleDropdown.value, locationInput.value);
    const vtree$ = view(bmiState$, weightSlider.DOM, heightSlider.DOM, scaleDropdown.DOM, locationInput.DOM);
    return {
        DOM: vtree$
    };
};

export default BmiCalculator;
