const os = require('os');
const { SlippiGame } = require('@slippi/slippi-js');
const chokidar = require('chokidar');

// example slippi file name: Game_20230127T190122.slp
// parse this into a Date to ensure we get the newest game
//
// to get slippi account: https://github.com/project-slippi/slippi-launcher/blob/main/src/renderer/lib/hooks/useAccount.ts
//
// Example of a more typical implementation structure

// of interest:
// looks like spectate feature works with a federated dolphin websocket server
// i want to avoid that and go p2p
// https://github.com/project-slippi/slippi-launcher/blob/main/src/broadcast/spectateManager.ts

// Watch slippi dir for new files
// Initialize watcher.
// default slippi path is ~/Slippi/
const watcher = chokidar.watch(`${os.homedir()}/Slippi/`, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
});

// Add event listeners.
const gamePaths = [];
let curGamePath;
let slippiGame;
watcher
  .on('add', (path) => {
    console.log(`New file: ${path}`);
    gamePaths.push(path);

    // TODO: can use ignoreInitial to avoid this?
    // see: https://github.com/project-slippi/slippi-js/blob/master/examples/realtimeFileReads.js
    // curGamePath only gets set after initial scan is complete
    // So we only create a SlippiGame when a new slp file is added after initial scan
    if (curGamePath) {
      curGamePath = path;
      console.log('Creating SlippiGame from path: ', curGamePath);
      slippiGame = new SlippiGame(curGamePath, { processOnTheFly: true });

      settings = slippiGame.getSettings();
      console.log('gamesettings: ', settings);
      frames = game.getFrames();
      latestFrame = game.getLatestFrame();
      gameEnd = game.getGameEnd();
      console.log('gameEnd: ', gameEnd);
    }
  })
  .on('ready', () => {
    console.log('Initial scan complete. Ready for changes');
    curGamePath = gamePaths[gamePaths.length - 1];
  });

// const str = '20230127T190122';
// const yr = str.substring(0,4)
// const month = str.substring(4,5)
// const day = str.substring(6,8)
// const localTimeInMilitaryFormat = str.substring(9) // skip 8th char (the 'T') and get chars from 9th to end
// console.log(yr, month, day, localTimeInMilitaryFormat)
