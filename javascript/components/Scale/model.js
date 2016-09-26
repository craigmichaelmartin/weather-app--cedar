import xs from 'xstream';

export default (newValue$, props$) => {
    const initialValue$ = props$.map((props) => ({scale: props.scale})).take(1);
    return xs.merge(initialValue$, newValue$).remember();
};
