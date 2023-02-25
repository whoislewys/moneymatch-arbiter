/// Stream game events, watch for game end event, push signed game results to proper Escrow contract
const { SlippiGame } = require('@slippi/slippi-js');
const os = require('os');
const chokidar = require('chokidar');
const _ = require('lodash');
const { ethers } = require('ethers');
const { Escrow__factory } = require('./types/ethers-contracts/factories/Escrow__factory');
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(
  process.env.GOERLI_ALCHEMY_URL
);
const arbiterKey = process.env.ARBITER_KEY;
const arbiterWallet = ethers.Wallet(arbiterKey, provider);
const listenPath = `${os.homedir()}/Slippi/`;
console.log(`Listening at: ${listenPath}`);
const EscrowContract = Escrow__factory.connect(
  addressesJson.addresses.elementToken,
  arbiterWallet,
);

const watcher = chokidar.watch(listenPath, {
  ignored: '!*.slp', // TODO: This doesn't work. Use regex?
  depth: 0,
  persistent: true,
  usePolling: true,
  ignoreInitial: true,
});

const gameByPath = {};

watcher.on('change', (path) => {
  const start = Date.now();

  let gamewinners,
    metadata,
    gameState,
    settings,
    stats,
    frames,
    latestFrame,
    gameEnd;
  try {
    let game = _.get(gameByPath, [path, 'game']);
    if (!game) {
      // console.log(`New file at: ${path}`);
      // Make sure to enable `processOnTheFly` to get updated stats as the game progresses
      game = new SlippiGame(path, { processOnTheFly: true });
      gameByPath[path] = {
        game: game,
        state: {
          settings: null,
          detectedPunishes: {},
        },
      };
    }

    gameState = _.get(gameByPath, [path, 'state']);

    settings = game.getSettings();
    metadata = game.getMetadata();
    frames = game.getFrames();
    latestFrame = game.getLatestFrame();
    gameEnd = game.getGameEnd();
    gamewinners = game.getWinners();
  } catch (err) {
    console.log(err);
    return;
  }

  if (!gameState.settings && settings) {
    console.log(`[Game Start] New game has started`);
    console.log(settings);
    gameState.settings = settings;
  }

  console.log(`We have ${_.size(frames)} frames.`);
  _.forEach(settings.players, (player) => {
    const frameData = _.get(latestFrame, ['players', player.playerIndex]);
    if (!frameData) {
      return;
    }

    // console.log(
    //   `[Port ${player.port}] ${frameData.post.percent.toFixed(1)}% | ` +
    //     `${frameData.post.stocksRemaining} stocks`
    // );
  });

  if (gameEnd) {
    // NOTE: These values and the quitter index will not work until 2.0.0 recording code is
    // NOTE: used. This code has not been publicly released yet as it still has issues
    const endTypes = {
      1: 'TIME!',
      2: 'GAME!',
      7: 'No Contest',
    };

    console.log('\n');

    const endMessage = _.get(endTypes, gameEnd.gameEndMethod) || 'Unknown';

    const lrasText =
      gameEnd.gameEndMethod === 7
        ? ` | Quitter Index: ${gameEnd.lrasInitiatorIndex}`
        : '';
    console.log(`[Game Complete] Type: ${endMessage}${lrasText}`);
  }

  if (gamewinners !== [] && metadata) {
    const winningPlayer = metadata.players[gamewinners[0].playerIndex];
    console.log('winningPlayer', winningPlayer);
    console.log('winningPlayer name: ', winningPlayer.names.netplay);
    console.log('winningPlayer code: ', winningPlayer.names.code); // ex. JAWA#977

    Escr
  }

  console.log(`Read took: ${Date.now() - start} ms`);
});
