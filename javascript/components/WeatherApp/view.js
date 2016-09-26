import xs from 'xstream';
import {div} from '@cycle/dom';
import getConditionClassName from '../../util/getConditionClassName';

export default (state$, scaleDropdownDOM, locationInputDOM, daysDisplayDOM,
                hoursDisplayDom, currentDisplayDom, statisticsDOM) =>
    xs.combine(state$, scaleDropdownDOM, locationInputDOM, daysDisplayDOM,
               hoursDisplayDom, currentDisplayDom, statisticsDOM)
        .map(([state, scaleVTree, locationVTree, daysVTree,
               hoursVTree, conditionsVTree, statisticsVTree]) =>
            div('.weatherApp', {
                class: {
                    [getConditionClassName(state.condition)]: true
                }
            }, [
                div('.container-fluid', [
                    div('.row', [
                        div('.col-xs-10', [
                            scaleVTree,
                            locationVTree
                        ])
                    ]),
                    div('.row', [
                        div('.col-xs-10', [
                            conditionsVTree
                        ])
                    ]),
                    div('.row .u-paddingBottom'),
                    daysVTree,
                    div('.row .u-paddingBottom'),
                    div('.row', [
                        div('.col-xl-3 .col-xl-push-7', [
                            statisticsVTree
                        ]),
                        div('.col-xl-7 .col-xl-pull-3', [
                            hoursVTree
                        ])
                    ])
                ])
            ])
        );
