import _ from 'lodash';
export default (pathname) => {
    const [, zip, day, hour, scale] = pathname.split('/');
    return {
        zip: +zip,
        day: +day || new Date().getDate(),
        hour: hour && _.isFinite(+hour) ? +hour : scale && _.isFinite(+scale) ? +scale : void 0,
        scale: scale ? scale : hour && !_.isFinite(+hour) ? hour : day && !_.isFinite(+day) ? day : 'english',
        editMode: false
    };
};
