import _ from 'lodash';

const isValidZip = (zip) => {
    const zipAsNum = +zip;
    return !!(zip && _.isNumber(zipAsNum) && !_.isNaN(zipAsNum)
        && zipAsNum > 0 && zipAsNum.toString().length === 5);
};

export {
    isValidZip
};
