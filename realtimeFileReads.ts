/// Stream game events, watch for game end event, push signed game results to proper Escrow contract
// const { SlippiGame } = require('@slippi/slippi-js');
// const os = require('os');
// const chokidar = require('chokidar');
// const _ = require('lodash');
// const { ethers } = require('ethers');
// const { EscrowFactory__factory } = require('./types/ethers-contracts/factories/contracts/EscrowFactory__factory.ts');
// require('dotenv').config();

import { SlippiGame } from '@slippi/slippi-js';
import * as os from 'os';
import * as chokidar from 'chokidar';
import _ from 'lodash';
import { ethers } from 'ethers';
import { EscrowFactory__factory } from './types/ethers-contracts/factories/contracts/EscrowFactory__factory';
import { Escrow__factory } from './types/ethers-contracts/factories/contracts/Escrow__factory';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

// MUMBAI
// const provider = new ethers.providers.JsonRpcProvider(
//   process.env.MUMBAI_ALCHEMY_URL
// );
// MAINNET
// const provider = new ethers.providers.JsonRpcProvider(
//   process.env.POLYGON_ALCHEMY_URL
// );
// LOCAL
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const arbiterKey = process.env.ARBITER_KEY ?? ethers.constants.AddressZero;
const arbiterWallet = new ethers.Wallet(arbiterKey, provider);

const listenPath = `${os.homedir()}/Slippi/`;
console.log(`Listening for slippi games at: ${listenPath}`);
const watcher = chokidar.watch(listenPath, {
  ignored: '!*.slp', // TODO: This doesn't work. Use regex?
  depth: 0,
  persistent: true,
  usePolling: true,
  ignoreInitial: true,
});

const gameByPath: any = {};

watcher.on('change', (path) => {
  // TODO: see when game starts to call startGame() function on the Escrow conch;
  const start = Date.now();
  console.log('CHANGE EVENT');

  let gamewinners: any;
  let metadata: any;
  let gameState: any;
  let settings: any;
  let frames: any;
  let latestFrame: any;
  let gameEnd: any;

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
  _.forEach(settings.players, (player: any) => {
    const frameData = _.get(latestFrame, ['players', player.playerIndex]);
    if (!frameData) {
      return;
    }
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

  if (gamewinners.length !== 0 && metadata) {
    const winningPlayer = metadata.players[gamewinners[0].playerIndex];
    const winnerId = winningPlayer.names.code; // ex. JAWA#977

    // Get the current game's Escrow address by using ids of players to search through EscrowFactory event logs
    const EscrowFactory = EscrowFactory__factory.connect(
      process.env.ESCROW_FACTORY_ADDRESS ?? ethers.constants.AddressZero,
      arbiterWallet
    );
    const player1Id = metadata.players[0].names.code;
    const player2Id = metadata.players[1].names.code;
    const currentGameFilter = EscrowFactory.filters.EscrowCreated(
      player1Id,
      null,
      player2Id,
      null,
      null
    );
    const currentGameLogs = EscrowFactory.queryFilter(currentGameFilter).then(
      (events) => {
        const latestEvent = events[events.length - 1];
        const currentGameEscrowAddress = latestEvent.args[4];
        const player1Id = latestEvent.args[0];
        const player1Address = latestEvent.args[1];
        const player2Id = latestEvent.args[2];
        const player2Address = latestEvent.args[3];

        // Get escrow contract for this game
        const EscrowContract = Escrow__factory.connect(
          currentGameEscrowAddress,
          arbiterWallet
        );

        // Sign game results in EIP-712 format
        const domain = {
          // Must match the signing domain in the contract
          name: 'MoneyMatch',
          version: '1',
          verifyingContract: currentGameEscrowAddress,
          chainId: 1337, // local
          // chainId: 437, // polygon
          // chainId: 80001 // polygon mumbai
        };
        const types = {
          GameResults: [{ name: 'winnerId', type: 'string' }],
        };
        const winner = {
          // winnerAddress: winnerId === player1Id ? player1Address : player2Address,
          winnerId,
        };

        arbiterWallet
          ._signTypedData(domain, types, winner)
          .then((signature) => {
            const gameResults = {
              ...winner,
              signature,
            };
            EscrowContract.endGame(gameResults);
          });
      }
    );
  }
});
