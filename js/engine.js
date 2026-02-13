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

    // ---- Enemy sprites — detailed mechanical & organic ----
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
                    // Organic: membrane body with tendrils and internal structures
                    drawGlow(ctx, cx, cy, r + 6, def.hue, 0.25);

                    // Outer membrane (irregular edge)
                    ctx.beginPath();
                    for (let a = 0; a < Math.PI * 2; a += 0.15) {
                        const wobble = Math.sin(a * 5 + t * Math.PI * 4) * r * 0.08;
                        const rr = r + wobble;
                        const px = cx + Math.cos(a) * rr;
                        const py = cy + Math.sin(a) * rr;
                        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    const g = ctx.createRadialGradient(cx - r*0.2, cy - r*0.2, r*0.1, cx, cy, r);
                    g.addColorStop(0, `hsl(${def.hue},45%,55%)`);
                    g.addColorStop(0.4, `hsl(${def.hue},40%,38%)`);
                    g.addColorStop(0.8, `hsl(${def.hue},35%,22%)`);
                    g.addColorStop(1, `hsla(${def.hue},30%,15%,0.2)`);
                    ctx.fillStyle = g;
                    ctx.fill();
                    // Membrane edge highlight
                    ctx.strokeStyle = `hsla(${def.hue},50%,55%,0.3)`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Internal veins/structures
                    ctx.strokeStyle = `hsla(${def.hue},40%,45%,0.25)`;
                    ctx.lineWidth = 0.8;
                    for (let v = 0; v < 4; v++) {
                        const va = (v / 4) * Math.PI * 2 + t * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(cx, cy);
                        const vx = cx + Math.cos(va) * r * 0.75;
                        const vy = cy + Math.sin(va) * r * 0.75;
                        ctx.quadraticCurveTo(
                            cx + Math.cos(va + 0.4) * r * 0.4,
                            cy + Math.sin(va + 0.4) * r * 0.4,
                            vx, vy
                        );
                        ctx.stroke();
                    }

                    // Nucleus (pulsing, off-center)
                    const nx = cx - r * 0.12 + Math.sin(t * Math.PI * 2) * 2.5;
                    const ny = cy - r * 0.08 + Math.cos(t * Math.PI * 2) * 1.5;
                    const nR = r * 0.22 * (1 + Math.sin(t * Math.PI * 4) * 0.1);
                    const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, nR);
                    ng.addColorStop(0, `hsl(${def.hue},60%,75%)`);
                    ng.addColorStop(0.6, `hsl(${def.hue},50%,55%)`);
                    ng.addColorStop(1, `hsla(${def.hue},40%,35%,0)`);
                    ctx.fillStyle = ng;
                    ctx.beginPath();
                    ctx.arc(nx, ny, nR, 0, Math.PI * 2);
                    ctx.fill();

                    // Tendrils (wavy appendages)
                    if (s >= 34) {
                        ctx.strokeStyle = `hsla(${def.hue},45%,50%,0.35)`;
                        ctx.lineWidth = 1.2;
                        for (let td = 0; td < 3; td++) {
                            const ta = (td / 3) * Math.PI * 2 + Math.PI + t * 0.8;
                            ctx.beginPath();
                            ctx.moveTo(cx + Math.cos(ta) * r * 0.8, cy + Math.sin(ta) * r * 0.8);
                            const tipX = cx + Math.cos(ta) * r * 1.4 + Math.sin(t * Math.PI * 3 + td) * 3;
                            const tipY = cy + Math.sin(ta) * r * 1.4 + Math.cos(t * Math.PI * 3 + td) * 3;
                            ctx.quadraticCurveTo(
                                cx + Math.cos(ta + 0.3) * r * 1.1,
                                cy + Math.sin(ta + 0.3) * r * 1.1,
                                tipX, tipY
                            );
                            ctx.stroke();
                        }
                    }

                    // Tiny spore dots
                    for (let sp = 0; sp < 3; sp++) {
                        const sa = (sp / 3) * Math.PI * 2 + t * 2;
                        const sd = r * 0.55;
                        ctx.fillStyle = `hsla(${def.hue},50%,60%,0.4)`;
                        ctx.beginPath();
                        ctx.arc(cx + Math.cos(sa) * sd, cy + Math.sin(sa) * sd, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else {
                    // Mechanical: angular ship-like design with thrusters and details
                    drawGlow(ctx, cx, cy, r + 4, def.hue, 0.15);

                    // Main hull — pointed nose, angled body
                    ctx.beginPath();
                    ctx.moveTo(cx - r * 0.9, cy);                      // nose (left = front since enemies face left)
                    ctx.lineTo(cx - r * 0.3, cy - r * 0.6);           // top-front
                    ctx.lineTo(cx + r * 0.4, cy - r * 0.75);          // top wing tip
                    ctx.lineTo(cx + r * 0.8, cy - r * 0.4);           // top rear
                    ctx.lineTo(cx + r * 0.9, cy);                      // rear center
                    ctx.lineTo(cx + r * 0.8, cy + r * 0.4);           // bottom rear
                    ctx.lineTo(cx + r * 0.4, cy + r * 0.75);          // bottom wing tip
                    ctx.lineTo(cx - r * 0.3, cy + r * 0.6);           // bottom-front
                    ctx.closePath();
                    // Dark metallic gradient
                    const hg = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
                    hg.addColorStop(0, `hsl(${def.hue},25%,35%)`);
                    hg.addColorStop(0.3, '#1e1e2e');
                    hg.addColorStop(0.7, '#161622');
                    hg.addColorStop(1, `hsl(${def.hue},20%,25%)`);
                    ctx.fillStyle = hg;
                    ctx.fill();
                    ctx.strokeStyle = `hsla(${def.hue},30%,45%,0.4)`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Panel detail lines
                    ctx.strokeStyle = 'rgba(80,100,130,0.25)';
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(cx - r * 0.5, cy);
                    ctx.lineTo(cx + r * 0.6, cy);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - r * 0.4);
                    ctx.lineTo(cx + r * 0.3, cy + r * 0.4);
                    ctx.stroke();

                    // Engine thruster glow (rear)
                    ctx.save();
                    ctx.globalCompositeOperation = 'lighter';
                    const thrustA = 0.3 + Math.sin(t * Math.PI * 4) * 0.15;
                    ctx.fillStyle = `hsla(${def.hue},60%,60%,${thrustA})`;
                    ctx.shadowColor = `hsl(${def.hue},60%,60%)`;
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    ctx.ellipse(cx + r * 0.9, cy - r * 0.15, 3, 2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(cx + r * 0.9, cy + r * 0.15, 3, 2, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();

                    // Weapon barrel / sensor (nose area)
                    ctx.fillStyle = `hsl(${def.hue},50%,55%)`;
                    ctx.shadowColor = `hsl(${def.hue},50%,55%)`;
                    ctx.shadowBlur = 3;
                    ctx.beginPath();
                    ctx.arc(cx - r * 0.65, cy, s * 0.06, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Wing accent stripes
                    if (s >= 30) {
                        ctx.fillStyle = `hsla(${def.hue},40%,50%,0.2)`;
                        ctx.beginPath();
                        ctx.moveTo(cx + r * 0.2, cy - r * 0.65);
                        ctx.lineTo(cx + r * 0.5, cy - r * 0.7);
                        ctx.lineTo(cx + r * 0.5, cy - r * 0.55);
                        ctx.lineTo(cx + r * 0.2, cy - r * 0.5);
                        ctx.closePath();
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(cx + r * 0.2, cy + r * 0.65);
                        ctx.lineTo(cx + r * 0.5, cy + r * 0.7);
                        ctx.lineTo(cx + r * 0.5, cy + r * 0.55);
                        ctx.lineTo(cx + r * 0.2, cy + r * 0.5);
                        ctx.closePath();
                        ctx.fill();
                    }

                    // Antenna (turret enemies)
                    if (def.pattern === 'fixed') {
                        ctx.strokeStyle = `hsla(${def.hue},40%,55%,0.5)`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(cx, cy - r * 0.4);
                        ctx.lineTo(cx - r * 0.3, cy - r * 0.9);
                        ctx.stroke();
                        ctx.fillStyle = `hsl(${def.hue},50%,60%)`;
                        ctx.beginPath();
                        ctx.arc(cx - r * 0.3, cy - r * 0.9, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });
        }
    });

    // ---- Boss sprites — warship/creature designs ----
    BOSSES.forEach(boss => {
        for (let f = 0; f < 4; f++) {
            makeTex(scene, `boss_${boss.id}_${f}`, boss.w + 40, boss.h + 40, (ctx, w, h) => {
                const cx = w/2, cy = h/2;
                const t = f / 4;
                const pulse = 1 + Math.sin(t * Math.PI * 2) * 0.04;
                const hw = boss.w * 0.48 * pulse;
                const hh = boss.h * 0.48 * pulse;
                const coreColorR = (boss.coreColor >> 16) & 0xff;
                const coreColorG = (boss.coreColor >> 8) & 0xff;
                const coreColorB = boss.coreColor & 0xff;

                // Main hull — angular warship shape (pointed nose on left)
                ctx.beginPath();
                ctx.moveTo(cx - hw * 1.1, cy);                        // nose
                ctx.lineTo(cx - hw * 0.5, cy - hh * 0.5);            // upper-front
                ctx.lineTo(cx - hw * 0.1, cy - hh * 0.85);           // upper wing root
                ctx.lineTo(cx + hw * 0.5, cy - hh * 0.95);           // upper wing tip
                ctx.lineTo(cx + hw * 0.8, cy - hh * 0.6);            // upper rear
                ctx.lineTo(cx + hw * 1.0, cy - hh * 0.3);            // top-rear corner
                ctx.lineTo(cx + hw * 1.0, cy + hh * 0.3);            // bottom-rear corner
                ctx.lineTo(cx + hw * 0.8, cy + hh * 0.6);            // lower rear
                ctx.lineTo(cx + hw * 0.5, cy + hh * 0.95);           // lower wing tip
                ctx.lineTo(cx - hw * 0.1, cy + hh * 0.85);           // lower wing root
                ctx.lineTo(cx - hw * 0.5, cy + hh * 0.5);            // lower-front
                ctx.closePath();
                const hullG = ctx.createLinearGradient(cx, cy - hh, cx, cy + hh);
                hullG.addColorStop(0, '#303048');
                hullG.addColorStop(0.3, '#1e1e30');
                hullG.addColorStop(0.7, '#181828');
                hullG.addColorStop(1, '#252540');
                ctx.fillStyle = hullG;
                ctx.fill();
                ctx.strokeStyle = 'rgba(80,100,140,0.5)';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Armor plating sections
                ctx.strokeStyle = 'rgba(60,80,110,0.35)';
                ctx.lineWidth = 0.8;
                // Horizontal panel lines
                ctx.beginPath();
                ctx.moveTo(cx - hw * 0.4, cy - hh * 0.25);
                ctx.lineTo(cx + hw * 0.9, cy - hh * 0.25);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(cx - hw * 0.4, cy + hh * 0.25);
                ctx.lineTo(cx + hw * 0.9, cy + hh * 0.25);
                ctx.stroke();
                // Vertical sections
                ctx.beginPath();
                ctx.moveTo(cx + hw * 0.2, cy - hh * 0.8);
                ctx.lineTo(cx + hw * 0.2, cy + hh * 0.8);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(cx + hw * 0.6, cy - hh * 0.5);
                ctx.lineTo(cx + hw * 0.6, cy + hh * 0.5);
                ctx.stroke();

                // Weapon turrets (small boxes along front)
                ctx.fillStyle = 'rgba(90,110,140,0.5)';
                const turretSize = hh * 0.12;
                [-0.35, 0, 0.35].forEach(yf => {
                    ctx.fillRect(cx - hw * 0.7, cy + hh * yf - turretSize/2, turretSize * 1.5, turretSize);
                    // Barrel
                    ctx.fillStyle = 'rgba(120,140,170,0.6)';
                    ctx.fillRect(cx - hw * 0.85, cy + hh * yf - 1, turretSize, 2);
                    ctx.fillStyle = 'rgba(90,110,140,0.5)';
                });

                // Engine vents (rear)
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                const ventA = 0.25 + Math.sin(t * Math.PI * 4) * 0.15;
                ctx.fillStyle = `rgba(${coreColorR},${coreColorG},${coreColorB},${ventA})`;
                ctx.shadowColor = `rgba(${coreColorR},${coreColorG},${coreColorB},0.5)`;
                ctx.shadowBlur = 8;
                [-0.25, 0, 0.25].forEach(yf => {
                    ctx.beginPath();
                    ctx.ellipse(cx + hw * 1.0, cy + hh * yf, 4, 6, 0, 0, Math.PI * 2);
                    ctx.fill();
                });
                ctx.restore();

                // Barrier plates on wing edges
                const barrierCount = boss.barriers || 4;
                ctx.fillStyle = 'rgba(80,120,170,0.3)';
                ctx.strokeStyle = 'rgba(100,140,200,0.45)';
                ctx.lineWidth = 1;
                if (barrierCount >= 1) {
                    ctx.fillRect(cx + hw * 0.3, cy - hh * 0.9, hw * 0.25, hh * 0.12);
                    ctx.strokeRect(cx + hw * 0.3, cy - hh * 0.9, hw * 0.25, hh * 0.12);
                }
                if (barrierCount >= 2) {
                    ctx.fillRect(cx + hw * 0.3, cy + hh * 0.78, hw * 0.25, hh * 0.12);
                    ctx.strokeRect(cx + hw * 0.3, cy + hh * 0.78, hw * 0.25, hh * 0.12);
                }
                if (barrierCount >= 3) {
                    ctx.fillRect(cx - hw * 0.2, cy - hh * 0.7, hh * 0.1, hw * 0.2);
                    ctx.strokeRect(cx - hw * 0.2, cy - hh * 0.7, hh * 0.1, hw * 0.2);
                }
                if (barrierCount >= 4) {
                    ctx.fillRect(cx - hw * 0.2, cy + hh * 0.5, hh * 0.1, hw * 0.2);
                    ctx.strokeRect(cx - hw * 0.2, cy + hh * 0.5, hh * 0.1, hw * 0.2);
                }

                // Central power core
                const coreR = Math.min(hw, hh) * 0.3 * (1 + Math.sin(t * Math.PI * 2) * 0.12);
                const cg = ctx.createRadialGradient(cx + hw * 0.1, cy, 0, cx + hw * 0.1, cy, coreR);
                cg.addColorStop(0, `rgba(255,255,255,0.95)`);
                cg.addColorStop(0.25, `rgba(${coreColorR},${coreColorG},${coreColorB},0.9)`);
                cg.addColorStop(0.6, `rgba(${coreColorR>>1},${coreColorG>>1},${coreColorB>>1},0.7)`);
                cg.addColorStop(1, `rgba(${coreColorR>>2},${coreColorG>>2},${coreColorB>>2},0.2)`);
                ctx.fillStyle = cg;
                ctx.beginPath();
                ctx.arc(cx + hw * 0.1, cy, coreR, 0, Math.PI * 2);
                ctx.fill();
                // Core glow ring
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                ctx.strokeStyle = `rgba(${coreColorR},${coreColorG},${coreColorB},${0.3 + Math.sin(t * Math.PI * 2) * 0.15})`;
                ctx.lineWidth = 2;
                ctx.shadowColor = `rgba(${coreColorR},${coreColorG},${coreColorB},0.5)`;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(cx + hw * 0.1, cy, coreR * 1.3, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            });
        }
    });

    // ---- Explosion frames (12 frames, richer effect) ----
    for (let f = 0; f < 12; f++) {
        makeTex(scene, `explode_${f}`, 80, 80, (ctx, w, h) => {
            const cx = w/2, cy = h/2;
            const t = f / 12;
            const r = 8 + t * 28;
            const alpha = 1 - t * 0.85;

            // Shockwave ring (appears in frames 2-6)
            if (f >= 2 && f <= 8) {
                const ringR = r * 1.3 + (f - 2) * 4;
                const ringA = Math.max(0, 0.3 - (f - 2) * 0.04);
                ctx.strokeStyle = `rgba(255,200,100,${ringA})`;
                ctx.lineWidth = 2.5 - f * 0.15;
                ctx.beginPath();
                ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Outer glow flash
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const glowR = r + 12;
            ctx.fillStyle = `hsla(${45 - t * 40},70%,${60 - t * 25}%,${alpha * 0.12})`;
            ctx.shadowColor = `hsla(${45 - t * 40},70%,55%,${alpha * 0.6})`;
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Hot core
            const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            cg.addColorStop(0, `rgba(255,255,220,${alpha})`);
            cg.addColorStop(0.2, `rgba(255,220,80,${alpha * 0.9})`);
            cg.addColorStop(0.5, `rgba(255,120,30,${alpha * 0.7})`);
            cg.addColorStop(0.8, `rgba(200,40,10,${alpha * 0.3})`);
            cg.addColorStop(1, `rgba(80,10,0,0)`);
            ctx.fillStyle = cg;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();

            // Bright white center flash (early frames)
            if (f < 4) {
                const flashA = (1 - f / 4) * 0.8;
                ctx.fillStyle = `rgba(255,255,255,${flashA})`;
                ctx.beginPath();
                ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }

            // Debris chunks (angular shapes flying outward)
            const seed = f * 7;
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2 + seed * 0.3;
                const dist = r * (0.6 + (((seed + i * 13) % 10) / 10) * 0.8);
                const chunkSize = 1.5 + (((seed + i * 7) % 5) / 5) * 2.5;
                const chunkA = alpha * 0.8;
                const hueShift = ((seed + i * 3) % 30);
                ctx.fillStyle = `rgba(255,${170 + hueShift},${60 + hueShift},${chunkA})`;
                ctx.beginPath();
                const dx = cx + Math.cos(a) * dist;
                const dy = cy + Math.sin(a) * dist;
                // Small angular chunk
                ctx.moveTo(dx - chunkSize, dy);
                ctx.lineTo(dx, dy - chunkSize * 0.7);
                ctx.lineTo(dx + chunkSize, dy);
                ctx.lineTo(dx, dy + chunkSize * 0.7);
                ctx.closePath();
                ctx.fill();
            }

            // Smoke wisps (later frames)
            if (f > 4) {
                const smokeA = (f - 4) / 8 * 0.15;
                for (let i = 0; i < 4; i++) {
                    const a = (i / 4) * Math.PI * 2 + f * 0.5;
                    const sd = r * 0.5 + f * 2;
                    ctx.fillStyle = `rgba(80,60,40,${smokeA})`;
                    ctx.beginPath();
                    ctx.arc(cx + Math.cos(a) * sd, cy + Math.sin(a) * sd, 4 + f * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                }
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
        // Vary pitch +/- 8% each shot to reduce fatigue
        const pitch = 1000 + Math.random() * 200;
        this._osc('sawtooth', pitch, 0.06, 0.10, 300 + Math.random() * 100);
    }
    laser() {
        const pitch = 1600 + Math.random() * 200;
        this._osc('sawtooth', pitch, 0.10, 0.15, 180 + Math.random() * 40);
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
        return CFG.PLAYER_SPEED + this.speedLevel * 50;
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
