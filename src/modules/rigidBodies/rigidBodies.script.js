import './rigidBodies.style.css';
import * as utils from '../utils.js';

import Matter from 'matter-js'
import { inView } from 'motion';

let Runner,
    runner,
    engine;


const buildHTML = () => {
    const html = `<div class="frame"></div>`
    return html;
}

const buildEngine = (selector) => {
    const element = document.querySelector(selector);

    Runner = Matter.Runner;

    const Engine = Matter.Engine,
        Events = Matter.Events,
        Render = Matter.Render,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        Bodies = Matter.Bodies,
        Vector = Matter.Vector;


    engine = Engine.create();

    const world = engine.world;

    const render = Render.create({
        element,
        engine,
        options: {
            width: element.offsetWidth,
            height: element.offsetHeight,
            wireframeStrokeStyle:  '#0cdcf7',
            wireframeBackground: 'transparent',
        }
    });

    Render.run(render);

    runner = Runner.create();


    const group = Body.nextGroup(true),
        length = 144,
        width = 25;

    const pendulum = Composites.stack(element.offsetWidth * 0.47, element.offsetHeight/2 , 2, 1, -20, 0, function(x, y) {
        return Bodies.rectangle(x, y, length, width, {
            collisionFilter: { group: group },
            frictionAir: 0,
            chamfer: 5,
            render: {
                fillStyle: 'transparent',
                lineWidth: 1
            }
        });
    });

    engine.gravity.scale = 0.002;

    Composites.chain(pendulum, 0.45, 0, -0.45, 0, {
        length: 0,
        render: {
            strokeStyle: '#4a485b'
        }
    });

    Composite.add(pendulum, Constraint.create({
        bodyB: pendulum.bodies[0],
        pointB: { x: -length * 0.42, y: 0 },
        pointA: { x: pendulum.bodies[0].position.x - length * 0.42, y: pendulum.bodies[0].position.y },
        stiffness: 0.9,
        length: 1,
        render: {
            strokeStyle: '#4a485b'
        }
    }));

    const lowerArm = pendulum.bodies[1];

    Body.rotate(lowerArm, -Math.PI * 0.3, {
        x: lowerArm.position.x - 50,
        y: lowerArm.position.y
    });

    Composite.add(world, pendulum);

    const trail = [];

    Events.on(render, 'afterRender', function() {
        const offset = length / 2 - 10;

        trail.unshift({
            position: Vector.clone(lowerArm.position),
            speed: lowerArm.speed,
            angle: lowerArm.angle,
        });

        Render.startViewTransform(render);
        render.context.globalAlpha = 0.7;

        for (let i = 0; i < trail.length; i += 1) {
            const point = trail[i].position,
                speed = trail[i].speed,
                angle = trail[i].angle;

            const hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
            render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';

            const dx = Math.cos(angle) * offset;
            const dy = Math.sin(angle) * offset;

            render.context.fillRect(point.x + dx, point.y + dy, 2, 2);
        }

        render.context.globalAlpha = 1;
        Render.endViewTransform(render);

        if (trail.length > 2000) {
            trail.pop();
        }
    });
}

const runEngine = () => {
    Runner.run(runner, engine);
}

export default () => {
    const html = buildHTML();
    utils.addTo(html, "#app");

    buildEngine('.frame');
    inView('.frame', runEngine, {amount: 0.75,});
}