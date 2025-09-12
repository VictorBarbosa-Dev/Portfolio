export default class Particles {

    constructor(canvas, userConfig = {}) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        const defaultConfig = {
            particles: {
                num: 200,
                radius: 3,
                connectDistance: 120,
                maxSpeed: 1.5,
                decelerationTime: 1.5,
                particleRepulsionForce: 0.2,
                particleRepulsionRadius: 50,
                neonSaturation: 100,
                neonLightness: 0,
                colorCycleTime: 6
            },
            mouse: {
                x: null,
                y: null,
                active: false,
                attractionForce: 0.2,
                repulsionForce: 0.2,
                attractionRadius: 200,
                repulsionRadius: 80,
                boostSpeed: 3.0
            }
        };

        this.config = this._mergeConfig(defaultConfig, userConfig);
        this._resizeCanvas();
        window.addEventListener("resize", () => this._resizeCanvas());

        this.particles = Array.from({ length: this.config.particles.num }, () => ({

            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.config.particles.maxSpeed,
            vy: (Math.random() - 0.5) * this.config.particles.maxSpeed,
            huePhase: Math.random() * 360,
            boost: false,
            decelTimer: 1
        }));

        this.connectDist = this.config.particles.connectDistance ** 2;
        this.mouseAttractRadius = this.config.mouse.attractionRadius ** 2;
        this.mouseRepulseRadius = this.config.mouse.repulsionRadius ** 2;
        this.particleRepulseRadius = this.config.particles.particleRepulsionRadius ** 2;

        this.lastTime = performance.now();

        this._setupEvents();
    }

    _mergeConfig(defaultConfig, userConfig) {

        return {
            particles: { ...defaultConfig.particles, ...(userConfig.particles || {}) },
            mouse: { ...defaultConfig.mouse, ...(userConfig.mouse || {}) }
        };
    }

    _setupEvents() {

        document.addEventListener("mousemove", e => {
            this.config.mouse.x = e.clientX;
            this.config.mouse.y = e.clientY;
            this.config.mouse.active = true;
        });

        document.addEventListener("mouseleave", () => {
            this.config.mouse.active = false;
        });
    }

    _resizeCanvas() {

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    _getNeonColor(h) {
        return `hsl(${h},${this.config.particles.neonSaturation}%,${this.config.particles.neonLightness}%)`;
    }

    _limitSpeed(p, max) {

        const v2 = p.vx ** 2 + p.vy ** 2;

        if (v2 > max ** 2) {
            const f = max / Math.sqrt(v2);
            p.vx *= f;
            p.vy *= f;
        }
    }

    _mixColors(h1, h2) {

        const d = ((h2 - h1 + 360 + 180) % 360) - 180;
        return `hsl(${(h1 + d / 2 + 360) % 360}, ${this.config.particles.neonSaturation}%, ${this.config.particles.neonLightness}%)`;
    }

    animate(time = performance.now()) {

        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particles.length; i++) {

            const p = this.particles[i];
            p.boost = false;

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            if (this.config.mouse.active) {

                const dx = this.config.mouse.x - p.x;
                const dy = this.config.mouse.y - p.y;
                const d2 = dx ** 2 + dy ** 2;

                if (d2 < this.mouseAttractRadius && d2 > this.mouseRepulseRadius) {

                    const d = Math.sqrt(d2);
                    const f = this.config.mouse.attractionForce * (1 - d / this.config.mouse.attractionRadius);
                    p.vx += dx * f;
                    p.vy += dy * f;
                    p.boost = true;
                    p.decelTimer = 0;

                } else if (d2 < this.mouseRepulseRadius) {

                    const d = Math.sqrt(d2);
                    const f = this.config.mouse.repulsionForce * (1 - d / this.config.mouse.repulsionRadius);
                    p.vx -= dx * f;
                    p.vy -= dy * f;
                    p.boost = true;
                    p.decelTimer = 0;
                }
            }

            for (let j = i + 1; j < this.particles.length; j++) {

                const q = this.particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const d2 = dx ** 2 + dy ** 2;
                if (d2 < this.particleRepulseRadius && d2 > 0) {
                    const d = Math.sqrt(d2);
                    const f = this.config.particles.particleRepulsionForce * (1 - d / this.config.particles.particleRepulsionRadius);
                    const fx = dx / d * f;
                    const fy = dy / d * f;
                    p.vx += fx;
                    p.vy += fy;
                    q.vx -= fx;
                    q.vy -= fy;
                    p.boost = true; q.boost = true;
                    p.decelTimer = 0; q.decelTimer = 0;
                }
            }

            if (p.boost) this._limitSpeed(p, this.config.mouse.boostSpeed);
            else {

                if (p.decelTimer < this.config.particles.decelerationTime) {

                    const t = dt / this.config.particles.decelerationTime;
                    p.vx *= 1 - t;
                    p.vy *= 1 - t;
                    p.decelTimer += dt;
                }

                this._limitSpeed(p, this.config.particles.maxSpeed);
            }

            p.huePhase = (p.huePhase + 360 / this.config.particles.colorCycleTime * dt) % 360;
        }

        for (let i = 0; i < this.particles.length; i++) {

            const p = this.particles[i];
            let connected = false;

            for (let j = i + 1; j < this.particles.length; j++) {
            
                const q = this.particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const d2 = dx ** 2 + dy ** 2;

                if (d2 < this.connectDist) {
            
                    connected = true;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = this._mixColors(p.huePhase, q.huePhase);
                    ctx.globalAlpha = 1 - d2 / this.connectDist;
                    ctx.stroke();
                }
            }

            if (connected) {
            
                ctx.beginPath();
                ctx.arc(p.x, p.y, this.config.particles.radius, 0, Math.PI * 2);
                ctx.fillStyle = this._getNeonColor(p.huePhase);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(this.animate.bind(this));
    }
}