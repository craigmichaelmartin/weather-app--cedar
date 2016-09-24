// Return a condition in the set is-{snowy, rainy, clear, cloudy}
export default (condition) => {
    if (/snow/i.test(condition)) {
        return 'is-snowy';
    }
    if (/rain|thunderstorm|showers/i.test(condition)) {
        return 'is-rainy';
    }
    if (/clear|sunny/i.test(condition)) {
        return 'is-clear';
    }
    return 'is-cloudy';
};

