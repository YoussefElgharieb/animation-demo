export const remove = (selector) => {
    document.querySelector(selector)?.remove();
}

export const addTo = (html, selector) => {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML('beforeend', html);
}