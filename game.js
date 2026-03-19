// ============================================================
//  RADAR FIGHTERS 2 — PLATFORMER BRAWLER
//  PixiJS v8 · Smash Bros-style · Platform stages
//  Scenes: MENU → CHARACTER_SELECT → FIGHT → GAME_OVER
// ============================================================

const SCENES = { MENU: 0, CHARACTER_SELECT: 1, FIGHT: 2, GAME_OVER: 3 };

// ── Game constants ──────────────────────────────────────────
const GRAVITY        = 0.55;
const MOVE_SPEED     = 5;
const JUMP_VY        = -15;         // First jump velocity
const DOUBLE_JUMP_VY = -12;         // Double jump velocity
const ATTACK_DUR     = 18;          // Base attack animation frames
const ATTACK_RANGE   = 95;
const ATTACK_RANGE_Y = 70;
const STOCKS         = 3;           // Lives per fighter
const DOUBLE_TAP_MS  = 350;
const KB_FRICTION    = 0.985;       // Knockback air friction (low = flies far)
const AIR_FRICTION   = 0.96;        // Normal air movement friction

// ── Attack definitions (Platformer Brawler style) ───────────
// dmg  = base % damage added
// kbx/kby = base knockback (scaled by defender.damage %)
// Scale formula: 0.3 + defender.damage / 100
const ATTACKS = {
  NORMAL:  { dmg: 7,  cd: 20, range: ATTACK_RANGE,        kbx: 4.5, kby: -4,  dur: 15, isKick: false, label: 'HIT!'  },
  KICK:    { dmg: 11, cd: 32, range: ATTACK_RANGE * 1.05, kbx: 6.5, kby: -10, dur: 22, isKick: true,  label: 'KICK!' },
  SPECIAL: { dmg: 18, cd: 55, range: ATTACK_RANGE * 1.1,  kbx: 10,  kby: -15, dur: 30, isKick: false, label: 'POW!' },
};

// ── Character definitions ───────────────────────────────────
const CHARACTERS = [
  // ── Founders ──
  { name: 'HERBERT', title: 'CO-FOUNDER & CEO',   power: 9, speed: 6, defense: 6, color: 0xc0392b, accentColor: 0xff6b6b, portrait: 'assets/char_herbert.png' },
  { name: 'GABO',    title: 'CO-FOUNDER & CTO',   power: 8, speed: 8, defense: 5, color: 0x2980b9, accentColor: 0x74b9ff, portrait: 'assets/char_gabo.png' },
  { name: 'AMANDA',  title: 'CO-FOUNDER & CRO',   power: 8, speed: 8, defense: 5, color: 0xe8735a, accentColor: 0xffb8b8, portrait: 'assets/char_amanda.png' },
  // ── Engineering ──
  { name: 'ARTURO',  title: 'TECH MANAGER',        power: 6, speed: 9, defense: 6, color: 0x2c3e50, accentColor: 0x95a5a6, portrait: 'assets/char_arturo.png' },
  { name: 'JAIME',   title: 'TECH LEAD',           power: 7, speed: 8, defense: 6, color: 0x1abc9c, accentColor: 0x76d7c4, portrait: 'assets/char_jaime.png' },
  { name: 'CHRIS',   title: 'BACKEND ENG LVL 3',  power: 6, speed: 9, defense: 6, color: 0xf39c12, accentColor: 0xffeaa7, portrait: 'assets/char_chris.png' },
  { name: 'KEVIN',   title: 'FULL STACK ENG',      power: 7, speed: 8, defense: 6, color: 0x0984e3, accentColor: 0x74b9ff, portrait: 'assets/char_kevin.png' },
  { name: 'LORENS',  title: 'BACKEND ENG',         power: 6, speed: 9, defense: 6, color: 0xe17055, accentColor: 0xfab1a0, portrait: 'assets/char_lorens.png' },
  { name: 'NELSON',  title: 'BACKEND ENG',         power: 7, speed: 8, defense: 6, color: 0x6c3483, accentColor: 0xaf7ac5, portrait: 'assets/char_nelson.png' },
  { name: 'ANDRÉS',  title: 'DEVOPS ENG',          power: 6, speed: 7, defense: 8, color: 0x117a65, accentColor: 0x52be80, portrait: 'assets/char_andres.png' },
  { name: 'JAVIER',  title: 'FRONTEND DEV',        power: 6, speed: 9, defense: 5, color: 0x34495e, accentColor: 0x85929e, portrait: 'assets/char_javier.png' },
  { name: 'GERARDO', title: 'LOW CODE ENG',        power: 6, speed: 7, defense: 7, color: 0xe74c3c, accentColor: 0xf1948a, portrait: 'assets/char_gerardo.png' },
  // ── Product ──
  { name: 'CARLO',   title: 'PRODUCT LEAD',        power: 8, speed: 7, defense: 6, color: 0x8e44ad, accentColor: 0xd7bde2, portrait: 'assets/char_carlo.png' },
  // ── Business ──
  { name: 'ESTEBAN', title: 'BIZ DEV ASSOC',       power: 8, speed: 8, defense: 5, color: 0xe67e22, accentColor: 0xf8c471, portrait: 'assets/char_esteban.png' },
  { name: 'FRANCISCO',title:'BUSINESS ANALYST',    power: 7, speed: 7, defense: 7, color: 0x6c5ce7, accentColor: 0xa29bfe, portrait: 'assets/char_francisco.png' },
  // ── Sales ──
  { name: 'HÉCTOR',  title: 'SALES MANAGER',       power: 8, speed: 7, defense: 6, color: 0x922b21, accentColor: 0xec7063, portrait: 'assets/char_hector.png' },
  { name: 'ALEX',    title: 'SALES EXEC',           power: 9, speed: 8, defense: 4, color: 0xd4ac0d, accentColor: 0xf9e79f, portrait: 'assets/char_alex.png' },
  // ── Operations ──
  { name: 'DANI',    title: 'OPERATIONS ANALYST',  power: 5, speed: 7, defense: 8, color: 0x27ae60, accentColor: 0xa9dfbf, portrait: 'assets/char_dani.png' },
  { name: 'YONG',    title: 'OPERATIONS MANAGER',  power: 6, speed: 7, defense: 8, color: 0x1a5276, accentColor: 0x5dade2, portrait: 'assets/char_yong.png' },
  // ── Finance ──
  { name: 'GERI',    title: 'ACCOUNTING MANAGER',  power: 5, speed: 6, defense: 9, color: 0xf1c40f, accentColor: 0xfcf3cf, portrait: 'assets/char_geri.png' },
  // ── People ──
  { name: 'MAX',     title: 'PEOPLE & CULTURE',    power: 7, speed: 7, defense: 7, color: 0x00b894, accentColor: 0x55efc4, portrait: 'assets/char_max.png' },
  // ── Marketing / Comms ──
  { name: 'ANDY',    title: 'MARKETING LEAD',      power: 8, speed: 8, defense: 5, color: 0xfd79a8, accentColor: 0xffb8d1, portrait: 'assets/char_andy.png' },
  { name: 'KAREN',   title: 'COMMS ANALYST',       power: 6, speed: 8, defense: 6, color: 0xfdcb6e, accentColor: 0xffeaa7, portrait: 'assets/char_karen.png' },
  // ── 🐬 Secret Boss ──
  { name: 'RADARÍN', title: 'CHIEF CULTURE OFF.',  power:10, speed:10, defense:10, color: 0x0099e5, accentColor: 0x00d2ff, portrait: 'assets/char_radarin.png' },
];

// ── Global state ─────────────────────────────────────────────
let app, currentScene = SCENES.MENU;
let textures = {};
window._textures = textures;
let sceneContainer = null;
let gameMode = '1P';  // '1P' or '2P'
let p1CharIdx = 0, p2CharIdx = 12;
const STAGES = ['bg_ixtapa', 'bg_vallebravo', 'bg_colchagua', 'bg_zapallar'];
let currentStage = null;

let audioCtx = null;
let musicNodes = [];
let currentMusicGain = null;
let bgmPlaying = false;
let musicSessionId = 0;
let currentMusicVolume = 0;
let isMuted = false;
let muteButton = null;
let muteButtonBg = null;
let muteButtonLabel = null;

// ─── Loading bar helper ──────────────────────────────────────
function setLoading(pct, msg) {
  const bar = document.getElementById('loading-bar');
  const txt = document.getElementById('loading-text');
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = msg || 'Loading...';
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
async function init() {
  app = new PIXI.Application();
  await app.init({
    resizeTo: window,
    backgroundColor: 0x000000,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  document.body.appendChild(app.canvas);
  app.stage.sortableChildren = true;

  setLoading(20, 'Loading backgrounds...');

  const assetList = [
    { alias: 'menu_bg',   src: 'assets/menu_bg.jpg' },
    { alias: 'select_bg', src: 'assets/select_bg.jpg' },
    { alias: 'bg',           src: 'assets/background.jpg' },
    { alias: 'bg_ixtapa',    src: 'assets/background.jpg' },
    { alias: 'bg_vallebravo',src: 'assets/bg_valle_bravo.jpg' },
    { alias: 'bg_colchagua', src: 'assets/bg_colchagua.jpg' },
    { alias: 'bg_zapallar',  src: 'assets/bg_zapallar.jpg' },
    ...CHARACTERS.map((c, i) => ({ alias: `char_${i}`, src: c.portrait })),
    ...CHARACTERS.map((c, i) => {
      const n = c.portrait.replace('assets/char_', '').replace('.png', '');
      return [
        { alias: `spr_${i}_idle`, src: `assets/spr_${n}_idle.png` },
        { alias: `spr_${i}_atk`,  src: `assets/spr_${n}_atk.png`  },
        { alias: `spr_${i}_hit`,  src: `assets/spr_${n}_hit.png`  },
      ];
    }).flat(),
    ...CHARACTERS.map((c, i) => {
      const n = c.portrait.replace('assets/char_', '').replace('.png', '');
      return ['kick','block','special','win','ko','jump','crouch','throw','taunt','walk'].map(pose => (
        { alias: `spr_${i}_${pose}`, src: `assets/spr_${n}_${pose}.png` }
      ));
    }).flat(),
    ...CHARACTERS.map((c, i) => {
      const n = c.portrait.replace('assets/char_', '').replace('.png', '');
      return [
        { alias: `spr_${i}_idle_f0`, src: `assets/spr_${n}_idle_f0.png` },
        { alias: `spr_${i}_idle_f1`, src: `assets/spr_${n}_idle_f1.png` },
        { alias: `spr_${i}_idle_f2`, src: `assets/spr_${n}_idle_f2.png` },
        { alias: `spr_${i}_walk_f0`, src: `assets/spr_${n}_walk_f0.png` },
        { alias: `spr_${i}_walk_f1`, src: `assets/spr_${n}_walk_f1.png` },
      ];
    }).flat(),
  ];

  let loaded = 0;
  for (const asset of assetList) {
    try { PIXI.Assets.add(asset); } catch(e) {}
    try { textures[asset.alias] = await PIXI.Assets.load(asset.src); } catch(e) {
      console.warn('Could not load:', asset.src);
    }
    loaded++;
    setLoading(20 + (loaded / assetList.length) * 70, `Loading ${asset.alias}...`);
  }

  setLoading(100, 'Ready!');
  await new Promise(r => setTimeout(r, 300));

  const ls = document.getElementById('loading-screen');
  if (ls) ls.style.display = 'none';

  initAudio();
  createMuteButton();
  showScene(SCENES.MENU);
}

// ═══════════════════════════════════════════════════════════
// AUDIO (Web Audio API 8-bit chiptune)
// ═══════════════════════════════════════════════════════════
function initAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e) {
    console.warn('Web Audio not available');
  }
}

function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      if (!bgmPlaying && currentScene) {
        switch (currentScene) {
          case SCENES.MENU:
          case SCENES.CHARACTER_SELECT:
            playMenuMusic(); break;
          case SCENES.FIGHT:
            playFightMusic(); break;
        }
      }
    });
  }
}

function stopMusic() {
  bgmPlaying = false;
  musicSessionId++;
  if (currentMusicGain) {
    try { currentMusicGain.disconnect(); } catch(e) {}
    currentMusicGain = null;
  }
  musicNodes.forEach(n => {
    try { n.stop(); } catch(e) {}
    try { n.disconnect(); } catch(e) {}
  });
  musicNodes = [];
}

function applyCurrentMusicVolume() {
  if (!audioCtx || !currentMusicGain) return;
  currentMusicGain.gain.cancelScheduledValues(audioCtx.currentTime);
  currentMusicGain.gain.setValueAtTime(isMuted ? 0 : currentMusicVolume, audioCtx.currentTime);
}

function setCurrentMusicGain(gainNode, volume) {
  currentMusicGain = gainNode;
  currentMusicVolume = volume;
  applyCurrentMusicVolume();
}

function updateMuteButton() {
  if (!muteButtonBg || !muteButtonLabel) return;
  muteButtonBg.clear();
  muteButtonBg.roundRect(0, 0, 40, 40, 10);
  muteButtonBg.fill({ color: 0x000000, alpha: 0.5 });
  muteButtonBg.stroke({ color: 0xffffff, alpha: 0.35, width: 1.5 });
  muteButtonLabel.text = isMuted ? '🔇' : '🔊';
}

function positionMuteButton() {
  if (!muteButton) return;
  muteButton.x = W() - 50;
  muteButton.y = 20;
}

function toggleMute() {
  isMuted = !isMuted;
  applyCurrentMusicVolume();
  updateMuteButton();
}

function createMuteButton() {
  muteButton = new PIXI.Container();
  muteButton.zIndex = 100;
  muteButton.eventMode = 'static';
  muteButton.cursor = 'pointer';
  muteButtonBg = new PIXI.Graphics();
  muteButtonLabel = makeText('🔊', { size: 20, color: 0xffffff });
  muteButtonLabel.anchor.set(0.5);
  muteButtonLabel.x = 20;
  muteButtonLabel.y = 20;
  muteButton.addChild(muteButtonBg, muteButtonLabel);
  muteButton.on('pointerdown', (e) => { e.stopPropagation(); toggleMute(); });
  muteButton.on('pointertap', (e) => { e.stopPropagation(); });
  positionMuteButton();
  updateMuteButton();
  app.stage.addChild(muteButton);
  app.renderer.on?.('resize', positionMuteButton);
}

function playMenuMusic() {
  if (!audioCtx || bgmPlaying) return;
  if (audioCtx.state === 'suspended') { resumeAudio(); return; }
  bgmPlaying = true;
  const mySession = musicSessionId;
  const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 783.99, 698.46, 659.25, 587.33, 523.25, 493.88, 440, 493.88, 523.25, 587.33];
  const noteDur = 0.15;
  const gain = audioCtx.createGain();
  gain.connect(audioCtx.destination);
  setCurrentMusicGain(gain, 0.015);
  musicNodes.push(gain);
  let t = audioCtx.currentTime, step = 0;
  function scheduleNote() {
    if (!bgmPlaying || musicSessionId !== mySession) return;
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(notes[step % notes.length], t);
    osc.connect(gain); osc.start(t); osc.stop(t + noteDur * 0.9);
    musicNodes.push(osc); t += noteDur; step++;
    if (musicNodes.length > 32) musicNodes.splice(1, 16);
    if (bgmPlaying && musicSessionId === mySession) setTimeout(scheduleNote, (noteDur * 1000) * 0.5);
  }
  scheduleNote();
}

function playVictoryMusic(onDone) {
  stopMusic();
  if (!audioCtx) { if (onDone) setTimeout(onDone, 2500); return; }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
    if (onDone) setTimeout(onDone, 2500);
    return;
  }
  bgmPlaying = true;
  const mySession = musicSessionId;
  const fanfare = [523, 659, 784, 1047, 784, 1047, 1319, 1047, 1319];
  const noteDur = 0.14;
  const gain = audioCtx.createGain();
  gain.connect(audioCtx.destination);
  setCurrentMusicGain(gain, 0.02);
  musicNodes.push(gain);
  let t = audioCtx.currentTime + 0.1;
  fanfare.forEach((freq) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);
    osc.connect(gain); osc.start(t); osc.stop(t + noteDur * 0.8);
    musicNodes.push(osc); t += noteDur;
  });
  const totalDur = (fanfare.length * noteDur + 0.1) * 1000;
  setTimeout(() => {
    if (musicSessionId !== mySession) return;
    stopMusic();
    if (onDone) onDone();
  }, totalDur + 400);
}

function playFightMusic() {
  stopMusic();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') { resumeAudio(); return; }
  bgmPlaying = true;
  const mySession = musicSessionId;
  const fightNotes = [220, 246.94, 261.63, 220, 196, 220, 246.94, 261.63, 293.66, 261.63, 246.94, 220, 196, 174.61, 196, 220];
  const noteDur = 0.12;
  const gain = audioCtx.createGain();
  gain.connect(audioCtx.destination);
  setCurrentMusicGain(gain, 0.0125);
  musicNodes.push(gain);
  let t = audioCtx.currentTime, step = 0;
  function scheduleNote() {
    if (!bgmPlaying || musicSessionId !== mySession) return;
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(fightNotes[step % fightNotes.length], t);
    osc.connect(gain); osc.start(t); osc.stop(t + noteDur * 0.85);
    musicNodes.push(osc); t += noteDur; step++;
    if (musicNodes.length > 32) musicNodes.splice(1, 16);
    if (bgmPlaying && musicSessionId === mySession) setTimeout(scheduleNote, (noteDur * 1000) * 0.5);
  }
  scheduleNote();
}

function playSFX(type) {
  if (!audioCtx) return;
  resumeAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  if (type === 'punch') {
    osc.type = 'square'; osc.frequency.setValueAtTime(180, t); osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
    gain.gain.setValueAtTime(0.1, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.start(t); osc.stop(t + 0.1);
  } else if (type === 'special') {
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(440, t); osc.frequency.exponentialRampToValueAtTime(880, t + 0.05); osc.frequency.exponentialRampToValueAtTime(220, t + 0.2);
    gain.gain.setValueAtTime(0.12, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.start(t); osc.stop(t + 0.3);
  } else if (type === 'ko') {
    osc.type = 'square'; osc.frequency.setValueAtTime(330, t); osc.frequency.exponentialRampToValueAtTime(55, t + 0.6);
    gain.gain.setValueAtTime(0.15, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.start(t); osc.stop(t + 0.7);
  } else if (type === 'select') {
    osc.type = 'square'; osc.frequency.setValueAtTime(660, t); osc.frequency.setValueAtTime(880, t + 0.05);
    gain.gain.setValueAtTime(0.07, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.start(t); osc.stop(t + 0.15);
  } else if (type === 'respawn') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(440, t); osc.frequency.exponentialRampToValueAtTime(880, t + 0.15);
    gain.gain.setValueAtTime(0.08, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.start(t); osc.stop(t + 0.25);
  }
}

// ═══════════════════════════════════════════════════════════
// SCENE MANAGEMENT
// ═══════════════════════════════════════════════════════════
function showScene(scene) {
  stopMusic();
  if (sceneContainer) {
    app.stage.removeChild(sceneContainer);
    sceneContainer.destroy({ children: true });
  }
  app.stage.position.set(0, 0);
  sceneContainer = new PIXI.Container();
  sceneContainer.zIndex = 0;
  app.stage.addChild(sceneContainer);
  currentScene = scene;

  switch (scene) {
    case SCENES.MENU:             buildMenuScene(sceneContainer); break;
    case SCENES.CHARACTER_SELECT: buildSelectScene(sceneContainer); break;
    case SCENES.FIGHT:            buildFightScene(sceneContainer); break;
    case SCENES.GAME_OVER:        buildGameOverScene(sceneContainer); break;
  }
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function W() { return app.screen.width; }
function H() { return app.screen.height; }

function makeText(str, opts = {}) {
  return new PIXI.Text({
    text: str,
    style: {
      fontFamily: opts.font || "'Press Start 2P', monospace",
      fontSize: opts.size || 16,
      fill: opts.color !== undefined ? opts.color : 0xffffff,
      align: opts.align || 'center',
      stroke: opts.stroke ? { color: opts.strokeColor || 0x000000, width: opts.strokeWidth || 4 } : undefined,
      dropShadow: opts.shadow ? {
        color: opts.shadowColor || 0x000000, blur: opts.shadowBlur || 4,
        distance: opts.shadowDist || 4, angle: Math.PI / 4, alpha: 0.8,
      } : undefined,
      wordWrap: opts.wordWrap || false,
      wordWrapWidth: opts.wrapWidth || 400,
    }
  });
}

function makeGlowText(str, size, color) {
  const container = new PIXI.Container();
  for (let i = 3; i >= 1; i--) {
    const glow = makeText(str, { size, color, shadow: true, shadowColor: color, shadowBlur: 8 * i, shadowDist: 0 });
    glow.anchor.set(0.5); glow.alpha = 0.3 / i; container.addChild(glow);
  }
  const main = makeText(str, { size, color, stroke: true, strokeColor: 0x000000, strokeWidth: 3 });
  main.anchor.set(0.5); container.addChild(main);
  return container;
}

function fillScreen(container, texture) {
  if (!texture) return;
  const bg = new PIXI.Sprite(texture);
  bg.width = W(); bg.height = H();
  container.addChild(bg);
  app.renderer.on?.('resize', () => { bg.width = W(); bg.height = H(); });
  return bg;
}

function makeButton(label, x, y, w, h, opts = {}) {
  const container = new PIXI.Container();
  container.x = x; container.y = y;
  container.interactive = true; container.cursor = 'pointer';
  const bg = new PIXI.Graphics();
  const color = opts.color || 0x111133;
  const borderColor = opts.border || 0x00ffcc;
  function drawBg(hover) {
    bg.clear();
    bg.roundRect(-w/2, -h/2, w, h, 8);
    bg.fill({ color: hover ? borderColor : color, alpha: hover ? 0.9 : 0.7 });
    bg.stroke({ color: borderColor, width: 2 });
  }
  drawBg(false); container.addChild(bg);
  const txt = makeText(label, { size: opts.fontSize || 12, color: opts.textColor !== undefined ? opts.textColor : (opts.color ? 0xffffff : 0x00ffcc) });
  txt.anchor.set(0.5); container.addChild(txt);
  container.on('pointerover', () => { drawBg(true); txt.style.fill = 0x000000; });
  container.on('pointerout',  () => { drawBg(false); txt.style.fill = opts.textColor !== undefined ? opts.textColor : 0x00ffcc; });
  return container;
}

// ═══════════════════════════════════════════════════════════
// SCENE: MENU
// ═══════════════════════════════════════════════════════════
function buildMenuScene(container) {
  playMenuMusic();
  const bg = fillScreen(container, textures['menu_bg']);
  const particles = [];
  const particleLayer = new PIXI.Container();
  container.addChild(particleLayer);
  for (let i = 0; i < 40; i++) {
    const g = new PIXI.Graphics();
    const r = Math.random() * 3 + 1;
    g.circle(0, 0, r).fill({ color: Math.random() > 0.5 ? 0x00ffcc : 0xff44aa, alpha: 0.8 });
    g.x = Math.random() * W(); g.y = Math.random() * H(); g.alpha = Math.random() * 0.6 + 0.2;
    particleLayer.addChild(g);
    particles.push({ sprite: g, vx: (Math.random() - 0.5) * 0.5, vy: -Math.random() * 0.8 - 0.2, life: Math.random() });
  }
  const overlay = new PIXI.Graphics();
  overlay.rect(0, 0, W(), H()).fill({ color: 0x000000, alpha: 0.45 });
  container.addChild(overlay);

  const titleContainer = new PIXI.Container();
  titleContainer.x = W() / 2; titleContainer.y = H() * 0.22;
  container.addChild(titleContainer);
  const titleSize = Math.min(Math.floor(W() / 18), 48);
  const titleGlow = makeGlowText('RADAR FIGHTERS 2', titleSize, 0x00ffcc);
  titleContainer.addChild(titleGlow);
  const subtitle = makeText('PLATFORMER BRAWLER', {
    size: Math.max(8, Math.floor(W() / 70)), color: 0xff44aa, shadow: true, shadowColor: 0xff44aa, shadowBlur: 6
  });
  subtitle.anchor.set(0.5); subtitle.y = titleSize * 1.5; titleContainer.addChild(subtitle);

  const pressStart = makeText('PRESS START', {
    size: Math.max(8, Math.floor(W() / 65)), color: 0xffff00, shadow: true, shadowColor: 0xffaa00, shadowBlur: 8
  });
  pressStart.anchor.set(0.5); pressStart.x = W() / 2; pressStart.y = H() * 0.46;
  container.addChild(pressStart);

  const btnW = Math.min(280, W() * 0.4), btnH = 44, btnX = W() / 2;
  const btnStartY = H() * 0.57, btnGap = btnH + 14;
  const btn1P    = makeButton('1 PLAYER VS AI',   btnX, btnStartY,           btnW, btnH);
  const btn2P    = makeButton('2 PLAYERS',         btnX, btnStartY + btnGap,  btnW, btnH);
  const btnQuick = makeButton('⚔ QUICK FIGHT',    btnX, btnStartY + btnGap*2, btnW, btnH, { color: 0x003322, border: 0x00ffaa, textColor: 0x00ffaa });
  const btnAbout = makeButton('ABOUT',             btnX, btnStartY + btnGap*3, btnW*0.6, btnH, { color: 0x221133, border: 0xbb44ff });
  container.addChild(btn1P, btn2P, btnQuick, btnAbout);

  btn1P.on('pointertap',    () => { document.removeEventListener('keydown', keyHandler); playSFX('select'); gameMode = '1P'; flashTransition(() => showScene(SCENES.CHARACTER_SELECT)); });
  btn2P.on('pointertap',    () => { document.removeEventListener('keydown', keyHandler); playSFX('select'); gameMode = '2P'; flashTransition(() => showScene(SCENES.CHARACTER_SELECT)); });
  btnQuick.on('pointertap', () => {
    document.removeEventListener('keydown', keyHandler);
    playSFX('select'); gameMode = '1P';
    p1CharIdx = Math.floor(Math.random() * CHARACTERS.length);
    p2CharIdx = Math.floor(Math.random() * CHARACTERS.length);
    if (p2CharIdx === p1CharIdx) p2CharIdx = (p1CharIdx + 1) % CHARACTERS.length;
    flashTransition(() => showScene(SCENES.FIGHT));
  });
  btnAbout.on('pointertap', () => showAboutModal(container));

  const keyHandler = (e) => {
    if (['Enter', ' ', 'a', 'A'].includes(e.key)) {
      document.removeEventListener('keydown', keyHandler);
      playSFX('select'); gameMode = '1P';
      flashTransition(() => showScene(SCENES.CHARACTER_SELECT));
    }
  };
  document.addEventListener('keydown', keyHandler);

  const ver = makeText('RADAR FIGHTERS 2 v1.0 © 2026', { size: 8, color: 0x444444 });
  ver.x = 8; ver.y = H() - 18; container.addChild(ver);

  const ticker = (tk) => {
    if (currentScene !== SCENES.MENU) { app.ticker.remove(ticker); return; }
    particles.forEach(p => {
      p.sprite.x += p.vx; p.sprite.y += p.vy; p.life += 0.005;
      if (p.sprite.y < -10 || p.life > 1) { p.sprite.x = Math.random() * W(); p.sprite.y = H() + 5; p.life = 0; }
    });
    pressStart.alpha = 0.5 + Math.sin(Date.now() / 400) * 0.5;
    titleContainer.scale.set(1 + Math.sin(Date.now() / 2000) * 0.015);
  };
  app.ticker.add(ticker);
}

function showAboutModal(container) {
  const modal = new PIXI.Container();
  modal.interactive = true;
  const overlay = new PIXI.Graphics();
  overlay.rect(0, 0, W(), H()).fill({ color: 0x000000, alpha: 0.8 });
  modal.addChild(overlay);
  const panel = new PIXI.Graphics();
  const pw = Math.min(580, W() * 0.92), ph = 360;
  panel.roundRect(W()/2 - pw/2, H()/2 - ph/2, pw, ph, 12);
  panel.fill({ color: 0x0a0a1a }).stroke({ color: 0x00ffcc, width: 2 });
  modal.addChild(panel);
  const lines = [
    { text: 'RADAR FIGHTERS 2', size: 13, color: 0x00ffcc, y: -130 },
    { text: 'Platformer Brawler — Smash Bros style', size: 7, color: 0xaaaaaa, y: -105 },
    { text: 'P1 Controls:', size: 9, color: 0xffff00, y: -80 },
    { text: 'A/D move  W/↑ jump (double jump!)', size: 7, color: 0x88aaff, y: -60 },
    { text: 'J=punch  K=kick  L=special  S=block', size: 7, color: 0x88aaff, y: -42 },
    { text: 'P2 Controls:', size: 9, color: 0xffff00, y: -18 },
    { text: '←/→ move  ↑ jump (double jump!)', size: 7, color: 0xff8866, y: 2 },
    { text: 'Num1/U=punch  Num2/I=kick  Num3/O=special', size: 6, color: 0xff8866, y: 20 },
    { text: '↓ = block', size: 7, color: 0xff8866, y: 38 },
    { text: 'MECHANICS:', size: 9, color: 0xffff00, y: 62 },
    { text: '⚡ Damage % grows — more % = more knockback', size: 6, color: 0xaaaaaa, y: 82 },
    { text: '💀 3 stocks each — fly off stage to lose one', size: 6, color: 0xaaaaaa, y: 99 },
    { text: '🏝 3 platforms per stage — fight in the air!', size: 6, color: 0xaaaaaa, y: 116 },
    { text: '[ TAP TO CLOSE ]', size: 9, color: 0xff44aa, y: 148 },
  ];
  lines.forEach(l => {
    const t = makeText(l.text, { size: l.size, color: l.color });
    t.anchor.set(0.5); t.x = W() / 2; t.y = H() / 2 + l.y;
    modal.addChild(t);
  });
  container.addChild(modal);
  overlay.interactive = true;
  overlay.on('pointertap', () => container.removeChild(modal));
}

function flashTransition(callback) {
  const flash = new PIXI.Graphics();
  flash.rect(0, 0, W(), H()).fill({ color: 0xffffff, alpha: 1 });
  flash.alpha = 1; flash.zIndex = 50;
  app.stage.addChild(flash);
  callback();
  let alpha = 1;
  const fadeOut = (tk) => {
    alpha -= tk.deltaTime * 0.08; flash.alpha = alpha;
    if (alpha <= 0) { app.stage.removeChild(flash); app.ticker.remove(fadeOut); }
  };
  app.ticker.add(fadeOut);
}

// ═══════════════════════════════════════════════════════════
// SCENE: CHARACTER SELECT
// ═══════════════════════════════════════════════════════════
function buildSelectScene(container) {
  playMenuMusic();
  fillScreen(container, textures['select_bg']);
  const overlay = new PIXI.Graphics();
  overlay.rect(0, 0, W(), H()).fill({ color: 0x000000, alpha: 0.5 });
  container.addChild(overlay);

  const title = makeText('SELECT FIGHTER', {
    size: Math.min(Math.floor(W() / 30), 28), color: 0xffff00, shadow: true, shadowColor: 0xff8800, shadowBlur: 10
  });
  title.anchor.set(0.5); title.x = W() / 2; title.y = H() * 0.06;
  container.addChild(title);

  const p1inst = makeText(gameMode === '2P' ? 'P1: A/D + ENTER' : 'Pick your fighter, then your rival', { size: 8, color: 0x4488ff });
  p1inst.anchor.set(0.5); p1inst.x = W() * 0.25; p1inst.y = H() * 0.12;
  container.addChild(p1inst);
  if (gameMode === '2P') {
    const p2inst = makeText('P2: ←/→ + L', { size: 8, color: 0xff4444 });
    p2inst.anchor.set(0.5); p2inst.x = W() * 0.75; p2inst.y = H() * 0.12;
    container.addChild(p2inst);
  }

  const cols = 6, rows = Math.ceil(CHARACTERS.length / 6);
  const cardMargin = Math.floor(W() * 0.012);
  const gridW = W() * 0.94, gridH = H() * 0.72;
  const cardW = (gridW - cardMargin * (cols - 1)) / cols;
  const cardH = (gridH - cardMargin * (rows - 1)) / rows;
  const gridX = (W() - gridW) / 2, gridY = H() * 0.15;

  let p1Hover = p1CharIdx, p2Hover = p2CharIdx;
  let p1Selected = -1, p2Selected = -1;
  const cards = [];
  const cardLayer = new PIXI.Container();
  container.addChild(cardLayer);

  CHARACTERS.forEach((char, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const cx = gridX + col * (cardW + cardMargin) + cardW / 2;
    const cy = gridY + row * (cardH + cardMargin) + cardH / 2;
    const card = new PIXI.Container();
    card.x = cx; card.y = cy; card.interactive = true; card.cursor = 'pointer';
    cardLayer.addChild(card);
    const bg = new PIXI.Graphics();
    card.addChild(bg);
    let portrait = null;
    if (textures[`char_${i}`]) {
      portrait = new PIXI.Sprite(textures[`char_${i}`]);
      portrait.anchor.set(0.5); portrait.width = cardW * 0.8; portrait.height = cardH * 0.7; portrait.y = -cardH * 0.05;
      card.addChild(portrait);
    }
    const nameText = makeText(char.name, { size: Math.max(7, Math.floor(cardW / 10)), color: 0xffffff, stroke: true, strokeColor: 0x000000, strokeWidth: 3 });
    nameText.anchor.set(0.5); nameText.y = cardH * 0.36; card.addChild(nameText);

    function redraw(hover, p1sel, p2sel) {
      bg.clear();
      const isP1Sel = p1sel === i, isP2Sel = p2sel === i;
      const isP1Hov = p1Hover === i, isP2Hov = gameMode === '2P' && p2Hover === i;
      let borderColor = 0x444466, alpha = 0.5;
      if (isP1Sel) { borderColor = 0x4488ff; alpha = 0.85; }
      if (isP2Sel) { borderColor = 0xff4444; alpha = 0.85; }
      if (isP1Hov && !isP1Sel) { borderColor = 0x88aaff; alpha = 0.7; }
      if (isP2Hov && !isP2Sel) { borderColor = 0xff8888; alpha = 0.7; }
      bg.roundRect(-cardW/2, -cardH/2, cardW, cardH, 8);
      bg.fill({ color: char.color, alpha }); bg.stroke({ color: borderColor, width: isP1Sel || isP2Sel ? 4 : 2 });
      if (isP1Sel && isP2Sel) {
        bg.roundRect(-cardW/2, -cardH/2, cardW/2, cardH, 4).stroke({ color: 0x4488ff, width: 3 });
        bg.roundRect(0, -cardH/2, cardW/2, cardH, 4).stroke({ color: 0xff4444, width: 3 });
      }
      if (isP1Sel || isP1Hov) { bg.roundRect(-cardW/2 + 4, -cardH/2 + 4, 22, 16, 4).fill({ color: 0x4488ff, alpha: 0.9 }); }
      if (isP2Sel || isP2Hov) { bg.roundRect(cardW/2 - 26, -cardH/2 + 4, 22, 16, 4).fill({ color: 0xff4444, alpha: 0.9 }); }
    }
    redraw(false, p1Selected, p2Selected);
    cards.push({ card, redraw });
    card.on('pointerover', () => { p1Hover = i; if (gameMode === '2P') p2Hover = i; updateCards(); updatePreview(); });
    card.on('pointertap', () => {
      playSFX('select');
      if (p1Selected === -1) { p1Selected = i; }
      else if (p2Selected === -1 && i !== p1Selected) { p2Selected = i; }
      else { p1Selected = i; p2Selected = -1; }
      updateCards(); updatePreview(); checkFightReady();
    });
  });

  function updateCards() { cards.forEach((c, i) => c.redraw(false, p1Selected, p2Selected)); }

  const previewPanel = new PIXI.Container();
  previewPanel.y = H() * 0.88; container.addChild(previewPanel);

  function updatePreview() {
    previewPanel.removeChildren();
    const ph = H() * 0.11, pw = W() * 0.8;
    const panelBg = new PIXI.Graphics();
    panelBg.roundRect(W() * 0.1, 0, pw, ph, 10).fill({ color: 0x050510, alpha: 0.8 }).stroke({ color: 0x333366, width: 1 });
    previewPanel.addChild(panelBg);
    const selIdx1 = p1Selected >= 0 ? p1Selected : p1Hover;
    const selIdx2 = p2Selected >= 0 ? p2Selected : p2Hover;
    drawPreviewChar(previewPanel, CHARACTERS[selIdx1], selIdx1, W() * 0.22, ph * 0.5,  1, 0x4488ff);
    drawPreviewChar(previewPanel, CHARACTERS[selIdx2], selIdx2, W() * 0.78, ph * 0.5, -1, 0xff4444);
    const vs = makeText('VS', { size: Math.max(14, Math.floor(ph / 5)), color: 0xffff00, shadow: true, shadowColor: 0xff8800, shadowBlur: 8 });
    vs.anchor.set(0.5); vs.x = W() / 2; vs.y = ph * 0.4; previewPanel.addChild(vs);
    drawStats(previewPanel, CHARACTERS[selIdx1], W() * 0.15, ph * 0.1,  1);
    drawStats(previewPanel, CHARACTERS[selIdx2], W() * 0.85, ph * 0.1, -1);
  }

  function drawPreviewChar(panel, char, idx, x, y, dir, labelColor) {
    if (!textures[`char_${idx}`]) return;
    const size = Math.min(H() * 0.14, 80);
    const sprite = new PIXI.Sprite(textures[`char_${idx}`]);
    sprite.anchor.set(0.5); sprite.width = size; sprite.height = size;
    sprite.x = x; sprite.y = y - size * 0.1; sprite.scale.x *= dir;
    panel.addChild(sprite);
    const name = makeText(char.name, { size: 8, color: labelColor });
    name.anchor.set(0.5); name.x = x; name.y = y + size * 0.6; panel.addChild(name);
  }

  function drawStats(panel, char, x, y, dir) {
    const labels = ['PWR', 'SPD', 'DEF'], vals = [char.power, char.speed, char.defense];
    const barW = W() * 0.12, colors = [0xff4444, 0x44ff88, 0x4488ff];
    labels.forEach((lbl, i) => {
      const ly = y + i * 22;
      const lt = makeText(lbl, { size: 7, color: 0x888888 });
      lt.anchor.set(dir > 0 ? 0 : 1, 0); lt.x = dir > 0 ? x + 5 : x - 5; lt.y = ly; panel.addChild(lt);
      const bgBar = new PIXI.Graphics();
      const bx = dir > 0 ? x + 35 : x - 35 - barW;
      bgBar.rect(bx, ly, barW, 8).fill({ color: 0x222222 });
      bgBar.rect(bx, ly, barW * vals[i] / 10, 8).fill({ color: colors[i] });
      panel.addChild(bgBar);
    });
  }

  updatePreview();

  const fightBtn = makeButton('⚔ FIGHT!', W() / 2, H() * 0.93, 200, 44, { color: 0x440000, border: 0xff4422, textColor: 0xff4422 });
  fightBtn.alpha = 0.4; container.addChild(fightBtn);

  function checkFightReady() {
    const ready = p1Selected >= 0 && p2Selected >= 0;
    fightBtn.alpha = ready ? 1 : 0.4; fightBtn.interactive = ready;
  }

  fightBtn.on('pointertap', () => {
    if (p1Selected < 0 || p2Selected < 0) return;
    p1CharIdx = p1Selected; p2CharIdx = p2Selected;
    playSFX('select'); document.removeEventListener('keydown', keydown);
    flashTransition(() => showScene(SCENES.FIGHT));
  });

  const keydown = (e) => {
    if (e.key === 'a' || e.key === 'A') { p1Hover = (p1Hover - 1 + CHARACTERS.length) % CHARACTERS.length; updateCards(); updatePreview(); }
    if (e.key === 'd' || e.key === 'D') { p1Hover = (p1Hover + 1) % CHARACTERS.length; updateCards(); updatePreview(); }
    if (e.key === 'Enter') {
      playSFX('select');
      if (p1Selected === -1) { p1Selected = p1Hover; }
      else if (p2Selected === -1 && p1Hover !== p1Selected) { p2Selected = p1Hover; }
      else { p1Selected = p1Hover; p2Selected = -1; }
      updateCards(); updatePreview(); checkFightReady();
    }
    if (e.key === 'ArrowLeft')  { p2Hover = (p2Hover - 1 + CHARACTERS.length) % CHARACTERS.length; updateCards(); updatePreview(); }
    if (e.key === 'ArrowRight') { p2Hover = (p2Hover + 1) % CHARACTERS.length; updateCards(); updatePreview(); }
    if (e.key === 'l' || e.key === 'L') {
      if (gameMode === '2P') { playSFX('select'); p2Selected = p2Hover; updateCards(); updatePreview(); checkFightReady(); }
    }
    if (e.key === 'f' || e.key === 'F') {
      if (p1Selected >= 0 && p2Selected >= 0) {
        p1CharIdx = p1Selected; p2CharIdx = p2Selected;
        playSFX('select'); document.removeEventListener('keydown', keydown);
        flashTransition(() => showScene(SCENES.FIGHT));
      }
    }
    if (e.key === 'Escape' || e.key === 'Backspace') {
      document.removeEventListener('keydown', keydown); showScene(SCENES.MENU);
    }
  };
  document.addEventListener('keydown', keydown);
}

// ═══════════════════════════════════════════════════════════
// SCENE: FIGHT — Platformer Brawler
// ═══════════════════════════════════════════════════════════
function buildFightScene(container) {
  playFightMusic();

  const char1def = CHARACTERS[p1CharIdx];
  const char2def = CHARACTERS[p2CharIdx];

  if (!currentStage) currentStage = STAGES[Math.floor(Math.random() * STAGES.length)];
  const stageName = currentStage;
  currentStage = null;

  // ── Stage background (full screen, stays fixed) ──────────
  const bgSprite = new PIXI.Sprite(textures[stageName] || textures['bg']);
  bgSprite.width = W(); bgSprite.height = H();
  container.addChild(bgSprite);

  // ── World container (for camera, holds platforms + fighters) ──
  const worldContainer = new PIXI.Container();
  container.addChild(worldContainer);

  // ── Constants ────────────────────────────────────────────
  const GROUND_Y  = H() * 0.82;
  const FIGHTER_H = Math.min(H() * 0.22, 130);
  const FIGHTER_W = FIGHTER_H * 0.45;
  const BLAST_L   = -220;
  const BLAST_R   = W() + 220;
  const BLAST_T   = -180;
  const BLAST_B   = H() + 220;

  // ── Platforms ────────────────────────────────────────────
  // Each platform: { x, y, w, h }  (y = top surface Y)
  const platforms = [
    // Ground
    { x: 0,            y: GROUND_Y,          w: W(),         h: 50  },
    // Left floating platform
    { x: W() * 0.06,   y: GROUND_Y - H()*0.24, w: W() * 0.26, h: 16 },
    // Right floating platform
    { x: W() * 0.68,   y: GROUND_Y - H()*0.24, w: W() * 0.26, h: 16 },
    // Center high platform
    { x: W() * 0.375,  y: GROUND_Y - H()*0.42, w: W() * 0.25, h: 16 },
  ];

  // Draw platforms
  const platformGfx = new PIXI.Graphics();
  worldContainer.addChild(platformGfx);

  function drawPlatforms() {
    platformGfx.clear();
    platforms.forEach((p, i) => {
      if (i === 0) {
        // Ground shadow band
        platformGfx.rect(p.x, p.y, p.w, p.h).fill({ color: 0x080810, alpha: 0.55 });
        platformGfx.rect(p.x, p.y, p.w, 5).fill({ color: 0x4ababa });
      } else {
        // Floating platforms
        platformGfx.roundRect(p.x, p.y, p.w, p.h, 5).fill({ color: 0x1a3a5a, alpha: 0.92 }).stroke({ color: 0x55b8cc, width: 2.5 });
        // Platform top highlight
        platformGfx.roundRect(p.x + 4, p.y + 2, p.w - 8, 3, 2).fill({ color: 0x88ddee, alpha: 0.4 });
      }
    });
  }
  drawPlatforms();

  // ── Blast zone indicators (subtle lines at screen edges) ──
  const blastGfx = new PIXI.Graphics();
  blastGfx.rect(0, H() - 6, W(), 6).fill({ color: 0xff2222, alpha: 0.25 });
  blastGfx.rect(0, 0, W(), 6).fill({ color: 0xff2222, alpha: 0.25 });
  blastGfx.rect(0, 0, 6, H()).fill({ color: 0xff2222, alpha: 0.25 });
  blastGfx.rect(W() - 6, 0, 6, H()).fill({ color: 0xff2222, alpha: 0.25 });
  worldContainer.addChild(blastGfx);

  // ── Shake state ──────────────────────────────────────────
  let shakeX = 0, shakeY = 0, shakeAmt = 0;
  function triggerShake(amount) { shakeAmt = Math.max(shakeAmt, amount); }

  // ── Fighter creation ─────────────────────────────────────
  function applyStats(fighter, chardef) {
    fighter.speedMult  = 0.55 + chardef.speed * 0.1;
    fighter.damageMult = 0.65 + chardef.power * 0.07;
    fighter.defenseMult= 1.25 - chardef.defense * 0.07;
  }

  function createFighter(chardef, startX, dir) {
    const f = {
      x: startX, y: GROUND_Y,
      vx: 0, vy: 0,
      dir,
      damage: 0,          // damage percentage (0–999%)
      stocks: STOCKS,     // lives remaining
      jumpsLeft: 2,       // 2 = fresh, 1 = used first, 0 = no more
      onGround: true,
      state: 'idle',      // idle, run, jump, attack, special, hit, ko, win, block
      attackTimer: 0,
      attackCd: 0,
      hitStun: 0,
      _knockbackFrames: 0,// ignore platform collision while in knockback
      _invincible: 0,     // invincibility frames after respawn
      _koTimer: 0,        // frames until respawn after KO
      speedMult: 1, damageMult: 1, defenseMult: 1,
      blocking: false,
      isAI: false, aiTimer: 0,
      chardef,
      faceTexture: null,
      container: null, bodyGfx: null, mainSprite: null, shadowGfx: null, auraGfx: null,
      _hitFlash: 0, _squash: 1, _squashV: 0,
      _lastAtkType: 'NORMAL', _lastAtkIsKick: false,
      _baseScaleX: 1, _baseScaleY: 1,
      _texIdle: null, _texAtk: null, _texHit: null, _texKick: null,
      _texBlock: null, _texSpecial: null, _texWin: null, _texKo: null,
      _texJump: null, _texWalk: null,
      _idleFrames: null, _walkFrames: null,
      _animFrame: 0, _animTimer: 0,
    };
    applyStats(f, chardef);
    return f;
  }

  let p1 = createFighter(char1def, W() * 0.3, 1);
  p1.faceTexture = textures[`char_${p1CharIdx}`];
  let p2 = createFighter(char2def, W() * 0.7, -1);
  p2.faceTexture = textures[`char_${p2CharIdx}`];
  p2.isAI = (gameMode === '1P');

  // ── Fighter sprites ──────────────────────────────────────
  const fightLayer = new PIXI.Container();
  worldContainer.addChild(fightLayer);

  function buildFighterSprite(fighter, charIdx) {
    const cont = new PIXI.Container();
    fightLayer.addChild(cont);
    fighter.container = cont;

    // Shadow
    const shadow = new PIXI.Graphics();
    shadow.ellipse(0, 0, FIGHTER_H * 0.21, 10).fill({ color: 0x000000, alpha: 0.4 });
    shadow.y = 4; cont.addChild(shadow); fighter.shadowGfx = shadow;

    if (fighter.faceTexture) {
      const spr = new PIXI.Sprite(fighter.faceTexture);
      spr.anchor.set(0.5, 1);
      const bsy = FIGHTER_H / fighter.faceTexture.height;
      const bsx = (FIGHTER_H * 0.75) / fighter.faceTexture.width;
      spr.scale.set(bsx, bsy);
      spr.y = 0;
      fighter._baseScaleX = bsx; fighter._baseScaleY = bsy;
      cont.addChild(spr); fighter.mainSprite = spr;

      const idx = charIdx;
      fighter._texIdle    = textures[`spr_${idx}_idle`]    || fighter.faceTexture;
      fighter._texAtk     = textures[`spr_${idx}_atk`]     || fighter.faceTexture;
      fighter._texHit     = textures[`spr_${idx}_hit`]     || fighter.faceTexture;
      fighter._texKick    = textures[`spr_${idx}_kick`]    || fighter._texAtk;
      fighter._texBlock   = textures[`spr_${idx}_block`]   || fighter._texIdle;
      fighter._texSpecial = textures[`spr_${idx}_special`] || fighter._texAtk;
      fighter._texWin     = textures[`spr_${idx}_win`]     || fighter._texIdle;
      fighter._texKo      = textures[`spr_${idx}_ko`]      || fighter._texHit;
      fighter._texJump    = textures[`spr_${idx}_jump`]    || fighter._texIdle;
      fighter._texWalk    = textures[`spr_${idx}_walk`]    || fighter._texIdle;
      const idleF0 = textures[`spr_${idx}_idle_f0`];
      const idleF1 = textures[`spr_${idx}_idle_f1`];
      const idleF2 = textures[`spr_${idx}_idle_f2`];
      fighter._idleFrames = (idleF0 && idleF1 && idleF2) ? [idleF0, idleF1, idleF0, idleF2] : null;
      const walkF0 = textures[`spr_${idx}_walk_f0`];
      const walkF1 = textures[`spr_${idx}_walk_f1`];
      fighter._walkFrames = (walkF0 && walkF1) ? [walkF0, walkF1] : null;
    }

    // Aura
    const aura = new PIXI.Graphics();
    aura.ellipse(0, -FIGHTER_H * 0.5, FIGHTER_H * 0.41, FIGHTER_H * 0.55).fill({ color: fighter.chardef.color, alpha: 0 });
    cont.addChild(aura); fighter.auraGfx = aura;

    const body = new PIXI.Graphics();
    cont.addChild(body); fighter.bodyGfx = body;
  }

  function lerpColor(a, b, t) {
    const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
    const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
    return ((Math.round(ar + (br-ar)*t) << 16) | (Math.round(ag + (bg-ag)*t) << 8) | Math.round(ab + (bb-ab)*t));
  }

  function drawFighterBody(fighter) {
    if (!fighter.mainSprite) return;
    const spr = fighter.mainSprite;
    const aura = fighter.auraGfx;
    const gfx  = fighter.bodyGfx;
    const t = Date.now() / 1000;
    const bx = fighter._baseScaleX || 1;
    const by = fighter._baseScaleY || 1;

    // Sprite swap by state
    if (fighter._texIdle) {
      let wantTex, useFrameCycle = false;
      switch (fighter.state) {
        case 'attack':  wantTex = fighter._lastAtkIsKick ? fighter._texKick : fighter._texAtk; break;
        case 'special': wantTex = fighter._texSpecial; break;
        case 'hit':     wantTex = fighter._texHit; break;
        case 'ko':      wantTex = fighter._texKo; break;
        case 'block':   wantTex = fighter._texBlock; break;
        case 'jump':    wantTex = fighter._texJump; break;
        case 'run':     useFrameCycle = !!fighter._walkFrames; if (!useFrameCycle) wantTex = fighter._texWalk; break;
        case 'win':     wantTex = fighter._texWin; break;
        default:        useFrameCycle = !!fighter._idleFrames; if (!useFrameCycle) wantTex = fighter._texIdle;
      }
      if (useFrameCycle) {
        const frames = fighter.state === 'run' ? fighter._walkFrames : fighter._idleFrames;
        const fps = fighter.state === 'run' ? 8 : 4;
        wantTex = frames[Math.floor(t * fps) % frames.length];
      }
      if (spr.texture !== wantTex) spr.texture = wantTex;
    }

    // Hit flash
    if (fighter._hitFlash > 0) {
      fighter._hitFlash = Math.max(0, fighter._hitFlash - 0.12);
      spr.tint = lerpColor(0xffffff, 0xff3333, fighter._hitFlash);
    } else {
      spr.tint = 0xffffff;
    }

    // Invincibility blink
    if (fighter._invincible > 0) {
      spr.alpha = Math.sin(Date.now() / 60) > 0 ? 1 : 0.3;
    } else {
      spr.alpha = 1;
    }

    // Spring squash
    fighter._squashV += (1 - fighter._squash) * 0.35;
    fighter._squashV *= 0.65;
    fighter._squash += fighter._squashV;

    gfx.clear();

    switch (fighter.state) {
      case 'idle': {
        const bob = Math.sin(t * 2.5) * 1.5;
        spr.scale.set(bx, by * (fighter._squash + Math.sin(t * 2.5) * 0.015));
        spr.y = bob; spr.rotation = 0; if (aura) aura.clear(); break;
      }
      case 'run': {
        const bounce = Math.abs(Math.sin(t * 12)) * 0.04;
        spr.scale.set(bx * (1 - bounce * 0.5), by * (fighter._squash + bounce));
        spr.y = -Math.abs(Math.sin(t * 12)) * 4; spr.rotation = 0.06; if (aura) aura.clear(); break;
      }
      case 'jump': {
        spr.scale.set(bx * 0.9, by * 1.08 * fighter._squash);
        spr.y = -3; spr.rotation = 0; if (aura) aura.clear(); break;
      }
      case 'attack': {
        const progress = 1 - (fighter.attackTimer / ATTACKS.NORMAL.dur);
        const isActive = progress > 0.3 && progress < 0.75;
        if (progress < 0.3) { spr.scale.set(bx * 0.9, by * 1.05); spr.rotation = -0.12; }
        else if (isActive) {
          spr.scale.set(bx * 1.12, by * 0.88); spr.rotation = 0.2;
          const fistX = FIGHTER_H * 0.45, fistY = -FIGHTER_H * 0.55;
          gfx.circle(fistX, fistY, FIGHTER_H * 0.13).fill({ color: 0xffffff, alpha: 0.9 });
          gfx.circle(fistX, fistY, FIGHTER_H * 0.2).fill({ color: fighter.chardef.accentColor, alpha: 0.5 });
          gfx.circle(fistX, fistY, FIGHTER_H * 0.28).fill({ color: fighter.chardef.color, alpha: 0.25 });
        } else { spr.scale.set(bx * 0.95, by * 1.02); spr.rotation = 0.05; }
        break;
      }
      case 'special': {
        const pulse = (Math.sin(t * 15) + 1) / 2;
        const progress = 1 - (fighter.attackTimer / ATTACKS.SPECIAL.dur);
        const isActive = progress > 0.25 && progress < 0.8;
        spr.scale.set(bx * (isActive ? 1.15 : 1.0), by * (isActive ? 0.88 : 1.0) * fighter._squash);
        spr.rotation = isActive ? 0.25 : 0; spr.y = Math.sin(t * 20) * 2;
        if (aura) {
          aura.clear();
          aura.ellipse(0, -FIGHTER_H * 0.5, FIGHTER_H*(0.38+pulse*0.08), FIGHTER_H*(0.5+pulse*0.1)).fill({ color: fighter.chardef.accentColor, alpha: 0.18+pulse*0.22 });
        }
        if (isActive) {
          const fx = FIGHTER_H * 0.5, fy = -FIGHTER_H * 0.5;
          gfx.circle(fx, fy, FIGHTER_H*0.17).fill({ color: 0xffffff, alpha: 1 });
          gfx.circle(fx, fy, FIGHTER_H*0.28).fill({ color: fighter.chardef.accentColor, alpha: 0.7 });
          gfx.circle(fx, fy, FIGHTER_H*0.42).fill({ color: fighter.chardef.color, alpha: 0.4 });
        }
        break;
      }
      case 'hit': {
        spr.scale.set(bx * 0.88, by * 1.1 * fighter._squash);
        spr.rotation = -0.18; spr.y = -4; break;
      }
      case 'block': {
        spr.scale.set(bx * 0.85, by * 0.92);
        spr.rotation = 0.05; spr.y = FIGHTER_H * 0.06;
        if (aura) { aura.clear(); aura.ellipse(0, -FIGHTER_H*0.5, FIGHTER_H*0.35, FIGHTER_H*0.5).fill({ color: 0x4488ff, alpha: 0.18 }); }
        break;
      }
      case 'ko': {
        spr.scale.set(bx * 0.88, by * 0.88); spr.rotation = 0; spr.y = 0;
        if (aura) aura.clear(); break;
      }
      case 'win': {
        const pulse = (Math.sin(t * 3) + 1) / 2;
        spr.scale.set(bx*(1+pulse*0.05), by*(1+pulse*0.05)); spr.y = -Math.abs(Math.sin(t*2))*4; spr.rotation = 0;
        if (aura) { aura.clear(); aura.ellipse(0, -FIGHTER_H*0.5, FIGHTER_H*(0.35+pulse*0.1), FIGHTER_H*(0.5+pulse*0.1)).fill({ color: fighter.chardef.accentColor, alpha: 0.15+pulse*0.15 }); }
        break;
      }
      default: spr.scale.set(bx, by); spr.y = 0; spr.rotation = 0;
    }
  }

  buildFighterSprite(p1, p1CharIdx);
  buildFighterSprite(p2, p2CharIdx);

  // ── Hit effects ──────────────────────────────────────────
  const effectLayer = new PIXI.Container();
  worldContainer.addChild(effectLayer);
  const hitEffects = [];

  function spawnDust(x, y) {
    for (let i = 0; i < 6; i++) {
      const g = new PIXI.Graphics();
      const size = Math.random() * 6 + 3;
      g.circle(0, 0, size).fill({ color: 0xd4b896, alpha: 0.8 });
      g.x = x + (Math.random() - 0.5) * 30; g.y = y; effectLayer.addChild(g);
      hitEffects.push({ t: 0, maxT: 0.5, vx: (Math.random()-0.5)*3, vy: -(Math.random()*2+0.5), sprite: g });
    }
  }

  function spawnHitEffect(x, y, isSpecial) {
    const count = isSpecial ? 16 : 8;
    const colors = isSpecial ? [0xffdd00, 0xff6600, 0xffffff] : [0xffffff, 0xffe0a0, 0xffcc44];
    const ring = new PIXI.Graphics();
    const ringSize = isSpecial ? FIGHTER_H*0.5 : FIGHTER_H*0.3;
    ring.circle(0,0,ringSize).fill({ color: isSpecial?0xffaa00:0xffffff, alpha: 0.6 });
    ring.x = x; ring.y = y; effectLayer.addChild(ring);
    hitEffects.push({ t:0, maxT:0.18, sprite:ring, ring:true });
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI*2/count)*i + Math.random()*0.3;
      const speed = (Math.random()*4+3) * (isSpecial?2.2:1);
      const g = new PIXI.Graphics();
      const size = isSpecial ? Math.random()*10+5 : Math.random()*7+3;
      const color = colors[Math.floor(Math.random()*colors.length)];
      g.circle(0,0,size).fill({ color, alpha:1 });
      if (isSpecial) g.circle(0,0,size*2).fill({ color:0xff4400, alpha:0.35 });
      g.x = x; g.y = y; effectLayer.addChild(g);
      hitEffects.push({ t:0, maxT:isSpecial?0.55:0.4, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, sprite:g });
    }
    const hitText = makeText(isSpecial?'★ POW! ★':'HIT!', {
      size: isSpecial?26:18, color: isSpecial?0xffdd00:0xffffff, shadow:true, shadowColor: isSpecial?0xff4400:0x333300, shadowBlur:8
    });
    hitText.anchor.set(0.5); hitText.x = x; hitText.y = y-28;
    hitText.scale.set(isSpecial?1.3:1); effectLayer.addChild(hitText);
    hitEffects.push({ t:0, maxT:0.55, sprite:hitText, textEffect:true });
  }

  function updateEffects(dt) {
    for (let i = hitEffects.length - 1; i >= 0; i--) {
      const e = hitEffects[i];
      e.t += dt * 0.05;
      const prog = e.t / e.maxT;
      if (e.textEffect) {
        e.sprite.y -= dt * 0.6; e.sprite.alpha = 1 - prog; e.sprite.scale.set(1 + prog * 0.3);
      } else if (e.ring) {
        e.sprite.alpha = (1 - prog) * 0.7; e.sprite.scale.set(1 + prog * 1.5);
      } else {
        e.sprite.x += e.vx; e.sprite.y += e.vy; e.vy += 0.18;
        e.sprite.alpha = 1 - prog; e.sprite.scale.set(1 - prog * 0.4);
      }
      if (prog >= 1) {
        effectLayer.removeChild(e.sprite);
        try { e.sprite.destroy(); } catch(err){}
        hitEffects.splice(i, 1);
      }
    }
  }

  // ── HUD ─────────────────────────────────────────────────
  // HUD is outside worldContainer → stays in screen space
  const hudLayer = new PIXI.Container();
  container.addChild(hudLayer);

  const hudPad = 12;
  const dmgSize = Math.min(Math.floor(W() / 22), 38);

  // Player names
  const p1NameHUD = makeText(char1def.name, { size: 9, color: 0x4488ff });
  p1NameHUD.x = hudPad; p1NameHUD.y = hudPad; hudLayer.addChild(p1NameHUD);

  const p2NameHUD = makeText(char2def.name, { size: 9, color: 0xff4444 });
  p2NameHUD.anchor.set(1, 0); p2NameHUD.x = W() - hudPad; p2NameHUD.y = hudPad; hudLayer.addChild(p2NameHUD);

  // VS
  const vsHUD = makeText('VS', { size: 13, color: 0xffff00 });
  vsHUD.anchor.set(0.5); vsHUD.x = W() / 2; vsHUD.y = hudPad + 2; hudLayer.addChild(vsHUD);

  // Damage % text
  const p1DmgText = makeText('0%', { size: dmgSize, color: 0x4488ff, stroke: true, strokeColor: 0x000011, strokeWidth: 4 });
  p1DmgText.anchor.set(0, 0.5);
  p1DmgText.x = hudPad; p1DmgText.y = H() - 50; hudLayer.addChild(p1DmgText);

  const p2DmgText = makeText('0%', { size: dmgSize, color: 0xff4444, stroke: true, strokeColor: 0x110000, strokeWidth: 4 });
  p2DmgText.anchor.set(1, 0.5);
  p2DmgText.x = W() - hudPad; p2DmgText.y = H() - 50; hudLayer.addChild(p2DmgText);

  // Stock icons
  const p1StocksGfx = new PIXI.Graphics();
  p1StocksGfx.y = H() - 20; hudLayer.addChild(p1StocksGfx);
  const p2StocksGfx = new PIXI.Graphics();
  p2StocksGfx.y = H() - 20; hudLayer.addChild(p2StocksGfx);

  function drawStockIcons() {
    p1StocksGfx.clear();
    for (let i = 0; i < STOCKS; i++) {
      const alive = i < p1.stocks;
      p1StocksGfx.circle(hudPad + 10 + i * 22, 0, 8).fill({ color: alive ? 0x4488ff : 0x222244 });
      if (alive) p1StocksGfx.circle(hudPad + 10 + i * 22, 0, 8).stroke({ color: 0x88ccff, width: 2 });
    }
    p2StocksGfx.clear();
    for (let i = 0; i < STOCKS; i++) {
      const alive = i < p2.stocks;
      p2StocksGfx.circle(W() - hudPad - 10 - i * 22, 0, 8).fill({ color: alive ? 0xff4444 : 0x442222 });
      if (alive) p2StocksGfx.circle(W() - hudPad - 10 - i * 22, 0, 8).stroke({ color: 0xff9999, width: 2 });
    }
  }

  function updateHUD() {
    // Damage %
    const d1 = Math.floor(p1.damage);
    const d2 = Math.floor(p2.damage);
    p1DmgText.text = d1 + '%';
    p1DmgText.style.fill = d1 > 150 ? 0xff2200 : d1 > 80 ? 0xff8800 : 0x4488ff;
    if (d1 > 150) p1DmgText.alpha = 0.7 + Math.sin(Date.now() / 100) * 0.3;
    else p1DmgText.alpha = 1;

    p2DmgText.text = d2 + '%';
    p2DmgText.style.fill = d2 > 150 ? 0xff2200 : d2 > 80 ? 0xff8800 : 0xff4444;
    if (d2 > 150) p2DmgText.alpha = 0.7 + Math.sin(Date.now() / 100 + 1.5) * 0.3;
    else p2DmgText.alpha = 1;

    drawStockIcons();
  }

  drawStockIcons();

  // ── Intro text ───────────────────────────────────────────
  const introLayer = new PIXI.Container();
  container.addChild(introLayer);
  let fightActive = false;

  function showIntroText(text, duration, color, callback) {
    introLayer.removeChildren();
    const flash = new PIXI.Graphics();
    flash.rect(0, 0, W(), H()).fill({ color: 0x000000, alpha: 0.5 });
    introLayer.addChild(flash);
    const t = makeGlowText(text, Math.min(Math.floor(W() / 10), 72), color);
    t.x = W() / 2; t.y = H() / 2; introLayer.addChild(t);
    let elapsed = 0;
    const ticker = (tk) => {
      elapsed += tk.deltaTime;
      const prog = elapsed / duration;
      t.scale.set(0.8 + prog * 0.4);
      t.alpha = prog < 0.1 ? prog * 10 : prog > 0.8 ? (1-prog)*5 : 1;
      flash.alpha = 0.5 * (1 - prog);
      if (prog >= 1) { app.ticker.remove(ticker); introLayer.removeChildren(); if (callback) callback(); }
    };
    app.ticker.add(ticker);
  }

  setTimeout(() => {
    showIntroText('FIGHT!', 80, 0xff4422, () => { fightActive = true; });
  }, 100);

  // ── Input ────────────────────────────────────────────────
  const keys = {};
  const keydown = (e) => { keys[e.key] = true; };
  const keyup   = (e) => { keys[e.key] = false; };
  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup',   keyup);

  // Jump edge-detection (fire once per key press, not hold)
  const jumpConsumed = { p1: false, p2: false };

  const touchBtns = buildTouchControls(container);

  // ── Platform collision ───────────────────────────────────
  function getPlatformBelow(f) {
    if (f.vy < 0) return null;                  // moving up → skip
    if (f._knockbackFrames > 0) return null;     // in knockback → pass through
    for (const plat of platforms) {
      if (f.x >= plat.x - 2 && f.x <= plat.x + plat.w + 2) {
        const prevY = f.y - f.vy * 0.5;          // prev position estimate
        if (prevY <= plat.y + 2 && f.y >= plat.y - 2) {
          return plat;
        }
      }
    }
    return null;
  }

  // ── KO / Stocks ──────────────────────────────────────────
  let matchOver = false, matchWinner = 0, navigating = false;

  function isOutsideBlast(f) {
    return f.x < BLAST_L || f.x > BLAST_R || f.y > BLAST_B || f.y < BLAST_T;
  }

  function respawnFighter(f) {
    f.x = W() / 2 + (f === p1 ? -80 : 80);
    f.y = -50;
    f.vx = 0; f.vy = 2;
    f.damage = 0;
    f.jumpsLeft = 2; f.onGround = false;
    f.state = 'jump';
    f.attackTimer = 0; f.attackCd = 0; f.hitStun = 0; f.blocking = false;
    f._hitFlash = 0; f._squash = 1; f._squashV = 0; f._knockbackFrames = 0;
    f._invincible = 150;  // ~2.5s invincibility
    f._koTimer = 0;
    if (f.container) f.container.rotation = 0;
    playSFX('respawn');
    // Star burst effect at center
    spawnHitEffect(f.x, H() * 0.4, false);
  }

  function handleKO(f) {
    if (f.state === 'ko') return;
    f.state = 'ko'; f.vx = 0; f.vy = 0;
    f.stocks = Math.max(0, f.stocks - 1);
    playSFX('ko'); triggerShake(18);
    drawStockIcons();

    if (f.stocks <= 0) {
      matchOver = true;
      matchWinner = f === p1 ? 2 : 1;
      return;
    }
    f._koTimer = 180;  // 3 seconds at 60fps before respawn
    // Show brief KO text
    const nm = f === p1 ? char1def.name : char2def.name;
    showIntroText('KO!', 70, 0xff2222, null);
  }

  // ── AI ───────────────────────────────────────────────────
  function updateAI(dt) {
    if (!p2.isAI || p2.state === 'ko' || p2.state === 'win') return;
    if (p2._invincible > 0 || p2.hitStun > 0) return;
    p2.aiTimer -= dt;
    if (p2.aiTimer > 0) return;
    p2.aiTimer = 10 + Math.random() * 15;

    const dist = Math.abs(p1.x - p2.x);
    const heightDiff = p1.y - p2.y;  // positive = p1 is below
    const rand = Math.random();

    // Approach or retreat
    if (dist > ATTACK_RANGE * 1.4) {
      p2.vx = (p1.x < p2.x ? -1 : 1) * MOVE_SPEED * p2.speedMult;
    } else if (dist < ATTACK_RANGE * 0.5) {
      p2.vx = (p1.x < p2.x ? 1 : -1) * MOVE_SPEED * p2.speedMult * 0.7;
    } else {
      p2.vx = 0;
    }

    // Jump toward opponent if above
    if (p2.onGround && heightDiff < -60 && rand < 0.55) {
      p2.vy = JUMP_VY; p2.onGround = false; p2.jumpsLeft = 1; p2.state = 'jump';
    } else if (!p2.onGround && p2.jumpsLeft > 0 && heightDiff < -80 && rand < 0.3) {
      p2.vy = DOUBLE_JUMP_VY; p2.jumpsLeft--; p2.state = 'jump';
    }

    // Jump randomly to mix up
    if (p2.onGround && rand < 0.12) {
      p2.vy = JUMP_VY; p2.onGround = false; p2.jumpsLeft = 1; p2.state = 'jump';
    }

    // Attack in range
    if (dist <= ATTACK_RANGE * 1.1 && Math.abs(p1.y - p2.y) < 80 && p2.attackCd <= 0 && p2.hitStun <= 0) {
      const r2 = Math.random();
      if      (r2 < 0.45) aiQueueAttack('NORMAL');
      else if (r2 < 0.75) aiQueueAttack('KICK');
      else                aiQueueAttack('SPECIAL');
    }

    // Don't walk off edges (simple check)
    if (p2.onGround) {
      const nearEdge = p2.x < 80 || p2.x > W() - 80;
      if (nearEdge) p2.vx = (p2.x < W()/2 ? 1 : -1) * MOVE_SPEED * p2.speedMult;
    }
  }

  // ── Attack system ────────────────────────────────────────
  let attackQueue = [];

  function canAttack(f) {
    return f.attackCd <= 0 && f.hitStun <= 0 &&
           f.state !== 'ko' && f.state !== 'win' && f.state !== 'hit';
  }

  function queueAttack(attacker, defender, atkType) {
    if (!canAttack(attacker)) return;
    if (attackQueue.some(r => r.attacker === attacker)) return;
    attackQueue.push({ attacker, defender, atkType });
  }

  function aiQueueAttack(atkType) { queueAttack(p2, p1, atkType); }

  function beginAttack(f, atkType) {
    const atk = ATTACKS[atkType];
    if (!atk) return;
    f._lastAtkType    = atkType;
    f._lastAtkIsKick  = atk.isKick;
    f.state           = atkType === 'SPECIAL' ? 'special' : 'attack';
    f.attackTimer     = atk.dur;
    f.attackCd        = atk.cd;
    playSFX(atkType === 'SPECIAL' ? 'special' : 'punch');
  }

  function checkHit(attacker, defender, atkType) {
    const atk = ATTACKS[atkType];
    if (!atk || defender.state === 'ko') return null;
    if (defender._invincible > 0) return null;
    const dist  = Math.abs(attacker.x - defender.x);
    const ydist = Math.abs(attacker.y - defender.y);
    if (dist >= atk.range || ydist >= ATTACK_RANGE_Y * 1.8) return null;
    const isBlocked = defender.blocking && defender.onGround;
    return { atk, atkType, isBlocked };
  }

  function applyHit(attacker, defender, hit) {
    if (!hit) return;
    const { atk, atkType, isBlocked } = hit;

    if (isBlocked) {
      defender.hitStun = 8;
      defender.vx += attacker.dir * atk.kbx * 0.3;
      return;
    }

    // Accumulate damage
    const dmgAdded = atk.dmg * attacker.damageMult * defender.defenseMult;
    defender.damage = Math.min(999, defender.damage + dmgAdded);

    // Knockback scales with accumulated damage
    const scale = 0.3 + defender.damage / 100;
    const kbDir = attacker.dir;
    defender.vx = kbDir * atk.kbx * scale * attacker.damageMult;
    defender.vy = atk.kby * scale * attacker.damageMult;

    // Hit state
    const stunMult = atkType === 'SPECIAL' ? 1.6 : atkType === 'KICK' ? 1.2 : 0.9;
    defender.hitStun = 22 * stunMult;
    defender.state = 'hit';
    defender.onGround = false;
    defender._hitFlash = 1;
    defender._squash = 0.7; defender._squashV = 0.1;
    defender._knockbackFrames = 25;

    const hitX = (attacker.x + defender.x) / 2;
    const hitY  = defender.y - FIGHTER_H * 0.5;
    spawnHitEffect(hitX, hitY, atkType === 'SPECIAL');
    triggerShake(atkType === 'SPECIAL' ? 12 : atkType === 'KICK' ? 7 : 4);
  }

  function resolveAttacks() {
    attackQueue.forEach(req => {
      beginAttack(req.attacker, req.atkType);
      applyHit(req.attacker, req.defender, checkHit(req.attacker, req.defender, req.atkType));
    });
    attackQueue = [];
  }

  // ── Camera (simple: lerp toward midpoint, zoom out if needed) ──
  let camZoom = 1.0;

  function updateCamera() {
    if (!fightActive) return;
    const midX = (p1.x + p2.x) / 2;
    const midY = Math.min((p1.y + p2.y) / 2, GROUND_Y * 0.9);
    const spread = Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) * 0.5;
    const targetZoom = Math.max(0.72, Math.min(1.0, W() * 0.75 / Math.max(spread + 200, 400)));
    camZoom += (targetZoom - camZoom) * 0.04;

    worldContainer.scale.set(camZoom);
    worldContainer.x = W() / 2 - midX * camZoom;
    worldContainer.y = H() / 2 - midY * camZoom;
  }

  // ── Main game loop ────────────────────────────────────────
  const ticker = (tk) => {
    if (currentScene !== SCENES.FIGHT) {
      app.ticker.remove(ticker);
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
      return;
    }

    const dt = tk.deltaTime;

    if (!fightActive || matchOver) {
      if (matchOver && !navigating) {
        navigating = true;
        const winner = matchWinner;
        const winName  = winner === 1 ? char1def.name : char2def.name;
        const winColor = winner === 1 ? 0x4488ff : 0xff4444;
        (winner === 1 ? p1 : p2).state = 'win';
        setTimeout(() => {
          showIntroText(winName + ' WINS!', 130, winColor, () => {
            setTimeout(() => {
              document.removeEventListener('keydown', keydown);
              document.removeEventListener('keyup', keyup);
              gameResult = { winner, p1Name: char1def.name, p2Name: char2def.name };
              showScene(SCENES.GAME_OVER);
            }, 600);
          });
        }, 800);
      }
      // Still animate sprites even when waiting
      [p1, p2].forEach(f => { if (f.container) drawFighterBody(f); });
      return;
    }

    // ── P1 Input ─────────────────────────────────────────
    if (p1.state !== 'ko' && p1.state !== 'win' && p1._koTimer <= 0) {
      const p1left  = keys['a'] || keys['A'] || touchBtns.left;
      const p1right = keys['d'] || keys['D'] || touchBtns.right;
      const p1jumpK = keys['w'] || keys['W'] || keys['ArrowUp'] || touchBtns.jump;
      const p1block = (keys['s'] || keys['S'] || touchBtns.down) && p1.onGround;
      const p1atk   = keys['j'] || keys['J'] || touchBtns.normal;
      const p1kick  = keys['k'] || keys['K'] || touchBtns.kick;
      const p1spcl  = keys['l'] || keys['L'] || touchBtns.special;

      p1.blocking = !!(p1block) && p1.hitStun <= 0 && p1.state !== 'attack' && p1.state !== 'special';

      if (p1.hitStun <= 0 && !p1.blocking) {
        let moving = false;
        if (p1left && p1.state !== 'attack' && p1.state !== 'special') {
          p1.vx = -MOVE_SPEED * p1.speedMult; p1.dir = -1;
          if (p1.state !== 'jump') p1.state = 'run'; moving = true;
        } else if (p1right && p1.state !== 'attack' && p1.state !== 'special') {
          p1.vx = MOVE_SPEED * p1.speedMult; p1.dir = 1;
          if (p1.state !== 'jump') p1.state = 'run'; moving = true;
        }
        if (!moving && p1.onGround && p1.state !== 'attack' && p1.state !== 'special') {
          p1.vx *= 0.7;
          if (p1.state === 'run') p1.state = 'idle';
        }

        // Jump
        if (p1jumpK) {
          if (!jumpConsumed.p1) {
            if (p1.onGround) {
              p1.vy = JUMP_VY; p1.onGround = false; p1.jumpsLeft = 1; p1.state = 'jump';
              jumpConsumed.p1 = true;
            } else if (p1.jumpsLeft > 0) {
              p1.vy = DOUBLE_JUMP_VY; p1.jumpsLeft--; p1.state = 'jump';
              jumpConsumed.p1 = true;
              // Double-jump puff
              spawnDust(p1.x, p1.y);
            }
          }
        } else {
          jumpConsumed.p1 = false;
        }

        // Attacks
        if (p1.attackCd <= 0) {
          if (p1atk)  queueAttack(p1, p2, 'NORMAL');
          if (p1kick) queueAttack(p1, p2, 'KICK');
          if (p1spcl) queueAttack(p1, p2, 'SPECIAL');
        }
      } else if (p1.blocking) {
        p1.state = 'block';
        p1.vx *= 0.7;
      }
    }

    // ── P2 Input ─────────────────────────────────────────
    if (!p2.isAI && p2.state !== 'ko' && p2.state !== 'win' && p2._koTimer <= 0) {
      const p2left  = keys['ArrowLeft']  || touchBtns.left2;
      const p2right = keys['ArrowRight'] || touchBtns.right2;
      const p2jumpK = keys['ArrowUp']    || touchBtns.jump2;
      const p2block = keys['ArrowDown']  && p2.onGround;
      // Numpad or U/I/O
      const p2atk   = keys['1'] || keys['Numpad1'] || keys['u'] || keys['U'];
      const p2kick  = keys['2'] || keys['Numpad2'] || keys['i'] || keys['I'];
      const p2spcl  = keys['3'] || keys['Numpad3'] || keys['o'] || keys['O'];

      p2.blocking = !!(p2block) && p2.hitStun <= 0 && p2.state !== 'attack' && p2.state !== 'special';

      if (p2.hitStun <= 0 && !p2.blocking) {
        let moving = false;
        if (p2left && p2.state !== 'attack' && p2.state !== 'special') {
          p2.vx = -MOVE_SPEED * p2.speedMult; p2.dir = -1;
          if (p2.state !== 'jump') p2.state = 'run'; moving = true;
        } else if (p2right && p2.state !== 'attack' && p2.state !== 'special') {
          p2.vx = MOVE_SPEED * p2.speedMult; p2.dir = 1;
          if (p2.state !== 'jump') p2.state = 'run'; moving = true;
        }
        if (!moving && p2.onGround && p2.state !== 'attack' && p2.state !== 'special') {
          p2.vx *= 0.7; if (p2.state === 'run') p2.state = 'idle';
        }

        if (p2jumpK) {
          if (!jumpConsumed.p2) {
            if (p2.onGround) {
              p2.vy = JUMP_VY; p2.onGround = false; p2.jumpsLeft = 1; p2.state = 'jump';
              jumpConsumed.p2 = true;
            } else if (p2.jumpsLeft > 0) {
              p2.vy = DOUBLE_JUMP_VY; p2.jumpsLeft--; p2.state = 'jump';
              jumpConsumed.p2 = true; spawnDust(p2.x, p2.y);
            }
          }
        } else { jumpConsumed.p2 = false; }

        if (p2.attackCd <= 0) {
          if (p2atk)  queueAttack(p2, p1, 'NORMAL');
          if (p2kick) queueAttack(p2, p1, 'KICK');
          if (p2spcl) queueAttack(p2, p1, 'SPECIAL');
        }
      } else if (p2.blocking) {
        p2.state = 'block'; p2.vx *= 0.7;
      }
    }

    // ── AI ──────────────────────────────────────────────
    if (p2.isAI) updateAI(dt);

    // ── Resolve attacks ──────────────────────────────────
    resolveAttacks();

    // ── Physics ─────────────────────────────────────────
    [p1, p2].forEach(f => {
      // Respawn countdown
      if (f.state === 'ko' && f._koTimer > 0) {
        f._koTimer -= dt;
        if (f._koTimer <= 0 && f.stocks > 0) respawnFighter(f);
        if (f.container) drawFighterBody(f);
        return;
      }
      if (f.state === 'ko' && f._koTimer <= 0 && f.stocks <= 0) {
        if (f.container) drawFighterBody(f);
        return;
      }

      // Gravity
      f.vy += GRAVITY;

      // Friction
      if (f._knockbackFrames > 0) {
        f._knockbackFrames = Math.max(0, f._knockbackFrames - dt);
        f.vx *= KB_FRICTION;
      } else if (!f.onGround) {
        f.vx *= AIR_FRICTION;
      }

      // Move
      f.x += f.vx * dt;
      f.y += f.vy * dt;

      // Platform collision
      f.onGround = false;
      const plat = getPlatformBelow(f);
      if (plat) {
        const wasAirborne = f.vy > 1;
        f.y = plat.y; f.vy = 0; f.onGround = true; f.jumpsLeft = 2;
        if (wasAirborne && f.state !== 'ko') {
          f._squash = 0.7; f._squashV = 0.12;
          if (f.state === 'jump' || f.state === 'hit') {
            f.state = 'idle'; spawnDust(f.x, f.y);
          }
        }
      }

      // Cooldowns
      if (f.attackCd > 0) f.attackCd -= dt;
      if (f.attackTimer > 0) {
        f.attackTimer -= dt;
        if (f.attackTimer <= 0 && f.state !== 'ko' && f.state !== 'hit' && f.state !== 'win' && f.state !== 'block') {
          f.state = f.onGround ? 'idle' : 'jump';
        }
      }
      if (f.hitStun > 0) {
        f.hitStun -= dt;
        if (f.hitStun <= 0 && f.state === 'hit') {
          f.state = f.onGround ? 'idle' : 'jump';
        }
      }

      // Invincibility
      if (f._invincible > 0) f._invincible -= dt;

      // Face opponent (when free)
      if (f.hitStun <= 0 && f.attackTimer <= 0 && f.state !== 'ko' && f.state !== 'win') {
        const opp = f === p1 ? p2 : p1;
        if (f.state !== 'run') f.dir = opp.x >= f.x ? 1 : -1;
      }
      // AI always faces opponent
      if (f === p2 && f.isAI) f.dir = p1.x >= p2.x ? 1 : -1;

      // Block state management
      if (f.state === 'block' && !f.blocking) f.state = 'idle';

      // Check blast zone KO
      if (isOutsideBlast(f) && f.state !== 'ko') {
        handleKO(f);
      }

      // Update sprite
      if (f.container) {
        f.container.x = f.x;
        f.container.y = f.y;
        f.container.scale.x = f.dir;
        if (f.state === 'ko') {
          f.container.rotation = Math.min(Math.PI / 2, f.container.rotation + 0.06 * dt);
        } else {
          f.container.rotation = 0;
        }
        drawFighterBody(f);
      }
    });

    updateEffects(dt);
    updateHUD();
    updateCamera();

    // Screen shake
    if (shakeAmt > 0.3) {
      shakeX = (Math.random() - 0.5) * shakeAmt * 2;
      shakeY = (Math.random() - 0.5) * shakeAmt * 2;
      shakeAmt *= 0.72;
    } else {
      shakeAmt = 0; shakeX = 0; shakeY = 0;
    }
    app.stage.position.set(shakeX, shakeY);
  };
  app.ticker.add(ticker);
}

// ═══════════════════════════════════════════════════════════
// TOUCH CONTROLS — Platformer Brawler layout
// Left: D-pad (←▲→▼)  |  Right: 3 attack buttons (PUNCH / KICK / SPECIAL)
// ═══════════════════════════════════════════════════════════
function buildTouchControls(container) {
  const state = {
    left: false, right: false, jump: false, down: false,
    normal: false, kick: false, special: false,
    // P2 (not used in touch mode but keep consistent)
    left2: false, right2: false, jump2: false,
  };

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 850;
  if (!isMobile) return state;

  const btnLayer = new PIXI.Container();
  btnLayer.interactiveChildren = true;
  container.addChild(btnLayer);

  const r   = Math.min(W() * 0.07, 46);
  const pad = 14;
  const baseY = H() - pad - r;

  // ── D-pad (left side) ────────────────────────────────
  const dpadCX = pad + r * 2.8;
  const dpadCY = baseY - r * 0.6;
  const dpadR  = r * 1.05;

  function makeDpad(label, ox, oy, key) {
    const g = new PIXI.Graphics();
    const bw = r * 1.55;
    g.roundRect(-bw/2, -bw/2, bw, bw, 10)
      .fill({ color: 0x162040, alpha: 0.92 })
      .stroke({ color: 0x55aaee, width: 2.5 });
    g.x = dpadCX + ox * dpadR;
    g.y = dpadCY + oy * dpadR;
    g.interactive = true; g.cursor = 'pointer';
    const t = makeText(label, { size: Math.max(10, Math.floor(r * 0.44)), color: 0xddeeff });
    t.anchor.set(0.5); g.addChild(t); btnLayer.addChild(g);
    g.on('pointerdown',     () => { state[key] = true;  g.alpha = 0.45; });
    g.on('pointerup',       () => { state[key] = false; g.alpha = 1; });
    g.on('pointerupoutside',() => { state[key] = false; g.alpha = 1; });
    return g;
  }
  makeDpad('◄', -1,  0, 'left');
  makeDpad('►',  1,  0, 'right');
  makeDpad('▲',  0, -1, 'jump');
  makeDpad('▼',  0,  1, 'down');

  // ── 3 attack buttons (right side) ────────────────────
  const attackDefs = [
    ['normal',  'J',       0, 0x1a2a4a, 0x4488ff],
    ['kick',    'K',       1, 0x2a1a1a, 0xff5533],
    ['special', 'L\nSPCL', 2, 0x1a1a2a, 0xbb44ff],
  ];

  const atkSpacing = r * 2.2;
  const atkStartX  = W() - pad - r - atkSpacing * 2;
  const atkY       = baseY;

  attackDefs.forEach(([key, label, col, bg, border]) => {
    const cx = atkStartX + col * atkSpacing;
    const g = new PIXI.Graphics();
    g.circle(0, 0, r).fill({ color: bg, alpha: 0.88 }).stroke({ color: border, width: 2.5 });
    g.x = cx; g.y = atkY; g.interactive = true; g.cursor = 'pointer';
    const t = makeText(label, { size: Math.max(8, Math.floor(r * 0.36)), color: border });
    t.anchor.set(0.5); g.addChild(t); btnLayer.addChild(g);
    g.on('pointerdown',     () => { state[key] = true;  g.alpha = 0.45; });
    g.on('pointerup',       () => { state[key] = false; g.alpha = 1; });
    g.on('pointerupoutside',() => { state[key] = false; g.alpha = 1; });
  });

  return state;
}

// ═══════════════════════════════════════════════════════════
// SCENE: GAME OVER
// ═══════════════════════════════════════════════════════════
let gameResult = { winner: 1, p1Name: 'P1', p2Name: 'P2' };

function buildGameOverScene(container) {
  const bg = new PIXI.Graphics();
  bg.rect(0, 0, W(), H()).fill({ color: 0x000000, alpha: 1 });
  container.addChild(bg);

  if (textures['bg']) {
    fillScreen(container, textures['bg']);
    const darken = new PIXI.Graphics();
    darken.rect(0, 0, W(), H()).fill({ color: 0x000000, alpha: 0.75 });
    container.addChild(darken);
  }

  // KO text
  const koTitle = makeGlowText('K.O.', Math.min(Math.floor(W() / 8), 90), 0xff2222);
  koTitle.x = W() / 2; koTitle.y = H() * 0.2;
  container.addChild(koTitle);

  // Winner name
  const winName  = gameResult.winner === 1 ? gameResult.p1Name : gameResult.p2Name;
  const winColor = gameResult.winner === 1 ? 0x4488ff : 0xff4444;
  const winText  = makeGlowText(winName + ' WINS!', Math.min(Math.floor(W() / 14), 48), winColor);
  winText.x = W() / 2; winText.y = H() * 0.42;
  container.addChild(winText);

  // Winner portrait
  const winIdx = gameResult.winner === 1 ? p1CharIdx : p2CharIdx;
  if (textures[`char_${winIdx}`]) {
    const portrait = new PIXI.Sprite(textures[`char_${winIdx}`]);
    const ps = Math.min(W() * 0.2, 180);
    portrait.width = ps; portrait.height = ps; portrait.anchor.set(0.5);
    portrait.x = W() / 2; portrait.y = H() * 0.65; container.addChild(portrait);
    const ring = new PIXI.Graphics();
    ring.circle(W() / 2, H() * 0.65, ps * 0.55).stroke({ color: winColor, width: 3 });
    container.addChild(ring);
  }

  // Buttons
  const btnRematch = makeButton('REMATCH',   W() / 2, H() * 0.83, 200, 44, { color: 0x002200, border: 0x44ff44, textColor: 0x44ff44 });
  const btnMenu    = makeButton('MAIN MENU', W() / 2, H() * 0.91, 200, 44, { color: 0x220022, border: 0xbb44ff, textColor: 0xbb44ff });
  container.addChild(btnRematch, btnMenu);

  playVictoryMusic(() => {
    if (currentScene === SCENES.GAME_OVER) playMenuMusic();
  });

  let navigated = false;
  let gameOverKeydown = null;

  function cleanupAndGo(sceneFn) {
    if (navigated) return;
    navigated = true;
    if (gameOverKeydown) { document.removeEventListener('keydown', gameOverKeydown); gameOverKeydown = null; }
    stopMusic(); playSFX('select'); flashTransition(sceneFn);
  }

  btnRematch.on('pointertap', () => cleanupAndGo(() => showScene(SCENES.FIGHT)));
  btnMenu.on('pointertap',    () => cleanupAndGo(() => showScene(SCENES.MENU)));

  gameOverKeydown = (e) => {
    if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') cleanupAndGo(() => showScene(SCENES.FIGHT));
    if (e.key === 'Escape' || e.key === 'm' || e.key === 'M') cleanupAndGo(() => showScene(SCENES.MENU));
  };
  document.addEventListener('keydown', gameOverKeydown);

  const ticker = (tk) => {
    if (currentScene !== SCENES.GAME_OVER) {
      app.ticker.remove(ticker);
      if (gameOverKeydown) { document.removeEventListener('keydown', gameOverKeydown); gameOverKeydown = null; }
      return;
    }
    koTitle.scale.set(1 + Math.sin(Date.now() / 600) * 0.05);
    winText.scale.set(1 + Math.sin(Date.now() / 800 + 1) * 0.03);
  };
  app.ticker.add(ticker);
}

// ═══════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════
window._game = {
  get p1CharIdx() { return p1CharIdx; }, set p1CharIdx(v) { p1CharIdx = v; },
  get p2CharIdx() { return p2CharIdx; }, set p2CharIdx(v) { p2CharIdx = v; },
  get gameMode()  { return gameMode;  }, set gameMode(v)  { gameMode = v;  },
  get chars() { return CHARACTERS.map((c,i) => `${i}: ${c.name}`); },
};
window.gotoFight = function(p1 = 0, p2 = 1, stage = null) {
  p1CharIdx = p1 % CHARACTERS.length;
  p2CharIdx = p2 % CHARACTERS.length;
  gameMode = '1P';
  currentStage = stage || STAGES[Math.floor(Math.random() * STAGES.length)];
  showScene(SCENES.FIGHT);
};
window.gotoMenu   = () => showScene(SCENES.MENU);
window.gotoSelect = () => { gameMode = '1P'; showScene(SCENES.CHARACTER_SELECT); };

window.addEventListener('load', () => {
  init().catch(err => {
    console.error('Fatal init error:', err);
    const lt = document.getElementById('loading-text');
    if (lt) lt.textContent = 'Error: ' + err.message;
  });
});

document.addEventListener('pointerdown', resumeAudio, { once: false });
