import _ from 'lodash';
import {div, span, img} from '@cycle/dom';
import {getScaledTemperatureDegree} from '../../util/temperature';

export default (state$) =>
    state$.map((state) =>
        div(_.map(state.days, (dayData) =>
            div('.col-lg-1 .col-md-2', [
                div('.Day .js-day .row', {
                    class: {
                        'is-active': state.day === dayData.day
                    },
                    attrs: {
                        'data-day': dayData.day
                    }
                }, [
                    div('.col-md-10 .col-xs-3', [
                        div('.Day-label', dayData.weekdayShort)
                    ]),
                    div('.col-md-10 .col-xs-3', [
                        img('.Day-image', {attrs: {src: dayData.iconUrl}})
                    ]),
                    div('.col-md-5 .col-xs-2', [
                        span('.Day-temperature .Day-temperature--high .js-dayHighTemperature',
                            getScaledTemperatureDegree(state.scale, dayData.high)
                        )
                    ]),
                    div('.col-md-5 .col-xs-2', [
                        span('.Day-temperature .day-temperature--low .js-dayLowTemperature',
                            getScaledTemperatureDegree(state.scale, dayData.low)
                        )
                    ])
                ])
            ])
        ))
    );
