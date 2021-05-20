const loadImg = async () => {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = function() {
            const width = this.width;
            const height = this.height;

            const canvas = document.createElement("canvas");

            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);

            const context = canvas.getContext("2d");
            context.drawImage(this, 0, 0);

            const imageData = context.getImageData(0, 0, width, height);
            resolve(imageData);
        };
        img.crossOrigin = 'anonymous';
        img.src = 'https://raw.githubusercontent.com/hakatashi/icon/master/images/icon_480px.png';
        // img.src = '/icon.png';
    });
};

const {Engine, Render, Runner, Bodies, Composite} = Matter.Engine;

const engine = Engine.create();
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        background: 'white',
    },
});

const rgba2s = (r, g, b, a) => `#${[r, g, b].map(e => (e || 0).toString(16).padStart(2,'0')).join('')}`;

const putImage = (img) => {
    // create two boxes and a ground
    const boxes = [];
    for(let i=0; i<img.height; i+=5) {
        for(let j=0; j<img.width; j+=5) {
            const [r, g, b, a] = img.data.slice(4*(img.width*i + j), 4*(img.width*i + j) + 4);
            if(r === 0xFF && g === 0xFF && b === 0xFF) continue;
            const box = Bodies.rectangle(j, i, 7, 7, { render: { fillStyle: rgba2s(r, g, b, a), } });
            boxes.push(box);
        }
    }
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, render: {fillStyle: 'orange'}, });

    Composite.add(engine.world, [...boxes, ground]);

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);
};

(async () => {
    const img = await loadImg();
    putImage(img);
})()
