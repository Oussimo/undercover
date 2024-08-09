import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase/firebase";
import { submitVote } from "../utils/gameLogic";

const VotingScreen = () => {
	const { gameCode } = useParams();
	const [game, setGame] = useState(null);
	const [players, setPlayers] = useState({});
	const [selectedPlayer, setSelectedPlayer] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const gameRef = ref(db, `games/${gameCode}`);
		onValue(gameRef, (snapshot) => {
			const data = snapshot.val();
			setGame(data);
			setPlayers(data.players || {});

			const allVotesSubmitted =
				Object.keys(data.rounds[data.currentRound]?.votes || {}).length ===
				Object.keys(data.players).length;
			if (allVotesSubmitted) {
				navigate(`/game/${gameCode}`);
			}
		});

		return () => off(gameRef);
	}, [gameCode, navigate]);

	const handleVote = async () => {
		if (selectedPlayer) {
			await submitVote(
				gameCode,
				localStorage.getItem("playerId"),
				selectedPlayer,
			);
		}
	};

	if (!game) return <div>Loading...</div>;

	return (
		<div>
			<h1>Voting Screen</h1>
			<h2>Who do you think is the Undercover?</h2>
			<select
				value={selectedPlayer}
				onChange={(e) => setSelectedPlayer(e.target.value)}
			>
				<option value="">Select a player</option>
				{Object.entries(players).map(([playerId, player]) => (
					<option key={playerId} value={playerId}>
						{player.username}
					</option>
				))}
			</select>
			<button onClick={handleVote}>Submit Vote</button>
		</div>
	);
};

export default VotingScreen;
