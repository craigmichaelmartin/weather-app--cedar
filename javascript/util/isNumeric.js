import _ from 'underscore';

export default (val) => !_.isNaN(+val) && _.isNumber(+val);
