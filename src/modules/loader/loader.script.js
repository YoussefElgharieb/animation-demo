import './loader.style.css';
import * as utils from '../utils.js';

import {animate, spring, stagger} from "motion";

const buildHTML = () => {
    const html = `<div class="loader">
        <div class="square-wrapper">
            <div class="square stack"></div>
        </div>
        <div class="square-wrapper">
            <div class="square stack"></div>
        </div>
        <div class="square-wrapper">
            <div class="square stack-bottom"></div>
        </div>
    </div>`

    return html;
}

const startLoaderAnimation = async () => {
    const loaderAnimationCleanUp = () => {
        const squares = document
            .querySelectorAll(".square");

        squares.forEach(square => {
            square.style.transform = "";
        });
    }

    const options = {
        duration: 0.1,
        type: spring,
        stiffness: 144,
        easing: "ease-in-out",
    }

    const squareDropOut = [
        ".stack-bottom",
        {
            y: 144,
            opacity: 0,
        },
        {
            delay: 1,
            opacity: {
                delay: 1 + options.duration * 2,
                duration: options.duration / 2,
            },
            y: options,
        }
    ]

    const stackShift = [
        ".stack",
        {
            y: 50,
        },
        options
    ];

    const squareDropIn = [
        ".stack-bottom",
        {
            y: [-100 - 233, -100],
            opacity: 1,
        },
        {
            ...options,
            duration: 0.01,
            stiffness: 55
        }
    ];

    const loaderAnimation = animate(
        [
            squareDropOut,
            stackShift,
            squareDropIn,
        ],
        {
            repeat: 2
        }
    );

    await loaderAnimation;

    loaderAnimationCleanUp();

    const loaderExitAnimation = animate(
        ".square",
        {
            y: "-100vh"
        },
        {
            delay: stagger(0.3),
            duration: 0.5,
            easing: "ease-in",
        }
    )

    await loaderExitAnimation;
}


export default async () => {
    const html = buildHTML()
    utils.addTo(html, "#app");

    await startLoaderAnimation();

    utils.remove(".loader")
}