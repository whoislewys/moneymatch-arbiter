"use strict";
/// Stream game events, watch for game end event, push signed game results to proper Escrow contract
// const { SlippiGame } = require('@slippi/slippi-js');
// const os = require('os');
// const chokidar = require('chokidar');
// const _ = require('lodash');
// const { ethers } = require('ethers');
// const { EscrowFactory__factory } = require('./types/ethers-contracts/factories/contracts/EscrowFactory__factory.ts');
// require('dotenv').config();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
exports.__esModule = true;
var slippi_js_1 = require("@slippi/slippi-js");
var os = require("os");
var chokidar = require("chokidar");
var lodash_1 = require("lodash");
var ethers_1 = require("ethers");
var EscrowFactory__factory_1 = require("./types/ethers-contracts/factories/contracts/EscrowFactory__factory");
var Escrow__factory_1 = require("./types/ethers-contracts/factories/contracts/Escrow__factory");
var dotenv = require("dotenv"); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
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
var listenPath = "".concat(os.homedir(), "/Slippi/");
console.log("Listening for slippi games at: ".concat(listenPath));
var watcher = chokidar.watch(listenPath, {
    ignored: '!*.slp',
    depth: 0,
    persistent: true,
    usePolling: true,
    ignoreInitial: true
});
var gameByPath = {};
watcher.on('change', function (path) {
    var _a;
    // TODO: see when game starts to call startGame() function on the Escrow conch;
    var start = Date.now();
    console.log('CHANGE EVENT');
    var gamewinners;
    var metadata;
    var gameState;
    var settings;
    var frames;
    var latestFrame;
    var gameEnd;
    try {
        var game = lodash_1["default"].get(gameByPath, [path, 'game']);
        if (!game) {
            // console.log(`New file at: ${path}`);
            // Make sure to enable `processOnTheFly` to get updated stats as the game progresses
            game = new slippi_js_1.SlippiGame(path, { processOnTheFly: true });
            gameByPath[path] = {
                game: game,
                state: {
                    settings: null,
                    detectedPunishes: {}
                }
            };
        }
        gameState = lodash_1["default"].get(gameByPath, [path, 'state']);
        settings = game.getSettings();
        metadata = game.getMetadata();
        frames = game.getFrames();
        latestFrame = game.getLatestFrame();
        gameEnd = game.getGameEnd();
        gamewinners = game.getWinners();
    }
    catch (err) {
        console.log(err);
        return;
    }
    if (!gameState.settings && settings) {
        console.log("[Game Start] New game has started");
        console.log(settings);
        gameState.settings = settings;
    }
    console.log("We have ".concat(lodash_1["default"].size(frames), " frames."));
    lodash_1["default"].forEach(settings.players, function (player) {
        var frameData = lodash_1["default"].get(latestFrame, ['players', player.playerIndex]);
        if (!frameData) {
            return;
        }
    });
    if (gameEnd) {
        // NOTE: These values and the quitter index will not work until 2.0.0 recording code is
        // NOTE: used. This code has not been publicly released yet as it still has issues
        var endTypes = {
            1: 'TIME!',
            2: 'GAME!',
            7: 'No Contest'
        };
        console.log('\n');
        var endMessage = lodash_1["default"].get(endTypes, gameEnd.gameEndMethod) || 'Unknown';
        var lrasText = gameEnd.gameEndMethod === 7
            ? " | Quitter Index: ".concat(gameEnd.lrasInitiatorIndex)
            : '';
        console.log("[Game Complete] Type: ".concat(endMessage).concat(lrasText));
    }
    if (gamewinners.length !== 0 && metadata) {
        var winningPlayer = metadata.players[gamewinners[0].playerIndex];
        var winnerId_1 = winningPlayer.names.code; // ex. JAWA#977
        // Get the current game's Escrow address by using ids of players to search through EscrowFactory event logs
        var EscrowFactory = EscrowFactory__factory_1.EscrowFactory__factory.connect((_a = process.env.ESCROW_FACTORY_ADDRESS) !== null && _a !== void 0 ? _a : ethers_1.ethers.constants.AddressZero, arbiterWallet);
        var player1Id = metadata.players[0].names.code;
        var player2Id = metadata.players[1].names.code;
        var currentGameFilter = EscrowFactory.filters.EscrowCreated(player1Id, null, player2Id, null, null);
        var currentGameLogs = EscrowFactory.queryFilter(currentGameFilter).then(function (events) {
            var latestEvent = events[events.length - 1];
            var currentGameEscrowAddress = latestEvent.args[4];
            var player1Id = latestEvent.args[0];
            var player1Address = latestEvent.args[1];
            var player2Id = latestEvent.args[2];
            var player2Address = latestEvent.args[3];
            // Get escrow contract for this game
            var EscrowContract = Escrow__factory_1.Escrow__factory.connect(currentGameEscrowAddress, arbiterWallet);
            // Sign game results in EIP-712 format
            var domain = {
                // Must match the signing domain in the contract
                name: 'MoneyMatch',
                version: '1',
                verifyingContract: currentGameEscrowAddress,
                chainId: 1337
            };
            var types = {
                GameResults: [{ name: 'winnerId', type: 'string' }]
            };
            var winner = {
                // winnerAddress: winnerId === player1Id ? player1Address : player2Address,
                winnerId: winnerId_1
            };
            arbiterWallet
                ._signTypedData(domain, types, winner)
                .then(function (signature) {
                var gameResults = __assign(__assign({}, winner), { signature: signature });
                EscrowContract.endGame(gameResults);
            });
        });
    }
});
