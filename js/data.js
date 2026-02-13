// ============================================================
// GRADIUS IV — Game Data & Configuration
// ============================================================

const CFG = {
    W: 960,
    H: 540,
    SCROLL_SPEED: 3.5,
    PLAYER_SPEED: 280,
    BULLET_SPEED: 650,
    ENEMY_BULLET_SPEED: 220,
    MAX_OPTIONS: 4,
    OPTION_DELAY: 12,
    START_LIVES: 3,
    POWER_SLOTS: ['SPEED UP','MISSILE','DOUBLE','LASER','OPTION','SHIELD'],
    SPEED_LEVELS: 5,
    INVULN_TIME: 2000,
    RESPAWN_TIME: 1500,
    CAPSULE_SPAWN_COUNT: 3,
    BOSS_WARNING_TIME: 3000,
    STAGE_CLEAR_TIME: 4000,
};

const CHARACTERS = [
    {
        id: 'typeI', name: 'TYPE-I CLASSIC',
        desc: 'Standard missiles, 45° double, piercing laser',
        bodyStyle: 'sleekFighter',
        missileType: 'down', doubleAngle: -45,
        laserLen: 200, shieldType: 'front',
    },
    {
        id: 'typeII', name: 'TYPE-II SPREAD',
        desc: 'Spread bombs, tail gun, medium laser',
        bodyStyle: 'spreadWing',
        missileType: 'spread', doubleAngle: 180,
        laserLen: 160, shieldType: 'forcefield',
    },
    {
        id: 'typeV', name: 'TYPE-V ARMOR',
        desc: 'Vertical mines, 45° double, short power laser',
        bodyStyle: 'armorPiercer',
        missileType: 'vertical', doubleAngle: -45,
        laserLen: 120, shieldType: 'front',
    },
    {
        id: 'typeVI', name: 'TYPE-VI TWIN',
        desc: 'Flying torpedoes, tail gun, twin laser',
        bodyStyle: 'sweptWing',
        missileType: 'forward', doubleAngle: 180,
        laserLen: 220, shieldType: 'forcefield',
    },
];

// Enemy type definitions
const ENEMIES = {
    // --- Stage 1: Liquid Metal (space, metallic) ---
    kill:            { hp: 1, score: 100, speed: 120, size: 32, hue: 210, shoots: true,  shootCD: 2200, drop: 0.15, pattern: 'sine' },
    gearMkII:        { hp: 1, score: 150, speed: 180, size: 28, hue: 220, shoots: false, drop: 0.10, pattern: 'vee' },
    rugal:           { hp: 2, score: 200, speed: 0,   size: 36, hue: 200, shoots: true,  shootCD: 2500, spread: 2, drop: 0.20, pattern: 'fixed' },
    meltingDragon:   { hp: 3, score: 300, speed: 60,  size: 48, hue: 240, shoots: false, drop: 0.25, pattern: 'drift', enrage: true },
    // --- Stage 2: Magma (volcanic, warm mechanical) ---
    saika:           { hp: 1, score: 100, speed: 100, size: 30, hue: 15,  shoots: false, drop: 0.10, pattern: 'diagonal', splits: true },
    ducker:          { hp: 1, score: 150, speed: 140, size: 24, hue: 25,  shoots: false, drop: 0.12, pattern: 'bounce' },
    turretTheta:     { hp: 3, score: 250, speed: 0,   size: 36, hue: 10,  shoots: true,  shootCD: 1500, drop: 0.20, pattern: 'fixed' },
    lavaCrawler:     { hp: 1, score: 50,  speed: 80,  size: 26, hue: 20,  shoots: false, drop: 0.05, pattern: 'march' },
    // --- Stage 3: Cell (organic interior, bio-toned) ---
    sera:            { hp: 2, score: 200, speed: 150, size: 34, hue: 280, shoots: true,  shootCD: 2800, drop: 0.15, pattern: 'burst' },
    spina:           { hp: 1, score: 150, speed: 260, size: 28, hue: 160, shoots: false, drop: 0.08, pattern: 'slide' },
    tendril:         { hp: 3, score: 300, speed: 50,  size: 40, hue: 310, shoots: true,  shootCD: 2000, shotgun: true, drop: 0.20, pattern: 'float' },
    crawler:         { hp: 4, score: 350, speed: 60,  size: 36, hue: 145, shoots: false, drop: 0.25, pattern: 'crawl' },
};

// Boss data
const BOSSES = [
    {
        id: 'bubbleCore', name: 'BUBBLE CORE', hp: 200, w: 200, h: 100, hue: 210,
        coreColor: 0x4488ff, barriers: 4, barrierHP: 50,
        phases: [
            { at: 1.0, id: 'peck',    bullets: 'aimed',   rate: 600,  speed: 300, moveSpeed: 180 },
            { at: 0.6, id: 'spiral',  bullets: 'spiral',  rate: 120,  speed: 200, moveSpeed: 120 },
            { at: 0.3, id: 'frenzy',  bullets: 'scatter',  rate: 300,  speed: 280, moveSpeed: 260 },
        ],
    },
    {
        id: 'rollingCore', name: 'ROLLING CORE', hp: 250, w: 200, h: 120, hue: 25,
        coreColor: 0xff6622, barriers: 4, barrierHP: 60,
        phases: [
            { at: 1.0, id: 'bounce',  bullets: 'bounce',  rate: 500,  speed: 250, moveSpeed: 100 },
            { at: 0.5, id: 'sticky',  bullets: 'aimed',   rate: 400,  speed: 180, moveSpeed: 140 },
            { at: 0.25,id: 'detach',  bullets: 'ring',    rate: 200,  speed: 200, moveSpeed: 220 },
        ],
    },
    {
        id: 'berial', name: 'BERIAL', hp: 300, w: 180, h: 140, hue: 140,
        coreColor: 0x44ff66, barriers: 3, barrierHP: 70,
        phases: [
            { at: 1.0, id: 'notes',   bullets: 'sine',    rate: 350,  speed: 220, moveSpeed: 80 },
            { at: 0.5, id: 'scream',  bullets: 'beam',    rate: 3000, speed: 0,   moveSpeed: 60 },
            { at: 0.25,id: 'inhale',  bullets: 'scatter',  rate: 400,  speed: 160, moveSpeed: 40 },
        ],
    },
];

// Stage wave timeline — [scrollX, eventType, data]
const STAGES = [
    // Stage 1: LIQUID METAL (Space)
    {
        name: 'LIQUID METAL', bgHue: 230, bgType: 'space', length: 3600,
        terrain: { bottom: true, top: false, complexity: 'light' },
        waves: [
            [100,  'wave', { enemy: 'kill',           count: 5, y: 140, spacing: 60 }],
            [350,  'wave', { enemy: 'gearMkII',       count: 7, y: 200, spacing: 40 }],
            [600,  'wave', { enemy: 'kill',            count: 6, y: 340, spacing: 55 }],
            [800,  'wave', { enemy: 'rugal',           count: 3, y: 100, spacing: 120 }],
            [900,  'capsule'],
            [1050, 'wave', { enemy: 'meltingDragon',   count: 4, y: 240, spacing: 80 }],
            [1300, 'wave', { enemy: 'kill',            count: 8, y: 180, spacing: 50 }],
            [1300, 'wave', { enemy: 'gearMkII',        count: 5, y: 360, spacing: 45 }],
            [1500, 'capsule'],
            [1600, 'wave', { enemy: 'rugal',           count: 4, y: 300, spacing: 100 }],
            [1850, 'wave', { enemy: 'meltingDragon',   count: 5, y: 160, spacing: 70 }],
            [2100, 'wave', { enemy: 'kill',            count: 10, y: 260, spacing: 45 }],
            [2100, 'capsule'],
            [2350, 'wave', { enemy: 'gearMkII',        count: 8, y: 140, spacing: 40 }],
            [2550, 'wave', { enemy: 'rugal',           count: 5, y: 200, spacing: 90 }],
            [2700, 'wave', { enemy: 'meltingDragon',   count: 6, y: 300, spacing: 65 }],
            [2900, 'wave', { enemy: 'kill',            count: 12, y: 220, spacing: 40 }],
            [3100, 'boss', { idx: 0 }],
        ],
    },
    // Stage 2: MAGMA (Volcanic)
    {
        name: 'MAGMA', bgHue: 15, bgType: 'magma', length: 3200,
        terrain: { bottom: true, top: true, complexity: 'medium' },
        waves: [
            [100,  'wave', { enemy: 'saika',           count: 6, y: 180, spacing: 55 }],
            [300,  'wave', { enemy: 'lavaCrawler',     count: 10, y: 410, spacing: 35 }],
            [550,  'wave', { enemy: 'ducker',          count: 5, y: 250, spacing: 60 }],
            [700,  'capsule'],
            [780,  'wave', { enemy: 'turretTheta',     count: 3, y: 130, spacing: 110 }],
            [1000, 'wave', { enemy: 'saika',           count: 8, y: 300, spacing: 50 }],
            [1200, 'wave', { enemy: 'lavaCrawler',     count: 14, y: 420, spacing: 30 }],
            [1200, 'capsule'],
            [1400, 'wave', { enemy: 'ducker',          count: 7, y: 200, spacing: 55 }],
            [1600, 'wave', { enemy: 'turretTheta',     count: 4, y: 340, spacing: 100 }],
            [1800, 'wave', { enemy: 'saika',           count: 10, y: 250, spacing: 45 }],
            [1800, 'capsule'],
            [2000, 'wave', { enemy: 'lavaCrawler',     count: 16, y: 400, spacing: 28 }],
            [2200, 'wave', { enemy: 'ducker',          count: 8, y: 180, spacing: 50 }],
            [2400, 'wave', { enemy: 'turretTheta',     count: 5, y: 260, spacing: 90 }],
            [2700, 'boss', { idx: 1 }],
        ],
    },
    // Stage 3: CELL (Organic interior)
    {
        name: 'CELL', bgHue: 280, bgType: 'cell', length: 3200,
        terrain: { bottom: true, top: false, complexity: 'medium' },
        waves: [
            [100,  'wave', { enemy: 'sera',            count: 4, y: 200, spacing: 70 }],
            [350,  'wave', { enemy: 'spina',           count: 6, y: 400, spacing: 50 }],
            [550,  'wave', { enemy: 'tendril',         count: 3, y: 250, spacing: 90 }],
            [700,  'capsule'],
            [800,  'wave', { enemy: 'crawler',         count: 4, y: 430, spacing: 80 }],
            [1050, 'wave', { enemy: 'sera',            count: 6, y: 300, spacing: 60 }],
            [1250, 'wave', { enemy: 'spina',           count: 8, y: 100, spacing: 45 }],
            [1250, 'capsule'],
            [1450, 'wave', { enemy: 'tendril',         count: 5, y: 180, spacing: 80 }],
            [1650, 'wave', { enemy: 'crawler',         count: 6, y: 440, spacing: 70 }],
            [1900, 'wave', { enemy: 'sera',            count: 8, y: 250, spacing: 55 }],
            [1900, 'capsule'],
            [2100, 'wave', { enemy: 'spina',           count: 10, y: 350, spacing: 40 }],
            [2350, 'wave', { enemy: 'tendril',         count: 4, y: 160, spacing: 85 }],
            [2350, 'wave', { enemy: 'crawler',         count: 5, y: 430, spacing: 65 }],
            [2700, 'boss', { idx: 2 }],
        ],
    },
];
