// ============================================================
// PARODIUS ENGINE — Assets, Audio, Entities, Systems
// ============================================================

// ---- Utility: procedural texture helper ----
function makeTex(scene, key, w, h, fn) {
    const c = scene.textures.createCanvas(key, w, h);
    const ctx = c.getContext();
    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    fn(ctx, w, h);
    c.refresh();
    return key;
}

// ---- Utility: glow helper ----
function drawGlow(ctx, x, y, r, hue, alpha) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowColor = `hsla(${hue},70%,50%,${alpha * 0.5})`;
    ctx.shadowBlur = r * 0.4;
    ctx.fillStyle = `hsla(${hue},60%,55%,${alpha * 0.2})`;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// ============================================================
// ASSET GENERATION
// ============================================================
function generateAssets(scene) {
    // ---- Player ships — 4 angular metallic spacecraft ----
    CHARACTERS.forEach(ch => {
        makeTex(scene, ch.id, 64, 40, (ctx, w, h) => {
            const my = h / 2;
            // Engine glow (blue-white)
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = 'hsla(210,80%,70%,0.4)';
            ctx.shadowColor = 'hsla(210,80%,70%,0.5)';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.ellipse(6, my, 5, h * 0.14, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Hull — angular paths per bodyStyle
            ctx.beginPath();
            if (ch.bodyStyle === 'sleekFighter') {
                // Classic Vic Viper delta with fork prongs
                ctx.moveTo(4, my);
                ctx.lineTo(w * 0.35, h * 0.15);
                ctx.lineTo(w * 0.55, h * 0.22);
                ctx.lineTo(w * 0.92, h * 0.12);  // top prong
                ctx.lineTo(w * 0.72, h * 0.35);
                ctx.lineTo(w * 0.92, my);          // nose tip
                ctx.lineTo(w * 0.72, h * 0.65);
                ctx.lineTo(w * 0.92, h * 0.88);  // bottom prong
                ctx.lineTo(w * 0.55, h * 0.78);
                ctx.lineTo(w * 0.35, h * 0.85);
                ctx.lineTo(4, my);
            } else if (ch.bodyStyle === 'spreadWing') {
                // Wider wingspan, broader hull, boxy rear
                ctx.moveTo(8, h * 0.3);
                ctx.lineTo(8, h * 0.7);
                ctx.lineTo(w * 0.2, h * 0.85);
                ctx.lineTo(w * 0.35, h * 0.92);
                ctx.lineTo(w * 0.5, h * 0.7);
                ctx.lineTo(w * 0.85, h * 0.55);
                ctx.lineTo(w * 0.92, my);
                ctx.lineTo(w * 0.85, h * 0.45);
                ctx.lineTo(w * 0.5, h * 0.3);
                ctx.lineTo(w * 0.35, h * 0.08);
                ctx.lineTo(w * 0.2, h * 0.15);
                ctx.lineTo(8, h * 0.3);
            } else if (ch.bodyStyle === 'armorPiercer') {
                // Aggressive forward-jutting nose, compact wings
                ctx.moveTo(6, my);
                ctx.lineTo(w * 0.15, h * 0.2);
                ctx.lineTo(w * 0.4, h * 0.15);
                ctx.lineTo(w * 0.55, h * 0.25);
                ctx.lineTo(w * 0.95, h * 0.4);
                ctx.lineTo(w * 0.95, h * 0.6);
                ctx.lineTo(w * 0.55, h * 0.75);
                ctx.lineTo(w * 0.4, h * 0.85);
                ctx.lineTo(w * 0.15, h * 0.8);
                ctx.lineTo(6, my);
            } else {
                // sweptWing — forward-swept wings
                ctx.moveTo(6, my);
                ctx.lineTo(w * 0.2, h * 0.35);
                ctx.lineTo(w * 0.55, h * 0.05);
                ctx.lineTo(w * 0.5, h * 0.35);
                ctx.lineTo(w * 0.9, h * 0.42);
                ctx.lineTo(w * 0.9, h * 0.58);
                ctx.lineTo(w * 0.5, h * 0.65);
                ctx.lineTo(w * 0.55, h * 0.95);
                ctx.lineTo(w * 0.2, h * 0.65);
                ctx.lineTo(6, my);
            }
            ctx.closePath();
            // Metallic silver-blue gradient (same for all ships)
            const hg = ctx.createLinearGradient(0, 0, 0, h);
            hg.addColorStop(0, '#d0dce8');
            hg.addColorStop(0.45, '#6080a0');
            hg.addColorStop(1, '#2a3544');
            ctx.fillStyle = hg;
            ctx.fill();
            ctx.strokeStyle = 'rgba(20,30,45,0.7)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // Panel detail lines
            ctx.strokeStyle = 'rgba(20,30,45,0.7)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(w * 0.3, my - 2);
            ctx.lineTo(w * 0.7, my - 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(w * 0.3, my + 2);
            ctx.lineTo(w * 0.7, my + 2);
            ctx.stroke();
            // Angular diamond cockpit (cyan tinted)
            ctx.beginPath();
            const ckX = w * 0.55, ckY = my;
            ctx.moveTo(ckX - 5, ckY);
            ctx.lineTo(ckX, ckY - 4);
            ctx.lineTo(ckX + 7, ckY);
            ctx.lineTo(ckX, ckY + 4);
            ctx.closePath();
            const cg = ctx.createLinearGradient(ckX - 5, ckY - 4, ckX + 7, ckY + 4);
            cg.addColorStop(0, 'rgba(150,230,255,0.9)');
            cg.addColorStop(1, 'rgba(60,140,180,0.8)');
            ctx.fillStyle = cg;
            ctx.fill();
        });
    });

    // ---- Bullets (cyan instead of yellow) ----
    makeTex(scene, 'bullet', 16, 6, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, 'rgba(100,220,255,0.3)');
        g.addColorStop(0.5, '#44ddff');
        g.addColorStop(1, '#aaeeff');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        drawGlow(ctx, w * 0.7, h / 2, 3, 195, 0.3);
    });

    makeTex(scene, 'bulletEnemy', 14, 14, (ctx, w, h) => {
        drawGlow(ctx, w/2, h/2, 6, 0, 0.25);
        const g = ctx.createRadialGradient(w/2 - 1, h/2 - 1, 1, w/2, h/2, 6);
        g.addColorStop(0, '#ff9999');
        g.addColorStop(0.4, '#dd3333');
        g.addColorStop(0.8, '#aa0000');
        g.addColorStop(1, 'rgba(150,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(w/2, h/2, 6, 0, Math.PI * 2);
        ctx.fill();
    });

    makeTex(scene, 'missile', 14, 8, (ctx, w, h) => {
        ctx.fillStyle = '#ff8844';
        ctx.beginPath();
        ctx.moveTo(0, h/2);
        ctx.lineTo(w * 0.7, 0);
        ctx.lineTo(w, h/2);
        ctx.lineTo(w * 0.7, h);
        ctx.closePath();
        ctx.fill();
        drawGlow(ctx, w * 0.3, h / 2, 5, 20, 0.5);
    });

    makeTex(scene, 'laser', 200, 8, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, 'rgba(100,220,255,0.1)');
        g.addColorStop(0.3, 'rgba(100,220,255,0.8)');
        g.addColorStop(0.7, '#aaeeff');
        g.addColorStop(1, '#ffffff');
        ctx.fillStyle = g;
        ctx.fillRect(0, h * 0.2, w, h * 0.6);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(0, h * 0.35, w, h * 0.3);
    });

    // ---- Option orb (orange/gold — authentic Gradius) ----
    makeTex(scene, 'option', 24, 24, (ctx, w, h) => {
        const cx = w/2, cy = h/2, r = 9;
        drawGlow(ctx, cx, cy, r + 3, 35, 0.3);
        const g = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, r);
        g.addColorStop(0, '#f8f0e0');
        g.addColorStop(0.3, '#ddb040');
        g.addColorStop(0.7, '#cc7700');
        g.addColorStop(1, '#994400');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
    });

    // ---- Power capsule (red with P — authentic Gradius) ----
    makeTex(scene, 'capsule', 28, 20, (ctx, w, h) => {
        drawGlow(ctx, w/2, h/2, 10, 0, 0.25);
        const cg = ctx.createLinearGradient(0, 0, 0, h);
        cg.addColorStop(0, '#ee4422');
        cg.addColorStop(0.5, '#cc3300');
        cg.addColorStop(1, '#881800');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.roundRect(3, 3, w - 6, h - 6, 6);
        ctx.fill();
        ctx.strokeStyle = '#ff8866';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('P', w/2, h/2 + 1);
    });

    // ---- Shield ----
    makeTex(scene, 'shield', 80, 50, (ctx, w, h) => {
        ctx.strokeStyle = 'rgba(100,200,255,0.7)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(100,200,255,0.8)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(w/2, h/2, w/2 - 4, h/2 - 4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(150,230,255,0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(w/2, h/2, w/2 - 8, h/2 - 8, 0, 0, Math.PI * 2);
        ctx.stroke();
    });

    // ---- Enemy sprites — mechanical vs organic ----
    Object.entries(ENEMIES).forEach(([key, def]) => {
        const s = def.size;
        const isOrganic = def.hue >= 140 && def.hue <= 320;
        for (let f = 0; f < 4; f++) {
            makeTex(scene, `${key}_${f}`, s + 16, s + 16, (ctx, w, h) => {
                const cx = w/2, cy = h/2;
                const t = f / 4;
                const pulse = 1 + Math.sin(t * Math.PI * 2) * 0.06;
                const r = s * 0.42 * pulse;

                if (isOrganic) {
                    // Organic style — rounded membrane, radial gradient, nucleus
                    drawGlow(ctx, cx, cy, r + 4, def.hue, 0.2);
                    ctx.beginPath();
                    ctx.arc(cx, cy, r, 0, Math.PI * 2);
                    ctx.closePath();
                    const g = ctx.createRadialGradient(cx - r*0.2, cy - r*0.2, r*0.1, cx, cy, r);
                    g.addColorStop(0, `hsl(${def.hue},40%,55%)`);
                    g.addColorStop(0.5, `hsl(${def.hue},35%,35%)`);
                    g.addColorStop(1, `hsla(${def.hue},30%,20%,0.3)`);
                    ctx.fillStyle = g;
                    ctx.fill();
                    // Internal nucleus (off-center bright dot)
                    const nx = cx - r * 0.15 + Math.sin(t * Math.PI * 2) * 2;
                    const ny = cy - r * 0.1;
                    ctx.fillStyle = `hsl(${def.hue},50%,65%)`;
                    ctx.beginPath();
                    ctx.arc(nx, ny, r * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Mechanical style — angular hexagonal frame
                    drawGlow(ctx, cx, cy, r + 4, def.hue, 0.15);
                    ctx.beginPath();
                    const sides = 6;
                    for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI * 2 / sides) {
                        const wobble = Math.sin(a * 3 + t * Math.PI * 6) * 2;
                        const rr = r + wobble;
                        const x = cx + Math.cos(a) * rr;
                        const y = cy + Math.sin(a) * rr;
                        if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    // Dark base with colored inner panel
                    const g = ctx.createRadialGradient(cx - r*0.2, cy - r*0.2, r*0.1, cx, cy, r);
                    g.addColorStop(0, `hsl(${def.hue},35%,45%)`);
                    g.addColorStop(0.4, '#1a1a2a');
                    g.addColorStop(1, '#0e0e1a');
                    ctx.fillStyle = g;
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(100,120,150,0.3)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    // Panel seam lines
                    ctx.strokeStyle = 'rgba(100,120,150,0.3)';
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(cx - r * 0.5, cy);
                    ctx.lineTo(cx + r * 0.5, cy);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - r * 0.5);
                    ctx.lineTo(cx, cy + r * 0.5);
                    ctx.stroke();
                    // Glowing sensor dot
                    const dotR = s * 0.08;
                    ctx.fillStyle = `hsl(${def.hue},60%,60%)`;
                    ctx.shadowColor = `hsl(${def.hue},60%,60%)`;
                    ctx.shadowBlur = 4;
                    ctx.beginPath();
                    ctx.arc(cx + r * 0.2, cy - r * 0.1, dotR, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });
        }
    });

    // ---- Boss sprites — rectangular Core warship design ----
    BOSSES.forEach(boss => {
        for (let f = 0; f < 4; f++) {
            makeTex(scene, `boss_${boss.id}_${f}`, boss.w + 40, boss.h + 40, (ctx, w, h) => {
                const cx = w/2, cy = h/2;
                const t = f / 4;
                const pulse = 1 + Math.sin(t * Math.PI * 2) * 0.04;
                const hw = boss.w * 0.48 * pulse;
                const hh = boss.h * 0.48 * pulse;

                // Dark rectangular hull
                ctx.beginPath();
                ctx.rect(cx - hw, cy - hh, hw * 2, hh * 2);
                const hullG = ctx.createLinearGradient(cx - hw, cy - hh, cx - hw, cy + hh);
                hullG.addColorStop(0, '#2a2a3a');
                hullG.addColorStop(0.3, '#1e1e2e');
                hullG.addColorStop(1, '#181825');
                ctx.fillStyle = hullG;
                ctx.fill();
                ctx.strokeStyle = 'rgba(60,80,100,0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Panel separation lines
                ctx.strokeStyle = 'rgba(60,80,100,0.4)';
                ctx.lineWidth = 1;
                // Horizontal lines
                ctx.beginPath();
                ctx.moveTo(cx - hw, cy - hh * 0.3);
                ctx.lineTo(cx + hw, cy - hh * 0.3);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(cx - hw, cy + hh * 0.3);
                ctx.lineTo(cx + hw, cy + hh * 0.3);
                ctx.stroke();
                // Vertical lines
                ctx.beginPath();
                ctx.moveTo(cx - hw * 0.4, cy - hh);
                ctx.lineTo(cx - hw * 0.4, cy + hh);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(cx + hw * 0.4, cy - hh);
                ctx.lineTo(cx + hw * 0.4, cy + hh);
                ctx.stroke();

                // Barrier plates (visual) — along edges
                const barrierCount = boss.barriers || 4;
                ctx.fillStyle = 'rgba(100,130,170,0.35)';
                ctx.strokeStyle = 'rgba(120,150,190,0.5)';
                ctx.lineWidth = 1;
                const plateW = hw * 0.35;
                const plateH = hh * 0.2;
                // Top barrier
                if (barrierCount >= 1) {
                    ctx.fillRect(cx - plateW/2, cy - hh - plateH * 0.6, plateW, plateH);
                    ctx.strokeRect(cx - plateW/2, cy - hh - plateH * 0.6, plateW, plateH);
                }
                // Bottom barrier
                if (barrierCount >= 2) {
                    ctx.fillRect(cx - plateW/2, cy + hh - plateH * 0.4, plateW, plateH);
                    ctx.strokeRect(cx - plateW/2, cy + hh - plateH * 0.4, plateW, plateH);
                }
                // Front-top barrier
                if (barrierCount >= 3) {
                    ctx.fillRect(cx + hw - plateH * 0.4, cy - hh * 0.5 - plateH/2, plateH, plateW);
                    ctx.strokeRect(cx + hw - plateH * 0.4, cy - hh * 0.5 - plateH/2, plateH, plateW);
                }
                // Front-bottom barrier
                if (barrierCount >= 4) {
                    ctx.fillRect(cx + hw - plateH * 0.4, cy + hh * 0.5 - plateH/2, plateH, plateW);
                    ctx.strokeRect(cx + hw - plateH * 0.4, cy + hh * 0.5 - plateH/2, plateH, plateW);
                }

                // Central core sphere
                const coreR = Math.min(hw, hh) * 0.35 * (1 + Math.sin(t * Math.PI * 2) * 0.1);
                const coreColorR = (boss.coreColor >> 16) & 0xff;
                const coreColorG = (boss.coreColor >> 8) & 0xff;
                const coreColorB = boss.coreColor & 0xff;
                const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
                cg.addColorStop(0, `rgba(255,255,255,0.9)`);
                cg.addColorStop(0.3, `rgba(${coreColorR},${coreColorG},${coreColorB},0.9)`);
                cg.addColorStop(0.7, `rgba(${coreColorR>>1},${coreColorG>>1},${coreColorB>>1},0.8)`);
                cg.addColorStop(1, `rgba(${coreColorR>>2},${coreColorG>>2},${coreColorB>>2},0.4)`);
                ctx.fillStyle = cg;
                ctx.beginPath();
                ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
                ctx.fill();
                // Core glow
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                ctx.shadowColor = `rgba(${coreColorR},${coreColorG},${coreColorB},0.6)`;
                ctx.shadowBlur = 12;
                ctx.fillStyle = `rgba(${coreColorR},${coreColorG},${coreColorB},0.15)`;
                ctx.beginPath();
                ctx.arc(cx, cy, coreR * 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }
    });

    // ---- Explosion frames ----
    for (let f = 0; f < 8; f++) {
        makeTex(scene, `explode_${f}`, 64, 64, (ctx, w, h) => {
            const cx = w/2, cy = h/2;
            const t = f / 8;
            const r = 10 + t * 22;
            const alpha = 1 - t * 0.8;
            // Outer flash
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = `hsla(${40 - t * 30},60%,${55 - t * 20}%,${alpha * 0.15})`;
            ctx.shadowColor = `hsla(${40 - t * 30},60%,50%,${alpha * 0.5})`;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            // Core
            const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            cg.addColorStop(0, `rgba(255,255,200,${alpha})`);
            cg.addColorStop(0.3, `rgba(255,180,50,${alpha * 0.8})`);
            cg.addColorStop(0.7, `rgba(255,80,20,${alpha * 0.5})`);
            cg.addColorStop(1, `rgba(100,20,0,0)`);
            ctx.fillStyle = cg;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
            // Sparks
            for (let i = 0; i < 6; i++) {
                const a = (i / 6) * Math.PI * 2 + t * 2;
                const sr = r * (0.8 + Math.random() * 0.6);
                ctx.fillStyle = `rgba(255,${200 + Math.random() * 55},100,${alpha * 0.7})`;
                ctx.beginPath();
                ctx.arc(cx + Math.cos(a) * sr, cy + Math.sin(a) * sr, 2 + Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    // ---- Particle / spark (cool blue/cyan tints) ----
    makeTex(scene, 'spark', 8, 8, (ctx, w, h) => {
        const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
        g.addColorStop(0, 'rgba(255,255,255,0.8)');
        g.addColorStop(0.5, 'rgba(100,180,220,0.4)');
        g.addColorStop(1, 'rgba(40,100,200,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
    });

    makeTex(scene, 'glow', 16, 16, (ctx, w, h) => {
        const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
        g.addColorStop(0, 'rgba(200,230,255,0.6)');
        g.addColorStop(0.4, 'rgba(120,170,230,0.2)');
        g.addColorStop(1, 'rgba(40,80,200,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
    });

    // ---- 1px white (for graphics fallbacks) ----
    makeTex(scene, 'pixel', 1, 1, (ctx) => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, 1, 1);
    });
}

// ============================================================
// AUDIO — Procedural Web Audio API
// ============================================================
class SFX {
    constructor() {
        this.ctx = null;
        this.master = null;
        this.ready = false;
        this.musicOscs = [];
    }
    init() {
        if (this.ready) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.master = this.ctx.createGain();
            this.master.gain.value = 0.25;
            this.master.connect(this.ctx.destination);
            this.ready = true;
        } catch(e) { console.warn('Audio unavailable:', e); }
    }
    resume() {
        if (this.ctx && this.ctx.state !== 'running') this.ctx.resume();
    }
    _osc(type, freq, dur, vol, freqEnd) {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, t);
        if (freqEnd) o.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 20), t + dur);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(Math.min(vol, 0.5), t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(this.master);
        o.start(t);
        o.stop(t + dur + 0.01);
    }
    shoot() {
        this._osc('sawtooth', 1200, 0.07, 0.15, 400);
    }
    laser() {
        this._osc('sawtooth', 1800, 0.12, 0.2, 200);
    }
    explosion() {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        const dur = 0.3;
        const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) {
            d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.2);
        }
        const src = this.ctx.createBufferSource();
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 800;
        const g = this.ctx.createGain();
        g.gain.value = 0.35;
        src.buffer = buf;
        src.playbackRate.setValueAtTime(1.0, t);
        src.playbackRate.exponentialRampToValueAtTime(0.5, t + dur);
        src.connect(lp).connect(g).connect(this.master);
        src.start(t);
    }
    bigExplosion() {
        if (!this.ready) return;
        const t = this.ctx.currentTime;
        const dur = 0.6;
        const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) {
            d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.8);
        }
        const src = this.ctx.createBufferSource();
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass'; lp.frequency.value = 600;
        const g = this.ctx.createGain();
        g.gain.value = 0.5;
        src.buffer = buf;
        src.playbackRate.setValueAtTime(0.8, t);
        src.playbackRate.exponentialRampToValueAtTime(0.3, t + dur);
        src.connect(lp).connect(g).connect(this.master);
        src.start(t);
    }
    powerUp() {
        if (!this.ready) return;
        [523, 659, 784].forEach((hz, i) => {
            setTimeout(() => this._osc('triangle', hz, 0.12, 0.18), i * 50);
        });
    }
    capsuleCollect() {
        if (!this.ready) return;
        [660, 880, 1100].forEach((hz, i) => {
            this._osc('sine', hz, 0.3, 0.12 / (i + 1));
        });
    }
    menuSelect() {
        this._osc('square', 660, 0.06, 0.12, 880);
    }
    menuMove() {
        this._osc('square', 440, 0.03, 0.08);
    }
    death() {
        if (!this.ready) return;
        this._osc('sawtooth', 400, 0.5, 0.25, 60);
        setTimeout(() => this.bigExplosion(), 100);
    }
    bossWarning() {
        if (!this.ready) return;
        for (let i = 0; i < 4; i++) {
            setTimeout(() => this._osc('square', 180, 0.2, 0.3, 140), i * 400);
        }
    }
    stageClear() {
        if (!this.ready) return;
        const notes = [523, 659, 784, 1047];
        notes.forEach((hz, i) => {
            setTimeout(() => this._osc('triangle', hz, 0.2, 0.2), i * 120);
        });
    }
    // ---- Procedural background music with Web Audio scheduling ----
    startMusic(bpm = 140, baseNote = 220, style = 'default') {
        if (!this.ready || !this.ctx || !this.master) return;
        this.stopMusic();

        const beatLen = 60 / bpm;
        const sixteenth = beatLen / 4;
        const scheduleAhead = 0.12;
        const schedulerTickMs = 25;
        const startAt = this.ctx.currentTime + 0.02;

        // Style bank — different moods per stage
        const styles = {
            default: {
                bass: [1, 1, 1.25, 1.5, 1, 1, 1.25, 1.33],
                mel: [2, 2.5, 3, 2.5, 2, 1.5, 2, 2.5],
                bassType: 'triangle', melType: 'square',
                bassGain: 0.055, melGain: 0.03,
                hatEvery: 1, hatGain: 0.016, kickGain: 0.22
            },
            chill: {
                bass: [1, 1, 1.125, 1.25, 1, 1, 1.125, 1.2],
                mel: [1.5, 2, 2.25, 2, 1.5, 1.33, 1.5, 2],
                bassType: 'sine', melType: 'triangle',
                bassGain: 0.05, melGain: 0.022,
                hatEvery: 2, hatGain: 0.01, kickGain: 0.18
            },
            tense: {
                bass: [1, 0.94, 1.125, 1.33, 1, 0.94, 1.125, 1.5],
                mel: [2, 2.25, 2.66, 2.25, 2, 1.78, 2, 2.25],
                bassType: 'sawtooth', melType: 'square',
                bassGain: 0.05, melGain: 0.028,
                hatEvery: 1, hatGain: 0.02, kickGain: 0.24
            },
            dark: {
                bass: [1, 0.89, 1.06, 1.19, 1, 0.89, 1.06, 1.33],
                mel: [2, 2.37, 2.83, 2.37, 2, 1.78, 2, 2.37],
                bassType: 'sawtooth', melType: 'sawtooth',
                bassGain: 0.045, melGain: 0.025,
                hatEvery: 1, hatGain: 0.018, kickGain: 0.2
            },
            industrial: {
                bass: [1, 1, 1.33, 1.5, 1, 1.06, 1.33, 1.78],
                mel: [2, 2.66, 3, 2.66, 2, 1.5, 2, 2.66],
                bassType: 'square', melType: 'sawtooth',
                bassGain: 0.04, melGain: 0.03,
                hatEvery: 1, hatGain: 0.022, kickGain: 0.26
            },
            ethereal: {
                bass: [1, 1.06, 1.19, 1.25, 1, 1.06, 1.19, 1.33],
                mel: [3, 3.56, 4, 3.56, 3, 2.67, 3, 3.56],
                bassType: 'sine', melType: 'sine',
                bassGain: 0.05, melGain: 0.02,
                hatEvery: 2, hatGain: 0.01, kickGain: 0.15
            },
            military: {
                bass: [1, 1, 1.25, 1.5, 1.25, 1, 1.5, 1.33],
                mel: [2, 2.5, 3, 3.5, 3, 2.5, 2, 2.5],
                bassType: 'triangle', melType: 'square',
                bassGain: 0.05, melGain: 0.032,
                hatEvery: 1, hatGain: 0.02, kickGain: 0.25
            }
        };
        const cfg = styles[style] || styles.default;

        // Noise buffer for percussion
        const noiseLen = Math.floor(this.ctx.sampleRate * 0.25);
        const noiseBuf = this.ctx.createBuffer(1, noiseLen, this.ctx.sampleRate);
        const noiseData = noiseBuf.getChannelData(0);
        for (let i = 0; i < noiseLen; i++) noiseData[i] = Math.random() * 2 - 1;
        this._musicNoiseBuffer = noiseBuf;

        const schedBass = (t, freq) => {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = cfg.bassType;
            o.frequency.setValueAtTime(freq, t);
            g.gain.setValueAtTime(cfg.bassGain, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + beatLen * 0.8);
            o.connect(g).connect(this.master);
            o.start(t); o.stop(t + beatLen);
        };
        const schedMel = (t, freq) => {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = cfg.melType;
            o.frequency.setValueAtTime(freq, t);
            g.gain.setValueAtTime(cfg.melGain, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + beatLen * 0.55);
            o.connect(g).connect(this.master);
            o.start(t); o.stop(t + beatLen * 0.7);
        };
        const schedKick = (t) => {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(140, t);
            o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
            g.gain.setValueAtTime(cfg.kickGain, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
            o.connect(g).connect(this.master);
            o.start(t); o.stop(t + 0.15);
        };
        const schedHat = (t, open) => {
            const src = this.ctx.createBufferSource();
            src.buffer = noiseBuf;
            const hp = this.ctx.createBiquadFilter();
            hp.type = 'highpass';
            hp.frequency.setValueAtTime(open ? 5000 : 7000, t);
            const g = this.ctx.createGain();
            g.gain.setValueAtTime(cfg.hatGain, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + (open ? 0.09 : 0.03));
            src.connect(hp).connect(g).connect(this.master);
            src.start(t); src.stop(t + (open ? 0.1 : 0.04));
        };

        // Transport state
        this._musicState = {
            beatLen, sixteenth, step16: 0,
            nextNoteTime: startAt, running: true
        };

        const scheduler = () => {
            const s = this._musicState;
            if (!s || !s.running) return;
            while (s.nextNoteTime < this.ctx.currentTime + scheduleAhead) {
                const step16 = s.step16;
                const beatStep = Math.floor(step16 / 4) % 8;
                // Kick on quarter notes
                if (step16 % 4 === 0) schedKick(s.nextNoteTime);
                if (style === 'tense' && step16 % 8 === 6) schedKick(s.nextNoteTime);
                // Hi-hat
                if (step16 % cfg.hatEvery === 0) {
                    schedHat(s.nextNoteTime, step16 % 16 === 12);
                }
                // Bass + melody on quarter notes
                if (step16 % 4 === 0) {
                    schedBass(s.nextNoteTime, baseNote * cfg.bass[beatStep]);
                    const melRatio = cfg.mel[beatStep] * ((step16 % 32 === 28) ? 0.5 : 1);
                    schedMel(s.nextNoteTime, baseNote * melRatio);
                }
                s.nextNoteTime += s.sixteenth;
                s.step16++;
            }
        };

        this._musicInterval = setInterval(scheduler, schedulerTickMs);
        const rafLoop = () => {
            const s = this._musicState;
            if (!s || !s.running) return;
            scheduler();
            this._musicRaf = requestAnimationFrame(rafLoop);
        };
        this._musicRaf = requestAnimationFrame(rafLoop);
    }
    stopMusic() {
        if (this._musicInterval) { clearInterval(this._musicInterval); this._musicInterval = null; }
        if (this._musicRaf) { cancelAnimationFrame(this._musicRaf); this._musicRaf = null; }
        if (this._musicState) { this._musicState.running = false; this._musicState = null; }
        this._musicNoiseBuffer = null;
    }
}

const sfx = new SFX();

// ============================================================
// TRAIL BUFFER — for Option following
// ============================================================
class TrailBuffer {
    constructor(size = 4096) {
        this.size = size;
        this.x = new Float32Array(size);
        this.y = new Float32Array(size);
        this.head = 0;
        this.count = 0;
    }
    push(x, y) {
        this.x[this.head] = x;
        this.y[this.head] = y;
        this.head = (this.head + 1) % this.size;
        this.count = Math.min(this.count + 1, this.size);
    }
    sample(delay) {
        if (this.count <= delay) return null;
        let idx = this.head - 1 - delay;
        while (idx < 0) idx += this.size;
        return { x: this.x[idx], y: this.y[idx] };
    }
}

// ============================================================
// POWER BAR — The Gradius signature mechanic
// ============================================================
class PowerBar {
    constructor() {
        this.cursor = 0;
        this.speedLevel = 0;
        this.hasMissile = false;
        this.hasDouble = false;
        this.hasLaser = false;
        this.optionCount = 0;
        this.hasShield = false;
        this.shieldHP = 0;
    }
    advance() {
        this.cursor = (this.cursor + 1) % CFG.POWER_SLOTS.length;
    }
    activate() {
        const slot = CFG.POWER_SLOTS[this.cursor];
        let activated = false;
        switch (slot) {
            case 'SPEED UP':
                if (this.speedLevel < CFG.SPEED_LEVELS) {
                    this.speedLevel++;
                    activated = true;
                }
                break;
            case 'MISSILE':
                if (!this.hasMissile) {
                    this.hasMissile = true;
                    activated = true;
                }
                break;
            case 'DOUBLE':
                if (!this.hasDouble) {
                    this.hasDouble = true;
                    this.hasLaser = false;
                    activated = true;
                }
                break;
            case 'LASER':
                if (!this.hasLaser) {
                    this.hasLaser = true;
                    this.hasDouble = false;
                    activated = true;
                }
                break;
            case 'OPTION':
                if (this.optionCount < CFG.MAX_OPTIONS) {
                    this.optionCount++;
                    activated = true;
                }
                break;
            case 'SHIELD':
                if (!this.hasShield) {
                    this.hasShield = true;
                    this.shieldHP = 3;
                    activated = true;
                }
                break;
        }
        if (activated) {
            this.cursor = 0;
        }
        return activated;
    }
    reset() {
        this.cursor = 0;
        this.speedLevel = 0;
        this.hasMissile = false;
        this.hasDouble = false;
        this.hasLaser = false;
        this.optionCount = 0;
        this.hasShield = false;
        this.shieldHP = 0;
    }
    getSpeed() {
        return CFG.PLAYER_SPEED + this.speedLevel * 40;
    }
}

// ============================================================
// BLOOM POST-FX PIPELINE
// ============================================================
class BloomPostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game,
            name: 'BloomPostFX',
            fragShader: `
precision mediump float;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
uniform vec2 uResolution;
uniform float uStrength;
uniform float uThreshold;
void main() {
    vec2 uv = outTexCoord;
    vec4 base = texture2D(uMainSampler, uv);
    vec3 sum = vec3(0.0);
    float total = 0.0;
    for (int x = -3; x <= 3; x++) {
        for (int y = -3; y <= 3; y++) {
            vec2 o = vec2(float(x), float(y)) / uResolution;
            vec3 c = texture2D(uMainSampler, uv + o).rgb;
            float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
            float w = max(l - uThreshold, 0.0);
            sum += c * w;
            total += w;
        }
    }
    vec3 bloom = total > 0.0 ? sum / total : vec3(0.0);
    gl_FragColor = vec4(base.rgb + bloom * uStrength, base.a);
}
            `
        });
    }
    onPreRender() {
        this.set2f('uResolution', this.renderer.width, this.renderer.height);
        this.set1f('uStrength', 0.22);
        this.set1f('uThreshold', 0.72);
    }
}
