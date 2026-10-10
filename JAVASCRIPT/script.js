const majorEl = document.getElementById("typing-major");
const facultyEl = document.getElementById("typing-faculty");

const majorText = "สาขาวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์";
const facultyText = "คณะวิศวกรรมศาสตร์และเทคโนโลยี";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";

function renderColor(str, splitIdx) {
    if (str.length <= splitIdx) {
        return '<span class="prefix-color">' + str + '</span>';
    } else {
        let prefix = str.substring(0, splitIdx);
        let mainText = str.substring(splitIdx);
        return '<span class="prefix-color">' + prefix + '</span><span class="main-color">' + mainText + '</span>';
    }
}

async function typeAndScramble(element, text, splitIdx) {
    let currentText = "";
    for (let i = 0; i < text.length; i++) {
        let scrambleTurns = 3; 
        for (let j = 0; j < scrambleTurns; j++) {
            let randomChar = chars[Math.floor(Math.random() * chars.length)];
            let tempText = currentText + randomChar;
            element.innerHTML = renderColor(tempText, splitIdx) + '<span class="cursor">|</span>';
            await new Promise(r => setTimeout(r, 25));
        }
        currentText += text[i];
        element.innerHTML = renderColor(currentText, splitIdx) + '<span class="cursor">|</span>';
        await new Promise(r => setTimeout(r, 30));
    }
    element.innerHTML = renderColor(currentText, splitIdx); 
}

async function startLoop() {
    while (true) {
        majorEl.innerHTML = "";
        facultyEl.innerHTML = "";
        await new Promise(r => setTimeout(r, 500));
        await typeAndScramble(majorEl, majorText, 4);
        await new Promise(r => setTimeout(r, 300));
        await typeAndScramble(facultyEl, facultyText, 3);
        await new Promise(r => setTimeout(r, 4000));
    }
}

window.addEventListener('load', startLoop);

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let maxParticles = window.innerWidth < 768 ? 25 : 80;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class NeuralParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 234, 141, ${this.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new NeuralParticle());
    }
}
initParticles();

function connectParticles() {
    const maxDistance = window.innerWidth < 768 ? 75 : 120;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacity = (1 - (distance / maxDistance)) * 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(88, 166, 255, ${opacity})`; 
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();

    requestAnimationFrame(animate);
}

window.addEventListener('load', () => {
    animate();
});
