import _ from 'underscore';

// Return raw http body mapped to desired days object
export default (results) =>
    _.mapObject({
        condition: results.conditions,
        iconUrl: results.icon_url,
        iconAlt: results.icon,
        high: results.high.fahrenheit,
        low: results.low.fahrenheit,
        monthname: results.date.monthname,
        weekday: results.date.weekday,
        weekdayShort: results.date.weekday_short,
        day: +results.date.day,
        totalSnow: results.snow_allday.in,
        averageHumidity: results.avehumidity,
        averageWindDirection: results.avewind.dir,
        averageWind: results.avewind.mph,
        precipitation: results.qpf_allday.in
    }, (val) => {
        if (val === '-9999' || val === '-999') {
            return void 0;
        }
        return val;
    });
