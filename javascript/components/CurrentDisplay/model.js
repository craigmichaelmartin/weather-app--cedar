import xs from 'xstream';

export default ({hours$, scale$}) =>
    xs.combine(hours$, scale$).remember()
        .map(([hours, scale]) => {
            const currentHour = new Date().getHours() + 1;
            return {hours, scale, currentHour};
        });
