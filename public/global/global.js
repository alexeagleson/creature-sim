const renderEngine = 'RotJs';
const canvasSize = 0.75;

// Phaser constants
const phaserTileSize = 32;
const phaserGameScale = 1;
const phaserTileSizeScaled = phaserTileSize * phaserGameScale;

// RotJs constants
const rotFontSize = 20;

// const screenWidth = renderEngine === 'RotJs'
//   ? Math.floor((window.innerWidth * canvasSize) / rotFontSize) * rotFontSize
//   : Math.floor((window.innerWidth * canvasSize) / phaserTileSizeScaled) * phaserTileSizeScaled;

// const screenHeight = renderEngine === 'RotJs'
//   ? Math.floor((window.innerHeight * canvasSize) / rotFontSize) * rotFontSize
//   : Math.floor((window.innerHeight * canvasSize) / phaserTileSizeScaled) * phaserTileSizeScaled;

const screenWidth = renderEngine === 'RotJs'
  ? Math.floor(window.innerWidth * canvasSize)
  : Math.floor(window.innerWidth * canvasSize);

const screenHeight = renderEngine === 'RotJs'
  ? Math.floor(window.innerHeight * canvasSize)
  : Math.floor(window.innerHeight * canvasSize);

const screenTileWidth = renderEngine === 'RotJs'
  ? Math.floor(screenWidth / rotFontSize)
  : Math.floor(screenWidth / phaserTileSizeScaled);

const screenTileHeight = renderEngine === 'RotJs'
  ? Math.floor(screenHeight / rotFontSize)
  : Math.floor(screenHeight / phaserTileSizeScaled);

// Global values independent of graphics engines
const tileSize = renderEngine === 'RotJs'
  ? rotFontSize
  : phaserTileSizeScaled;

const Colours = {
  // VSCode Colours
  HEX_WHITE: '#ABB2BF',
  HEX_BLACK: '#262626',
  HEX_RED: '#FF4C4C',
  HEX_YELLOW: '#FFE272',
  HEX_BLUE: '#56b6c2',
  HEX_GREEN: '#98c379',
  HEX_ORANGE: '#FF9900',
  HEX_GREY: '#666666',
  FONT_FAMILY: 'dejavu sans mono, consolas, monospace',
};

const ScreenCs = {
  RENDER_ENGINE: renderEngine,
  ROT_FONT_SIZE: rotFontSize,
  SCREEN_WIDTH: screenWidth,
  SCREEN_HEIGHT: screenHeight,
  SCREEN_TILE_WIDTH: screenTileWidth,
  SCREEN_TILE_HEIGHT: screenTileHeight,
  TILE_SIZE: tileSize,
};

const ProtoCs = {
  STANDING_ON_MAX_DISTANCE: 0,
  INTERACT_MAX_DISTANCE: 1.5,
  SPEAK_MAX_DISTANCE: 3,
  EXAMINE_MAX_DISTANCE: 5,

  DIALOGUE_DURATION_MILLISECONDS: 3000,

  CONCERNED_VALUE: 75,

  HUNGER_LOSS_PER_MILLISECOND: 0.001,
  THIRST_LOSS_PER_MILLISECOND: 0.001,

  STAMINA_LOSS_PER_MILLISECOND: 0.0001,
};

const World = {
  Time: {},
  Camera: {},
  AllSounds: {},
  MapNodeTree: null,
  MainDisplay: null,
  ReactUI: {},
  allEvents: [],
  allMaps: [],
  allObjects: [],
  allActiveTileSprites: [],
  allMapsMap: new Map(),
  allObjectsMap: new Map(),

  allObjectsCombat: [],
  allObjectsConsumable: [],
  allObjectsConsumer: [],
  allObjectsDecisionAI: [],
  allObjectsDestructible: [],
  allObjectsEquipment: [],
  allObjectsEquipper: [],
  allObjectsInventory: [],
  allObjectsItem: [],
  allObjectsLiving: [],
  allObjectsMoving: [],
  allObjectsPathing: [],
  allObjectsPhaserObject: [],
  allObjectsPortal: [],
  allObjectsRotJsObject: [],
  allObjectsSocial: [],
  allObjectsTemperature: [],
  allObjectsTurnTaking: [],

  worldPaused: false,
  worldEnd: false,
  playerMapTransition: false,
};
