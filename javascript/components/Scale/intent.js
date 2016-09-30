export default (DOMSource) =>
    DOMSource.select('.js-scale').events('click')
        .map((ev) => ev.currentTarget.dataset.value);
