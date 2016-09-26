import xs from 'xstream';

export default (hour$, scale$) =>
    xs.combine(hour$, scale$).remember()
        .map(([hours, scale]) => {
            const currentHour = new Date().getHours() + 1;
            return {hours, scale, currentHour};
        });
