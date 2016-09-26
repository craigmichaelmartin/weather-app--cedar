import _ from 'lodash';
import {div, span, img} from '@cycle/dom';
import {getScaledTemperatureDegree} from '../../util/temperature';

export default (state$) =>
    state$.map((state) =>
        div(_.map(state.days, (day) =>
            div('.col-lg-1 .col-md-2', [
                div('.Day .js-day .row', {
                    class: {
                        'is-active': state.whichDay === day.day
                    },
                    attrs: {
                        'data-day': day.day
                    }
                }, [
                    div('.col-md-10 .col-xs-3', [
                        div('.Day-label', day.weekdayShort)
                    ]),
                    div('.col-md-10 .col-xs-3', [
                        img('.Day-image', {attrs: {src: day.iconUrl}})
                    ]),
                    div('.col-md-5 .col-xs-2', [
                        span('.Day-temperature .Day-temperature--high .js-dayHighTemperature',
                            getScaledTemperatureDegree(state.scale.scale, day.high)
                        )
                    ]),
                    div('.col-md-5 .col-xs-2', [
                        span('.Day-temperature .day-temperature--low .js-dayLowTemperature',
                            getScaledTemperatureDegree(state.scale.scale, day.low)
                        )
                    ])
                ])
            ])
        ))
    );
