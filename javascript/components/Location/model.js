import xs from 'xstream';

export default (obj$, props$, autoZip$) => {
    // Could I just use startWith and pass the value, instead of creating a
    // one value stream to pass in, mapping it, and taking the single value?
    const initialZipTyping$ = props$.map((props) => props.zip).take(1);
    const initialZipLegit$ = props$.map((props) => props.zip).take(1); // unclear why I can not reuse initialZipTyping$
    const initialMode$ = props$.map((props) => props.editMode).take(1);
    const validZip$ = obj$.zipTyping.filter((zip) => zip.length === 5);
    const zipTyping$ = xs.merge(initialZipTyping$, obj$.zipTyping).remember();
    const zipLegit$ = xs.merge(initialZipLegit$, validZip$).remember();
    const editMode$ = xs.merge(
        initialMode$, obj$.displayClick, obj$.inputBlur, obj$.editIconClick,
        obj$.mapIconClick, obj$.cancelIconClick, obj$.zipFiveLetters
    ).remember();
    const combine$ = xs.combine(zipTyping$, zipLegit$, editMode$, autoZip$).remember()
        .map(([zipTyping, validZip, editMode, autoZip]) =>
            ({zipTyping: zipTyping || autoZip, validZip: validZip || autoZip, editMode})
        );
    return {
        combine: combine$,
        zipTyping: zipTyping$,
        zipLegit: zipLegit$,
        editMode: editMode$
    };
};
