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
const provider = new ethers.providers.JsonRpcProvider(
  process.env.MUMBAI_ALCHEMY_URL
);
// MAINNET
// const provider = new ethers.providers.JsonRpcProvider(
//   process.env.POLYGON_ALCHEMY_URL
// );
// LOCAL
// const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');

const arbiterKey = process.env.ARBITER_KEY ?? ethers.constants.AddressZero;
const arbiterWallet = new ethers.Wallet(arbiterKey, provider);
console.log('arbiter address: ', arbiterWallet.address);

let gamewinners: any;
let metadata: any;
let settings: any;
let gameEndResult: any;
let currentEscrow: any;
let game: any;
let initialized: boolean;
let gameEnded: boolean;

const getCurrentGameEscrow = async (settings: any) => {
  // Get the current game's Escrow address by using ids of players to search through EscrowFactory event logs
  const EscrowFactory = EscrowFactory__factory.connect(
    process.env.ESCROW_FACTORY_ADDRESS ?? ethers.constants.AddressZero,
    arbiterWallet
  );
  console.log('Got EscrowFactory contract');
  console.log('EscrowFactory address: ', EscrowFactory.address);
  const player1Id = settings.players[0].connectCode;
  console.log('player1Id: ', player1Id);
  const player2Id = settings.players[1].connectCode;
  console.log('player2Id: ', player2Id);
  // query events with both players as player1 and player2, since players may be in a different order when game starts
  const p1p2GameFilter = EscrowFactory.filters.EscrowCreated(
    player1Id,
    null,
    player2Id,
    null,
    null
  );
  const p1p2Events = await EscrowFactory.queryFilter(p1p2GameFilter);
  const p2p1GameFilter = EscrowFactory.filters.EscrowCreated(
    player2Id,
    null,
    player1Id,
    null,
    null
  );
  const p2p1Events = await EscrowFactory.queryFilter(p2p1GameFilter);
  const events = [...p1p2Events, ...p2p1Events];
  // get event with max block number
  const latestEvent = events.reduce((mostRecent, curEvent) => {
    return mostRecent === undefined || curEvent.blockNumber > mostRecent.blockNumber ? curEvent : mostRecent;
  });
  console.log('latestEvent: ', latestEvent);
  const currentGameEscrowAddress = latestEvent.args[4];
  console.log('currentGameEscrowAddress: ', currentGameEscrowAddress);
  const contractPlayer1Address = latestEvent.args[1];
  console.log('contractPlayer1Address: ', contractPlayer1Address);
  const contractPlayer2Address = latestEvent.args[3];
  console.log('contractPlayer2Address: ', contractPlayer2Address);

  // Get escrow contract for this game
  const EscrowContract = Escrow__factory.connect(
    currentGameEscrowAddress,
    arbiterWallet
  );
  console.log('\n');
  return EscrowContract;
};

// 0 start game
// 1 get escrow contract when new game starts
// 2 call startGame on escrow contract
// 3 wait and let game play out
// 4 call endGame on escrow contract when game ends
const handleChange = async (path: string) => {
  // Create SlippiGame object
  if (!game) {
    console.log(`New game file at: ${path}`);
    // Make sure to enable `processOnTheFly` to get updated stats as the game progresses
    game = new SlippiGame(path, { processOnTheFly: true });
  }

  settings = game.getSettings();
  metadata = game.getMetadata();
  gameEndResult = game.getGameEnd();
  gamewinners = game.getWinners();

  if (settings && !initialized) {
    initialized = true;
    // 1 When game has started, get the Escrow contract
    console.log(`[Slippi] GameStarted`);
    console.log('\n');
    if (!currentEscrow) {
      currentEscrow = await getCurrentGameEscrow(settings);
      // 2 start game
      const gameStarted = await currentEscrow.gameStarted();
      console.log('Game started?: ', gameStarted);
      if (!gameStarted) {
        try {
          console.log('Starting game on Escrow contract');
          await currentEscrow.startGame();
        } catch (e) {
          console.error('Error Starting Game: ', e);
        }
      }
    }
  }

  // prod
  if (!gameEnded && gameEndResult && gamewinners.length !== 0 && metadata) {
    gameEnded = true;
    console.log('[Slippi] GameEnded');
    console.log('\n');

    const endTypes = {
      1: 'TIME!',
      2: 'GAME!',
      7: 'No Contest',
    };
    const endMessage = get(endTypes, gameEndResult.gameEndMethod) || 'Unknown';
    const lrasText =
      gameEndResult.gameEndMethod === 7
        ? ` | Quitter Index: ${gameEndResult.lrasInitiatorIndex}`
        : '';
    console.log(`[Slippi] GameEndType: ${endMessage}${lrasText}`);

    const winningPlayer = metadata.players[gamewinners[0].playerIndex];
    const winnerId = winningPlayer.names.code; // ex. TARC#448
    console.log('[Slippi] Winning player: ', winningPlayer);
    console.log('[Slippi] winnerId: ', winnerId);

    try {
      console.log('[MoneyMatch] Ending game');
      await currentEscrow.endGame(winnerId);
      process.exit(0);
    } catch (e) {
      console.error('[MoneyMatch] Error Ending Game: ', e);
    }
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

// prod
watcher.on('change', (path) => {
  // handleChange('/Users/machine/Slippi/Game_20230222T120712.slp');
  handleChange(path);
});
