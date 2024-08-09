import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGame, addPlayer } from "../utils/gameLogic";

const Home = () => {
	const [playerName, setPlayerName] = useState("");
	const [gameCode, setGameCode] = useState("");
	const [totalRounds, setTotalRounds] = useState(3);
	const [undercoverCount, setUndercoverCount] = useState(1);
	const navigate = useNavigate();

	const handleCreateGame = async () => {
		const newGameCode = await createGame(
			playerName,
			totalRounds,
			undercoverCount,
		);
		navigate(`/lobby/${newGameCode}`);
	};

	const handleJoinGame = async () => {
		await addPlayer(gameCode, playerName);
		navigate(`/lobby/${gameCode}`);
	};

	return (
		<div>
			<h1>Undercover Game</h1>
			<input
				type="text"
				placeholder="Your Name"
				value={playerName}
				onChange={(e) => setPlayerName(e.target.value)}
			/>
			<h2>Create Game</h2>
			<input
				type="number"
				placeholder="Total Rounds"
				value={totalRounds}
				onChange={(e) => setTotalRounds(parseInt(e.target.value))}
			/>
			<input
				type="number"
				placeholder="Undercover Count"
				value={undercoverCount}
				onChange={(e) => setUndercoverCount(parseInt(e.target.value))}
			/>
			<button onClick={handleCreateGame}>Create Game</button>
			<h2>Join Game</h2>
			<input
				type="text"
				placeholder="Game Code"
				value={gameCode}
				onChange={(e) => setGameCode(e.target.value)}
			/>
			<button onClick={handleJoinGame}>Join Game</button>
		</div>
	);
};

export default Home;
