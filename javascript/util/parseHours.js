import _ from 'underscore';

// Return raw http body mapped to desired hours object
export default (results) =>
    _.mapObject({
        monthname: results.FCTTIME.month_name,
        weekday: results.FCTTIME.weekday_name,
        weekdayShort: results.FCTTIME.weekday_name_abbrev,
        day: +results.FCTTIME.mday,
        hour: +results.FCTTIME.hour, // 24 hour clock
        condition: results.condition,
        feelsLike: results.feelslike.english,
        humidity: results.humidity,
        iconUrl: results.icon_url,
        iconAlt: results.icon,
        temperature: results.temp.english,
        dewpoint: results.dewpoint.english,
        heatIndex: results.heatindex.english,
        windDirection: results.wdir.dir,
        windSpeed: results.wspd.english,
        precipitation: results.qpf.english
    }, (val) => {
        if (val === '-9999' || val === '-999') {
            return void 0;
        }
        return val;
    });
