"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
exports.__esModule = true;
var slippi_js_1 = require("@slippi/slippi-js");
var chokidar = require("chokidar");
var dotenv = require("dotenv"); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
var ethers_1 = require("ethers");
var lodash_1 = require("lodash");
var os = require("os");
var EscrowFactory__factory_1 = require("./types/ethers-contracts/factories/contracts/EscrowFactory__factory");
var Escrow__factory_1 = require("./types/ethers-contracts/factories/contracts/Escrow__factory");
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
var provider = new ethers_1.ethers.providers.JsonRpcProvider('http://localhost:8545');
var arbiterKey = (_a = process.env.ARBITER_KEY) !== null && _a !== void 0 ? _a : ethers_1.ethers.constants.AddressZero;
var arbiterWallet = new ethers_1.ethers.Wallet(arbiterKey, provider);
console.log('arbiter address: ', arbiterWallet.address);
var gamewinners;
var metadata;
var settings;
var gameEndResult;
var currentEscrow;
var game;
var initialized;
var gameEnded;
var getCurrentGameEscrow = function (settings) { return __awaiter(void 0, void 0, void 0, function () {
    var EscrowFactory, player1Id, player2Id, p1p2GameFilter, p1p2Events, p2p1GameFilter, p2p1Events, events, latestEvent, currentGameEscrowAddress, contractPlayer1Address, contractPlayer2Address, EscrowContract;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                EscrowFactory = EscrowFactory__factory_1.EscrowFactory__factory.connect((_a = process.env.ESCROW_FACTORY_ADDRESS) !== null && _a !== void 0 ? _a : ethers_1.ethers.constants.AddressZero, arbiterWallet);
                console.log('Got EscrowFactory contract');
                console.log('EscrowFactory address: ', EscrowFactory.address);
                player1Id = settings.players[0].connectCode;
                console.log('player1Id: ', player1Id);
                player2Id = settings.players[1].connectCode;
                console.log('player2Id: ', player2Id);
                p1p2GameFilter = EscrowFactory.filters.EscrowCreated(player1Id, null, player2Id, null, null);
                return [4 /*yield*/, EscrowFactory.queryFilter(p1p2GameFilter)];
            case 1:
                p1p2Events = _b.sent();
                p2p1GameFilter = EscrowFactory.filters.EscrowCreated(player2Id, null, player1Id, null, null);
                return [4 /*yield*/, EscrowFactory.queryFilter(p2p1GameFilter)];
            case 2:
                p2p1Events = _b.sent();
                events = __spreadArray(__spreadArray([], p1p2Events, true), p2p1Events, true);
                latestEvent = events.reduce(function (mostRecent, curEvent) {
                    return mostRecent === undefined || curEvent.blockNumber > mostRecent.blockNumber ? curEvent : mostRecent;
                });
                console.log('latestEvent: ', latestEvent);
                currentGameEscrowAddress = latestEvent.args[4];
                console.log('currentGameEscrowAddress: ', currentGameEscrowAddress);
                contractPlayer1Address = latestEvent.args[1];
                console.log('contractPlayer1Address: ', contractPlayer1Address);
                contractPlayer2Address = latestEvent.args[3];
                console.log('contractPlayer2Address: ', contractPlayer2Address);
                EscrowContract = Escrow__factory_1.Escrow__factory.connect(currentGameEscrowAddress, arbiterWallet);
                console.log('\n');
                return [2 /*return*/, EscrowContract];
        }
    });
}); };
// 0 start game
// 1 get escrow contract when new game starts
// 2 call startGame on escrow contract
// 3 wait and let game play out
// 4 call endGame on escrow contract when game ends
var handleChange = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var gameStarted, e_1, endTypes, endMessage, lrasText, winningPlayer, winnerId, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Create SlippiGame object
                if (!game) {
                    console.log("New game file at: ".concat(path));
                    // Make sure to enable `processOnTheFly` to get updated stats as the game progresses
                    game = new slippi_js_1.SlippiGame(path, { processOnTheFly: true });
                }
                settings = game.getSettings();
                metadata = game.getMetadata();
                gameEndResult = game.getGameEnd();
                gamewinners = game.getWinners();
                if (!(settings && !initialized)) return [3 /*break*/, 6];
                initialized = true;
                // 1 When game has started, get the Escrow contract
                console.log("[Slippi] GameStarted");
                console.log('\n');
                if (!!currentEscrow) return [3 /*break*/, 6];
                return [4 /*yield*/, getCurrentGameEscrow(settings)];
            case 1:
                currentEscrow = _a.sent();
                return [4 /*yield*/, currentEscrow.gameStarted()];
            case 2:
                gameStarted = _a.sent();
                console.log('Game started?: ', gameStarted);
                if (!!gameStarted) return [3 /*break*/, 6];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                console.log('Starting game on Escrow contract');
                return [4 /*yield*/, currentEscrow.startGame()];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                console.error('Error Starting Game: ', e_1);
                return [3 /*break*/, 6];
            case 6:
                if (!(!gameEnded && gameEndResult && gamewinners.length !== 0 && metadata)) return [3 /*break*/, 10];
                gameEnded = true;
                console.log('[Slippi] GameEnded');
                console.log('\n');
                endTypes = {
                    1: 'TIME!',
                    2: 'GAME!',
                    7: 'No Contest'
                };
                endMessage = (0, lodash_1.get)(endTypes, gameEndResult.gameEndMethod) || 'Unknown';
                lrasText = gameEndResult.gameEndMethod === 7
                    ? " | Quitter Index: ".concat(gameEndResult.lrasInitiatorIndex)
                    : '';
                console.log("[Slippi] GameEndType: ".concat(endMessage).concat(lrasText));
                winningPlayer = metadata.players[gamewinners[0].playerIndex];
                winnerId = winningPlayer.names.code;
                console.log('[Slippi] Winning player: ', winningPlayer);
                console.log('[Slippi] winnerId: ', winnerId);
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                console.log('[MoneyMatch] Ending game');
                return [4 /*yield*/, currentEscrow.endGame(winnerId)];
            case 8:
                _a.sent();
                process.exit(0);
                return [3 /*break*/, 10];
            case 9:
                e_2 = _a.sent();
                console.error('[MoneyMatch] Error Ending Game: ', e_2);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
// Watch for new game
var listenPath = "".concat(os.homedir(), "/Slippi/");
console.log("Listening for slippi games at: ".concat(listenPath));
var watcher = chokidar.watch(listenPath, {
    ignored: '!*.slp',
    depth: 0,
    persistent: true,
    usePolling: true,
    ignoreInitial: true
});
// prod
watcher.on('change', function (path) {
    // handleChange('/Users/machine/Slippi/Game_20230222T120712.slp');
    handleChange(path);
});
