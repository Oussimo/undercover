import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase/firebase";

const ScoreScreen = () => {
	const { gameCode } = useParams();
	const [game, setGame] = useState(null);
	const [players, setPlayers] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		const gameRef = ref(db, `games/${gameCode}`);
		onValue(gameRef, (snapshot) => {
			const data = snapshot.val();
			setGame(data);
			setPlayers(data.players || {});
		});

		return () => off(gameRef);
	}, [gameCode]);

	const handlePlayAgain = () => {
		navigate("/");
	};

	if (!game) return <div>Loading...</div>;

	const undercoverWins = Object.values(players).some(
		(player) => player.isUndercover && !player.isEliminated,
	);

	return (
		<div>
			<h1>Game Over</h1>
			<h2>{undercoverWins ? "Undercover Wins!" : "Citizens Win!"}</h2>
			<h3>Player Results:</h3>
			<ul>
				{Object.entries(players).map(([playerId, player]) => (
					<li key={playerId}>
						{player.username}: {player.isUndercover ? "Undercover" : "Citizen"}
						{player.isEliminated ? " (Eliminated)" : ""}
					</li>
				))}
			</ul>
			<button onClick={handlePlayAgain}>Play Again</button>
		</div>
	);
};

export default ScoreScreen;
