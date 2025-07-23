import './message.style.css'
import * as utils from '../utils.js';
import {animate, scroll, stagger} from "motion";

const buildHTML = () => {
    const message = 'Heeeeey!'

    const wrapped = [...message].map(letter => `<span class="message-text-character">${letter}</span>`).join('');

    return `<div class="message">
        <div class="message-text-wrapper">
            <p class="message-text">${wrapped}</p>
        </div>
    </div>`;
}

const startMessageAnimation = async () => {
    const messageAnimation = animate(
        ".message-text-character",
        {opacity: [0,1]},
        {delay: stagger(0.1)},
    )

    await messageAnimation;
}




export default async () => {
    const html = buildHTML();
    utils.addTo(html, "#app");
    await startMessageAnimation();
}