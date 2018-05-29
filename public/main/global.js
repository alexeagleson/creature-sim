const RENDER_ENGINE = 'Phaser';
const CANVAS_SIZE = 0.75;

const isEngine = (engineName) => {
  if (engineName.toLowerCase() === RENDER_ENGINE.toLowerCase()) { return true; }
  return false;
};

// Phaser constants
const PHASER_TILE_SIZE = 32;
const PHASER_GAME_SCALE = 1;
const PHASER_TILE_SIZE_SCALED = PHASER_TILE_SIZE * PHASER_GAME_SCALE;

// RotJs constants
const ROT_FONT_SIZE = 20;

const SCREEN_WIDTH = isEngine('RotJs')
  ? Math.floor(window.innerWidth * CANVAS_SIZE / ROT_FONT_SIZE) * ROT_FONT_SIZE
  : Math.floor(window.innerWidth * CANVAS_SIZE / PHASER_TILE_SIZE_SCALED) * PHASER_TILE_SIZE_SCALED;

const SCREEN_HEIGHT = isEngine('RotJs')
  ? Math.floor(window.innerHeight * CANVAS_SIZE / ROT_FONT_SIZE) * ROT_FONT_SIZE
  : Math.floor(window.innerHeight * CANVAS_SIZE / PHASER_TILE_SIZE_SCALED) * PHASER_TILE_SIZE_SCALED;

const MAIN_DISPLAY_TILE_WIDTH = isEngine('RotJs')
  ? Math.floor(SCREEN_WIDTH / ROT_FONT_SIZE)
  : Math.floor(SCREEN_WIDTH / PHASER_TILE_SIZE_SCALED);

const MAIN_DISPLAY_TILE_HEIGHT = isEngine('RotJs')
  ? Math.floor(SCREEN_HEIGHT / ROT_FONT_SIZE)
  : Math.floor(SCREEN_HEIGHT / PHASER_TILE_SIZE_SCALED);

// Global values independent of graphics engines
const TILE_SIZE = isEngine('RotJs')
  ? ROT_FONT_SIZE
  : PHASER_TILE_SIZE_SCALED;

// VSCode Colours
const HEX_WHITE = '#ABB2BF';
const HEX_BLACK = '#262626';
const HEX_RED = '#FF4C4C';
const HEX_YELLOW = '#FFE272';
const HEX_BLUE = '#56b6c2';
const HEX_GREEN = '#98c379';
const HEX_ORANGE = '#FF9900';
const HEX_GREY = '#666666';
const FONT_FAMILY = 'dejavu sans mono, consolas, monospace';

//Atom Colours
// const HEX_WHITE = '#abb2bf';
// const HEX_BLACK = '#282c34';
// const HEX_RED = '#e05848';
// const HEX_YELLOW = '#d19a66';
// const HEX_BLUE = '#56b6c2';
// const HEX_GREEN = '#A0D86C';
// const HEX_ORANGE = '#FF9900';
// const HEX_GREY = '#666666';
// const FONT_FAMILY = 'Inconsolata, Monaco, Consolas, Courier New, Courier';

// Time
const WORLD_TIME_MULTIPLIER = 3000;

const World = {
  Time: {},
  Camera: {},
  allUI: {},

  MainDisplay: null,

  allEvents: [],
  allObjects: [],

  worldPaused: false,
  worldEnd: false
};
