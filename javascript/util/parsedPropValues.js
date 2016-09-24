import isNumeric from './isNumeric';
export default (pathname) => {
    const [, zip, day, hour, scale] = pathname.split('/');
    return {
        zip: +zip,
        day: +day || new Date().getDate(),
        hour: hour && isNumeric(hour) ? +hour : scale && isNumeric(scale) ? +scale : void 0,
        scale: scale ? scale : hour && !isNumeric(hour) ? hour : day && !isNumeric(day) ? day : 'english',
        editMode: false
    };
};
