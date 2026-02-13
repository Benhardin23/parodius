// ============================================================
// PARODIUS SCENES — Boot, Title, Select, Game, GameOver
// ============================================================

// ---- BOOT SCENE ----
class BootScene extends Phaser.Scene {
    constructor() { super('Boot'); }
    create() {
        const txt = this.add.text(CFG.W / 2, CFG.H / 2, 'GENERATING ASSETS...', {
            fontSize: '20px', fill: '#8888cc', fontFamily: 'monospace'
        }).setOrigin(0.5);
        this.time.delayedCall(100, () => {
            generateAssets(this);
            sfx.init();
            this.scene.start('Title');
        });
    }
}

// ---- TITLE SCENE ----
class TitleScene extends Phaser.Scene {
    constructor() { super('Title'); }
    create() {
        // Background stars
        this.stars = [];
        for (let i = 0; i < 120; i++) {
            const s = this.add.circle(
                Math.random() * CFG.W, Math.random() * CFG.H,
                0.5 + Math.random() * 1.5, 0xffffff, 0.3 + Math.random() * 0.7
            );
            s.speed = 0.3 + Math.random() * 1.5;
            this.stars.push(s);
        }
        // Title
        this.add.text(CFG.W / 2, 140, GAME_TITLE, {
            fontSize: '72px', fontFamily: 'Impact, sans-serif',
            fill: '#8899cc', stroke: '#334466', strokeThickness: 6,
        }).setOrigin(0.5);
        this.add.text(CFG.W / 2, 210, '\u30D1\u30ED\u30C7\u30A3\u30A6\u30B9', {
            fontSize: '24px', fontFamily: 'sans-serif', fill: '#6688aa'
        }).setOrigin(0.5);
        this.add.text(CFG.W / 2, 270, GAME_VERSION, {
            fontSize: '14px', fontFamily: 'monospace', fill: '#556688'
        }).setOrigin(0.5);
        // Start prompt
        this.startText = this.add.text(CFG.W / 2, 390, 'PRESS ENTER OR SPACE', {
            fontSize: '22px', fontFamily: 'monospace', fill: '#ffffff'
        }).setOrigin(0.5);
        // Blink
        this.tweens.add({
            targets: this.startText, alpha: 0, yoyo: true,
            repeat: -1, duration: 500, ease: 'Sine.easeInOut'
        });
        // Controls info
        this.add.text(CFG.W / 2, 460, 'WASD / Arrows: Move    Z: Shoot    X: Activate Power-Up', {
            fontSize: '13px', fontFamily: 'monospace', fill: '#666699'
        }).setOrigin(0.5);
        this.add.text(CFG.W / 2, 485, 'C: Missile    ESC: Pause', {
            fontSize: '13px', fontFamily: 'monospace', fill: '#666699'
        }).setOrigin(0.5);
        // Input
        this.input.keyboard.once('keydown-SPACE', () => this.go());
        this.input.keyboard.once('keydown-ENTER', () => this.go());
    }
    go() {
        sfx.resume();
        sfx.menuSelect();
        this.scene.start('Select');
    }
    update() {
        this.stars.forEach(s => {
            s.x -= s.speed;
            if (s.x < -5) s.x = CFG.W + 5;
        });
    }
}

// ---- CHARACTER SELECT SCENE ----
class SelectScene extends Phaser.Scene {
    constructor() { super('Select'); }
    create() {
        this.selected = 0;
        this.add.text(CFG.W / 2, 40, 'SELECT WEAPON CONFIG', {
            fontSize: '28px', fontFamily: 'Impact, sans-serif',
            fill: '#8899cc', stroke: '#334466', strokeThickness: 3
        }).setOrigin(0.5);
        const startX = 120;
        const gap = (CFG.W - 240) / (CHARACTERS.length - 1);
        this.slots = CHARACTERS.map((ch, i) => {
            const x = startX + i * gap;
            const y = 220;
            const img = this.add.image(x, y, ch.id).setScale(2);
            const nameText = this.add.text(x, y + 60, ch.name, {
                fontSize: '16px', fontFamily: 'monospace', fill: '#ffffff'
            }).setOrigin(0.5);
            const descText = this.add.text(x, y + 82, ch.desc, {
                fontSize: '11px', fontFamily: 'monospace', fill: '#8888aa',
                wordWrap: { width: 180 }
            }).setOrigin(0.5);
            const border = this.add.rectangle(x, y, 84, 60, 0x000000, 0)
                .setStrokeStyle(2, 0x4488cc, 0);
            return { img, nameText, descText, border, x, y };
        });
        this.updateSelection();
        this.input.keyboard.on('keydown-LEFT', () => {
            this.selected = (this.selected - 1 + CHARACTERS.length) % CHARACTERS.length;
            sfx.menuMove();
            this.updateSelection();
        });
        this.input.keyboard.on('keydown-RIGHT', () => {
            this.selected = (this.selected + 1) % CHARACTERS.length;
            sfx.menuMove();
            this.updateSelection();
        });
        this.input.keyboard.on('keydown-SPACE', () => this.confirm());
        this.input.keyboard.on('keydown-ENTER', () => this.confirm());
        this.input.keyboard.on('keydown-Z', () => this.confirm());
        // Hint
        this.add.text(CFG.W / 2, CFG.H - 40, 'LEFT/RIGHT to choose, ENTER to confirm', {
            fontSize: '14px', fontFamily: 'monospace', fill: '#666688'
        }).setOrigin(0.5);
    }
    updateSelection() {
        this.slots.forEach((s, i) => {
            const active = i === this.selected;
            s.border.setStrokeStyle(active ? 3 : 0, 0x4488cc, active ? 1 : 0);
            s.img.setScale(active ? 2.0 : 1.5);
            s.img.setAlpha(active ? 1 : 0.5);
            s.nameText.setColor(active ? '#88bbdd' : '#888888');
        });
    }
    confirm() {
        sfx.menuSelect();
        this.scene.start('Game', { characterIndex: this.selected, stageIndex: 0, loopCount: 0, score: 0, lives: CFG.START_LIVES });
    }
}

// ---- MAIN GAME SCENE ----
class GameScene extends Phaser.Scene {
    constructor() { super('Game'); }

    init(data) {
        this.charIdx = data.characterIndex || 0;
        this.stageIdx = data.stageIndex || 0;
        this.loopCount = data.loopCount || 0;
        this.score = data.score || 0;
        this.lives = data.lives !== undefined ? data.lives : CFG.START_LIVES;
        this.hiScore = parseInt(localStorage.getItem('parodius_hi') || '0');
    }

    create() {
        this.char = CHARACTERS[this.charIdx];
        this.stageData = STAGES[this.stageIdx % STAGES.length];
        this.powerBar = new PowerBar();
        this.trail = new TrailBuffer();
        this.scrollX = 0;
        this.waveIndex = 0;
        this.bossActive = false;
        this.bossDefeated = false;
        this.boss = null;
        this.bossHP = 0;
        this.bossMaxHP = 0;
        this.bossBarrierHP = 0;
        this.bossBarrierMax = 0;
        this.paused = false;
        this.playerDead = false;
        this.invulnTimer = 0;
        this.shootTimer = 0;
        this.missileTimer = 0;
        this.laserCooldown = 0;
        this.bossShootTimer = 0;
        this.bossPhaseIdx = 0;
        this.bossBulletAngle = 0;
        this.stageClear = false;
        this.shakeMag = 0;
        this.gameTime = 0;

        // Try bloom pipeline
        try {
            this.cameras.main.setPostPipeline('BloomPostFX');
        } catch(e) { /* WebGL not available, skip bloom */ }

        // ---- Parallax Background ----
        this.bgLayers = [];
        this.createBackground();

        // ---- Physics Groups ----
        this.playerBullets = this.physics.add.group({ maxSize: 80 });
        this.enemyBullets = this.physics.add.group({ maxSize: 120 });
        this.enemies = this.physics.add.group({ maxSize: 60 });
        this.capsules = this.physics.add.group({ maxSize: 20 });

        // ---- Player ----
        this.player = this.physics.add.sprite(100, CFG.H / 2, this.char.id);
        this.player.setScale(1.0);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(12, 10);
        this.player.setDepth(10);

        // ---- Engine trail particles ----
        this.engineParticles = this.add.particles(0, 0, 'spark', {
            follow: this.player,
            followOffset: { x: -18, y: 0 },
            speed: { min: 15, max: 60 },
            angle: { min: 165, max: 195 },
            scale: { start: 0.5, end: 0 },
            lifespan: { min: 100, max: 250 },
            frequency: 35,
            tint: [0x3388cc, 0x55aadd, 0xddeeff],
            blendMode: 'ADD',
            quantity: 1,
        });
        this.engineParticles.setDepth(9);

        // ---- Options ----
        this.options = [];

        // ---- Shield sprite ----
        this.shieldSprite = this.add.image(0, 0, 'shield').setVisible(false).setDepth(11).setAlpha(0.7);

        // ---- HUD ----
        this.createHUD();

        // ---- Input ----
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyW = this.input.keyboard.addKey('W');
        this.keyA = this.input.keyboard.addKey('A');
        this.keyS = this.input.keyboard.addKey('S');
        this.keyD = this.input.keyboard.addKey('D');
        this.keyZ = this.input.keyboard.addKey('Z');
        this.keyX = this.input.keyboard.addKey('X');
        this.keyC = this.input.keyboard.addKey('C');
        this.keyEsc = this.input.keyboard.addKey('ESC');
        this.keyP = this.input.keyboard.addKey('P');

        // ---- Collisions ----
        this.physics.add.overlap(this.playerBullets, this.enemies, this.bulletHitEnemy, null, this);
        this.physics.add.overlap(this.player, this.capsules, this.collectCapsule, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.playerHitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemyBullets, this.playerHitBullet, null, this);

        // ---- Stage name display ----
        const stName = this.add.text(CFG.W / 2, CFG.H / 2 - 40, `STAGE ${this.stageIdx + 1}`, {
            fontSize: '36px', fontFamily: 'Impact, sans-serif',
            fill: '#8899cc', stroke: '#334466', strokeThickness: 4
        }).setOrigin(0.5).setDepth(100).setScrollFactor(0);
        const stSub = this.add.text(CFG.W / 2, CFG.H / 2 + 10, this.stageData.name, {
            fontSize: '20px', fontFamily: 'monospace', fill: '#ffffff'
        }).setOrigin(0.5).setDepth(100).setScrollFactor(0);
        this.tweens.add({ targets: [stName, stSub], alpha: 0, delay: 2000, duration: 1000, onComplete: () => { stName.destroy(); stSub.destroy(); }});

        // ---- Pause overlay ----
        this.pauseOverlay = this.add.rectangle(CFG.W / 2, CFG.H / 2, CFG.W, CFG.H, 0x000000, 0.55)
            .setScrollFactor(0).setDepth(999).setVisible(false);
        this.pauseText = this.add.text(CFG.W / 2, CFG.H / 2 - 30, 'PAUSED', {
            fontSize: '48px', fontFamily: 'Impact, sans-serif',
            fill: '#ffffff', stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000).setVisible(false);
        this.pauseHintText = this.add.text(CFG.W / 2, CFG.H / 2 + 20, 'Press ESC or P to Resume', {
            fontSize: '16px', fontFamily: 'monospace',
            fill: '#8899cc', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(1000).setVisible(false);

        // Start music
        const bpms = [140, 155, 130, 135, 160, 120, 150];
        const notes = [220, 246, 196, 233, 261, 185, 247];
        const styles = ['default', 'tense', 'chill', 'dark', 'industrial', 'ethereal', 'military'];
        const si = this.stageIdx % bpms.length;
        sfx.startMusic(bpms[si], notes[si], styles[si]);

        // Cleanup on scene shutdown to prevent leaks
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sfx.stopMusic();
            this.engineParticles.stop();
        });
    }

    createBackground() {
        const h = this.stageData.bgHue;
        // Layer 0 - deep bg (slowest) — slightly blue-shifted
        for (let i = 0; i < 80; i++) {
            const starHue = (h + (Math.random() - 0.5) * 30) / 360;
            const s = this.add.circle(
                Math.random() * CFG.W * 2, Math.random() * CFG.H,
                0.5 + Math.random() * 1, Phaser.Display.Color.HSLToColor(starHue, 0.25, 0.3 + Math.random() * 0.2).color,
                0.4 + Math.random() * 0.4
            ).setScrollFactor(0).setDepth(-10);
            s._speed = 0.2 + Math.random() * 0.3;
            this.bgLayers.push(s);
        }
        // Layer 1 - mid (medium speed)
        for (let i = 0; i < 40; i++) {
            const starHue = (h + (Math.random() - 0.5) * 20) / 360;
            const s = this.add.circle(
                Math.random() * CFG.W * 2, Math.random() * CFG.H,
                1 + Math.random() * 2, Phaser.Display.Color.HSLToColor(starHue, 0.3, 0.4 + Math.random() * 0.3).color,
                0.3 + Math.random() * 0.5
            ).setScrollFactor(0).setDepth(-5);
            s._speed = 0.6 + Math.random() * 0.8;
            this.bgLayers.push(s);
        }
        // Layer 2 - near stars (fastest) — white with slight blue tint, reduced alpha
        for (let i = 0; i < 25; i++) {
            const tint = Math.random() > 0.3 ? 0xffffff : 0xccddff;
            const s = this.add.circle(
                Math.random() * CFG.W * 2, Math.random() * CFG.H,
                1.5 + Math.random() * 2.5, tint, 0.4 + Math.random() * 0.4
            ).setScrollFactor(0).setDepth(-2);
            s._speed = 1.2 + Math.random() * 1.5;
            this.bgLayers.push(s);
        }
    }

    createHUD() {
        const hd = 100;
        // ---- Top bar background ----
        this.add.rectangle(CFG.W / 2, 0, CFG.W, 36, 0x000011, 0.6)
            .setOrigin(0.5, 0).setDepth(hd - 1).setScrollFactor(0);
        // Score
        this.scoreText = this.add.text(CFG.W / 2, 10, '0', {
            fontSize: '22px', fontFamily: 'Impact, Arial Black, sans-serif',
            fill: '#ffffff', stroke: '#000000', strokeThickness: 2,
        }).setOrigin(0.5, 0).setDepth(hd).setScrollFactor(0);
        this.add.text(CFG.W / 2, 2, 'SCORE', {
            fontSize: '8px', fontFamily: 'sans-serif', fill: '#6677aa', letterSpacing: 2,
        }).setOrigin(0.5, 0).setDepth(hd).setScrollFactor(0);
        // Hi-Score
        this.hiScoreText = this.add.text(CFG.W - 14, 10, `${this.hiScore}`, {
            fontSize: '18px', fontFamily: 'Impact, Arial Black, sans-serif',
            fill: '#ccbb55', stroke: '#000000', strokeThickness: 2,
        }).setOrigin(1, 0).setDepth(hd).setScrollFactor(0);
        this.add.text(CFG.W - 14, 2, 'HI-SCORE', {
            fontSize: '8px', fontFamily: 'sans-serif', fill: '#6677aa', letterSpacing: 1,
        }).setOrigin(1, 0).setDepth(hd).setScrollFactor(0);
        // Lives
        this.livesText = this.add.text(14, 10, '', {
            fontSize: '20px', fontFamily: 'sans-serif', fill: '#ff5555',
            stroke: '#000000', strokeThickness: 2,
        }).setOrigin(0, 0).setDepth(hd).setScrollFactor(0);
        // Stage + Loop
        const stageLabel = this.loopCount > 0
            ? `STAGE ${this.stageIdx + 1}  LOOP ${this.loopCount + 1}`
            : `STAGE ${this.stageIdx + 1}`;
        this.add.text(14, 2, stageLabel, {
            fontSize: '8px', fontFamily: 'sans-serif', fill: '#6677aa', letterSpacing: 2,
        }).setOrigin(0, 0).setDepth(hd).setScrollFactor(0);

        // ---- Power bar ----
        const barW = 540;
        const barH = 36;
        const barX = (CFG.W - barW) / 2;
        const barY = CFG.H - barH - 4;
        const slotW = barW / CFG.POWER_SLOTS.length;
        // Bar outer frame
        const barGfx = this.add.graphics().setDepth(hd).setScrollFactor(0);
        barGfx.fillStyle(0x060610, 0.88);
        barGfx.fillRoundedRect(barX - 3, barY - 3, barW + 6, barH + 6, 6);
        barGfx.lineStyle(1, 0x222240, 0.6);
        barGfx.strokeRoundedRect(barX - 3, barY - 3, barW + 6, barH + 6, 6);
        // Slot labels and colors (cooler blue-grey tones)
        const slotColors = [0x1a6644, 0x885533, 0x2a5588, 0x2266aa, 0x886633, 0x554488];
        this.powerSlots = CFG.POWER_SLOTS.map((name, i) => {
            const sx = barX + i * slotW + slotW / 2;
            const sy = barY + barH / 2;
            // Slot background
            const bg = this.add.rectangle(sx, sy, slotW - 3, barH - 4, 0x0c0c22, 0.95)
                .setDepth(hd + 1).setScrollFactor(0).setStrokeStyle(1, 0x222244);
            // Glow rect (invisible until cursor)
            const glow = this.add.rectangle(sx, sy, slotW - 1, barH - 2, 0x4488cc, 0)
                .setDepth(hd + 0.5).setScrollFactor(0);
            // Label
            const label = this.add.text(sx, sy - 1, name, {
                fontSize: '12px', fontFamily: 'Impact, Arial Black, sans-serif',
                fill: '#555577', stroke: '#000000', strokeThickness: 1,
                letterSpacing: 0.5,
            }).setOrigin(0.5).setDepth(hd + 2).setScrollFactor(0);
            // Activated dot indicator
            const dot = this.add.circle(sx + slotW / 2 - 8, barY + 6, 3, slotColors[i], 0)
                .setDepth(hd + 2).setScrollFactor(0);
            return { bg, glow, label, dot, baseColor: slotColors[i] };
        });

        // ---- Boss HP bar ----
        this.bossHPBarBg = this.add.rectangle(CFG.W / 2, 42, 302, 12, 0x000000, 0)
            .setStrokeStyle(1.5, 0xff3333, 0.7).setDepth(hd).setScrollFactor(0).setVisible(false);
        this.bossHPBar = this.add.rectangle(CFG.W / 2, 42, 300, 10, 0xff2222, 0.9)
            .setDepth(hd + 1).setScrollFactor(0).setVisible(false);
        this.bossBarrierBar = this.add.rectangle(CFG.W / 2, 42, 300, 10, 0x4488cc, 0.9)
            .setDepth(hd + 1.5).setScrollFactor(0).setVisible(false);
        this.bossNameText = this.add.text(CFG.W / 2, 54, '', {
            fontSize: '11px', fontFamily: 'Impact, sans-serif', fill: '#ff8888',
            stroke: '#000000', strokeThickness: 2, letterSpacing: 2,
        }).setOrigin(0.5, 0).setDepth(hd).setScrollFactor(0);
    }

    updateHUD() {
        this.scoreText.setText(String(this.score));
        const hearts = Math.max(this.lives, 0);
        this.livesText.setText(hearts > 0 ? '\u2764'.repeat(hearts) : '');
        if (this.score > this.hiScore) {
            this.hiScore = this.score;
            localStorage.setItem('parodius_hi', String(this.hiScore));
        }
        this.hiScoreText.setText(String(this.hiScore));

        // Power bar — cursor highlight + activated indicators
        const pb = this.powerBar;
        this.powerSlots.forEach((s, i) => {
            const isCursor = i === pb.cursor;
            let isActive = false;
            if (i === 0 && pb.speedLevel > 0) isActive = true;
            if (i === 1 && pb.hasMissile) isActive = true;
            if (i === 2 && pb.hasDouble) isActive = true;
            if (i === 3 && pb.hasLaser) isActive = true;
            if (i === 4 && pb.optionCount > 0) isActive = true;
            if (i === 5 && pb.hasShield) isActive = true;

            if (isCursor) {
                s.bg.setFillStyle(0x1a2a40, 0.95);
                s.bg.setStrokeStyle(2, 0x4488cc);
                s.glow.setFillStyle(0x336699, 0.08);
                s.label.setColor('#aaccdd');
                s.label.setFontSize(13);
            } else if (isActive) {
                s.bg.setFillStyle(0x152030, 0.9);
                s.bg.setStrokeStyle(1, s.baseColor);
                s.glow.setFillStyle(s.baseColor, 0.04);
                s.label.setColor('#8899aa');
                s.label.setFontSize(12);
            } else {
                s.bg.setFillStyle(0x0c0c1a, 0.9);
                s.bg.setStrokeStyle(1, 0x1a1a33);
                s.glow.setFillStyle(0x000000, 0);
                s.label.setColor('#3a3a55');
                s.label.setFontSize(12);
            }
            s.dot.setAlpha(isActive ? 1 : 0);
            if (i === 0 && pb.speedLevel > 0) {
                s.label.setText(`SPD x${pb.speedLevel}`);
            } else if (i === 4 && pb.optionCount > 0) {
                s.label.setText(`OPT x${pb.optionCount}`);
            } else {
                s.label.setText(CFG.POWER_SLOTS[i]);
            }
        });

        // Boss HP bar with barrier segment
        if (this.bossActive && this.boss && this.boss.active) {
            this.bossHPBarBg.setVisible(true);
            if (this.bossBarrierHP > 0) {
                // Show barrier bar (blue) on top of core bar (red)
                const totalHP = this.bossMaxHP + this.bossBarrierMax;
                const coreWidth = 300 * (this.bossMaxHP / totalHP);
                const barrierWidth = 300 * (this.bossBarrierHP / totalHP);
                this.bossHPBar.setVisible(true);
                this.bossHPBar.width = coreWidth;
                this.bossHPBar.x = CFG.W / 2 - (300 - coreWidth) / 2;
                this.bossBarrierBar.setVisible(true);
                this.bossBarrierBar.width = barrierWidth;
                this.bossBarrierBar.x = CFG.W / 2 - (300 - barrierWidth) / 2 + coreWidth;
            } else {
                this.bossBarrierBar.setVisible(false);
                this.bossHPBar.setVisible(true);
                this.bossHPBar.width = 300 * Math.max(this.bossHP / this.bossMaxHP, 0);
                this.bossHPBar.x = CFG.W / 2;
            }
        } else {
            this.bossHPBar.setVisible(false);
            this.bossHPBarBg.setVisible(false);
            this.bossBarrierBar.setVisible(false);
            this.bossNameText.setText('');
        }
    }

    update(time, delta) {
        // Pause toggle must run before paused early return
        if (Phaser.Input.Keyboard.JustDown(this.keyEsc) || Phaser.Input.Keyboard.JustDown(this.keyP)) {
            this.togglePause();
            return;
        }

        if (this.paused || this.stageClear) return;

        const dt = delta / 1000;
        this.gameTime += delta;

        // Scroll
        if (!this.bossActive) {
            this.scrollX += CFG.SCROLL_SPEED;
        }

        // Background parallax
        this.bgLayers.forEach(s => {
            s.x -= s._speed;
            if (s.x < -10) s.x = CFG.W + 10 + Math.random() * 50;
        });

        // Screen shake decay
        if (this.shakeMag > 0) {
            this.cameras.main.setScroll(
                (Math.random() - 0.5) * this.shakeMag,
                (Math.random() - 0.5) * this.shakeMag
            );
            this.shakeMag *= 0.9;
            if (this.shakeMag < 0.5) {
                this.shakeMag = 0;
                this.cameras.main.setScroll(0, 0);
            }
        }

        // ---- Player movement ----
        if (!this.playerDead) {
            const spd = this.powerBar.getSpeed();
            let vx = 0, vy = 0;
            if (this.cursors.left.isDown || this.keyA.isDown) vx = -spd;
            if (this.cursors.right.isDown || this.keyD.isDown) vx = spd;
            if (this.cursors.up.isDown || this.keyW.isDown) vy = -spd;
            if (this.cursors.down.isDown || this.keyS.isDown) vy = spd;
            this.player.setVelocity(vx, vy);

            // Trail for options
            this.trail.push(this.player.x, this.player.y);

            // Invulnerability
            if (this.invulnTimer > 0) {
                this.invulnTimer -= delta;
                this.player.setAlpha(Math.sin(time * 0.02) * 0.4 + 0.6);
            } else {
                this.player.setAlpha(1);
            }

            // Shield position
            if (this.powerBar.hasShield) {
                if (this.char.shieldType === 'front') {
                    this.shieldSprite.setPosition(this.player.x + 20, this.player.y);
                } else {
                    const a = time * 0.003;
                    this.shieldSprite.setPosition(
                        this.player.x + Math.cos(a) * 25,
                        this.player.y + Math.sin(a) * 20
                    );
                }
                this.shieldSprite.setVisible(true);
            } else {
                this.shieldSprite.setVisible(false);
            }

            // ---- Shooting ----
            this.shootTimer -= delta;
            if (this.keyZ.isDown && this.shootTimer <= 0) {
                this.fireWeapon();
                this.shootTimer = this.powerBar.hasLaser ? 200 : 100;
            }

            // ---- Missiles (separate key) ----
            this.missileTimer -= delta;
            if ((this.keyC.isDown || (this.keyZ.isDown && this.powerBar.hasMissile)) && this.missileTimer <= 0 && this.powerBar.hasMissile) {
                this.fireMissile();
                this.missileTimer = 400;
            }

            // ---- Power-up activate ----
            if (Phaser.Input.Keyboard.JustDown(this.keyX)) {
                const slotName = CFG.POWER_SLOTS[this.powerBar.cursor];
                if (this.powerBar.activate()) {
                    sfx.powerUp();
                    this.syncOptions();
                    this.floatText(this.player.x, this.player.y - 30, slotName + '!', '#88ccff', 18);
                    this.cameras.main.flash(100, 100, 180, 255, true);
                }
            }
        } else {
            this.player.setVelocity(0, 0);
        }

        // ---- Update Options ----
        this.options.forEach((opt, i) => {
            const s = this.trail.sample((i + 1) * CFG.OPTION_DELAY);
            if (s) {
                opt.setPosition(s.x, s.y);
            }
        });

        // ---- Update enemy bullets ----
        this.enemyBullets.children.each(b => {
            if (b.active && (b.x < -20 || b.x > CFG.W + 20 || b.y < -20 || b.y > CFG.H + 20)) {
                b.setActive(false).setVisible(false);
                b.body.stop();
            }
        });

        // ---- Update player bullets ----
        this.playerBullets.children.each(b => {
            if (b.active && (b.x > CFG.W + 30 || b.x < -30 || b.y < -30 || b.y > CFG.H + 30)) {
                b.setActive(false).setVisible(false);
                b.body.stop();
            }
        });

        // ---- Spawn waves ----
        this.processWaves();

        // ---- Update enemies ----
        this.updateEnemies(time, delta);

        // ---- Update boss ----
        if (this.bossActive && this.boss && this.boss.active && !this.bossDefeated) {
            this.updateBoss(time, delta);
        }

        // ---- HUD ----
        this.updateHUD();
    }

    togglePause() {
        this.paused = !this.paused;
        this.pauseOverlay.setVisible(this.paused);
        this.pauseText.setVisible(this.paused);
        this.pauseHintText.setVisible(this.paused);
        if (this.paused) {
            sfx.stopMusic();
        } else {
            const bpms = [140, 155, 130, 135, 160, 120, 150];
            const notes = [220, 246, 196, 233, 261, 185, 247];
            const styles = ['default', 'tense', 'chill', 'dark', 'industrial', 'ethereal', 'military'];
            const si = this.stageIdx % bpms.length;
            sfx.startMusic(bpms[si], notes[si], styles[si]);
        }
    }

    // ---- Weapon firing ----
    fireWeapon() {
        if (this.powerBar.hasLaser) {
            this.fireLaser();
        } else {
            this.fireNormal();
        }
    }

    fireNormal() {
        sfx.shoot();
        this.spawnBullet(this.player.x + 20, this.player.y, CFG.BULLET_SPEED, 0);
        this.options.forEach(opt => {
            this.spawnBullet(opt.x + 16, opt.y, CFG.BULLET_SPEED, 0);
        });
        if (this.powerBar.hasDouble) {
            const ang = this.char.doubleAngle * Math.PI / 180;
            this.spawnBullet(this.player.x + 16, this.player.y - 8,
                CFG.BULLET_SPEED * Math.cos(ang), CFG.BULLET_SPEED * Math.sin(ang));
            this.options.forEach(opt => {
                this.spawnBullet(opt.x + 12, opt.y - 6,
                    CFG.BULLET_SPEED * Math.cos(ang), CFG.BULLET_SPEED * Math.sin(ang));
            });
        }
    }

    fireLaser() {
        sfx.laser();
        const b = this.playerBullets.get(this.player.x + 30, this.player.y, 'laser');
        if (b) {
            b.setActive(true).setVisible(true).setDepth(8);
            b.body.setVelocity(CFG.BULLET_SPEED * 1.2, 0);
            b.body.setSize(180, 6);
            b.dmg = 2;
        }
        this.options.forEach(opt => {
            const ob = this.playerBullets.get(opt.x + 20, opt.y, 'laser');
            if (ob) {
                ob.setActive(true).setVisible(true).setDepth(8);
                ob.body.setVelocity(CFG.BULLET_SPEED * 1.2, 0);
                ob.body.setSize(180, 6);
                ob.dmg = 2;
            }
        });
    }

    fireMissile() {
        sfx.shoot();
        const mt = this.char.missileType;
        if (mt === 'spread') {
            [-1, 1].forEach(dir => {
                this.spawnMissile(this.player.x, this.player.y + dir * 10, 200, dir * 150);
            });
        } else if (mt === 'vertical') {
            [-1, 1].forEach(dir => {
                this.spawnMissile(this.player.x, this.player.y + dir * 10, 50, dir * 200);
            });
        } else if (mt === 'forward') {
            this.spawnMissile(this.player.x + 15, this.player.y, 350, 0);
        } else {
            // Default down missile
            this.spawnMissile(this.player.x, this.player.y + 12, 150, 200);
        }
    }

    spawnBullet(x, y, vx, vy) {
        const b = this.playerBullets.get(x, y, 'bullet');
        if (b) {
            b.setActive(true).setVisible(true).setDepth(8);
            b.body.setVelocity(vx, vy);
            b.body.setSize(12, 4);
            b.dmg = 1;
        }
    }

    spawnMissile(x, y, vx, vy) {
        const b = this.playerBullets.get(x, y, 'missile');
        if (b) {
            b.setActive(true).setVisible(true).setDepth(8);
            b.body.setVelocity(vx, vy);
            b.body.setSize(12, 6);
            b.dmg = 1;
        }
    }

    spawnEnemyBullet(x, y, vx, vy) {
        const b = this.enemyBullets.get(x, y, 'bulletEnemy');
        if (b) {
            b.setActive(true).setVisible(true).setDepth(7);
            b.body.setVelocity(vx, vy);
            b.body.setSize(8, 8);
        }
    }

    // ---- Wave spawning ----
    processWaves() {
        const waves = this.stageData.waves;
        while (this.waveIndex < waves.length) {
            const [triggerX, type, data] = waves[this.waveIndex];
            if (this.scrollX < triggerX) break;
            if (type === 'wave') {
                this.spawnWave(data);
            } else if (type === 'capsule') {
                this.spawnCapsuleEvent();
            } else if (type === 'boss') {
                this.startBoss(data.idx);
            }
            this.waveIndex++;
        }
    }

    spawnCapsuleEvent() {
        const count = CFG.CAPSULE_SPAWN_COUNT || 3;
        for (let i = 0; i < count; i++) {
            const yOff = (i - (count - 1) / 2) * 40;
            const c = this.capsules.get(CFG.W + 20 + i * 30, CFG.H / 2 + yOff + (Math.random() - 0.5) * 60, 'capsule');
            if (!c) continue;
            c.setActive(true).setVisible(true).setDepth(6);
            c.body.setVelocity(-60, 0);
            c.body.setSize(18, 14);
        }
    }

    spawnWave(data) {
        const def = ENEMIES[data.enemy];
        if (!def) return;
        for (let i = 0; i < data.count; i++) {
            this.time.delayedCall(i * 180, () => {
                const ex = CFG.W + 30 + i * (data.spacing || 50);
                const ey = data.y + (Math.random() - 0.5) * 40;
                this.spawnEnemy(data.enemy, def, ex, ey);
            });
        }
    }

    spawnEnemy(typeKey, def, x, y) {
        const e = this.enemies.get(x, Phaser.Math.Clamp(y, 30, CFG.H - 30), `${typeKey}_0`);
        if (!e) return;
        e.setActive(true).setVisible(true).setDepth(5);
        e.body.setSize(def.size * 0.8, def.size * 0.8);
        // NG+ scaling
        const loopMul = 1 + this.loopCount * 0.25;
        e.hp = Math.max(1, Math.ceil(def.hp * loopMul));
        e.score = Math.ceil(def.score * loopMul);
        e.typeKey = typeKey;
        e.def = def;
        e.spawnY = y;
        e.age = 0;
        const baseCD = def.shootCD || 9999;
        e.shootCD = Math.max(400, Math.floor(baseCD / loopMul));
        e.shootTimer = Math.random() * e.shootCD;
        e.frameIdx = 0;
        e.frameTimer = 0;
        e.dropRate = def.drop;
        const spd = def.speed || 100;
        if (def.pattern === 'fixed' || def.pattern === 'stationary') {
            e.body.setVelocity(-CFG.SCROLL_SPEED * 60, 0);
        } else if (def.pattern === 'march' || def.pattern === 'crawl') {
            e.body.setVelocity(-spd, 0);
        } else {
            e.body.setVelocity(-spd, 0);
        }
    }

    updateEnemies(time, delta) {
        this.enemies.children.each(e => {
            if (!e.active) return;
            e.age += delta;
            // Animation
            e.frameTimer += delta;
            if (e.frameTimer > 200) {
                e.frameTimer = 0;
                e.frameIdx = (e.frameIdx + 1) % 4;
                e.setTexture(`${e.typeKey}_${e.frameIdx}`);
            }
            // Pattern-specific movement
            const def = e.def;
            if (def.pattern === 'sine') {
                e.body.setVelocityY(Math.sin(e.age * 0.003) * 100);
            } else if (def.pattern === 'vee') {
                if (e.age > 1500) {
                    e.body.setVelocityY(Math.sin(e.age * 0.002) * 80);
                }
            } else if (def.pattern === 'diagonal') {
                e.body.setVelocityY(Math.sin(e.age * 0.002) * 60 + 30);
            } else if (def.pattern === 'bounce') {
                if (e.y < 50 || e.y > CFG.H - 50) {
                    e.body.setVelocityY(-e.body.velocity.y);
                }
            } else if (def.pattern === 'burst') {
                if ((e.age % 1000) < 300) {
                    e.body.setVelocityX(-def.speed * 2);
                } else {
                    e.body.setVelocityX(-def.speed * 0.3);
                }
            } else if (def.pattern === 'slide') {
                e.body.setVelocityX(-def.speed);
                if (e.y > CFG.H - 40) e.body.setVelocityY(-100);
                if (e.y < 40) e.body.setVelocityY(100);
            } else if (def.pattern === 'float') {
                e.body.setVelocityX(-def.speed * 0.5);
                e.body.setVelocityY(Math.sin(e.age * 0.0015) * 40);
            } else if (def.pattern === 'hover') {
                e.body.setVelocityX(-def.speed * 0.3);
                e.body.setVelocityY(Math.sin(e.age * 0.002) * 60);
            } else if (def.pattern === 'drift') {
                e.body.setVelocityX(-def.speed);
                e.body.setVelocityY(Math.sin(e.age * 0.001) * 20);
                if (def.enrage && e.hp < def.hp) {
                    e.body.setVelocityX(-def.speed * 3);
                    const dx = this.player.x - e.x;
                    const dy = this.player.y - e.y;
                    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                    e.body.setVelocityY((dy / dist) * def.speed * 2);
                }
            }
            // Shooting
            if (def.shoots && !this.playerDead) {
                e.shootTimer -= delta;
                if (e.shootTimer <= 0) {
                    e.shootTimer = e.shootCD + Math.random() * 500;
                    if (def.spread) {
                        for (let s = 0; s < def.spread; s++) {
                            const ang = ((s - (def.spread - 1) / 2) * 25) * Math.PI / 180;
                            this.spawnEnemyBullet(e.x - 10, e.y,
                                -CFG.ENEMY_BULLET_SPEED * Math.cos(ang),
                                CFG.ENEMY_BULLET_SPEED * Math.sin(ang));
                        }
                    } else if (def.shotgun) {
                        for (let s = -2; s <= 2; s++) {
                            const ang = s * 15 * Math.PI / 180;
                            this.spawnEnemyBullet(e.x - 10, e.y,
                                -CFG.ENEMY_BULLET_SPEED * Math.cos(ang),
                                CFG.ENEMY_BULLET_SPEED * Math.sin(ang));
                        }
                    } else {
                        const dx = this.player.x - e.x;
                        const dy = this.player.y - e.y;
                        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                        this.spawnEnemyBullet(e.x - 10, e.y,
                            (dx / dist) * CFG.ENEMY_BULLET_SPEED,
                            (dy / dist) * CFG.ENEMY_BULLET_SPEED);
                    }
                }
            }
            // Off-screen cleanup
            if (e.x < -60) {
                e.setActive(false).setVisible(false);
                e.body.stop();
            }
        });
    }

    screenBomb() {
        this.enemies.children.each(e => {
            if (e.active) {
                this.score += e.score;
                this.spawnExplosion(e.x, e.y);
                e.setActive(false).setVisible(false);
                e.body.stop();
            }
        });
        this.enemyBullets.children.each(b => {
            if (b.active) {
                b.setActive(false).setVisible(false);
                b.body.stop();
            }
        });
        this.cameras.main.flash(300, 255, 255, 255);
        this.shakeMag = 8;
        sfx.bigExplosion();
    }

    // ---- Collision callbacks ----
    bulletHitEnemy(bullet, enemy) {
        if (!bullet.active || !enemy.active) return;
        bullet.setActive(false).setVisible(false);
        bullet.body.stop();
        enemy.hp -= (bullet.dmg || 1);
        enemy.setTintFill(0xffffff);
        this.time.delayedCall(50, () => {
            if (enemy.active) enemy.clearTint();
        });
        if (enemy.hp <= 0) {
            this.killEnemy(enemy);
        }
    }

    killEnemy(enemy) {
        this.score += enemy.score;
        this.spawnExplosion(enemy.x, enemy.y);
        this.spawnDeathParticles(enemy.x, enemy.y, 210);
        sfx.explosion();
        this.shakeMag = Math.max(this.shakeMag, 2);
        this.floatText(enemy.x, enemy.y - 20, `+${enemy.score}`, '#88ccff', 12);
        if (Math.random() < enemy.dropRate) {
            this.spawnCapsule(enemy.x, enemy.y);
        }
        enemy.setActive(false).setVisible(false);
        enemy.body.stop();
    }

    spawnDeathParticles(x, y, hue) {
        const tint = Phaser.Display.Color.HSLToColor(hue / 360, 0.4, 0.5).color;
        const emitter = this.add.particles(x, y, 'spark', {
            speed: { min: 50, max: 160 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.7, end: 0 },
            lifespan: { min: 120, max: 350 },
            tint: [tint, 0xbbccdd, 0x6699bb],
            blendMode: 'ADD',
            quantity: 10,
            emitting: false,
        });
        emitter.setDepth(15);
        emitter.explode(10);
        this.time.delayedCall(500, () => emitter.destroy());
    }

    spawnCapsule(x, y) {
        const c = this.capsules.get(x, y, 'capsule');
        if (!c) return;
        c.setActive(true).setVisible(true).setDepth(6);
        c.body.setVelocity(-40, 0);
        c.body.setSize(18, 14);
    }

    collectCapsule(player, capsule) {
        if (!capsule.active || this.playerDead) return;
        capsule.setActive(false).setVisible(false);
        capsule.body.stop();
        this.powerBar.advance();
        sfx.powerUp();
        this.floatText(capsule.x, capsule.y, 'POWER', '#cc3300');
        const em = this.add.particles(capsule.x, capsule.y, 'spark', {
            speed: { min: 40, max: 120 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.8, end: 0 },
            lifespan: { min: 100, max: 300 },
            tint: [0xcc3300, 0xff6644, 0xffffff],
            blendMode: 'ADD',
            quantity: 8,
            emitting: false,
        });
        em.setDepth(15);
        em.explode(8);
        this.time.delayedCall(400, () => em.destroy());
    }

    playerHitEnemy(player, enemy) {
        if (!enemy.active || this.playerDead || this.invulnTimer > 0 || this.bossDefeated || this.stageClear) return;
        this.playerDie();
    }

    playerHitBullet(player, bullet) {
        if (!bullet.active || this.playerDead || this.invulnTimer > 0 || this.bossDefeated || this.stageClear) return;
        bullet.setActive(false).setVisible(false);
        bullet.body.stop();
        if (this.powerBar.hasShield && this.powerBar.shieldHP > 0) {
            this.powerBar.shieldHP--;
            if (this.powerBar.shieldHP <= 0) {
                this.powerBar.hasShield = false;
            }
            this.shakeMag = 3;
            return;
        }
        this.playerDie();
    }

    playerDie() {
        if (this.playerDead || this.stageClear || this.bossDefeated) return;
        this.playerDead = true;
        this.player.setVisible(false);
        this.player.body.stop();
        this.engineParticles.stop();
        this.spawnExplosion(this.player.x, this.player.y, true);
        this.spawnDeathParticles(this.player.x, this.player.y, 210);
        sfx.death();
        this.shakeMag = 12;
        this.powerBar.reset();
        this.clearOptions();
        this.shieldSprite.setVisible(false);
        this.lives--;
        if (this.lives < 0) {
            this.time.delayedCall(2000, () => {
                sfx.stopMusic();
                this.scene.start('GameOver', {
                    score: this.score, hiScore: this.hiScore,
                    stage: this.stageIdx + 1, characterIndex: this.charIdx,
                    loopCount: this.loopCount
                });
            });
        } else {
            this.time.delayedCall(CFG.RESPAWN_TIME, () => {
                this.playerDead = false;
                this.player.setPosition(80, CFG.H / 2);
                this.player.setVisible(true);
                this.invulnTimer = CFG.INVULN_TIME;
                this.engineParticles.start();
            });
        }
    }

    // ---- Options management ----
    syncOptions() {
        const target = this.powerBar.optionCount;
        while (this.options.length < target) {
            const opt = this.add.image(this.player.x, this.player.y, 'option').setDepth(9);
            this.options.push(opt);
        }
    }

    clearOptions() {
        this.options.forEach(o => o.destroy());
        this.options = [];
    }

    // ---- Boss ----
    startBoss(bossIdx) {
        this.bossActive = true;
        const bd = BOSSES[bossIdx % BOSSES.length];
        // NG+ scaling
        const loopMul = 1 + this.loopCount * 0.25;
        this.bossMaxHP = Math.ceil(bd.hp * loopMul);
        this.bossHP = this.bossMaxHP;
        const scaledBarrierHP = Math.ceil(bd.barrierHP * loopMul);
        this.bossBarrierMax = bd.barriers * scaledBarrierHP;
        this.bossBarrierHP = this.bossBarrierMax;
        this.bossPhaseIdx = 0;
        this.bossShootTimer = 0;
        this.bossBulletAngle = 0;
        this.bossNameText.setText(bd.name);
        sfx.bossWarning();
        this.boss = this.physics.add.sprite(CFG.W + bd.w, CFG.H / 2, `boss_${bd.id}_0`);
        this.boss.setDepth(6);
        this.boss.body.setSize(bd.w * 0.7, bd.h * 0.7);
        this.boss.bossData = bd;
        this.boss.frameIdx = 0;
        this.boss.frameTimer = 0;
        this.boss.moveAngle = 0;
        this.tweens.add({
            targets: this.boss,
            x: CFG.W - bd.w / 2 - 80,
            duration: 2000,
            ease: 'Sine.easeOut'
        });
        this.physics.add.overlap(this.playerBullets, this.boss, this.bulletHitBoss, null, this);
        this.physics.add.overlap(this.player, this.boss, this.playerHitEnemy, null, this);
    }

    updateBoss(time, delta) {
        if (!this.boss || !this.boss.active) return;
        const bd = this.boss.bossData;
        const dt = delta / 1000;

        this.boss.frameTimer += delta;
        if (this.boss.frameTimer > 250) {
            this.boss.frameTimer = 0;
            this.boss.frameIdx = (this.boss.frameIdx + 1) % 4;
            this.boss.setTexture(`boss_${bd.id}_${this.boss.frameIdx}`);
        }

        const hpRatio = this.bossHP / this.bossMaxHP;
        // Pick lowest-threshold phase that hpRatio qualifies for
        let phase = bd.phases[0];
        for (const p of bd.phases) {
            if (hpRatio <= p.at && p.at <= phase.at) {
                phase = p;
            }
        }

        this.boss.moveAngle += dt * 1.5;
        const moveSpd = phase.moveSpeed || 100;
        const targetY = CFG.H / 2 + Math.sin(this.boss.moveAngle) * (CFG.H * 0.3);
        const dy = targetY - this.boss.y;
        this.boss.body.setVelocityY(Phaser.Math.Clamp(dy * 3, -moveSpd, moveSpd));
        if (this.boss.x < CFG.W * 0.55) {
            this.boss.body.setVelocityX(80);
        } else if (this.boss.x > CFG.W - 100) {
            this.boss.body.setVelocityX(-80);
        } else {
            this.boss.body.setVelocityX(Math.sin(this.boss.moveAngle * 0.7) * 50);
        }

        this.bossShootTimer -= delta;
        if (this.bossShootTimer <= 0 && !this.playerDead) {
            this.bossShootTimer = phase.rate || 500;
            const btype = phase.bullets;
            const spd = phase.speed || 200;

            if (btype === 'aimed') {
                const dx = this.player.x - this.boss.x;
                const dy2 = this.player.y - this.boss.y;
                const dist = Math.sqrt(dx*dx + dy2*dy2) || 1;
                this.spawnEnemyBullet(this.boss.x - 40, this.boss.y,
                    (dx / dist) * spd, (dy2 / dist) * spd);
            } else if (btype === 'spiral') {
                this.bossBulletAngle += 0.4;
                for (let i = 0; i < 3; i++) {
                    const a = this.bossBulletAngle + i * (Math.PI * 2 / 3);
                    this.spawnEnemyBullet(this.boss.x - 20, this.boss.y,
                        Math.cos(a) * spd, Math.sin(a) * spd);
                }
            } else if (btype === 'scatter') {
                for (let i = 0; i < 5; i++) {
                    const a = Math.random() * Math.PI * 2;
                    this.spawnEnemyBullet(this.boss.x - 20, this.boss.y,
                        Math.cos(a) * spd * (0.5 + Math.random() * 0.5),
                        Math.sin(a) * spd * (0.5 + Math.random() * 0.5));
                }
            } else if (btype === 'bounce') {
                for (let i = 0; i < 3; i++) {
                    const a = -Math.PI + Math.random() * Math.PI;
                    this.spawnEnemyBullet(this.boss.x - 30, this.boss.y,
                        Math.cos(a) * spd, Math.sin(a) * spd);
                }
            } else if (btype === 'ring') {
                for (let i = 0; i < 12; i++) {
                    const a = (i / 12) * Math.PI * 2;
                    this.spawnEnemyBullet(this.boss.x, this.boss.y,
                        Math.cos(a) * spd, Math.sin(a) * spd);
                }
            } else if (btype === 'sine') {
                const dx = this.player.x - this.boss.x;
                const dy3 = this.player.y - this.boss.y;
                const dist = Math.sqrt(dx*dx + dy3*dy3) || 1;
                this.spawnEnemyBullet(this.boss.x - 20, this.boss.y,
                    (dx / dist) * spd, (dy3 / dist) * spd);
                this.spawnEnemyBullet(this.boss.x - 20, this.boss.y - 30,
                    (dx / dist) * spd, (dy3 / dist) * spd * 0.8);
            } else if (btype === 'beam') {
                for (let i = -4; i <= 4; i++) {
                    this.spawnEnemyBullet(this.boss.x - 40, this.boss.y + i * 15, -spd, 0);
                }
                this.shakeMag = 4;
            }
        }
    }

    bulletHitBoss(bullet, boss) {
        if (!bullet.active || !boss.active || this.bossDefeated) return;
        // Phaser may swap args — ensure bullet is the projectile
        if (!bullet.dmg && bullet.dmg !== 0) {
            const tmp = bullet; bullet = boss; boss = tmp;
        }
        if (!bullet.active) return;
        bullet.setActive(false).setVisible(false);
        bullet.body.stop();
        const dmg = bullet.dmg || 1;
        const bd = this.boss ? this.boss.bossData : null;
        if (!bd) return;

        // Barrier system: damage barriers first
        if (this.bossBarrierHP > 0) {
            this.bossBarrierHP -= dmg;
            // Flash blue for barrier hit
            boss.setTintFill(0x4488ff);
            this.time.delayedCall(40, () => {
                if (boss.active) boss.clearTint();
            });
            // Check for barrier segment destruction
            const segmentHP = bd.barrierHP;
            const prevSegments = Math.ceil((this.bossBarrierHP + dmg) / segmentHP);
            const currSegments = Math.ceil(Math.max(this.bossBarrierHP, 0) / segmentHP);
            if (currSegments < prevSegments) {
                this.floatText(boss.x, boss.y - 40, 'BARRIER DOWN!', '#4488ff', 16);
                this.shakeMag = 5;
                sfx.explosion();
            }
            if (this.bossBarrierHP <= 0) {
                this.bossBarrierHP = 0;
                this.floatText(boss.x, boss.y - 60, 'CORE EXPOSED!', '#ff4444', 20);
                this.cameras.main.flash(200, 100, 150, 255, true);
                this.shakeMag = 8;
                sfx.bigExplosion();
            }
        } else {
            // Damage core directly
            this.bossHP -= dmg;
            boss.setTintFill(0xffffff);
            this.time.delayedCall(40, () => {
                if (boss.active) boss.clearTint();
            });
            if (this.bossHP <= 0) {
                this.killBoss();
            }
        }
    }

    killBoss() {
        if (this.bossDefeated || this.stageClear) return;
        this.bossDefeated = true;
        this.score += 10000;
        this.invulnTimer = 99999;

        if (this.boss && this.boss.body) {
            this.boss.body.stop();
            this.boss.body.enable = false;
        }

        this.enemyBullets.children.each(b => {
            if (b.active) {
                b.setActive(false).setVisible(false);
                b.body.stop();
            }
        });

        const bx = this.boss ? this.boss.x : CFG.W * 0.75;
        const by = this.boss ? this.boss.y : CFG.H / 2;
        const bw = this.boss ? this.boss.bossData.w : 120;
        const bh = this.boss ? this.boss.bossData.h : 100;

        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(i * 150, () => {
                this.spawnExplosion(
                    bx + (Math.random() - 0.5) * bw,
                    by + (Math.random() - 0.5) * bh,
                    true
                );
                sfx.bigExplosion();
            });
        }

        this.time.delayedCall(1200, () => {
            if (this.boss) {
                this.boss.destroy();
                this.boss = null;
            }
            this.bossActive = false;
            this.shakeMag = 15;
            this.cameras.main.flash(500, 255, 200, 100);
            sfx.stageClear();
            this.floatText(CFG.W / 2, CFG.H / 2, 'STAGE CLEAR!', '#8899cc', 40);

            this.stageClear = true;
            const nextStage = this.stageIdx + 1;
            const hasMoreStages = nextStage < STAGES.length;

            const transitionData = {
                characterIndex: this.charIdx,
                stageIndex: hasMoreStages ? nextStage : 0,
                loopCount: hasMoreStages ? this.loopCount : this.loopCount + 1,
                score: this.score,
                lives: this.lives
            };

            this.time.delayedCall(CFG.STAGE_CLEAR_TIME, () => {
                sfx.stopMusic();
                if (!hasMoreStages) {
                    this.floatText(CFG.W / 2, CFG.H / 2 - 60, `ENTERING LOOP ${transitionData.loopCount + 1}`, '#ffcc44', 28);
                }
                this.time.delayedCall(hasMoreStages ? 0 : 1500, () => {
                    this.scene.restart(transitionData);
                });
            });
        });
    }

    // ---- Effects ----
    spawnExplosion(x, y, big) {
        const frames = 8;
        const spr = this.add.sprite(x, y, 'explode_0').setDepth(20);
        if (big) spr.setScale(1.5);
        let frame = 0;
        const timer = this.time.addEvent({
            delay: 50,
            repeat: frames - 1,
            callback: () => {
                frame++;
                if (frame < frames) {
                    spr.setTexture(`explode_${frame}`);
                } else {
                    spr.destroy();
                }
            }
        });
    }

    floatText(x, y, text, color, size) {
        const t = this.add.text(x, y, text, {
            fontSize: `${size || 16}px`, fontFamily: 'monospace',
            fill: color || '#ffffff', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(50).setScrollFactor(0);
        this.tweens.add({
            targets: t, y: y - 50, alpha: 0,
            duration: 1200, ease: 'Cubic.easeOut',
            onComplete: () => t.destroy()
        });
    }
}

// ---- GAME OVER SCENE ----
class GameOverScene extends Phaser.Scene {
    constructor() { super('GameOver'); }
    init(data) {
        this.finalScore = data.score || 0;
        this.hiScore = data.hiScore || 0;
        this.stage = data.stage || 1;
        this.charIdx = data.characterIndex || 0;
        this.loopCount = data.loopCount || 0;
        this.victory = data.victory || false;
    }
    create() {
        this.add.rectangle(CFG.W / 2, CFG.H / 2, CFG.W, CFG.H, 0x0a0a18);
        for (let i = 0; i < 60; i++) {
            this.add.circle(Math.random() * CFG.W, Math.random() * CFG.H,
                0.5 + Math.random() * 1, 0xffffff, 0.3 + Math.random() * 0.5);
        }
        if (this.victory) {
            this.add.text(CFG.W / 2, 100, 'CONGRATULATIONS!', {
                fontSize: '48px', fontFamily: 'Impact, sans-serif',
                fill: '#8899cc', stroke: '#334466', strokeThickness: 5
            }).setOrigin(0.5);
            this.add.text(CFG.W / 2, 160, 'The Bacterian threat has been neutralized.', {
                fontSize: '16px', fontFamily: 'monospace', fill: '#aaaacc'
            }).setOrigin(0.5);
        } else {
            this.add.text(CFG.W / 2, 100, 'GAME OVER', {
                fontSize: '56px', fontFamily: 'Impact, sans-serif',
                fill: '#ff4444', stroke: '#880000', strokeThickness: 5
            }).setOrigin(0.5);
            const stageInfo = this.loopCount > 0
                ? `Made it to Stage ${this.stage} (Loop ${this.loopCount + 1})`
                : `Made it to Stage ${this.stage}`;
            this.add.text(CFG.W / 2, 160, stageInfo, {
                fontSize: '16px', fontFamily: 'monospace', fill: '#aaaacc'
            }).setOrigin(0.5);
        }
        this.add.text(CFG.W / 2, 230, `SCORE: ${this.finalScore}`, {
            fontSize: '28px', fontFamily: 'monospace', fill: '#ffffff'
        }).setOrigin(0.5);
        this.add.text(CFG.W / 2, 270, `HI-SCORE: ${this.hiScore}`, {
            fontSize: '20px', fontFamily: 'monospace', fill: '#8899cc'
        }).setOrigin(0.5);
        if (this.finalScore >= this.hiScore && this.finalScore > 0) {
            const newHi = this.add.text(CFG.W / 2, 305, 'NEW HIGH SCORE!', {
                fontSize: '18px', fontFamily: 'monospace', fill: '#4488cc'
            }).setOrigin(0.5);
            this.tweens.add({ targets: newHi, alpha: 0.3, yoyo: true, repeat: -1, duration: 400 });
        }
        const retry = this.add.text(CFG.W / 2, 390, 'PRESS ENTER TO CONTINUE', {
            fontSize: '20px', fontFamily: 'monospace', fill: '#ffffff'
        }).setOrigin(0.5);
        this.tweens.add({ targets: retry, alpha: 0, yoyo: true, repeat: -1, duration: 600 });
        this.add.text(CFG.W / 2, 430, 'PRESS T FOR TITLE SCREEN', {
            fontSize: '14px', fontFamily: 'monospace', fill: '#666688'
        }).setOrigin(0.5);
        const retryData = {
            characterIndex: this.charIdx,
            stageIndex: Math.max((this.stage - 1), 0),
            loopCount: this.loopCount,
            score: 0,
            lives: CFG.START_LIVES
        };
        this.input.keyboard.on('keydown-ENTER', () => {
            sfx.menuSelect();
            this.scene.start('Game', retryData);
        });
        this.input.keyboard.on('keydown-T', () => {
            sfx.menuSelect();
            this.scene.start('Title');
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            sfx.menuSelect();
            this.scene.start('Game', retryData);
        });
    }
}
