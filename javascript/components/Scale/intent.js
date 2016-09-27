export default (DOMSource) =>
    DOMSource.select('.js-scale').events('click')
        .map((ev) => ({scale: ev.currentTarget.dataset.value}));
