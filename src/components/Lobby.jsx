import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase/firebase";
import { startGame } from "../utils/gameLogic";

const Lobby = () => {
	const { gameCode } = useParams();
	const [game, setGame] = useState(null);
	const [players, setPlayers] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const gameRef = ref(db, `games/${gameCode}`);
		onValue(gameRef, (snapshot) => {
			const data = snapshot.val();
			setGame(data);
			setPlayers(Object.values(data.players || {}));

			if (data.status === "in_progress") {
				navigate(`/game/${gameCode}`);
			}
		});

		return () => off(gameRef);
	}, [gameCode, navigate]);

	const handleStartGame = () => {
		startGame(gameCode);
	};

	if (!game) return <div>Loading...</div>;

	return (
		<div>
			<h1>Game Lobby</h1>
			<h2>Game Code: {gameCode}</h2>
			<h3>Players:</h3>
			<ul>
				{players.map((player, index) => (
					<li key={index}>{player.username}</li>
				))}
			</ul>
			{game.hostId === localStorage.getItem("playerId") && (
				<button onClick={handleStartGame}>Start Game</button>
			)}
		</div>
	);
};

export default Lobby;
