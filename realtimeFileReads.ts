import { SlippiGame } from '@slippi/slippi-js';
import * as chokidar from 'chokidar';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { ethers } from 'ethers';
import { get } from 'lodash';
import * as os from 'os';
import { EscrowFactory__factory } from './types/ethers-contracts/factories/contracts/EscrowFactory__factory';
import { Escrow__factory } from './types/ethers-contracts/factories/contracts/Escrow__factory';
dotenv.config();

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
console.log('arbiter address: ', arbiterWallet.address);

const getCurrentGameEscrow = async (settings: any) => {
  // Get the current game's Escrow address by using ids of players to search through EscrowFactory event logs
  const EscrowFactory = EscrowFactory__factory.connect(
    process.env.ESCROW_FACTORY_ADDRESS ?? ethers.constants.AddressZero,
    arbiterWallet
  );
  console.log('Got EscrowFactory contract');
  const player1Id = settings.players[0].connectCode;
  console.log('player1Id: ', player1Id);
  const player2Id = settings.players[1].connectCode;
  console.log('player2Id: ', player2Id);
  const currentGameFilter = EscrowFactory.filters.EscrowCreated(
    player1Id,
    null,
    player2Id,
    null,
    null
  );

  const events = await EscrowFactory.queryFilter(currentGameFilter);
  const latestEvent = events[events.length - 1];
  const currentGameEscrowAddress = latestEvent.args[4];
  // console.log('currentGameEscrowAddress: ', currentGameEscrowAddress);
  const contractPlayer1Address = latestEvent.args[1];
  console.log('contractPlayer1Address: ', contractPlayer1Address);
  const contractPlayer2Address = latestEvent.args[3];
  console.log('contractPlayer2Address: ', contractPlayer2Address);

  // Get escrow contract for this game
  const EscrowContract = Escrow__factory.connect(
    currentGameEscrowAddress,
    arbiterWallet
  );
  console.log('EscrowContract.address: ', EscrowContract.address);
  console.log('\n');
  return EscrowContract;
};

const handleChange = async (path: any) => {
  console.log('handleChange');
  let gamewinners: any;
  let metadata: any;
  let gameState: any;
  let settings: any;
  let gameEnd: any;
  let currentEscrow: any;

  try {
    const gameByPath: any = {};
    let game = get(gameByPath, [path, 'game']);
    console.log('game: ', game);
    // Create SlippiGame object
    if (!game) {
      console.log(`New game file at: ${path}`);
      // Make sure to enable `processOnTheFly` to get updated stats as the game progresses
      game = new SlippiGame(path, { processOnTheFly: true });
      gameByPath[path] = {
        game: game,
        state: {
          settings: null,
          detectedPunishes: {},
        },
      };
      console.log('game by path: ', gameByPath);
    }

    // gameState = get(gameByPath, [path, 'state']);

    settings = game.getSettings();
    metadata = game.getMetadata();
    gameEnd = game.getGameEnd();
    gamewinners = game.getWinners();

    if (!currentEscrow) {
      currentEscrow = await getCurrentGameEscrow(settings);
    }
  } catch (err) {
    console.log(err);
    return;
  }

  // When game has started, get the Escrow contract and call startGame
  if (!gameState.settings && settings) {
    console.log(`[Game Start] New game has started`);
    // console.log('settings: ', settings);
    gameState.settings = settings;

    // todo: run this once on slp file creation instead of on every frame
    const gameStarted = await currentEscrow.gameStarted();
    console.log('game started: ', gameStarted);
    if (!gameStarted) {
      try {
        console.log('Starting game on Escrow contract');
        await currentEscrow.startGame();
      } catch (e) {
        console.error('Error Starting Game: ', e);
      }
    }
  }

  // dev
  // if (true) {
  //   gameEnd = {
  //     gameEndMethod: 2,
  //     lrasInitiatorIndex: -1,
  //     placements: [
  //       { playerIndex: 0, position: 0 },
  //       { playerIndex: 1, position: 1 },
  //       { playerIndex: 2, position: -1 },
  //       { playerIndex: 3, position: -1 },
  //     ],
  //   };
  // enddev

  // prod
  if (gameEnd) {
    const endTypes = {
      1: 'TIME!',
      2: 'GAME!',
      7: 'No Contest',
    };

    console.log('\n');

    const endMessage = get(endTypes, gameEnd.gameEndMethod) || 'Unknown';

    const lrasText =
      gameEnd.gameEndMethod === 7
        ? ` | Quitter Index: ${gameEnd.lrasInitiatorIndex}`
        : '';
    console.log(`[Game Complete] Type: ${endMessage}${lrasText}`);
  }

  // dev
  // gamewinners = [
  //   {
  //     playerIndex: 0,
  //     names: {
  //       code: 'TARC#448',
  //     },
  //   },
  // ];
  // enddev

  if (gamewinners.length !== 0 && metadata) {
    const winningPlayer = metadata.players[gamewinners[0].playerIndex];
    const winnerId = winningPlayer.names.code; // ex. TARC#448
    console.log('winnerId: ', winnerId);

    // Sign game results in EIP-712 format
    // const domain = {
    //   // Must match the signing domain in the contract
    //   name: 'MoneyMatch',
    //   version: '1',
    //   verifyingContract: currentEscrow.address,
    //   chainId: 1337, // local
    //   // chainId: 437, // polygon
    //   // chainId: 80001 // polygon mumbai
    // };
    // const types = {
    //   GameResults: [{ name: 'winnerId', type: 'string' }],
    // };
    // const winner = {
    //   // winnerAddress: winnerId === player1Id ? player1Address : player2Address,
    //   winnerId,
    // };
    // const signature = await arbiterWallet._signTypedData(domain, types, winner)
    // const gameResults = {
    //   ...winner,
    //   signature,
    // };
    // await currentEscrow.endGame(gameResults);

    try {
      console.log('Ending game');
      await currentEscrow.endGame(winnerId);
    } catch (e) {
      console.error('Error Ending Game: ', e);
    }
    console.log('Game over');
  }
};

// Watch for new game
const listenPath = `${os.homedir()}/Slippi/`;
console.log(`Listening for slippi games at: ${listenPath}`);
const watcher = chokidar.watch(listenPath, {
  ignored: '!*.slp', // TODO: This doesn't work. Use regex?
  depth: 0,
  persistent: true,
  usePolling: true,
  ignoreInitial: true,
});

// dev
// handleChange('/Users/machine/Slippi/Game_20230213T193024.slp');
// enddev

// prod
watcher.on('change', (path) => {
  // handleChange('/Users/machine/Slippi/Game_20230222T120712.slp');
  handleChange(path);
});
