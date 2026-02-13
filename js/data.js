// ============================================================
// PARODIUS — Game Data & Configuration
// ============================================================

const GAME_TITLE = 'PARODIUS';
const GAME_VERSION = 'v1.0.0';

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
    // --- Stage 4: Crystal (icy/prismatic) ---
    shardling:       { hp: 2, score: 220, speed: 190, size: 30, hue: 200, shoots: false, drop: 0.10, pattern: 'slide' },
    prismManta:      { hp: 3, score: 300, speed: 140, size: 40, hue: 235, shoots: true,  shootCD: 2400, drop: 0.16, pattern: 'sine' },
    frostNode:       { hp: 4, score: 340, speed: 0,   size: 38, hue: 180, shoots: true,  shootCD: 1700, spread: 3, drop: 0.18, pattern: 'fixed' },
    glaciaWorm:      { hp: 5, score: 420, speed: 90,  size: 46, hue: 250, shoots: false, drop: 0.22, pattern: 'drift', enrage: true },
    // --- Stage 5: Factory (mechanical) ---
    rivetImp:        { hp: 2, score: 240, speed: 210, size: 28, hue: 35, shoots: false, drop: 0.10, pattern: 'vee' },
    pistonHound:     { hp: 3, score: 320, speed: 170, size: 34, hue: 45, shoots: true,  shootCD: 2100, drop: 0.15, pattern: 'diagonal' },
    kilnTurret:      { hp: 5, score: 420, speed: 0,   size: 42, hue: 30, shoots: true,  shootCD: 1400, shotgun: true, drop: 0.20, pattern: 'fixed' },
    pressCrawler:    { hp: 6, score: 500, speed: 75,  size: 44, hue: 50, shoots: false, drop: 0.24, pattern: 'march' },
    // --- Stage 6: Void (dark/nebula) ---
    wraithBit:       { hp: 3, score: 280, speed: 240, size: 30, hue: 280, shoots: false, drop: 0.10, pattern: 'float' },
    novaLeech:       { hp: 4, score: 360, speed: 160, size: 38, hue: 300, shoots: true,  shootCD: 1900, drop: 0.16, pattern: 'burst' },
    abyssAnchor:     { hp: 6, score: 460, speed: 0,   size: 44, hue: 265, shoots: true,  shootCD: 1300, spread: 4, drop: 0.20, pattern: 'fixed' },
    eclipseSerpent:  { hp: 7, score: 560, speed: 100, size: 50, hue: 290, shoots: true,  shootCD: 2300, shotgun: true, drop: 0.25, pattern: 'sine', enrage: true },
    // --- Stage 7: Fortress (final) ---
    legionScout:     { hp: 4, score: 320, speed: 240, size: 30, hue: 10, shoots: true,  shootCD: 2500, drop: 0.09, pattern: 'slide' },
    siegeRaptor:     { hp: 5, score: 420, speed: 180, size: 40, hue: 20, shoots: true,  shootCD: 1700, drop: 0.14, pattern: 'bounce' },
    bastionTurret:   { hp: 8, score: 620, speed: 0,   size: 46, hue: 0,  shoots: true,  shootCD: 1100, spread: 5, drop: 0.18, pattern: 'fixed' },
    dreadJuggernaut: { hp: 10, score: 800, speed: 85, size: 54, hue: 40, shoots: true,  shootCD: 1800, shotgun: true, drop: 0.26, pattern: 'crawl', enrage: true },
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
    {
        id: 'cryoPrism', name: 'CRYO PRISM', hp: 360, w: 210, h: 130, hue: 220,
        coreColor: 0x77bbff, barriers: 4, barrierHP: 85,
        phases: [
            { at: 1.0,  id: 'facet',   bullets: 'sine',    rate: 1450, speed: 180, moveSpeed: 55 },
            { at: 0.66, id: 'fractal', bullets: 'spiral',  rate: 1150, speed: 220, moveSpeed: 80 },
            { at: 0.33, id: 'glacier', bullets: 'scatter',  rate: 850,  speed: 260, moveSpeed: 105 },
        ],
    },
    {
        id: 'forgeTitan', name: 'FORGE TITAN', hp: 430, w: 220, h: 140, hue: 38,
        coreColor: 0xffaa44, barriers: 5, barrierHP: 95,
        phases: [
            { at: 1.0,  id: 'smelter', bullets: 'aimed',   rate: 1200, speed: 210, moveSpeed: 60 },
            { at: 0.65, id: 'gears',   bullets: 'bounce',  rate: 900,  speed: 240, moveSpeed: 90 },
            { at: 0.30, id: 'overdrive',bullets: 'beam',   rate: 700,  speed: 300, moveSpeed: 120 },
        ],
    },
    {
        id: 'umbraThrone', name: 'UMBRA THRONE', hp: 520, w: 230, h: 150, hue: 280,
        coreColor: 0xaa66ff, barriers: 5, barrierHP: 110,
        phases: [
            { at: 1.0,  id: 'horizon', bullets: 'ring',    rate: 1100, speed: 220, moveSpeed: 70 },
            { at: 0.62, id: 'nullweave',bullets: 'sine',   rate: 820,  speed: 260, moveSpeed: 110 },
            { at: 0.28, id: 'collapse', bullets: 'spiral', rate: 620,  speed: 320, moveSpeed: 135 },
        ],
    },
    {
        id: 'ironEmperor', name: 'IRON EMPEROR', hp: 700, w: 250, h: 170, hue: 15,
        coreColor: 0xff5533, barriers: 6, barrierHP: 140,
        phases: [
            { at: 1.0,  id: 'command', bullets: 'aimed',   rate: 950,  speed: 240, moveSpeed: 85 },
            { at: 0.60, id: 'citadel', bullets: 'beam',    rate: 700,  speed: 320, moveSpeed: 120 },
            { at: 0.25, id: 'laststand',bullets: 'scatter', rate: 520, speed: 360, moveSpeed: 150 },
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
    // Stage 4: CRYSTAL (Icy/Prismatic)
    {
        name: 'CRYSTAL', bgHue: 220, bgType: 'ice', length: 4600,
        terrain: { bottom: true, top: true, complexity: 'medium' },
        waves: [
            [180,  'wave', { enemy: 'shardling',    count: 6,  y: 120, spacing: 90 }],
            [360,  'wave', { enemy: 'shardling',    count: 6,  y: 360, spacing: 90 }],
            [520,  'capsule'],
            [700,  'wave', { enemy: 'prismManta',   count: 4,  y: 180, spacing: 150 }],
            [900,  'wave', { enemy: 'frostNode',    count: 2,  y: 110, spacing: 420 }],
            [1100, 'wave', { enemy: 'shardling',    count: 8,  y: 240, spacing: 80 }],
            [1280, 'capsule'],
            [1460, 'wave', { enemy: 'glaciaWorm',   count: 2,  y: 320, spacing: 300 }],
            [1680, 'wave', { enemy: 'prismManta',   count: 5,  y: 140, spacing: 130 }],
            [1880, 'wave', { enemy: 'frostNode',    count: 2,  y: 360, spacing: 360 }],
            [2080, 'capsule'],
            [2280, 'wave', { enemy: 'shardling',    count: 10, y: 220, spacing: 70 }],
            [2520, 'wave', { enemy: 'glaciaWorm',   count: 3,  y: 280, spacing: 260 }],
            [2780, 'wave', { enemy: 'prismManta',   count: 6,  y: 120, spacing: 120 }],
            [3040, 'capsule'],
            [3300, 'wave', { enemy: 'frostNode',    count: 3,  y: 90,  spacing: 300 }],
            [3600, 'wave', { enemy: 'shardling',    count: 12, y: 260, spacing: 65 }],
            [4020, 'boss', { idx: 3 }],
        ],
    },
    // Stage 5: FACTORY (Mechanical/Industrial)
    {
        name: 'FACTORY', bgHue: 40, bgType: 'industrial', length: 5000,
        terrain: { bottom: true, top: true, complexity: 'heavy' },
        waves: [
            [160,  'wave', { enemy: 'rivetImp',     count: 8,  y: 130, spacing: 80 }],
            [340,  'wave', { enemy: 'rivetImp',     count: 8,  y: 350, spacing: 80 }],
            [520,  'capsule'],
            [700,  'wave', { enemy: 'pistonHound',  count: 5,  y: 170, spacing: 130 }],
            [900,  'wave', { enemy: 'kilnTurret',   count: 2,  y: 100, spacing: 430 }],
            [1120, 'wave', { enemy: 'pressCrawler',  count: 2,  y: 330, spacing: 320 }],
            [1320, 'capsule'],
            [1520, 'wave', { enemy: 'rivetImp',     count: 10, y: 240, spacing: 70 }],
            [1760, 'wave', { enemy: 'pistonHound',  count: 6,  y: 130, spacing: 120 }],
            [1980, 'wave', { enemy: 'kilnTurret',   count: 3,  y: 360, spacing: 300 }],
            [2200, 'capsule'],
            [2440, 'wave', { enemy: 'pressCrawler',  count: 3,  y: 300, spacing: 240 }],
            [2700, 'wave', { enemy: 'rivetImp',     count: 12, y: 190, spacing: 65 }],
            [2960, 'wave', { enemy: 'pistonHound',  count: 7,  y: 280, spacing: 110 }],
            [3240, 'capsule'],
            [3500, 'wave', { enemy: 'kilnTurret',   count: 3,  y: 120, spacing: 260 }],
            [3800, 'wave', { enemy: 'pressCrawler',  count: 4,  y: 340, spacing: 210 }],
            [4120, 'wave', { enemy: 'rivetImp',     count: 14, y: 220, spacing: 60 }],
            [4480, 'boss', { idx: 4 }],
        ],
    },
    // Stage 6: VOID (Dark Nebula)
    {
        name: 'VOID', bgHue: 285, bgType: 'nebula', length: 5400,
        terrain: { bottom: false, top: false, complexity: 'medium' },
        waves: [
            [180,  'wave', { enemy: 'wraithBit',      count: 8,  y: 120, spacing: 85 }],
            [360,  'wave', { enemy: 'wraithBit',      count: 8,  y: 360, spacing: 85 }],
            [560,  'capsule'],
            [760,  'wave', { enemy: 'novaLeech',      count: 5,  y: 180, spacing: 140 }],
            [980,  'wave', { enemy: 'abyssAnchor',    count: 2,  y: 110, spacing: 460 }],
            [1220, 'wave', { enemy: 'eclipseSerpent', count: 2,  y: 280, spacing: 340 }],
            [1460, 'capsule'],
            [1700, 'wave', { enemy: 'wraithBit',      count: 12, y: 230, spacing: 68 }],
            [1960, 'wave', { enemy: 'novaLeech',      count: 6,  y: 140, spacing: 120 }],
            [2220, 'wave', { enemy: 'abyssAnchor',    count: 3,  y: 350, spacing: 300 }],
            [2460, 'capsule'],
            [2720, 'wave', { enemy: 'eclipseSerpent', count: 3,  y: 260, spacing: 260 }],
            [2980, 'wave', { enemy: 'wraithBit',      count: 14, y: 200, spacing: 60 }],
            [3260, 'wave', { enemy: 'novaLeech',      count: 7,  y: 320, spacing: 110 }],
            [3560, 'capsule'],
            [3860, 'wave', { enemy: 'abyssAnchor',    count: 4,  y: 100, spacing: 240 }],
            [4180, 'wave', { enemy: 'eclipseSerpent', count: 4,  y: 300, spacing: 220 }],
            [4540, 'wave', { enemy: 'wraithBit',      count: 16, y: 240, spacing: 55 }],
            [4940, 'boss', { idx: 5 }],
        ],
    },
    // Stage 7: FORTRESS (Final)
    {
        name: 'FORTRESS', bgHue: 15, bgType: 'fortress', length: 6000,
        terrain: { bottom: true, top: true, complexity: 'heavy' },
        waves: [
            [180,  'wave', { enemy: 'legionScout',     count: 10, y: 130, spacing: 75 }],
            [360,  'wave', { enemy: 'legionScout',     count: 10, y: 350, spacing: 75 }],
            [560,  'capsule'],
            [780,  'wave', { enemy: 'siegeRaptor',     count: 6,  y: 170, spacing: 120 }],
            [1020, 'wave', { enemy: 'bastionTurret',   count: 2,  y: 100, spacing: 470 }],
            [1260, 'wave', { enemy: 'dreadJuggernaut', count: 2,  y: 320, spacing: 360 }],
            [1500, 'capsule'],
            [1740, 'wave', { enemy: 'legionScout',     count: 14, y: 220, spacing: 62 }],
            [2000, 'wave', { enemy: 'siegeRaptor',     count: 7,  y: 130, spacing: 110 }],
            [2260, 'wave', { enemy: 'bastionTurret',   count: 3,  y: 360, spacing: 320 }],
            [2520, 'capsule'],
            [2780, 'wave', { enemy: 'dreadJuggernaut', count: 3,  y: 300, spacing: 260 }],
            [3060, 'wave', { enemy: 'legionScout',     count: 16, y: 180, spacing: 58 }],
            [3340, 'wave', { enemy: 'siegeRaptor',     count: 8,  y: 290, spacing: 105 }],
            [3640, 'capsule'],
            [3940, 'wave', { enemy: 'bastionTurret',   count: 4,  y: 120, spacing: 250 }],
            [4260, 'wave', { enemy: 'dreadJuggernaut', count: 4,  y: 340, spacing: 220 }],
            [4620, 'wave', { enemy: 'legionScout',     count: 18, y: 240, spacing: 52 }],
            [5000, 'capsule'],
            [5360, 'wave', { enemy: 'siegeRaptor',     count: 10, y: 200, spacing: 95 }],
            [5660, 'boss', { idx: 6 }],
        ],
    },
];
