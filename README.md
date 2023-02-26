## How it Works

#### Basic in-a-day hack
1. set up bet contract between two players (id is combo of their slippi username + eth address). each player bets 0.001 eth
1. wait for game to start. if game not started in x amount of time, allow the players to claim a refund
1. get live game feed locally
1. on game end, post agreed upon .slp file to IPFS
1. based on results of gameend event, smart contract releases funds to winner


#### More featureful version:
1. set up bet contract between two players. p1 and p2 must connect to each other and agree on how much they want to bet
1. get live game feed locally
1. each player's live game feeds get synced over OrbitDB to ensre events line up
1. on game end, post agreed upon .slp file to IPFS
1. smart contract releases funds to winner


## Questions:
Q: how does the electron app pop you out into the browser then get that info back? or does it even get info back? i saw something about this in the slippi repo

Q: Easy way to tell off gameend event who won? or need to look at stocks? see example-endgame.txt

TODO: work on orbit to turn game events into crdt


#### Updated hack steps
1. Set up bet through web frontend, (sending link to coordinate params as necessary)
2. Play the game
    the arbiter server & the game. play through the end.
3. Winner claims winnings
    in the background, the arbiter process will find the bet contract between the two players created, watch the game state until a "GameEnded" state is reached, and set the winner depending on the result of the game. This allows the winner to claim their winnings

