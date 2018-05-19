const RENDER_ENGINE = "Rot-JS";
const CANVAS_SIZE = 0.75;

// Phaser constants
const PHASER_TILE_SIZE = 32;
const PHASER_GAME_SCALE = 1;
const PHASER_TILE_SIZE_SCALED = PHASER_TILE_SIZE * PHASER_GAME_SCALE;

// Rot-JS constants
const ROT_FONT_SIZE = 20;

const SCREEN_WIDTH = RENDER_ENGINE === "Rot-JS"
  ? Math.floor(window.innerWidth * CANVAS_SIZE / ROT_FONT_SIZE) * ROT_FONT_SIZE
  : Math.floor(window.innerWidth * CANVAS_SIZE / PHASER_TILE_SIZE_SCALED) * PHASER_TILE_SIZE_SCALED;

const SCREEN_HEIGHT = RENDER_ENGINE === "Rot-JS"
  ? Math.floor(window.innerHeight * CANVAS_SIZE / ROT_FONT_SIZE) * ROT_FONT_SIZE
  : Math.floor(window.innerHeight * CANVAS_SIZE / PHASER_TILE_SIZE_SCALED) * PHASER_TILE_SIZE_SCALED;

// More Rot-JS constants
const ROT_TILE_WIDTH = Math.floor(SCREEN_WIDTH / ROT_FONT_SIZE);
const ROT_TILE_HEIGHT = Math.floor(SCREEN_HEIGHT / ROT_FONT_SIZE);

// Global values independent of graphics engines
const TILE_SIZE = RENDER_ENGINE === "Rot-JS"
  ? ROT_FONT_SIZE
  : PHASER_TILE_SIZE_SCALED;

// Colours
const HEX_WHITE = '#ABB2BF';
const HEX_BLACK = '#262626';

// Time
WORLD_TIME_MULTIPLIER = 3000;

const World = {
  Time: {},
  allObjects: new Map(),
  allRotObjects: new Map(),
  allMovingObjects: new Map()
};
