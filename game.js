// ============================================================
//  RADAR FIGHTERS 2 — PLATFORMER BRAWLER v2.0
//  PixiJS v8 · Smash Bros-style · Neon Arcade · Up to 4 Players
//  Scenes: MENU → CHARACTER_SELECT → FIGHT → GAME_OVER
// ============================================================

const SCENES = { MENU: 0, CHARACTER_SELECT: 1, FIGHT: 2, GAME_OVER: 3 };

// ── Game constants ──────────────────────────────────────────
const GRAVITY        = 0.55;
const MOVE_SPEED     = 5;
const JUMP_VY        = -20;          // First jump (was -15)
const DOUBLE_JUMP_VY = -16;          // Double jump (was -12)
const ATTACK_DUR     = 18;
const ATTACK_RANGE   = 95;
const ATTACK_RANGE_Y = 70;
const STOCKS         = 3;
const KB_FRICTION    = 0.985;
const AIR_FRICTION   = 0.96;

// ── Stage neon palette ──────────────────────────────────────
const STAGE_NEON = {
  'bg_ixtapa':    0xbf00ff,
  'bg_colchagua': 0x00ff88,
  'bg_zapallar':  0x00d2ff,
  'bg_vallebravo':0xff6b00,
  'bg':           0xbf00ff,
};

// ── Player colors ───────────────────────────────────────────
const PLAYER_COLORS = [0x4488ff, 0xff4444, 0x44ff88, 0xffdd00];
const PLAYER_LABELS = ['P1', 'P2', 'P3', 'P4'];

// ── Attack definitions ──────────────────────────────────────
const ATTACKS = {
  NORMAL:  { dmg: 7,  cd: 20, range: ATTACK_RANGE,        kbx: 4.5, kby: -4,  dur: 15, isKick: false },
  KICK:    { dmg: 11, cd: 32, range: ATTACK_RANGE * 1.05, kbx: 6.5, kby: -10, dur: 22, isKick: true  },
  SPECIAL: { dmg: 18, cd: 55, range: ATTACK_RANGE * 1.1,  kbx: 10,  kby: -15, dur: 30, isKick: false },
};

// ── Player controls config ──────────────────────────────────
const CTRL_CONFIGS = [
  // P1: A/D move, W jump, S block, J/K/L attack
  { left:['a','A'], right:['d','D'], jump:['w','W'], block:['s','S'],
    punch:['j','J'], kick:['k','K'], special:['l','L'] },
  // P2: arrows move, numpad/U/I/O attack
  { left:['ArrowLeft'], right:['ArrowRight'], jump:['ArrowUp'], block:['ArrowDown'],
    punch:['1','Numpad1','u','U'], kick:['2','Numpad2','i','I'], special:['3','Numpad3','o','O'] },
  // P3: F/H move, T jump, G block, Z/X/C attack
  { left:['f','F'], right:['h','H'], jump:['t','T'], block:['g','G'],
    punch:['z','Z'], kick:['x','X'], special:['c','C'] },
  // P4: Numpad move/attack (keyboard fallback)
  { left:['Numpad4'], right:['Numpad6'], jump:['Numpad8'], block:['Numpad5'],
    punch:['Numpad7'], kick:['Numpad9'], special:['Numpad0'] },
];

// ── Character definitions ───────────────────────────────────
const CHARACTERS = [
  // ── Founders ──
  { name:'HERBERT',   title:'CO-FOUNDER & CEO',     power:9, speed:6, defense:6, color:0xc0392b, accentColor:0xff6b6b, portrait:'assets/char_herbert.png'  },
  { name:'GABO',      title:'CO-FOUNDER & CTO',     power:8, speed:8, defense:5, color:0x2980b9, accentColor:0x74b9ff, portrait:'assets/char_gabo.png'     },
  { name:'AMANDA',    title:'CO-FOUNDER & CRO',     power:8, speed:8, defense:5, color:0xe8735a, accentColor:0xffb8b8, portrait:'assets/char_amanda.png'   },
  // ── Engineering ──
  { name:'ARTURO',    title:'TECH MANAGER',          power:6, speed:9, defense:6, color:0x2c3e50, accentColor:0x95a5a6, portrait:'assets/char_arturo.png'   },
  { name:'JAIME',     title:'TECH LEAD',             power:7, speed:8, defense:6, color:0x1abc9c, accentColor:0x76d7c4, portrait:'assets/char_jaime.png'    },
  { name:'CHRIS',     title:'BACKEND ENG LVL 3',    power:6, speed:9, defense:6, color:0xf39c12, accentColor:0xffeaa7, portrait:'assets/char_chris.png'    },
  { name:'KEVIN',     title:'FULL STACK ENG',        power:7, speed:8, defense:6, color:0x0984e3, accentColor:0x74b9ff, portrait:'assets/char_kevin.png'    },
  { name:'LORENS',    title:'BACKEND ENG',           power:6, speed:9, defense:6, color:0xe17055, accentColor:0xfab1a0, portrait:'assets/char_lorens.png'   },
  { name:'NELSON',    title:'BACKEND ENG',           power:7, speed:8, defense:6, color:0x6c3483, accentColor:0xaf7ac5, portrait:'assets/char_nelson.png'   },
  { name:'ANDRÉS',    title:'DEVOPS ENG',            power:6, speed:7, defense:8, color:0x117a65, accentColor:0x52be80, portrait:'assets/char_andres.png'   },
  { name:'JAVIER',    title:'FRONTEND DEV',          power:6, speed:9, defense:5, color:0x34495e, accentColor:0x85929e, portrait:'assets/char_javier.png'   },
  { name:'GERARDO',   title:'LOW CODE ENG',          power:6, speed:7, defense:7, color:0xe74c3c, accentColor:0xf1948a, portrait:'assets/char_gerardo.png'  },
  // ── Product ──
  { name:'CARLO',     title:'PRODUCT LEAD',          power:8, speed:7, defense:6, color:0x8e44ad, accentColor:0xd7bde2, portrait:'assets/char_carlo.png'    },
  // ── Business ──
  { name:'ESTEBAN',   title:'BIZ DEV ASSOC',         power:8, speed:8, defense:5, color:0xe67e22, accentColor:0xf8c471, portrait:'assets/char_esteban.png'  },
  { name:'FRANCISCO', title:'BUSINESS ANALYST',      power:7, speed:7, defense:7, color:0x6c5ce7, accentColor:0xa29bfe, portrait:'assets/char_francisco.png'},
  // ── Sales ──
  { name:'HÉCTOR',    title:'SALES MANAGER',         power:8, speed:7, defense:6, color:0x922b21, accentColor:0xec7063, portrait:'assets/char_hector.png'   },
  { name:'ALEX',      title:'SALES EXEC',            power:9, speed:8, defense:4, color:0xd4ac0d, accentColor:0xf9e79f, portrait:'assets/char_alex.png'     },
  // ── Operations ──
  { name:'DANI',      title:'OPERATIONS ANALYST',    power:5, speed:7, defense:8, color:0x27ae60, accentColor:0xa9dfbf, portrait:'assets/char_dani.png'     },
  { name:'YONG',      title:'OPERATIONS MANAGER',    power:6, speed:7, defense:8, color:0x1a5276, accentColor:0x5dade2, portrait:'assets/char_yong.png'     },
  // ── Finance ──
  { name:'GERI',      title:'ACCOUNTING MANAGER',    power:5, speed:6, defense:9, color:0xf1c40f, accentColor:0xfcf3cf, portrait:'assets/char_geri.png'     },
  // ── People ──
  { name:'MAX',       title:'PEOPLE & CULTURE',      power:7, speed:7, defense:7, color:0x00b894, accentColor:0x55efc4, portrait:'assets/char_max.png'      },
  // ── Marketing ──
  { name:'ANDY',      title:'MARKETING LEAD',        power:8, speed:8, defense:5, color:0xfd79a8, accentColor:0xffb8d1, portrait:'assets/char_andy.png'     },
  { name:'KAREN',     title:'COMMS ANALYST',         power:6, speed:8, defense:6, color:0xfdcb6e, accentColor:0xffeaa7, portrait:'assets/char_karen.png'    },
  // ── 🐬 Secret Boss ──
  { name:'RADARÍN',   title:'CHIEF CULTURE OFF.',    power:10,speed:10,defense:10,color:0x0099e5, accentColor:0x00d2ff, portrait:'assets/char_radarin.png'  },
];

// ── Global state ─────────────────────────────────────────────
let app, currentScene = SCENES.MENU;
let textures = {};
window._textures = textures;
let sceneContainer = null;

// gameMode: '1P' | '2P' | '4PFFA' | '2V2' | '2PAI'
let gameMode = '1P';
let charIndices = [0, 12, 1, 13];  // P1..P4 char indices
let currentStage = null;
const STAGES = ['bg_ixtapa', 'bg_vallebravo', 'bg_colchagua', 'bg_zapallar'];

let audioCtx = null, musicNodes = [], currentMusicGain = null;
let bgmPlaying = false, musicSessionId = 0, currentMusicVolume = 0;
let isMuted = false, muteButton = null, muteButtonBg = null, muteButtonLabel = null;
let gameResult = { winner: -1, winnerName: '', p1Name: 'P1', p2Name: 'P2' };

// ── Loading ──────────────────────────────────────────────────
function setLoading(pct, msg) {
  const bar = document.getElementById('loading-bar');
  const txt = document.getElementById('loading-text');
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = msg || 'Loading...';
}

// ═══════════════════════════════════════════════════════════
// INIT
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

  setLoading(10, 'Loading backgrounds...');

  const assetList = [
    { alias:'bg_ixtapa',    src:'assets/background.jpg'     },
    { alias:'bg_vallebravo',src:'assets/bg_valle_bravo.jpg' },
    { alias:'bg_colchagua', src:'assets/bg_colchagua.jpg'   },
    { alias:'bg_zapallar',  src:'assets/bg_zapallar.jpg'    },
    { alias:'bg',           src:'assets/background.jpg'     },
    ...CHARACTERS.map((c,i) => ({ alias:`char_${i}`, src:c.portrait })),
    ...CHARACTERS.map((c,i) => {
      const n = c.portrait.replace('assets/char_','').replace('.png','');
      return [
        { alias:`spr_${i}_idle`,    src:`assets/spr_${n}_idle.png`    },
        { alias:`spr_${i}_atk`,     src:`assets/spr_${n}_atk.png`     },
        { alias:`spr_${i}_hit`,     src:`assets/spr_${n}_hit.png`     },
        { alias:`spr_${i}_kick`,    src:`assets/spr_${n}_kick.png`    },
        { alias:`spr_${i}_block`,   src:`assets/spr_${n}_block.png`   },
        { alias:`spr_${i}_special`, src:`assets/spr_${n}_special.png` },
        { alias:`spr_${i}_win`,     src:`assets/spr_${n}_win.png`     },
        { alias:`spr_${i}_ko`,      src:`assets/spr_${n}_ko.png`      },
        { alias:`spr_${i}_jump`,    src:`assets/spr_${n}_jump.png`    },
        { alias:`spr_${i}_walk`,    src:`assets/spr_${n}_walk.png`    },
        { alias:`spr_${i}_idle_f0`, src:`assets/spr_${n}_idle_f0.png` },
        { alias:`spr_${i}_idle_f1`, src:`assets/spr_${n}_idle_f1.png` },
        { alias:`spr_${i}_idle_f2`, src:`assets/spr_${n}_idle_f2.png` },
        { alias:`spr_${i}_walk_f0`, src:`assets/spr_${n}_walk_f0.png` },
        { alias:`spr_${i}_walk_f1`, src:`assets/spr_${n}_walk_f1.png` },
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
    setLoading(10 + (loaded / assetList.length) * 85, `Loading ${asset.alias}...`);
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
// AUDIO
function initAudio() {
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
}

function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      if (!bgmPlaying) {
        switch (currentScene) {
          case SCENES.MENU: case SCENES.CHARACTER_SELECT: playMenuMusic(); break;
          case SCENES.FIGHT: playFightMusic(); break;
        }
      }
    });
  }
}

function stopMusic() {
  bgmPlaying = false; musicSessionId++;
  if (currentMusicGain) { try { currentMusicGain.disconnect(); } catch(e) {} currentMusicGain = null; }
  musicNodes.forEach(n => { try { n.stop(); } catch(e) {} try { n.disconnect(); } catch(e) {} });
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
  muteButtonBg.roundRect(0,0,40,40,10).fill({ color:0x000000, alpha:0.5 }).stroke({ color:0xffffff, alpha:0.35, width:1.5 });
  muteButtonLabel.text = isMuted ? '🔇' : '🔊';
}

function positionMuteButton() { if (muteButton) { muteButton.x = W()-50; muteButton.y = 20; } }

function toggleMute() { isMuted = !isMuted; applyCurrentMusicVolume(); updateMuteButton(); }

function createMuteButton() {
  muteButton = new PIXI.Container();
  muteButton.zIndex = 100;
  muteButton.eventMode = 'static';
  muteButton.cursor = 'pointer';
  muteButtonBg = new PIXI.Graphics();
  muteButtonLabel = makeText('🔊', { size:20, color:0xffffff });
  muteButtonLabel.anchor.set(0.5); muteButtonLabel.x = 20; muteButtonLabel.y = 20;
  muteButton.addChild(muteButtonBg, muteButtonLabel);
  muteButton.on('pointerdown', (e) => { e.stopPropagation(); toggleMute(); });
  muteButton.on('pointertap',  (e) => { e.stopPropagation(); });
  positionMuteButton(); updateMuteButton();
  app.stage.addChild(muteButton);
  app.renderer.on?.('resize', positionMuteButton);
}

function playMenuMusic() {
  if (!audioCtx || bgmPlaying) return;
  if (audioCtx.state === 'suspended') { resumeAudio(); return; }
  bgmPlaying = true;
  const mySession = musicSessionId;
  const notes = [523.25,587.33,659.25,698.46,783.99,880,783.99,698.46,659.25,587.33,523.25,493.88,440,493.88,523.25,587.33];
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
    if (musicNodes.length > 32) musicNodes.splice(1,16);
    if (bgmPlaying && musicSessionId === mySession) setTimeout(scheduleNote, noteDur * 500);
  }
  scheduleNote();
}

function playFightMusic() {
  stopMusic();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') { resumeAudio(); return; }
  bgmPlaying = true;
  const mySession = musicSessionId;
  const fightNotes = [220,246.94,261.63,220,196,220,246.94,261.63,293.66,261.63,246.94,220,196,174.61,196,220];
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
    if (musicNodes.length > 32) musicNodes.splice(1,16);
    if (bgmPlaying && musicSessionId === mySession) setTimeout(scheduleNote, noteDur * 500);
  }
  scheduleNote();
}

function playVictoryMusic(onDone) {
  stopMusic();
  if (!audioCtx) { if (onDone) setTimeout(onDone, 2500); return; }
  if (audioCtx.state === 'suspended') { audioCtx.resume().catch(()=>{}); if (onDone) setTimeout(onDone, 2500); return; }
  bgmPlaying = true;
  const mySession = musicSessionId;
  const fanfare = [523,659,784,1047,784,1047,1319,1047,1319];
  const noteDur = 0.14;
  const gain = audioCtx.createGain();
  gain.connect(audioCtx.destination);
  setCurrentMusicGain(gain, 0.02);
  musicNodes.push(gain);
  let t = audioCtx.currentTime + 0.1;
  fanfare.forEach(freq => {
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

function playSFX(type) {
  if (!audioCtx) return;
  resumeAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  if (type === 'punch') {
    osc.type = 'square'; osc.frequency.setValueAtTime(180,t); osc.frequency.exponentialRampToValueAtTime(80,t+0.08);
    gain.gain.setValueAtTime(0.1,t); gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);
    osc.start(t); osc.stop(t+0.1);
  } else if (type === 'special') {
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(440,t); osc.frequency.exponentialRampToValueAtTime(880,t+0.05); osc.frequency.exponentialRampToValueAtTime(220,t+0.2);
    gain.gain.setValueAtTime(0.12,t); gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);
    osc.start(t); osc.stop(t+0.3);
  } else if (type === 'ko') {
    osc.type = 'square'; osc.frequency.setValueAtTime(330,t); osc.frequency.exponentialRampToValueAtTime(55,t+0.6);
    gain.gain.setValueAtTime(0.15,t); gain.gain.exponentialRampToValueAtTime(0.001,t+0.6);
    osc.start(t); osc.stop(t+0.7);
  } else if (type === 'select') {
    osc.type = 'square'; osc.frequency.setValueAtTime(660,t); osc.frequency.setValueAtTime(880,t+0.05);
    gain.gain.setValueAtTime(0.07,t); gain.gain.exponentialRampToValueAtTime(0.001,t+0.1);
    osc.start(t); osc.stop(t+0.15);
  } else if (type === 'respawn') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(440,t); osc.frequency.exponentialRampToValueAtTime(880,t+0.15);
    gain.gain.setValueAtTime(0.08,t); gain.gain.exponentialRampToValueAtTime(0.001,t+0.2);
    osc.start(t); osc.stop(t+0.25);
  }
}

// ═══════════════════════════════════════════════════════════
// SCENE MANAGEMENT
function showScene(scene) {
  stopMusic();
  if (sceneContainer) { app.stage.removeChild(sceneContainer); sceneContainer.destroy({ children:true }); }
  app.stage.position.set(0,0);
  sceneContainer = new PIXI.Container();
  sceneContainer.zIndex = 0;
  app.stage.addChild(sceneContainer);
  currentScene = scene;
  switch (scene) {
    case SCENES.MENU:             buildMenuScene(sceneContainer);      break;
    case SCENES.CHARACTER_SELECT: buildSelectScene(sceneContainer);    break;
    case SCENES.FIGHT:            buildFightScene(sceneContainer);     break;
    case SCENES.GAME_OVER:        buildGameOverScene(sceneContainer);  break;
  }
}

// ═══════════════════════════════════════════════════════════
// HELPERS
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
        distance: opts.shadowDist || 4, angle: Math.PI/4, alpha: 0.8,
      } : undefined,
      wordWrap: opts.wordWrap || false,
      wordWrapWidth: opts.wrapWidth || 400,
    }
  });
}

function makeGlowText(str, size, color) {
  const container = new PIXI.Container();
  for (let i = 3; i >= 1; i--) {
    const glow = makeText(str, { size, color, shadow:true, shadowColor:color, shadowBlur:8*i, shadowDist:0 });
    glow.anchor.set(0.5); glow.alpha = 0.3/i; container.addChild(glow);
  }
  const main = makeText(str, { size, color, stroke:true, strokeColor:0x000000, strokeWidth:3 });
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
  const color      = opts.color  || 0x050514;
  const borderColor = opts.border || 0x00ffcc;
  function drawBg(hover) {
    bg.clear();
    bg.roundRect(-w/2, -h/2, w, h, 8);
    bg.fill({ color: hover ? borderColor : color, alpha: hover ? 0.9 : 0.75 });
    bg.stroke({ color: borderColor, width: hover ? 3 : 2 });
    // Glow effect on hover
    if (hover) {
      bg.roundRect(-w/2-4, -h/2-4, w+8, h+8, 10);
      bg.stroke({ color: borderColor, width: 1, alpha: 0.3 });
    }
  }
  drawBg(false); container.addChild(bg);
  const txt = makeText(label, { size: opts.fontSize || 11, color: opts.textColor !== undefined ? opts.textColor : 0x00ffcc });
  txt.anchor.set(0.5); container.addChild(txt);
  container.on('pointerover', () => { drawBg(true);  txt.style.fill = opts.hoverTextColor || 0x000000; });
  container.on('pointerout',  () => { drawBg(false); txt.style.fill = opts.textColor !== undefined ? opts.textColor : 0x00ffcc; });
  return container;
}

function flashTransition(callback) {
  const flash = new PIXI.Graphics();
  flash.rect(0,0,W(),H()).fill({ color:0x000000, alpha:1 });
  flash.alpha = 1; flash.zIndex = 50;
  app.stage.addChild(flash);
  callback();
  let alpha = 1;
  const fadeOut = (tk) => {
    alpha -= tk.deltaTime * 0.07; flash.alpha = alpha;
    if (alpha <= 0) { app.stage.removeChild(flash); app.ticker.remove(fadeOut); }
  };
  app.ticker.add(fadeOut);
}

// ── Neon background with animated stars + particles ──────────
function buildNeonBackground(container) {
  // Dark gradient overlay (drawn as solid for PixiJS compatibility)
  const bgGrad = new PIXI.Graphics();
  // Draw vertical gradient using multiple rects
  const steps = 20;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    // Interpolate from dark blue-navy top to near-black middle to dark violet bottom
    const r1 = 0, g1 = 5, b1 = 25;     // dark navy top
    const r2 = 8, g2 = 0, b2 = 20;     // dark violet bottom
    const r = Math.round(r1 + (r2-r1)*t);
    const g = Math.round(g1 + (g2-g1)*t);
    const b = Math.round(b1 + (b2-b1)*t);
    const color = (r<<16)|(g<<8)|b;
    bgGrad.rect(0, i*H()/steps, W(), H()/steps+1).fill({ color, alpha: 1 });
  }
  container.addChild(bgGrad);

  // Stars
  const starLayer = new PIXI.Container();
  container.addChild(starLayer);
  const stars = [];
  for (let i = 0; i < 80; i++) {
    const g = new PIXI.Graphics();
    const size = Math.random() * 1.5 + 0.5;
    const brightness = Math.random() * 0.7 + 0.3;
    g.circle(0,0,size).fill({ color:0xffffff, alpha:brightness });
    g.x = Math.random() * W(); g.y = Math.random() * H() * 0.85;
    starLayer.addChild(g);
    stars.push({ sprite:g, twinkleOffset: Math.random() * Math.PI * 2, twinkleSpeed: 0.5 + Math.random() * 2 });
  }

  // Floating particles
  const particleLayer = new PIXI.Container();
  container.addChild(particleLayer);
  const particles = [];
  const particleColors = [0x00ffcc, 0xff44aa, 0x4488ff, 0xbf00ff, 0x00d2ff];
  for (let i = 0; i < 30; i++) {
    const g = new PIXI.Graphics();
    const size = Math.random() * 2.5 + 0.5;
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    g.circle(0,0,size).fill({ color, alpha:0.7 });
    g.x = Math.random() * W(); g.y = Math.random() * H();
    particleLayer.addChild(g);
    particles.push({ sprite:g, vx:(Math.random()-0.5)*0.4, vy:-Math.random()*0.6-0.1, life:Math.random() });
  }

  // Scanlines overlay
  const scanlines = new PIXI.Graphics();
  for (let y = 0; y < H(); y += 4) {
    scanlines.rect(0, y, W(), 2).fill({ color:0x000000, alpha:0.08 });
  }
  container.addChild(scanlines);

  return { stars, particles };
}

// ═══════════════════════════════════════════════════════════
// SCENE: MENU
function buildMenuScene(container) {
  playMenuMusic();

  // Neon background
  const { stars, particles } = buildNeonBackground(container);

  // Title glow
  const titleCont = new PIXI.Container();
  titleCont.x = W()/2; titleCont.y = H()*0.18;
  container.addChild(titleCont);
  const titleSize = Math.min(Math.floor(W()/18), 44);
  const titleGlow = makeGlowText('RADAR FIGHTERS 2', titleSize, 0x00ffcc);
  titleCont.addChild(titleGlow);
  const subtitle = makeText('NEON ARCADE BRAWLER', {
    size: Math.max(7, Math.floor(W()/75)), color:0xff44aa, shadow:true, shadowColor:0xff44aa, shadowBlur:8
  });
  subtitle.anchor.set(0.5); subtitle.y = titleSize * 1.6; titleCont.addChild(subtitle);

  const pressStart = makeText('PRESS ENTER TO START', {
    size: Math.max(7, Math.floor(W()/75)), color:0xffff00, shadow:true, shadowColor:0xffaa00, shadowBlur:8
  });
  pressStart.anchor.set(0.5); pressStart.x = W()/2; pressStart.y = H()*0.40; container.addChild(pressStart);

  // Game mode buttons
  const btnW = Math.min(300, W()*0.4), btnH = 42;
  const btnX = W()/2, btnGap = btnH + 10;
  const btnStartY = H() * 0.50;

  const btn1P   = makeButton('1 PLAYER VS AI',     btnX, btnStartY,          btnW, btnH, { color:0x060620, border:0x4488ff, textColor:0x4488ff, hoverTextColor:0xffffff });
  const btn2P   = makeButton('2 PLAYERS LOCAL',    btnX, btnStartY+btnGap,   btnW, btnH, { color:0x060620, border:0xff4444, textColor:0xff4444, hoverTextColor:0xffffff });
  const btn2PAI = makeButton('2P VS 2 AI',         btnX, btnStartY+btnGap*2, btnW, btnH, { color:0x060620, border:0x44ff88, textColor:0x44ff88, hoverTextColor:0x000000 });
  const btn4P   = makeButton('4P FREE FOR ALL',    btnX, btnStartY+btnGap*3, btnW, btnH, { color:0x060620, border:0xffdd00, textColor:0xffdd00, hoverTextColor:0x000000 });
  const btn2V2  = makeButton('2 VS 2 TEAMS',       btnX, btnStartY+btnGap*4, btnW, btnH, { color:0x060620, border:0xbf00ff, textColor:0xbf00ff, hoverTextColor:0xffffff });
  const btnQuick= makeButton('⚡ QUICK FIGHT',     btnX, btnStartY+btnGap*5, btnW*0.65, btnH, { color:0x060620, border:0x00ffcc, textColor:0x00ffcc });
  container.addChild(btn1P, btn2P, btn2PAI, btn4P, btn2V2, btnQuick);

  function startMode(mode) {
    document.removeEventListener('keydown', keyHandler);
    playSFX('select'); gameMode = mode;
    flashTransition(() => showScene(SCENES.CHARACTER_SELECT));
  }

  btn1P.on('pointertap',   () => startMode('1P'));
  btn2P.on('pointertap',   () => startMode('2P'));
  btn2PAI.on('pointertap', () => startMode('2PAI'));
  btn4P.on('pointertap',   () => startMode('4PFFA'));
  btn2V2.on('pointertap',  () => startMode('2V2'));
  btnQuick.on('pointertap',() => {
    document.removeEventListener('keydown', keyHandler);
    playSFX('select'); gameMode = '1P';
    charIndices[0] = Math.floor(Math.random()*CHARACTERS.length);
    charIndices[1] = (charIndices[0] + 1 + Math.floor(Math.random()*(CHARACTERS.length-1))) % CHARACTERS.length;
    flashTransition(() => showScene(SCENES.FIGHT));
  });

  const keyHandler = (e) => {
    if (['Enter',' '].includes(e.key)) {
      document.removeEventListener('keydown', keyHandler);
      playSFX('select'); gameMode = '1P';
      flashTransition(() => showScene(SCENES.CHARACTER_SELECT));
    }
  };
  document.addEventListener('keydown', keyHandler);

  const ver = makeText('v2.0 © 2026 RADAR — radar-fighters-2.vercel.app', { size:7, color:0x333355 });
  ver.x = 8; ver.y = H()-16; container.addChild(ver);

  const ticker = (tk) => {
    if (currentScene !== SCENES.MENU) { app.ticker.remove(ticker); return; }
    const t = Date.now();
    // Animate stars
    stars.forEach(s => {
      const a = 0.3 + Math.sin(t/1000 * s.twinkleSpeed + s.twinkleOffset) * 0.35;
      s.sprite.alpha = Math.max(0.05, a);
    });
    // Animate particles
    particles.forEach(p => {
      p.sprite.x += p.vx; p.sprite.y += p.vy;
      if (p.sprite.y < -5) { p.sprite.y = H()+5; p.sprite.x = Math.random()*W(); }
    });
    pressStart.alpha = 0.5 + Math.sin(t/400) * 0.5;
    titleCont.scale.set(1 + Math.sin(t/2000)*0.015);
  };
  app.ticker.add(ticker);
}

// ═══════════════════════════════════════════════════════════
// SCENE: CHARACTER SELECT
function buildSelectScene(container) {
  playMenuMusic();

  // Neon background
  const { stars, particles } = buildNeonBackground(container);

  // Determine how many players we're selecting for
  const numPlayers = ['4PFFA','2V2','2PAI'].includes(gameMode) ? 4 : 2;
  const numHumans  = gameMode === '1P'  ? 1 :
                     gameMode === '2PAI'? 2 :
                     gameMode === '2P'  ? 2 : numPlayers;

  const title = makeText('SELECT FIGHTER', {
    size: Math.min(Math.floor(W()/28), 26), color:0xffff00, shadow:true, shadowColor:0xff8800, shadowBlur:10
  });
  title.anchor.set(0.5); title.x = W()/2; title.y = H()*0.055; container.addChild(title);

  // Mode label
  const modeLabels = { '1P':'1P VS AI', '2P':'2P LOCAL', '4PFFA':'4P FREE-FOR-ALL', '2V2':'2 VS 2 TEAMS', '2PAI':'2P VS 2 AI' };
  const modeText = makeText('[' + (modeLabels[gameMode]||gameMode) + ']', { size:8, color:0x00ffcc });
  modeText.anchor.set(0.5); modeText.x = W()/2; modeText.y = H()*0.105; container.addChild(modeText);

  // Grid
  const cols = 6, rows = Math.ceil(CHARACTERS.length/6);
  const cardMargin = Math.floor(W()*0.01);
  const gridW = W()*0.95, gridH = H()*0.68;
  const cardW = (gridW - cardMargin*(cols-1))/cols;
  const cardH = (gridH - cardMargin*(rows-1))/rows;
  const gridX = (W()-gridW)/2, gridY = H()*0.14;

  // Cursor state: hoverIdx & selectedIdx per player
  let cursors = [];
  for (let pi = 0; pi < numPlayers; pi++) {
    cursors.push({ hover: pi % CHARACTERS.length, selected: -1 });
  }

  const cards = [];
  const cardLayer = new PIXI.Container(); container.addChild(cardLayer);

  CHARACTERS.forEach((char, i) => {
    const col = i % cols, row = Math.floor(i/cols);
    const cx = gridX + col*(cardW+cardMargin) + cardW/2;
    const cy = gridY + row*(cardH+cardMargin) + cardH/2;
    const card = new PIXI.Container();
    card.x = cx; card.y = cy; card.interactive = true; card.cursor = 'pointer';
    cardLayer.addChild(card);

    const bg = new PIXI.Graphics();
    card.addChild(bg);

    if (textures[`char_${i}`]) {
      const portrait = new PIXI.Sprite(textures[`char_${i}`]);
      portrait.anchor.set(0.5);
      portrait.width = cardW*0.78; portrait.height = cardH*0.68;
      portrait.y = -cardH*0.06; card.addChild(portrait);
    }
    const nameText = makeText(char.name, { size: Math.max(6, Math.floor(cardW/11)), color:0xffffff, stroke:true, strokeColor:0x000000, strokeWidth:2 });
    nameText.anchor.set(0.5); nameText.y = cardH*0.37; card.addChild(nameText);

    function redraw() {
      bg.clear();
      const hovers = cursors.filter((c,pi) => c.hover === i && c.selected < 0).map((_,pi) => pi);
      const selects = cursors.filter((c,pi) => c.selected === i).map((_,pi) => pi);
      const isHovered = hovers.length > 0;
      const isSelected = selects.length > 0;

      // Dark card base
      const cardColor = isSelected ? 0x101020 : 0x080818;
      const cardAlpha = isSelected ? 0.95 : (isHovered ? 0.8 : 0.55);
      bg.roundRect(-cardW/2, -cardH/2, cardW, cardH, 8).fill({ color:cardColor, alpha:cardAlpha });

      // Border: color of the player who has it selected, or char color
      if (isSelected) {
        // Multi-color borders for multiple selections
        selects.forEach((pi, idx) => {
          const bw = 3 - idx;
          bg.roundRect(-cardW/2+idx*2, -cardH/2+idx*2, cardW-idx*4, cardH-idx*4, 8-idx)
            .stroke({ color: PLAYER_COLORS[pi], width: bw });
        });
      } else if (isHovered) {
        const pi = hovers[0];
        bg.roundRect(-cardW/2, -cardH/2, cardW, cardH, 8).stroke({ color: PLAYER_COLORS[pi], width: 2 });
        // Glow on hover
        bg.roundRect(-cardW/2-3, -cardH/2-3, cardW+6, cardH+6, 10).stroke({ color: PLAYER_COLORS[pi], width: 1, alpha: 0.3 });
      } else {
        bg.roundRect(-cardW/2, -cardH/2, cardW, cardH, 8).stroke({ color: 0x223344, width: 1 });
      }

      // Player indicators (small colored dots top-left)
      selects.forEach((pi, idx) => {
        const dotX = -cardW/2+6+idx*14, dotY = -cardH/2+5;
        bg.circle(dotX, dotY, 5).fill({ color: PLAYER_COLORS[pi] });
        bg.circle(dotX, dotY, 5).stroke({ color: 0xffffff, width: 1 });
      });
      hovers.forEach((pi, idx) => {
        if (selects.includes(pi)) return;
        const dotX = cardW/2-6-idx*14, dotY = -cardH/2+5;
        bg.circle(dotX, dotY, 4).fill({ color: PLAYER_COLORS[pi], alpha: 0.5 });
      });
    }
    redraw();
    cards.push({ card, redraw });

    card.on('pointerover', () => { cursors[0].hover = i; if (numPlayers > 1 && numHumans > 1) cursors[1].hover = i; updateCards(); });
    card.on('pointertap',  () => {
      playSFX('select');
      if (cursors[0].selected < 0) { cursors[0].selected = i; }
      else { const next = cursors.findIndex(c => c.selected < 0); if (next >= 0) cursors[next].selected = i; }
      updateCards(); checkFightReady();
    });
  });

  function updateCards() { cards.forEach(c => c.redraw()); updatePreview(); }

  // Preview panel
  const previewPanel = new PIXI.Container();
  previewPanel.y = H()*0.86; container.addChild(previewPanel);

  function updatePreview() {
    previewPanel.removeChildren();
    const ph = H()*0.12, pw = W()*0.95;
    const panelBg = new PIXI.Graphics();
    panelBg.roundRect(W()*0.025, 0, pw, ph, 10)
      .fill({ color:0x050510, alpha:0.88 })
      .stroke({ color:0x223366, width:1 });
    previewPanel.addChild(panelBg);

    const slotW = pw / numPlayers;
    for (let pi = 0; pi < numPlayers; pi++) {
      const idx = cursors[pi].selected >= 0 ? cursors[pi].selected : cursors[pi].hover;
      const char = CHARACTERS[idx];
      const cx = W()*0.025 + slotW*(pi+0.5);
      const cy = ph*0.5;

      // Portrait
      if (textures[`char_${idx}`]) {
        const size = Math.min(ph*0.7, 55);
        const spr = new PIXI.Sprite(textures[`char_${idx}`]);
        spr.anchor.set(0.5); spr.width = size; spr.height = size;
        spr.x = cx - slotW*0.18; spr.y = cy - size*0.05;
        previewPanel.addChild(spr);
      }

      // Player label
      const isAIPlayer = pi >= numHumans;
      const lbl = makeText(PLAYER_LABELS[pi] + (isAIPlayer?' [CPU]':''), { size:7, color: PLAYER_COLORS[pi] });
      lbl.anchor.set(0.5); lbl.x = cx; lbl.y = ph*0.08; previewPanel.addChild(lbl);

      // Char name
      const nameConfirm = cursors[pi].selected >= 0 ? '✔ ' : '';
      const nameT = makeText(nameConfirm + char.name, { size:6, color: cursors[pi].selected >= 0 ? 0x44ff88 : 0xaaaaaa });
      nameT.anchor.set(0.5); nameT.x = cx; nameT.y = ph*0.55; previewPanel.addChild(nameT);

      // Divider
      if (pi < numPlayers-1) {
        const div = new PIXI.Graphics();
        div.rect(W()*0.025 + slotW*(pi+1)-0.5, ph*0.1, 1, ph*0.8).fill({ color:0x223366 });
        previewPanel.addChild(div);
      }
    }
  }
  updatePreview();

  // Fight button
  const fightBtn = makeButton('⚔ FIGHT!', W()/2, H()*0.935, 220, 44, { color:0x220000, border:0xff4422, textColor:0xff4422, hoverTextColor:0xffffff });
  fightBtn.alpha = 0.4; container.addChild(fightBtn);

  function checkFightReady() {
    const needed = numHumans;
    const confirmed = cursors.filter(c => c.selected >= 0).length;
    const ready = confirmed >= needed;
    fightBtn.alpha = ready ? 1 : 0.4;
    fightBtn.interactive = ready;
    return ready;
  }

  fightBtn.on('pointertap', () => {
    if (!checkFightReady()) return;
    confirmAndFight();
  });

  function confirmAndFight() {
    // Fill in AI chars where not selected
    for (let pi = 0; pi < numPlayers; pi++) {
      if (cursors[pi].selected >= 0) charIndices[pi] = cursors[pi].selected;
      else {
        // Auto-pick for AI or unselected
        let ai;
        do { ai = Math.floor(Math.random()*CHARACTERS.length); }
        while (charIndices.slice(0,pi).includes(ai));
        charIndices[pi] = ai;
      }
    }
    playSFX('select');
    document.removeEventListener('keydown', keydown);
    flashTransition(() => showScene(SCENES.FIGHT));
  }

  // Keyboard navigation
  const keydown = (e) => {
    // P1: A/D navigate, Enter/J confirm
    if (e.key==='a'||e.key==='A') { cursors[0].hover=(cursors[0].hover-1+CHARACTERS.length)%CHARACTERS.length; updateCards(); }
    if (e.key==='d'||e.key==='D') { cursors[0].hover=(cursors[0].hover+1)%CHARACTERS.length; updateCards(); }
    if (e.key==='w'||e.key==='W') { cursors[0].hover=(cursors[0].hover-cols+CHARACTERS.length)%CHARACTERS.length; updateCards(); }
    if (e.key==='s'||e.key==='S'&&numHumans>0) { cursors[0].hover=(cursors[0].hover+cols)%CHARACTERS.length; updateCards(); }
    if ((e.key==='Enter'||e.key==='j'||e.key==='J') && cursors[0].selected<0) {
      playSFX('select'); cursors[0].selected = cursors[0].hover; updateCards(); checkFightReady();
    }

    // P2: arrows navigate, L confirm
    if (numHumans >= 2) {
      if (e.key==='ArrowLeft')  { cursors[1].hover=(cursors[1].hover-1+CHARACTERS.length)%CHARACTERS.length; updateCards(); }
      if (e.key==='ArrowRight') { cursors[1].hover=(cursors[1].hover+1)%CHARACTERS.length; updateCards(); }
      if (e.key==='ArrowUp')    { cursors[1].hover=(cursors[1].hover-cols+CHARACTERS.length)%CHARACTERS.length; updateCards(); }
      if ((e.key==='l'||e.key==='L'||e.key==='Numpad3') && cursors[1].selected<0) {
        playSFX('select'); cursors[1].selected = cursors[1].hover; updateCards(); checkFightReady();
      }
    }

    // P3: F/H navigate, C confirm
    if (numHumans >= 3) {
      if (e.key==='f'||e.key==='F') { cursors[2].hover=(cursors[2].hover-1+CHARACTERS.length)%CHARACTERS.length; updateCards(); }
      if (e.key==='h'||e.key==='H') { cursors[2].hover=(cursors[2].hover+1)%CHARACTERS.length; updateCards(); }
      if ((e.key==='c'||e.key==='C') && cursors[2].selected<0) {
        playSFX('select'); cursors[2].selected = cursors[2].hover; updateCards(); checkFightReady();
      }
    }

    // P4: Numpad navigate, Numpad0 confirm
    if (numHumans >= 4) {
      if (e.key==='Numpad4') { cursors[3].hover=(cursors[3].hover-1+CHARACTERS.length)%CHARACTERS.length; updateCards(); }
      if (e.key==='Numpad6') { cursors[3].hover=(cursors[3].hover+1)%CHARACTERS.length; updateCards(); }
      if (e.key==='Numpad0' && cursors[3].selected<0) {
        playSFX('select'); cursors[3].selected = cursors[3].hover; updateCards(); checkFightReady();
      }
    }

    // Start fight if all selected
    if (e.key==='f'&&numHumans<3) { /* don't conflict */ }
    if (e.key==='F' && checkFightReady()) { confirmAndFight(); }

    if (e.key==='Escape') { document.removeEventListener('keydown', keydown); showScene(SCENES.MENU); }
  };
  document.addEventListener('keydown', keydown);

  // Ticker for star/particle animation
  const ticker = (tk) => {
    if (currentScene !== SCENES.CHARACTER_SELECT) { app.ticker.remove(ticker); return; }
    const t = Date.now();
    stars.forEach(s => { s.sprite.alpha = 0.2 + Math.sin(t/1000 * s.twinkleSpeed + s.twinkleOffset) * 0.3; });
    particles.forEach(p => {
      p.sprite.x += p.vx; p.sprite.y += p.vy;
      if (p.sprite.y < -5) { p.sprite.y = H()+5; p.sprite.x = Math.random()*W(); }
    });
  };
  app.ticker.add(ticker);
}

// ═══════════════════════════════════════════════════════════
// SCENE: FIGHT — Platformer Brawler (up to 4 players)
function buildFightScene(container) {
  playFightMusic();

  // Determine player count and AI config
  const numPlayers = ['4PFFA','2V2','2PAI'].includes(gameMode) ? 4 : 2;
  const numHumans  = gameMode === '1P' ? 1 : gameMode === '2PAI' ? 2 : gameMode === '2P' ? 2 : numPlayers;

  // Team assignment (for 2V2): P1+P2 = team 0, P3+P4 = team 1
  function getTeam(pi) {
    if (gameMode === '2V2') return pi < 2 ? 0 : 1;
    return pi; // FFA: each is own team
  }

  // Stage
  if (!currentStage) currentStage = STAGES[Math.floor(Math.random()*STAGES.length)];
  const stageName = currentStage;
  currentStage = null;
  const neonColor = STAGE_NEON[stageName] || 0x00ffcc;

  // ── Stage background ────────────────────────────────────
  const bgSprite = new PIXI.Sprite(textures[stageName] || textures['bg']);
  bgSprite.width = W(); bgSprite.height = H();
  container.addChild(bgSprite);

  // Dark overlay for neon feel
  const darkOverlay = new PIXI.Graphics();
  darkOverlay.rect(0,0,W(),H()).fill({ color:0x000011, alpha:0.55 });
  container.addChild(darkOverlay);

  // Animated particles over background
  const bgParticles = [];
  const bgPartLayer = new PIXI.Container();
  container.addChild(bgPartLayer);
  const neonColors2 = [neonColor, 0x00ffcc, 0xff44aa];
  for (let i = 0; i < 20; i++) {
    const g = new PIXI.Graphics();
    const color = neonColors2[Math.floor(Math.random()*neonColors2.length)];
    g.circle(0,0, Math.random()*2+0.5).fill({ color, alpha:0.6 });
    g.x = Math.random()*W(); g.y = Math.random()*H();
    bgPartLayer.addChild(g);
    bgParticles.push({ sprite:g, vx:(Math.random()-0.5)*0.3, vy:-Math.random()*0.3-0.05 });
  }

  // ── World container ─────────────────────────────────────
  const worldContainer = new PIXI.Container();
  container.addChild(worldContainer);

  // ── Constants ────────────────────────────────────────────
  const GROUND_Y  = H() * 0.82;
  const FIGHTER_H = Math.min(H()*0.22, 130);
  const FIGHTER_W = FIGHTER_H * 0.45;
  // Extended blast zones for 4P
  const blastExt = numPlayers >= 4 ? 350 : 220;
  const BLAST_L  = -blastExt;
  const BLAST_R  = W() + blastExt;
  const BLAST_T  = -220;
  const BLAST_B  = H() + 220;

  // ── Platforms (5 platforms, asymmetric, adjusted for high jumps) ──
  const platforms = [
    // Ground
    { x:0, y:GROUND_Y, w:W(), h:50, isGround:true },
    // Left platform (low)
    { x:W()*0.04, y:GROUND_Y - H()*0.26, w:W()*0.22, h:14, isGround:false },
    // Right platform (low)
    { x:W()*0.74, y:GROUND_Y - H()*0.26, w:W()*0.22, h:14, isGround:false },
    // Center platform (mid)
    { x:W()*0.35, y:GROUND_Y - H()*0.42, w:W()*0.30, h:14, isGround:false },
    // Top-left (high)
    { x:W()*0.10, y:GROUND_Y - H()*0.56, w:W()*0.18, h:12, isGround:false },
    // Top-right (high)
    { x:W()*0.72, y:GROUND_Y - H()*0.56, w:W()*0.18, h:12, isGround:false },
  ];

  // ── Platform Graphics ────────────────────────────────────
  const platformGfx = new PIXI.Graphics();
  worldContainer.addChild(platformGfx);

  let platformPulseT = 0;
  function drawNeonPlatforms() {
    platformGfx.clear();
    const pulse = 0.6 + Math.sin(platformPulseT * 0.05) * 0.4;

    platforms.forEach((p) => {
      if (p.isGround) {
        // Ground: dark band with neon top edge
        platformGfx.rect(p.x, p.y, p.w, p.h).fill({ color:0x050510, alpha:0.6 });
        // Neon top edge
        platformGfx.rect(p.x, p.y, p.w, 4).fill({ color:neonColor, alpha:pulse });
        // Glow layers below
        platformGfx.rect(p.x, p.y+4, p.w, 6).fill({ color:neonColor, alpha:pulse*0.3 });
        platformGfx.rect(p.x, p.y+10, p.w, 10).fill({ color:neonColor, alpha:pulse*0.1 });
      } else {
        // Floating platform: neon glow
        // Outer glow
        platformGfx.roundRect(p.x-4, p.y-4, p.w+8, p.h+8, 8).fill({ color:neonColor, alpha:pulse*0.15 });
        platformGfx.roundRect(p.x-2, p.y-2, p.w+4, p.h+4, 6).fill({ color:neonColor, alpha:pulse*0.25 });
        // Main body
        platformGfx.roundRect(p.x, p.y, p.w, p.h, 5).fill({ color:0x090920, alpha:0.92 }).stroke({ color:neonColor, width:2.5, alpha:pulse });
        // Top highlight
        platformGfx.roundRect(p.x+4, p.y+2, p.w-8, 3, 2).fill({ color:neonColor, alpha:pulse*0.5 });
      }
    });
  }
  drawNeonPlatforms();

  // ── Blast zone indicators ────────────────────────────────
  const blastGfx = new PIXI.Graphics();
  blastGfx.rect(0, H()-6, W(), 6).fill({ color:0xff2222, alpha:0.2 });
  blastGfx.rect(0, 0, W(), 4).fill({ color:0xff2222, alpha:0.2 });
  blastGfx.rect(0, 0, 4, H()).fill({ color:0xff2222, alpha:0.2 });
  blastGfx.rect(W()-4, 0, 4, H()).fill({ color:0xff2222, alpha:0.2 });
  worldContainer.addChild(blastGfx);

  // ── Shake state ──────────────────────────────────────────
  let shakeX = 0, shakeY = 0, shakeAmt = 0;
  function triggerShake(amount) { shakeAmt = Math.max(shakeAmt, amount); }

  // ── Fighter creation ─────────────────────────────────────
  function applyStats(fighter, chardef) {
    fighter.speedMult  = 0.55 + chardef.speed   * 0.1;
    fighter.damageMult = 0.65 + chardef.power    * 0.07;
    fighter.defenseMult= 1.25 - chardef.defense  * 0.07;
  }

  function createFighter(chardef, startX, dir, playerIdx, isAI, team) {
    const f = {
      x: startX, y: GROUND_Y,
      vx:0, vy:0, dir,
      damage:0, stocks:STOCKS,
      jumpsLeft:2, onGround:true,
      state:'idle',
      attackTimer:0, attackCd:0, hitStun:0,
      _knockbackFrames:0, _invincible:0, _koTimer:0,
      speedMult:1, damageMult:1, defenseMult:1,
      blocking:false,
      isAI, aiTimer:0,
      playerIdx, team, chardef,
      faceTexture:null,
      container:null, bodyGfx:null, mainSprite:null, shadowGfx:null, auraGfx:null,
      _hitFlash:0, _squash:1, _squashV:0,
      _lastAtkIsKick:false,
      _baseScaleX:1, _baseScaleY:1,
      _texIdle:null, _texAtk:null, _texHit:null, _texKick:null,
      _texBlock:null, _texSpecial:null, _texWin:null, _texKo:null,
      _texJump:null, _texWalk:null,
      _idleFrames:null, _walkFrames:null,
      _animFrame:0, _animTimer:0,
      ctrl: CTRL_CONFIGS[playerIdx] || CTRL_CONFIGS[0],
      jumpConsumed:false,
    };
    applyStats(f, chardef);
    return f;
  }

  // Fighter spawn positions
  const spawnPositions = [
    W()*0.25, W()*0.75, W()*0.40, W()*0.60
  ];
  const spawnDirs = [1, -1, 1, -1];

  const fighters = [];
  for (let pi = 0; pi < numPlayers; pi++) {
    const idx = charIndices[pi] ?? pi;
    const isAI = pi >= numHumans;
    const f = createFighter(
      CHARACTERS[idx], spawnPositions[pi], spawnDirs[pi],
      pi, isAI, getTeam(pi)
    );
    f.faceTexture = textures[`char_${idx}`];
    fighters.push(f);
  }

  // ── Fighter sprites ──────────────────────────────────────
  const fightLayer = new PIXI.Container();
  worldContainer.addChild(fightLayer);

  function buildFighterSprite(fighter, charIdx) {
    const cont = new PIXI.Container();
    fightLayer.addChild(cont);
    fighter.container = cont;

    const shadow = new PIXI.Graphics();
    shadow.ellipse(0,0, FIGHTER_H*0.21, 10).fill({ color:0x000000, alpha:0.4 });
    shadow.y = 4; cont.addChild(shadow); fighter.shadowGfx = shadow;

    if (fighter.faceTexture) {
      const spr = new PIXI.Sprite(fighter.faceTexture);
      spr.anchor.set(0.5,1);
      const bsy = FIGHTER_H / fighter.faceTexture.height;
      const bsx = (FIGHTER_H*0.75) / fighter.faceTexture.width;
      spr.scale.set(bsx, bsy);
      spr.y = 0;
      fighter._baseScaleX = bsx; fighter._baseScaleY = bsy;
      cont.addChild(spr); fighter.mainSprite = spr;

      const i = charIdx;
      fighter._texIdle    = textures[`spr_${i}_idle`]    || fighter.faceTexture;
      fighter._texAtk     = textures[`spr_${i}_atk`]     || fighter.faceTexture;
      fighter._texHit     = textures[`spr_${i}_hit`]     || fighter.faceTexture;
      fighter._texKick    = textures[`spr_${i}_kick`]    || fighter._texAtk;
      fighter._texBlock   = textures[`spr_${i}_block`]   || fighter._texIdle;
      fighter._texSpecial = textures[`spr_${i}_special`] || fighter._texAtk;
      fighter._texWin     = textures[`spr_${i}_win`]     || fighter._texIdle;
      fighter._texKo      = textures[`spr_${i}_ko`]      || fighter._texHit;
      fighter._texJump    = textures[`spr_${i}_jump`]    || fighter._texIdle;
      fighter._texWalk    = textures[`spr_${i}_walk`]    || fighter._texIdle;
      const f0 = textures[`spr_${i}_idle_f0`], f1 = textures[`spr_${i}_idle_f1`], f2 = textures[`spr_${i}_idle_f2`];
      fighter._idleFrames = (f0&&f1&&f2) ? [f0,f1,f0,f2] : null;
      const w0 = textures[`spr_${i}_walk_f0`], w1 = textures[`spr_${i}_walk_f1`];
      fighter._walkFrames = (w0&&w1) ? [w0,w1] : null;
    }

    const aura = new PIXI.Graphics();
    aura.ellipse(0, -FIGHTER_H*0.5, FIGHTER_H*0.41, FIGHTER_H*0.55).fill({ color:fighter.chardef.color, alpha:0 });
    cont.addChild(aura); fighter.auraGfx = aura;

    // Player color ring at feet
    const ring = new PIXI.Graphics();
    ring.ellipse(0, 0, FIGHTER_H*0.17, 6).fill({ color: PLAYER_COLORS[fighter.playerIdx], alpha:0.5 });
    cont.addChild(ring);

    const body = new PIXI.Graphics();
    cont.addChild(body); fighter.bodyGfx = body;
  }

  fighters.forEach((f, pi) => buildFighterSprite(f, charIndices[pi] ?? pi));

  // ── Hit effects ──────────────────────────────────────────
  const effectLayer = new PIXI.Container();
  worldContainer.addChild(effectLayer);
  const hitEffects = [];

  function spawnDust(x, y) {
    for (let i = 0; i < 6; i++) {
      const g = new PIXI.Graphics();
      g.circle(0,0, Math.random()*6+2).fill({ color:0xd4b896, alpha:0.7 });
      g.x = x + (Math.random()-0.5)*30; g.y = y; effectLayer.addChild(g);
      hitEffects.push({ t:0, maxT:0.5, vx:(Math.random()-0.5)*3, vy:-(Math.random()*2+0.5), sprite:g });
    }
  }

  function spawnHitEffect(x, y, isSpecial, attackerColor) {
    const count = isSpecial ? 18 : 10;
    const baseColor = attackerColor || 0xffffff;
    const colors = isSpecial
      ? [0xffdd00, 0xff6600, 0xff00aa, baseColor]
      : [baseColor, 0xffffff, 0xffe0a0];

    // Ring burst
    const ring = new PIXI.Graphics();
    ring.circle(0,0, isSpecial ? FIGHTER_H*0.5 : FIGHTER_H*0.3).fill({ color: isSpecial?0xffaa00:0xffffff, alpha:0.5 });
    ring.x = x; ring.y = y; effectLayer.addChild(ring);
    hitEffects.push({ t:0, maxT:0.18, sprite:ring, ring:true });

    // Color particles
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI*2/count)*i + Math.random()*0.4;
      const speed = (Math.random()*4+3) * (isSpecial?2.2:1);
      const g = new PIXI.Graphics();
      const size = isSpecial ? Math.random()*10+5 : Math.random()*7+3;
      const color = colors[Math.floor(Math.random()*colors.length)];
      g.circle(0,0,size).fill({ color, alpha:1 });
      if (isSpecial) g.circle(0,0,size*2.2).fill({ color:color, alpha:0.25 });
      g.x = x; g.y = y; effectLayer.addChild(g);
      hitEffects.push({ t:0, maxT:isSpecial?0.6:0.4, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, sprite:g });
    }

    // Hit text
    const hitText = makeText(isSpecial?'★ POW! ★':'HIT!', {
      size: isSpecial?26:18, color: isSpecial?0xffdd00:0xffffff, shadow:true, shadowColor:isSpecial?0xff4400:0x333300, shadowBlur:8
    });
    hitText.anchor.set(0.5); hitText.x = x; hitText.y = y-28;
    hitText.scale.set(isSpecial?1.3:1); effectLayer.addChild(hitText);
    hitEffects.push({ t:0, maxT:0.55, sprite:hitText, textEffect:true });
  }

  function updateEffects(dt) {
    for (let i = hitEffects.length-1; i >= 0; i--) {
      const e = hitEffects[i];
      e.t += dt*0.05;
      const prog = e.t/e.maxT;
      if (e.textEffect) {
        e.sprite.y -= dt*0.6; e.sprite.alpha = 1-prog; e.sprite.scale.set(1+prog*0.3);
      } else if (e.ring) {
        e.sprite.alpha = (1-prog)*0.7; e.sprite.scale.set(1+prog*1.5);
      } else {
        e.sprite.x += e.vx; e.sprite.y += e.vy; e.vy += 0.18;
        e.sprite.alpha = 1-prog; e.sprite.scale.set(1-prog*0.4);
      }
      if (prog >= 1) {
        effectLayer.removeChild(e.sprite);
        try { e.sprite.destroy(); } catch(err){}
        hitEffects.splice(i,1);
      }
    }
  }

  // ── HUD ─────────────────────────────────────────────────
  const hudLayer = new PIXI.Container();
  container.addChild(hudLayer);

  // HUD background bar
  const hudBg = new PIXI.Graphics();
  hudBg.rect(0, H()-80, W(), 80).fill({ color:0x000011, alpha:0.75 });
  hudBg.rect(0, H()-82, W(), 2).fill({ color:neonColor, alpha:0.4 });
  hudLayer.addChild(hudBg);

  const dmgSize = Math.min(Math.floor(W()/(numPlayers*8)), 34);
  const hudPad = 12;
  const hudSlotW = (W()-hudPad*2) / numPlayers;

  // Player HUD elements
  const hudEls = fighters.map((f, pi) => {
    const color = PLAYER_COLORS[pi];
    const isRight = pi >= numPlayers/2;
    const slotX = hudPad + hudSlotW*pi + hudSlotW/2;

    // Name
    const nameText = makeText(f.chardef.name, { size:7, color });
    nameText.anchor.set(0.5); nameText.x = slotX; nameText.y = H()-75; hudLayer.addChild(nameText);

    // Player label
    const pLabel = makeText(PLAYER_LABELS[pi] + (f.isAI?' CPU':''), { size:6, color, shadow:true, shadowColor:color, shadowBlur:4 });
    pLabel.anchor.set(0.5); pLabel.x = slotX; pLabel.y = H()-62; hudLayer.addChild(pLabel);

    // Damage %
    const dmgText = makeText('0%', { size:dmgSize, color, stroke:true, strokeColor:0x000011, strokeWidth:4 });
    dmgText.anchor.set(0.5); dmgText.x = slotX; dmgText.y = H()-40; hudLayer.addChild(dmgText);

    // Stocks container
    const stocksGfx = new PIXI.Graphics();
    stocksGfx.y = H()-12; hudLayer.addChild(stocksGfx);

    // Divider
    if (pi > 0) {
      const div = new PIXI.Graphics();
      div.rect(hudPad+hudSlotW*pi, H()-78, 1, 76).fill({ color:neonColor, alpha:0.2 });
      hudLayer.addChild(div);
    }

    return { dmgText, stocksGfx, color };
  });

  // Team indicator for 2v2
  if (gameMode === '2V2') {
    const teamDivX = W()/2;
    const teamDiv = new PIXI.Graphics();
    teamDiv.rect(teamDivX-1, H()-82, 2, 80).fill({ color:0xffffff, alpha:0.3 });
    hudLayer.addChild(teamDiv);
    const t1 = makeText('TEAM 1', { size:7, color:0x4488ff });
    t1.anchor.set(0.5); t1.x = teamDivX/2; t1.y = H()-85; hudLayer.addChild(t1);
    const t2 = makeText('TEAM 2', { size:7, color:0xff4444 });
    t2.anchor.set(0.5); t2.x = teamDivX + teamDivX/2; t2.y = H()-85; hudLayer.addChild(t2);
  }

  function drawStockIcons() {
    fighters.forEach((f, pi) => {
      const color = PLAYER_COLORS[pi];
      const slotX = hudPad + hudSlotW*pi + hudSlotW/2;
      const el = hudEls[pi];
      el.stocksGfx.clear();
      for (let s = 0; s < STOCKS; s++) {
        const alive = s < f.stocks;
        const sx = slotX + (s - (STOCKS-1)/2) * 16;
        el.stocksGfx.circle(sx, 0, 6).fill({ color: alive ? color : 0x222233 });
        if (alive) el.stocksGfx.circle(sx, 0, 6).stroke({ color:0xffffff, width:1.5, alpha:0.6 });
      }
    });
  }

  function getDmgColor(dmg) {
    if (dmg < 30)  return 0xffffff;
    if (dmg < 70)  return 0xffff00;
    if (dmg < 120) return 0xff8800;
    return 0xff2200;
  }

  function updateHUD() {
    fighters.forEach((f, pi) => {
      const d = Math.floor(f.damage);
      const el = hudEls[pi];
      el.dmgText.text = d + '%';
      el.dmgText.style.fill = getDmgColor(d);
      if (d > 150) el.dmgText.alpha = 0.7 + Math.sin(Date.now()/100 + pi) * 0.3;
      else el.dmgText.alpha = 1;
    });
    drawStockIcons();
  }
  drawStockIcons();

  // ── Intro text ───────────────────────────────────────────
  const introLayer = new PIXI.Container(); container.addChild(introLayer);
  let fightActive = false;

  function showIntroText(text, duration, color, callback) {
    introLayer.removeChildren();
    const flash = new PIXI.Graphics();
    flash.rect(0,0,W(),H()).fill({ color:0x000000, alpha:0.5 });
    introLayer.addChild(flash);
    const t = makeGlowText(text, Math.min(Math.floor(W()/10), 72), color);
    t.x = W()/2; t.y = H()/2; introLayer.addChild(t);
    let elapsed = 0;
    const ticker = (tk) => {
      elapsed += tk.deltaTime;
      const prog = elapsed/duration;
      t.scale.set(0.8 + prog*0.4);
      t.alpha = prog<0.1 ? prog*10 : prog>0.8 ? (1-prog)*5 : 1;
      flash.alpha = 0.5 * (1-prog);
      if (prog >= 1) { app.ticker.remove(ticker); introLayer.removeChildren(); if (callback) callback(); }
    };
    app.ticker.add(ticker);
  }

  setTimeout(() => showIntroText('FIGHT!', 80, 0xff4422, () => { fightActive = true; }), 100);

  // ── Input ────────────────────────────────────────────────
  const keys = {};
  const keydown = (e) => { keys[e.code] = true; keys[e.key] = true; };
  const keyup   = (e) => { keys[e.code] = false; keys[e.key] = false; };
  document.addEventListener('keydown', keydown);
  document.addEventListener('keyup',   keyup);

  function ctrlPressed(fighter, action) {
    const ctrl = fighter.ctrl;
    if (!ctrl || !ctrl[action]) return false;
    return ctrl[action].some(k => keys[k]);
  }

  // Gamepad support for P4
  function getGamepadInput(gpIdx) {
    const gps = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gps[gpIdx];
    if (!gp) return null;
    return {
      left:    gp.axes[0] < -0.3 || gp.buttons[14]?.pressed,
      right:   gp.axes[0] > 0.3  || gp.buttons[15]?.pressed,
      jump:    gp.buttons[0]?.pressed || gp.buttons[2]?.pressed,
      block:   gp.buttons[4]?.pressed || gp.buttons[5]?.pressed,
      punch:   gp.buttons[0]?.pressed,
      kick:    gp.buttons[2]?.pressed,
      special: gp.buttons[3]?.pressed || gp.buttons[1]?.pressed,
    };
  }

  const touchBtns = buildTouchControls(container);

  // ── Platform collision ───────────────────────────────────
  function getPlatformBelow(f) {
    if (f.vy < 0) return null;
    if (f._knockbackFrames > 0) return null;
    for (const plat of platforms) {
      if (f.x >= plat.x-2 && f.x <= plat.x+plat.w+2) {
        const prevY = f.y - f.vy*0.5;
        if (prevY <= plat.y+2 && f.y >= plat.y-2) return plat;
      }
    }
    return null;
  }

  // ── KO / Stocks ──────────────────────────────────────────
  let matchOver = false, matchWinner = -1, navigating = false;

  function isOutsideBlast(f) {
    return f.x < BLAST_L || f.x > BLAST_R || f.y > BLAST_B || f.y < BLAST_T;
  }

  function respawnFighter(f) {
    f.x = W()/2 + (f.playerIdx < numPlayers/2 ? -80 : 80) * (f.playerIdx % 2 === 0 ? 1 : -1);
    f.y = -50; f.vx = 0; f.vy = 2;
    f.damage = 0; f.jumpsLeft = 2; f.onGround = false;
    f.state = 'jump';
    f.attackTimer = 0; f.attackCd = 0; f.hitStun = 0; f.blocking = false;
    f._hitFlash = 0; f._squash = 1; f._squashV = 0; f._knockbackFrames = 0;
    f._invincible = 150; f._koTimer = 0;
    if (f.container) f.container.rotation = 0;
    playSFX('respawn');
    spawnHitEffect(f.x, H()*0.4, false, PLAYER_COLORS[f.playerIdx]);
  }

  function handleKO(f) {
    if (f.state === 'ko') return;
    f.state = 'ko'; f.vx = 0; f.vy = 0;
    f.stocks = Math.max(0, f.stocks-1);
    playSFX('ko'); triggerShake(18);

    if (f.stocks <= 0) {
      checkWinCondition();
      return;
    }
    f._koTimer = 180;
    showIntroText('KO!', 70, 0xff2222, null);
  }

  function checkWinCondition() {
    if (gameMode === '2V2') {
      // Team mode: team with all members dead loses
      const team0alive = fighters.filter(f => f.team===0 && f.stocks>0).length;
      const team1alive = fighters.filter(f => f.team===1 && f.stocks>0).length;
      if (team0alive === 0) {
        matchOver = true;
        matchWinner = fighters.find(f => f.team===1 && f.stocks>0)?.playerIdx ?? 2;
      } else if (team1alive === 0) {
        matchOver = true;
        matchWinner = fighters.find(f => f.team===0 && f.stocks>0)?.playerIdx ?? 0;
      }
    } else {
      // FFA / 1P / 2P: last one standing
      const alive = fighters.filter(f => f.stocks > 0);
      if (alive.length <= 1) {
        matchOver = true;
        matchWinner = alive.length === 1 ? alive[0].playerIdx : -1;
      }
    }
  }

  // ── AI ───────────────────────────────────────────────────
  function updateAI(f, dt) {
    if (f.state === 'ko' || f.state === 'win') return;
    if (f._invincible > 0 || f.hitStun > 0) return;
    f.aiTimer -= dt;
    if (f.aiTimer > 0) return;
    f.aiTimer = 10 + Math.random()*15;

    // Target the closest opponent
    const opponents = fighters.filter(o => o !== f && o.stocks > 0 && o.state !== 'ko');
    if (opponents.length === 0) return;
    const target = opponents.reduce((a,b) => Math.abs(a.x-f.x) < Math.abs(b.x-f.x) ? a : b);

    const dist = Math.abs(target.x - f.x);
    const heightDiff = target.y - f.y;
    const rand = Math.random();

    if (dist > ATTACK_RANGE*1.4) {
      f.vx = (target.x < f.x ? -1 : 1) * MOVE_SPEED * f.speedMult;
    } else if (dist < ATTACK_RANGE*0.5) {
      f.vx = (target.x < f.x ? 1 : -1) * MOVE_SPEED * f.speedMult * 0.7;
    } else {
      f.vx = 0;
    }

    if (f.onGround && heightDiff < -60 && rand < 0.55) {
      f.vy = JUMP_VY; f.onGround = false; f.jumpsLeft = 1; f.state = 'jump';
    } else if (!f.onGround && f.jumpsLeft > 0 && heightDiff < -80 && rand < 0.3) {
      f.vy = DOUBLE_JUMP_VY; f.jumpsLeft--; f.state = 'jump';
    }
    if (f.onGround && rand < 0.12) {
      f.vy = JUMP_VY; f.onGround = false; f.jumpsLeft = 1; f.state = 'jump';
    }
    if (dist <= ATTACK_RANGE*1.1 && Math.abs(target.y-f.y) < 80 && f.attackCd <= 0 && f.hitStun <= 0) {
      const r2 = Math.random();
      const atkType = r2 < 0.45 ? 'NORMAL' : r2 < 0.75 ? 'KICK' : 'SPECIAL';
      queueAttack(f, target, atkType);
    }
    if (f.onGround) {
      const nearEdge = f.x < 80 || f.x > W()-80;
      if (nearEdge) f.vx = (f.x < W()/2 ? 1 : -1) * MOVE_SPEED * f.speedMult;
    }
  }

  // ── Attack system ────────────────────────────────────────
  let attackQueue = [];

  function canAttack(f) {
    return f.attackCd <= 0 && f.hitStun <= 0 && f.state !== 'ko' && f.state !== 'win' && f.state !== 'hit';
  }

  function queueAttack(attacker, defender, atkType) {
    if (!canAttack(attacker)) return;
    if (attackQueue.some(r => r.attacker === attacker && r.defender === defender)) return;
    // Can't attack teammates in 2v2
    if (gameMode === '2V2' && attacker.team === defender.team) return;
    attackQueue.push({ attacker, defender, atkType });
  }

  function beginAttack(f, atkType) {
    const atk = ATTACKS[atkType];
    if (!atk) return;
    f._lastAtkIsKick = atk.isKick;
    f.state = atkType === 'SPECIAL' ? 'special' : 'attack';
    f.attackTimer = atk.dur; f.attackCd = atk.cd;
    playSFX(atkType === 'SPECIAL' ? 'special' : 'punch');
  }

  function checkHit(attacker, defender, atkType) {
    const atk = ATTACKS[atkType];
    if (!atk || defender.state === 'ko' || defender._invincible > 0) return null;
    const dist  = Math.abs(attacker.x - defender.x);
    const ydist = Math.abs(attacker.y - defender.y);
    if (dist >= atk.range || ydist >= ATTACK_RANGE_Y*1.8) return null;
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
    const dmgAdded = atk.dmg * attacker.damageMult * defender.defenseMult;
    defender.damage = Math.min(999, defender.damage + dmgAdded);
    const scale = 0.3 + defender.damage/100;
    defender.vx = attacker.dir * atk.kbx * scale * attacker.damageMult;
    defender.vy = atk.kby * scale * attacker.damageMult;
    const stunMult = atkType === 'SPECIAL' ? 1.6 : atkType === 'KICK' ? 1.2 : 0.9;
    defender.hitStun = 22 * stunMult;
    defender.state = 'hit'; defender.onGround = false;
    defender._hitFlash = 1;
    defender._squash = 0.7; defender._squashV = 0.1;
    defender._knockbackFrames = 25;

    const hitX = (attacker.x + defender.x)/2;
    const hitY  = defender.y - FIGHTER_H*0.5;
    spawnHitEffect(hitX, hitY, atkType === 'SPECIAL', PLAYER_COLORS[attacker.playerIdx]);
    triggerShake(atkType === 'SPECIAL' ? 14 : atkType === 'KICK' ? 9 : 5);
  }

  function resolveAttacks() {
    attackQueue.forEach(req => {
      beginAttack(req.attacker, req.atkType);
      applyHit(req.attacker, req.defender, checkHit(req.attacker, req.defender, req.atkType));
    });
    attackQueue = [];
  }

  // ── Camera ───────────────────────────────────────────────
  let camZoom = 1.0;

  function updateCamera() {
    if (!fightActive) return;
    const alive = fighters.filter(f => f.state !== 'ko' || f.stocks > 0);
    if (alive.length === 0) return;
    const xs = alive.map(f => f.x);
    const ys = alive.map(f => f.y);
    const midX = xs.reduce((a,b)=>a+b,0)/xs.length;
    const midY = Math.min(ys.reduce((a,b)=>a+b,0)/ys.length, GROUND_Y*0.88);
    const spreadX = Math.max(...xs) - Math.min(...xs);
    const spreadY = Math.max(...ys) - Math.min(...ys);
    const spread = spreadX + spreadY*0.4;
    const minZoom = numPlayers >= 4 ? 0.58 : 0.72;
    const targetZoom = Math.max(minZoom, Math.min(1.0, W()*0.65 / Math.max(spread+250, 350)));
    camZoom += (targetZoom - camZoom) * 0.04;
    worldContainer.scale.set(camZoom);
    worldContainer.x = W()/2 - midX*camZoom;
    worldContainer.y = H()/2 - midY*camZoom;
  }

  // ── Fighter body drawing ─────────────────────────────────
  function lerpColor(a,b,t) {
    const ar=(a>>16)&0xff, ag=(a>>8)&0xff, ab=a&0xff;
    const br=(b>>16)&0xff, bg=(b>>8)&0xff, bb=b&0xff;
    return ((Math.round(ar+(br-ar)*t)<<16)|(Math.round(ag+(bg-ag)*t)<<8)|Math.round(ab+(bb-ab)*t));
  }

  function drawFighterBody(fighter) {
    if (!fighter.mainSprite) return;
    const spr = fighter.mainSprite, aura = fighter.auraGfx, gfx = fighter.bodyGfx;
    const t = Date.now()/1000;
    const bx = fighter._baseScaleX || 1, by = fighter._baseScaleY || 1;

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
        wantTex = frames[Math.floor(t*fps) % frames.length];
      }
      if (spr.texture !== wantTex) spr.texture = wantTex;
    }

    if (fighter._hitFlash > 0) {
      fighter._hitFlash = Math.max(0, fighter._hitFlash-0.12);
      spr.tint = lerpColor(0xffffff, 0xff3333, fighter._hitFlash);
    } else { spr.tint = 0xffffff; }

    if (fighter._invincible > 0) {
      spr.alpha = Math.sin(Date.now()/60) > 0 ? 1 : 0.3;
    } else { spr.alpha = 1; }

    fighter._squashV += (1-fighter._squash)*0.35;
    fighter._squashV *= 0.65;
    fighter._squash += fighter._squashV;
    gfx.clear();

    switch (fighter.state) {
      case 'idle': {
        const bob = Math.sin(t*2.5)*1.5;
        spr.scale.set(bx, by*(fighter._squash + Math.sin(t*2.5)*0.015));
        spr.y = bob; spr.rotation = 0; if (aura) aura.clear(); break;
      }
      case 'run': {
        const bounce = Math.abs(Math.sin(t*12))*0.04;
        spr.scale.set(bx*(1-bounce*0.5), by*(fighter._squash+bounce));
        spr.y = -Math.abs(Math.sin(t*12))*4; spr.rotation = 0.06; if (aura) aura.clear(); break;
      }
      case 'jump': {
        spr.scale.set(bx*0.9, by*1.08*fighter._squash);
        spr.y = -3; spr.rotation = 0; if (aura) aura.clear(); break;
      }
      case 'attack': {
        const progress = 1-(fighter.attackTimer/ATTACKS.NORMAL.dur);
        const isActive = progress>0.3 && progress<0.75;
        if (progress<0.3) { spr.scale.set(bx*0.9, by*1.05); spr.rotation = -0.12; }
        else if (isActive) {
          spr.scale.set(bx*1.12, by*0.88); spr.rotation = 0.2;
          const fistX = FIGHTER_H*0.45, fistY = -FIGHTER_H*0.55;
          gfx.circle(fistX, fistY, FIGHTER_H*0.13).fill({ color:0xffffff, alpha:0.9 });
          gfx.circle(fistX, fistY, FIGHTER_H*0.22).fill({ color:fighter.chardef.accentColor, alpha:0.5 });
        } else { spr.scale.set(bx*0.95, by*1.02); spr.rotation = 0.05; }
        break;
      }
      case 'special': {
        const pulse = (Math.sin(t*15)+1)/2;
        const progress = 1-(fighter.attackTimer/ATTACKS.SPECIAL.dur);
        const isActive = progress>0.25 && progress<0.8;
        spr.scale.set(bx*(isActive?1.15:1.0), by*(isActive?0.88:1.0)*fighter._squash);
        spr.rotation = isActive?0.25:0; spr.y = Math.sin(t*20)*2;
        if (aura) {
          aura.clear();
          aura.ellipse(0, -FIGHTER_H*0.5, FIGHTER_H*(0.38+pulse*0.08), FIGHTER_H*(0.5+pulse*0.1))
            .fill({ color:fighter.chardef.accentColor, alpha:0.18+pulse*0.22 });
        }
        if (isActive) {
          const fx=FIGHTER_H*0.5, fy=-FIGHTER_H*0.5;
          gfx.circle(fx,fy,FIGHTER_H*0.17).fill({ color:0xffffff, alpha:1 });
          gfx.circle(fx,fy,FIGHTER_H*0.28).fill({ color:fighter.chardef.accentColor, alpha:0.7 });
          gfx.circle(fx,fy,FIGHTER_H*0.42).fill({ color:fighter.chardef.color, alpha:0.4 });
        }
        break;
      }
      case 'hit': {
        spr.scale.set(bx*0.88, by*1.1*fighter._squash);
        spr.rotation = -0.18; spr.y = -4; break;
      }
      case 'block': {
        spr.scale.set(bx*0.85, by*0.92); spr.rotation = 0.05; spr.y = FIGHTER_H*0.06;
        if (aura) { aura.clear(); aura.ellipse(0,-FIGHTER_H*0.5,FIGHTER_H*0.35,FIGHTER_H*0.5).fill({ color:0x4488ff, alpha:0.18 }); }
        break;
      }
      case 'ko': {
        spr.scale.set(bx*0.88, by*0.88); spr.rotation = 0; spr.y = 0;
        if (aura) aura.clear(); break;
      }
      case 'win': {
        const pulse = (Math.sin(t*3)+1)/2;
        spr.scale.set(bx*(1+pulse*0.05), by*(1+pulse*0.05));
        spr.y = -Math.abs(Math.sin(t*2))*4; spr.rotation = 0;
        if (aura) { aura.clear(); aura.ellipse(0,-FIGHTER_H*0.5,FIGHTER_H*(0.35+pulse*0.1),FIGHTER_H*(0.5+pulse*0.1)).fill({ color:fighter.chardef.accentColor, alpha:0.15+pulse*0.15 }); }
        break;
      }
      default: spr.scale.set(bx, by); spr.y = 0; spr.rotation = 0;
    }
  }

  // ── Main game loop ────────────────────────────────────────
  const ticker = (tk) => {
    if (currentScene !== SCENES.FIGHT) {
      app.ticker.remove(ticker);
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup',   keyup);
      return;
    }
    const dt = tk.deltaTime;

    // Animate bg particles
    bgParticles.forEach(p => {
      p.sprite.x += p.vx; p.sprite.y += p.vy;
      if (p.sprite.y < -5) { p.sprite.y = H()+5; p.sprite.x = Math.random()*W(); }
    });

    // Platform pulse animation
    platformPulseT += dt;
    drawNeonPlatforms();

    if (!fightActive || matchOver) {
      if (matchOver && !navigating) {
        navigating = true;
        if (matchWinner >= 0) {
          const winner = fighters[matchWinner];
          if (winner) winner.state = 'win';
          const winName  = winner ? winner.chardef.name : '???';
          const winColor = matchWinner >= 0 ? PLAYER_COLORS[matchWinner] : 0xffffff;
          gameResult = {
            winner: matchWinner,
            winnerName: winName,
            charIdx: charIndices[matchWinner] ?? matchWinner,
            p1Name: fighters[0]?.chardef.name,
            p2Name: fighters[1]?.chardef.name,
          };
          setTimeout(() => {
            showIntroText(winName + ' WINS!', 130, winColor, () => {
              setTimeout(() => {
                document.removeEventListener('keydown', keydown);
                document.removeEventListener('keyup',   keyup);
                showScene(SCENES.GAME_OVER);
              }, 600);
            });
          }, 800);
        } else {
          // Draw
          gameResult = { winner:-1, winnerName:'DRAW', charIdx:0, p1Name:'P1', p2Name:'P2' };
          setTimeout(() => {
            showIntroText('DRAW!', 130, 0xffff00, () => {
              setTimeout(() => { document.removeEventListener('keydown', keydown); document.removeEventListener('keyup', keyup); showScene(SCENES.GAME_OVER); }, 600);
            });
          }, 800);
        }
      }
      fighters.forEach(f => { if (f.container) drawFighterBody(f); });
      return;
    }

    // ── Player Input ───────────────────────────────────────
    fighters.forEach((f, pi) => {
      if (f.state === 'ko' || f.state === 'win' || f._koTimer > 0) return;
      if (f.isAI) { updateAI(f, dt); return; }

      // Get input (keyboard + gamepad for P4)
      let left=false, right=false, jumpK=false, block=false, punch=false, kick=false, special=false;

      if (pi === 3) {
        const gp = getGamepadInput(0); // First gamepad for P4
        if (gp) {
          left=gp.left; right=gp.right; jumpK=gp.jump; block=gp.block;
          punch=gp.punch; kick=gp.kick; special=gp.special;
        }
      }
      // Always also check keyboard
      left    = left    || ctrlPressed(f,'left');
      right   = right   || ctrlPressed(f,'right');
      jumpK   = jumpK   || ctrlPressed(f,'jump');
      block   = (ctrlPressed(f,'block')) && f.onGround;
      punch   = punch   || ctrlPressed(f,'punch');
      kick    = kick    || ctrlPressed(f,'kick');
      special = special || ctrlPressed(f,'special');

      // P1 touch support
      if (pi === 0) {
        left    = left    || touchBtns.left;
        right   = right   || touchBtns.right;
        jumpK   = jumpK   || touchBtns.jump;
        block   = block   || (touchBtns.down && f.onGround);
        punch   = punch   || touchBtns.normal;
        kick    = kick    || touchBtns.kick;
        special = special || touchBtns.special;
      }

      f.blocking = !!block && f.hitStun <= 0 && f.state !== 'attack' && f.state !== 'special';

      if (f.hitStun <= 0 && !f.blocking) {
        let moving = false;
        if (left && f.state !== 'attack' && f.state !== 'special') {
          f.vx = -MOVE_SPEED * f.speedMult; f.dir = -1;
          if (f.state !== 'jump') f.state = 'run'; moving = true;
        } else if (right && f.state !== 'attack' && f.state !== 'special') {
          f.vx = MOVE_SPEED * f.speedMult; f.dir = 1;
          if (f.state !== 'jump') f.state = 'run'; moving = true;
        }
        if (!moving && f.onGround && f.state !== 'attack' && f.state !== 'special') {
          f.vx *= 0.7;
          if (f.state === 'run') f.state = 'idle';
        }

        if (jumpK) {
          if (!f.jumpConsumed) {
            if (f.onGround) {
              f.vy = JUMP_VY; f.onGround = false; f.jumpsLeft = 1; f.state = 'jump';
              f.jumpConsumed = true;
            } else if (f.jumpsLeft > 0) {
              f.vy = DOUBLE_JUMP_VY; f.jumpsLeft--; f.state = 'jump';
              f.jumpConsumed = true;
              spawnDust(f.x, f.y);
            }
          }
        } else { f.jumpConsumed = false; }

        if (f.attackCd <= 0) {
          const enemies = fighters.filter(o => o !== f && o.stocks > 0 && (gameMode !== '2V2' || o.team !== f.team));
          const nearestEnemy = enemies.length ? enemies.reduce((a,b) => Math.abs(a.x-f.x) < Math.abs(b.x-f.x) ? a : b) : null;
          if (nearestEnemy) {
            if (punch)   queueAttack(f, nearestEnemy, 'NORMAL');
            if (kick)    queueAttack(f, nearestEnemy, 'KICK');
            if (special) queueAttack(f, nearestEnemy, 'SPECIAL');
          }
        }
      } else if (f.blocking) {
        f.state = 'block'; f.vx *= 0.7;
      }
    });

    // ── Resolve attacks ───────────────────────────────────
    resolveAttacks();

    // ── Physics ───────────────────────────────────────────
    fighters.forEach(f => {
      if (f.state === 'ko' && f._koTimer > 0) {
        f._koTimer -= dt;
        if (f._koTimer <= 0 && f.stocks > 0) respawnFighter(f);
        if (f.container) drawFighterBody(f);
        return;
      }
      if (f.state === 'ko' && f.stocks <= 0) {
        if (f.container) drawFighterBody(f);
        return;
      }

      f.vy += GRAVITY;
      if (f._knockbackFrames > 0) {
        f._knockbackFrames = Math.max(0, f._knockbackFrames-dt);
        f.vx *= KB_FRICTION;
      } else if (!f.onGround) {
        f.vx *= AIR_FRICTION;
      }
      f.x += f.vx * dt;
      f.y += f.vy * dt;

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

      if (f.attackCd > 0) f.attackCd -= dt;
      if (f.attackTimer > 0) {
        f.attackTimer -= dt;
        if (f.attackTimer <= 0 && f.state !== 'ko' && f.state !== 'hit' && f.state !== 'win' && f.state !== 'block') {
          f.state = f.onGround ? 'idle' : 'jump';
        }
      }
      if (f.hitStun > 0) {
        f.hitStun -= dt;
        if (f.hitStun <= 0 && f.state === 'hit') f.state = f.onGround ? 'idle' : 'jump';
      }
      if (f._invincible > 0) f._invincible -= dt;

      // Face nearest opponent
      if (f.hitStun <= 0 && f.attackTimer <= 0 && f.state !== 'ko' && f.state !== 'win') {
        const opponents = fighters.filter(o => o !== f && o.stocks > 0 && o.state !== 'ko');
        if (opponents.length > 0 && f.state !== 'run') {
          const nearest = opponents.reduce((a,b) => Math.abs(a.x-f.x) < Math.abs(b.x-f.x) ? a : b);
          f.dir = nearest.x >= f.x ? 1 : -1;
        }
      }
      if (f.state === 'block' && !f.blocking) f.state = 'idle';

      if (isOutsideBlast(f) && f.state !== 'ko') handleKO(f);

      if (f.container) {
        f.container.x = f.x; f.container.y = f.y;
        f.container.scale.x = f.dir;
        if (f.state === 'ko') {
          f.container.rotation = Math.min(Math.PI/2, f.container.rotation + 0.06*dt);
        } else { f.container.rotation = 0; }
        drawFighterBody(f);
      }
    });

    updateEffects(dt);
    updateHUD();
    updateCamera();

    // Screen shake
    if (shakeAmt > 0.3) {
      shakeX = (Math.random()-0.5)*shakeAmt*2.5;
      shakeY = (Math.random()-0.5)*shakeAmt*2.5;
      shakeAmt *= 0.72;
    } else { shakeAmt = 0; shakeX = 0; shakeY = 0; }
    app.stage.position.set(shakeX, shakeY);
  };
  app.ticker.add(ticker);
}

// ═══════════════════════════════════════════════════════════
// TOUCH CONTROLS
function buildTouchControls(container) {
  const state = {
    left:false, right:false, jump:false, down:false,
    normal:false, kick:false, special:false,
    left2:false, right2:false, jump2:false,
  };
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 850;
  if (!isMobile) return state;

  const btnLayer = new PIXI.Container();
  btnLayer.interactiveChildren = true;
  container.addChild(btnLayer);

  const r   = Math.min(W()*0.07, 46);
  const pad = 14;
  const baseY = H() - pad - r;
  const dpadCX = pad + r*2.8, dpadCY = baseY - r*0.6, dpadR = r*1.05;

  function makeDpad(label, ox, oy, key) {
    const g = new PIXI.Graphics();
    const bw = r*1.55;
    g.roundRect(-bw/2,-bw/2,bw,bw,10).fill({ color:0x060620, alpha:0.92 }).stroke({ color:0x4488ff, width:2.5 });
    g.x = dpadCX + ox*dpadR; g.y = dpadCY + oy*dpadR;
    g.interactive = true; g.cursor = 'pointer';
    const t = makeText(label, { size:Math.max(10,Math.floor(r*0.44)), color:0xaaccff });
    t.anchor.set(0.5); g.addChild(t); btnLayer.addChild(g);
    g.on('pointerdown',     () => { state[key]=true;  g.alpha=0.45; });
    g.on('pointerup',       () => { state[key]=false; g.alpha=1; });
    g.on('pointerupoutside',() => { state[key]=false; g.alpha=1; });
    return g;
  }
  makeDpad('◄',-1,0,'left'); makeDpad('►',1,0,'right');
  makeDpad('▲',0,-1,'jump'); makeDpad('▼',0,1,'down');

  const attackDefs = [
    ['normal', 'J',    0, 0x4488ff],
    ['kick',   'K',    1, 0xff5533],
    ['special','SPL',  2, 0xbb44ff],
  ];
  const atkSpacing = r*2.2;
  const atkStartX = W()-pad-r-atkSpacing*2;
  attackDefs.forEach(([key, label, col, border]) => {
    const g = new PIXI.Graphics();
    g.circle(0,0,r).fill({ color:0x060620, alpha:0.88 }).stroke({ color:border, width:2.5 });
    g.x = atkStartX+col*atkSpacing; g.y = baseY; g.interactive = true; g.cursor = 'pointer';
    const t = makeText(label, { size:Math.max(8,Math.floor(r*0.36)), color:border });
    t.anchor.set(0.5); g.addChild(t); btnLayer.addChild(g);
    g.on('pointerdown',     () => { state[key]=true;  g.alpha=0.45; });
    g.on('pointerup',       () => { state[key]=false; g.alpha=1; });
    g.on('pointerupoutside',() => { state[key]=false; g.alpha=1; });
  });
  return state;
}

// ═══════════════════════════════════════════════════════════
// SCENE: GAME OVER
function buildGameOverScene(container) {
  // Neon background
  const { stars, particles } = buildNeonBackground(container);

  const darken = new PIXI.Graphics();
  darken.rect(0,0,W(),H()).fill({ color:0x000000, alpha:0.6 });
  container.addChild(darken);

  const koTitle = makeGlowText('K.O.', Math.min(Math.floor(W()/8), 88), 0xff2222);
  koTitle.x = W()/2; koTitle.y = H()*0.18; container.addChild(koTitle);

  const isDraw = gameResult.winner < 0;
  const winColor = isDraw ? 0xffff00 : (gameResult.winner < PLAYER_COLORS.length ? PLAYER_COLORS[gameResult.winner] : 0x00ffcc);
  const winLabel = isDraw ? 'DRAW!' : (PLAYER_LABELS[gameResult.winner]||'P1') + ' — ' + (gameResult.winnerName||'WINNER') + ' WINS!';
  const winText = makeGlowText(winLabel, Math.min(Math.floor(W()/15), 40), winColor);
  winText.x = W()/2; winText.y = H()*0.38; container.addChild(winText);

  // Winner portrait
  const winIdx = gameResult.charIdx ?? charIndices[gameResult.winner] ?? 0;
  if (!isDraw && textures[`char_${winIdx}`]) {
    const portrait = new PIXI.Sprite(textures[`char_${winIdx}`]);
    const ps = Math.min(W()*0.22, 200);
    portrait.width = ps; portrait.height = ps; portrait.anchor.set(0.5);
    portrait.x = W()/2; portrait.y = H()*0.62; container.addChild(portrait);
    const ring = new PIXI.Graphics();
    ring.circle(W()/2, H()*0.62, ps*0.55).stroke({ color:winColor, width:3, alpha:0.8 });
    ring.circle(W()/2, H()*0.62, ps*0.6).stroke({ color:winColor, width:1, alpha:0.3 });
    container.addChild(ring);
  }

  const btnRematch = makeButton('REMATCH',   W()/2, H()*0.83, 220, 44, { color:0x001100, border:0x44ff44, textColor:0x44ff44, hoverTextColor:0x000000 });
  const btnMenu    = makeButton('MAIN MENU', W()/2, H()*0.91, 220, 44, { color:0x110022, border:0xbb44ff, textColor:0xbb44ff, hoverTextColor:0xffffff });
  container.addChild(btnRematch, btnMenu);

  playVictoryMusic(() => { if (currentScene === SCENES.GAME_OVER) playMenuMusic(); });

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
    if (e.key==='Enter'||e.key==='r'||e.key==='R') cleanupAndGo(() => showScene(SCENES.FIGHT));
    if (e.key==='Escape'||e.key==='m'||e.key==='M') cleanupAndGo(() => showScene(SCENES.MENU));
  };
  document.addEventListener('keydown', gameOverKeydown);

  const ticker = (tk) => {
    if (currentScene !== SCENES.GAME_OVER) {
      app.ticker.remove(ticker);
      if (gameOverKeydown) { document.removeEventListener('keydown', gameOverKeydown); gameOverKeydown = null; }
      return;
    }
    const t = Date.now();
    stars.forEach(s => { s.sprite.alpha = 0.2+Math.sin(t/1000*s.twinkleSpeed+s.twinkleOffset)*0.3; });
    particles.forEach(p => { p.sprite.x+=p.vx; p.sprite.y+=p.vy; if(p.sprite.y<-5){p.sprite.y=H()+5;p.sprite.x=Math.random()*W();} });
    koTitle.scale.set(1+Math.sin(t/600)*0.05);
    winText.scale.set(1+Math.sin(t/800+1)*0.03);
  };
  app.ticker.add(ticker);
}

// ═══════════════════════════════════════════════════════════
// BOOT
window._game = {
  get p1CharIdx() { return charIndices[0]; }, set p1CharIdx(v) { charIndices[0]=v; },
  get p2CharIdx() { return charIndices[1]; }, set p2CharIdx(v) { charIndices[1]=v; },
  get gameMode()  { return gameMode;        }, set gameMode(v)  { gameMode=v;       },
  get chars() { return CHARACTERS.map((c,i) => `${i}: ${c.name}`); },
};
window.gotoFight = function(p1=0, p2=1, stage=null) {
  charIndices[0] = p1 % CHARACTERS.length;
  charIndices[1] = p2 % CHARACTERS.length;
  gameMode = '1P';
  currentStage = stage || STAGES[Math.floor(Math.random()*STAGES.length)];
  showScene(SCENES.FIGHT);
};
window.gotoMenu   = () => showScene(SCENES.MENU);
window.gotoSelect = () => { gameMode='1P'; showScene(SCENES.CHARACTER_SELECT); };

window.addEventListener('load', () => {
  init().catch(err => {
    console.error('Fatal init error:', err);
    const lt = document.getElementById('loading-text');
    if (lt) lt.textContent = 'Error: ' + err.message;
  });
});

document.addEventListener('pointerdown', resumeAudio, { once:false });
