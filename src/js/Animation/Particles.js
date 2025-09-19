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
                neonLightness: 50,
                colors: ["#7F0CC0", "#9F0FF0", "#FFFFFF"],
                colorCycle: true,
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
        ['mousemove', 'touchmove'].forEach(event => {
            document.addEventListener(event, e => {
                this.config.mouse.x = e.clientX ?? e.touches[0].clientX;
                this.config.mouse.y = e.clientY ?? e.touches[0].clientY;
                this.config.mouse.active = true;
            });
        });

        ['mouseleave', 'touchend'].forEach(event => {
            document.addEventListener(event, () => {
                this.config.mouse.active = false;
            });
        });
    }

    _resizeCanvas() {
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const area = this.canvas.width * this.canvas.height;
        const scale = Math.sqrt(area) / 1000; 

        this.config.particles.num = Math.floor(250 * scale);
        this.config.particles.radius = Math.max(2, 2.5 * scale);
        this.config.particles.connectDistance = Math.min(150, 100 * scale);
        
        this.config.mouse.repulsionRadius = 100 * scale;

        this.particles = Array.from(
            { length: this.config.particles.num },
            () => {
                
                const colorIndex = Math.floor(Math.random() * this.config.particles.colors.length);
                const nextColorIndex = (colorIndex + 1) % this.config.particles.colors.length;
                
                return {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * this.config.particles.maxSpeed,
                    vy: (Math.random() - 0.5) * this.config.particles.maxSpeed,
                    colorIndex,
                    nextColorIndex,
                    colorProgress: Math.random(),
                    boost: false,
                    decelTimer: 1
                };
            }
        );

        this.connectDist = this.config.particles.connectDistance ** 2;
        this.mouseAttractRadius = this.config.mouse.attractionRadius ** 2;
        this.mouseRepulseRadius = this.config.mouse.repulsionRadius ** 2;
        this.particleRepulseRadius = this.config.particles.particleRepulsionRadius ** 2;
    }

    _limitSpeed(p, max) {
        const v2 = p.vx ** 2 + p.vy ** 2;
        if (v2 > max ** 2) {
            const f = max / Math.sqrt(v2);
            p.vx *= f;
            p.vy *= f;
        }
    }

    _hexToRgb(hex) {
        hex = hex.replace("#", "");
        if (hex.length === 3) hex = hex.split("").map(x => x + x).join("");
        const num = parseInt(hex, 16);
        return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }

    _parseColor(c) {
        if (c.startsWith("#")) return this._hexToRgb(c);
        const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (m) return { r: +m[1], g: +m[2], b: +m[3] };
        return { r: 255, g: 255, b: 255 };
    }

    _mixColors(c1, c2) {
        const rgb1 = this._parseColor(c1);
        const rgb2 = this._parseColor(c2);
        const r = Math.round((rgb1.r + rgb2.r) / 2);
        const g = Math.round((rgb1.g + rgb2.g) / 2);
        const b = Math.round((rgb1.b + rgb2.b) / 2);
        return `rgb(${r},${g},${b})`;
    }

    _interpolateColors(c1, c2, t) {
        const rgb1 = this._parseColor(c1);
        const rgb2 = this._parseColor(c2);
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
        return `rgb(${r},${g},${b})`;
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
                    const f = this.config.particles.particleRepulsionForce *
                              (1 - d / this.config.particles.particleRepulsionRadius);
                    const fx = dx / d * f;
                    const fy = dy / d * f;

                    p.vx += fx;
                    p.vy += fy;
                    q.vx -= fx;
                    q.vy -= fy;

                    p.boost = true;
                    q.boost = true;

                    p.decelTimer = 0;
                    q.decelTimer = 0;
                }
            }

            if (p.boost) {
                this._limitSpeed(p, this.config.mouse.boostSpeed);
            } else {
                if (p.decelTimer < this.config.particles.decelerationTime) {
                    const t = dt / this.config.particles.decelerationTime;
                    p.vx *= 1 - t;
                    p.vy *= 1 - t;
                    p.decelTimer += dt;
                }
                this._limitSpeed(p, this.config.particles.maxSpeed);
            }

            if (this.config.particles.colorCycle) {
                p.colorProgress += dt / this.config.particles.colorCycleTime;
                if (p.colorProgress >= 1) {
                    p.colorProgress = 0;
                    p.colorIndex = p.nextColorIndex;
                    p.nextColorIndex = (p.nextColorIndex + 1) % this.config.particles.colors.length;
                }
            }
        }

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const colorP = this._interpolateColors(
                this.config.particles.colors[p.colorIndex],
                this.config.particles.colors[p.nextColorIndex],
                p.colorProgress
            );

            for (let j = i + 1; j < this.particles.length; j++) {
                const q = this.particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const d2 = dx ** 2 + dy ** 2;

                if (d2 < this.connectDist) {
                    const colorQ = this._interpolateColors(
                        this.config.particles.colors[q.colorIndex],
                        this.config.particles.colors[q.nextColorIndex],
                        q.colorProgress
                    );

                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = this._mixColors(colorP, colorQ);
                    ctx.globalAlpha = 1 - d2 / this.connectDist;
                    ctx.stroke();
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, this.config.particles.radius, 0, Math.PI * 2);
            ctx.fillStyle = colorP;
            ctx.globalAlpha = 1;
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(this.animate.bind(this));
    }
}
