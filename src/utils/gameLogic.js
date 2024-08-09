import { ref, push, set, get } from "firebase/database";
import { db } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";

const wordPairs = [
	{ citizen: "apple", undercover: "pear" },
	{ citizen: "dog", undercover: "cat" },
	// Add more word pairs here
];

export const createGame = async (hostName, totalRounds, undercoverCount) => {
	const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
	const gameRef = ref(db, `games/${gameCode}`);
	const hostId = uuidv4();

	await set(gameRef, {
		hostId,
		gameCode,
		status: "waiting",
		totalRounds,
		undercoverCount,
		currentRound: 1,
		createdAt: Date.now(),
	});

	await addPlayer(gameCode, hostName, hostId);

	return gameCode;
};

export const addPlayer = async (gameCode, playerName, playerId = uuidv4()) => {
	const playerRef = ref(db, `games/${gameCode}/players/${playerId}`);
	await set(playerRef, {
		username: playerName,
		isUndercover: false,
		isEliminated: false,
	});
	localStorage.setItem("playerId", playerId);
	return playerId;
};

export const startGame = async (gameCode) => {
	const gameRef = ref(db, `games/${gameCode}`);
	const gameSnapshot = await get(gameRef);
	const game = gameSnapshot.val();

	const players = Object.entries(game.players);
	const undercoverPlayers = players
		.sort(() => 0.5 - Math.random())
		.slice(0, game.undercoverCount);

	const wordPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];

	for (const [playerId, player] of players) {
		const isUndercover = undercoverPlayers.some(([id]) => id === playerId);
		const word = isUndercover ? wordPair.undercover : wordPair.citizen;
		await set(ref(db, `games/${gameCode}/players/${playerId}`), {
			...player,
			isUndercover,
			assignedWord: word,
		});
	}

	await set(ref(db, `games/${gameCode}/status`), "in_progress");
};

export const submitClue = async (gameCode, playerId, clue) => {
	const gameRef = ref(db, `games/${gameCode}`);
	const gameSnapshot = await get(gameRef);
	const game = gameSnapshot.val();

	const clueRef = ref(
		db,
		`games/${gameCode}/rounds/${game.currentRound}/clues/${playerId}`,
	);
	await set(clueRef, {
		clueText: clue,
		submittedAt: Date.now(),
	});
};

export const submitVote = async (gameCode, voterId, votedForId) => {
	const gameRef = ref(db, `games/${gameCode}`);
	const gameSnapshot = await get(gameRef);
	const game = gameSnapshot.val();

	const voteRef = ref(
		db,
		`games/${gameCode}/rounds/${game.currentRound}/votes/${voterId}`,
	);
	await set(voteRef, votedForId);
};

export const endRound = async (gameCode) => {
	const gameRef = ref(db, `games/${gameCode}`);
	const gameSnapshot = await get(gameRef);
	const game = gameSnapshot.val();

	const votes = game.rounds[game.currentRound].votes;
	const voteCount = Object.values(votes).reduce((acc, votedForId) => {
		acc[votedForId] = (acc[votedForId] || 0) + 1;
		return acc;
	}, {});

	const eliminatedPlayerId = Object.entries(voteCount).sort(
		(a, b) => b[1] - a[1],
	)[0][0];

	await set(
		ref(db, `games/${gameCode}/players/${eliminatedPlayerId}/isEliminated`),
		true,
	);

	const allUndercoversEliminated = Object.values(game.players).every(
		(player) => !player.isUndercover || player.isEliminated,
	);

	if (allUndercoversEliminated || game.currentRound === game.totalRounds) {
		await set(ref(db, `games/${gameCode}/status`), "completed");
	} else {
		await set(ref(db, `games/${gameCode}/currentRound`), game.currentRound + 1);
	}

	return eliminatedPlayerId;
};
