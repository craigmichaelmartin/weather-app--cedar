export default ({DOMSource}) =>
    DOMSource.select('.js-day').events('click')
        .map((ev) => +ev.currentTarget.dataset.day);
