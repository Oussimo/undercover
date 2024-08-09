import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase/firebase";
import { submitClue, endRound } from "../utils/gameLogic";

const Game = () => {
	const { gameCode } = useParams();
	const [game, setGame] = useState(null);
	const [players, setPlayers] = useState({});
	const [currentPlayer, setCurrentPlayer] = useState(null);
	const [clue, setClue] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const gameRef = ref(db, `games/${gameCode}`);
		onValue(gameRef, (snapshot) => {
			const data = snapshot.val();
			setGame(data);
			setPlayers(data.players || {});
			setCurrentPlayer(data.players[localStorage.getItem("playerId")]);

			if (data.status === "completed") {
				navigate(`/score/${gameCode}`);
			}
		});

		return () => off(gameRef);
	}, [gameCode, navigate]);

	const handleSubmitClue = async () => {
		await submitClue(gameCode, localStorage.getItem("playerId"), clue);
		setClue("");
	};

	const handleEndRound = async () => {
		await endRound(gameCode);
		navigate(`/voting/${gameCode}`);
	};

	if (!game || !currentPlayer) return <div>Loading...</div>;

	const allCluesSubmitted =
		Object.keys(game.rounds[game.currentRound]?.clues || {}).length ===
		Object.keys(players).length;

	return (
		<div>
			<h1>Undercover Game</h1>
			<h2>
				Round {game.currentRound} of {game.totalRounds}
			</h2>
			<h3>Your word: {currentPlayer.assignedWord}</h3>
			<input
				type="text"
				placeholder="Enter your clue"
				value={clue}
				onChange={(e) => setClue(e.target.value)}
			/>
			<button onClick={handleSubmitClue}>Submit Clue</button>
			<h3>Submitted Clues:</h3>
			<ul>
				{Object.entries(game.rounds[game.currentRound]?.clues || {}).map(
					([playerId, clueData]) => (
						<li key={playerId}>
							{players[playerId].username}: {clueData.clueText}
						</li>
					),
				)}
			</ul>
			{allCluesSubmitted && <button onClick={handleEndRound}>End Round</button>}
		</div>
	);
};

export default Game;
