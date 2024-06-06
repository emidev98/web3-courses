// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "./Achievement.sol";
import "./Point.sol";

abstract contract TicTacToe is VRFConsumerBaseV2 {
    struct Game {
        address player1;
        address player2;
        address lastPlayer;
        address winner;
        uint[4][4] coords;
    }
    Game[] games;
    mapping(address => uint) wins;
    mapping(uint => uint) gamesRequestIds;
    Achievement achievement;
    Point point;
    VRFCoordinatorV2Interface vrfCoordinator;
    uint64 subscriptionID;

    constructor(address achievementAddress, address pointsAddress, address vrfCoordinatorAddress, uint64 subId) 
    VRFConsumerBaseV2(vrfCoordinatorAddress) {
        achievement = Achievement(achievementAddress);
        point = Point(pointsAddress);
        vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorAddress);
        subscriptionID = subId;

    }

    function startGame(address p1, address p2) public returns (uint) {
        require(p1 != p2, "Players must be different");

        uint gameId = games.length;
        Game memory game;
        game.player1 = p1;
        game.player2 = p2;
        games.push(game);

        uint256 requestId = vrfCoordinator.requestRandomWords(
            0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c,
            subscriptionID,
            3,
            100_000,
            1
        );

        gamesRequestIds[gameId] = requestId;

        return gameId;
    }

    function fullfillRandomWords(uint256 _requestId, uint256[] memory _randomness) internal {
        uint matchId = gamesRequestIds[_requestId];
        uint random = _randomness[0];
        
        if (random % 2 == 0) {
            games[matchId].lastPlayer = games[matchId].player1;
        } else {
            games[matchId].lastPlayer = games[matchId].player2;
        }
    }

    function play(uint gameId, uint x, uint y) public {
        Game memory game = games[gameId];
        require(
            msg.sender == game.player1 || msg.sender == game.player2,
            "You are not a player"
        );
        require(x > 0 && x < 4 && y > 0 && y < 4, "Invalid coordinates");
        require(game.lastPlayer != msg.sender, "It's not your turn");
        require(game.coords[x][y] == 0, "Cell is already taken");
        require(!isGameOver(game), "Game is over");
        require(game.lastPlayer != address(0), "Game has not started yet");

        game = saveMove(gameId, x, y);

        uint winner = checkWinner(game);
        saveWinner(gameId, winner);

        games[gameId].lastPlayer = msg.sender;
    }

    function isGameOver(Game memory game) private pure returns (bool) {
        if (game.winner != address(0)) return true;

        for (uint x = 1; x < 4; x++) {
            for (uint y = 1; y < 4; y++) {
                if (game.coords[x][y] == 0) return false;
            }
        }

        return true;
    }

    function saveMove(
        uint gameId,
        uint x,
        uint y
    ) private returns (Game memory) {
        Game storage game = games[gameId];
        game.coords[x][y] = game.lastPlayer == game.player1 ? 1 : 2;

        return game;
    }

    function checkWinner(Game memory game) private pure returns (uint) {
        // Check \
        uint winner = checkCross(game.coords, 1, 1, 2, 2, 3, 3);

        // Check /
        if (winner == 0) winner = checkCross(game.coords, 1, 3, 2, 2, 3, 1);

        // Check rows
        for (uint i = 1; i < 4; i++) {
            if (winner == 0) winner = checkCross(game.coords, i, 1, i, 2, i, 3);
        }

        // Check columns
        for (uint i = 1; i < 4; i++) {
            if (winner == 0) winner = checkCross(game.coords, 1, i, 2, i, 3, i);
        }

        return 0;
    }

    function checkCross(
        uint[4][4] memory coords,
        uint x1,
        uint y1,
        uint x2,
        uint y2,
        uint x3,
        uint y3
    ) private pure returns (uint) {
        if (
            coords[x1][y1] == coords[x2][y2] && coords[x2][y2] == coords[x3][y3]
        ) {
            return coords[x1][y1];
        }
        return 0;
    }

    function saveWinner(uint winner, uint gameId) private {
        Game storage game = games[gameId];

        if (winner != 0) {
            if (winner == 1) {
                game.winner = game.player1;
            } else if (winner == 2) {
                game.winner = game.player2;
            }

            wins[game.winner]++;
            if (wins[game.winner] % 5 == 0) {
                achievement.emitAchievement(game.winner);
            }
            
            if (achievement.balanceOf(game.winner) == 0) {
                point.mint(game.winner, 2);
            } else {
                point.mint(game.winner, 1);
            }
        }
    }
}
