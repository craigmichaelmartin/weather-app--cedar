import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';

export default (obj$, props$, autoZip$, weatherBack$) => {
    // Could I just use startWith and pass the value, instead of creating a
    // one value stream to pass in, mapping it, and taking the single value?
    const initialZipTyping$ = props$.map((props) => props.zip).take(1);
    const initialZipLegit$ = props$.map((props) => props.zip).take(1); // unclear why I can not reuse initialZipTyping$
    const initialMode$ = props$.map((props) => props.editMode).take(1);
    const validZip$ = obj$.zipTyping.filter((zip) => zip.length === 5)
        .compose(dropRepeats());
    const zipTyping$ = xs.merge(initialZipTyping$, obj$.zipTyping).remember();
    const zipLegit$ = xs.merge(initialZipLegit$, validZip$).remember();
    const editMode$ = xs.merge(
        initialMode$, obj$.displayClick, obj$.inputBlur, obj$.editIconClick,
        obj$.mapIconClick, obj$.cancelIconClick, obj$.zipFiveLetters
    ).remember();
    const isLoading$ = xs.merge(
        zipLegit$.mapTo(true),
        weatherBack$.mapTo(false)
    );
    const state$ = xs.combine(zipTyping$, zipLegit$, editMode$, autoZip$,
            isLoading$)
        .remember()
        .map(([zipTyping, validZip, editMode, autoZip, isLoading]) =>
            ({
                editMode, isLoading,
                zipTyping: zipTyping || autoZip,
                validZip: validZip || autoZip
            })
        );
    return {state$, zipTyping$, zipLegit$, editMode$};
};
