import { ObjectId } from "mongodb";
import { db, client } from "../services/mongo.js";
const GamesVotesCollection = db.collection("games_votes");

import JudgesService from "../services/judges.js";
import GamesService from "../services/games.js";

/**
 * Obtiene los votos de un juego por su ID.
 * @param {string} idGame - ID del juego.
 * @returns {Array} - Nombre del juez e información del voto.
 */
async function findVotesByGame(idGame) {
  await client.connect();

  const votes = await GamesVotesCollection.find({
    "game._id": new ObjectId(idGame),
  }).toArray();

  let requested_data = [];

  for (let vote of votes) {
    const data = {
      judge_name: vote.judge.name,
      gameplay: vote.gameplay,
      art: vote.art,
      sound: vote.sound,
      thematic_affinity: vote.thematic_affinity,
    };

    requested_data.push(data);
  }

  return requested_data;
}

/**
 * Obtiene los votos emitidos de un juez por su ID.
 * @param {string} idJudge - ID del juez.
 * @returns {Array} - Nombre del juego e información del voto.
 */
async function findVotesByJudge(idJudge) {
  await client.connect();

  const votes = await GamesVotesCollection.find({
    "judge._id": new ObjectId(idJudge),
  }).toArray();

  let requested_data = [];

  for (let vote of votes) {
    const data = {
      game_name: vote.game.name,
      gameplay: vote.gameplay,
      art: vote.art,
      sound: vote.sound,
      thematic_affinity: vote.thematic_affinity,
    };

    requested_data.push(data);
  }

  return requested_data;
}

/**
 * Genera un voto para un juego.
 *
 * @param {string} idGame - ID del juego.
 * @param {object} vote - Objeto con los datos del voto.
 * @returns {object} - Datos del nuevo voto agregado.
 */
async function addVote(idGame, vote) {
  await client.connect();

  const judge_data = await JudgesService.getJudgeById(vote.judge_id);
  const game_data = await GamesService.getGameById(idGame);

  const vote_data = {
    gameplay: vote.gameplay,
    art: vote.art,
    sound: vote.sound,
    thematic_affinity: vote.thematic_affinity,
  };

  const game = {
    _id: game_data._id,
    name: game_data.name,
  };

  const judge = {
    _id: judge_data._id,
    name: judge_data.name + " " + judge_data.surname,
  };

  const newVote = {
    ...vote_data,
    judge: { ...judge },
    game: { ...game },
  };

  await GamesVotesCollection.insertOne(newVote);

  let totalScore =
    game_data.totalScore +
    vote_data.gameplay +
    vote_data.art +
    vote_data.sound +
    vote_data.thematic_affinity;

  await GamesService.editGame(idGame, { totalScore: totalScore });

  return newVote;
}

/**
 * Valida la existencia de un juego y un juez.
 *
 * Conecta a un cliente y obtiene el juego y el juez por sus respectivos IDs.
 *
 * Devuelve un objeto con los IDs del juego y el juez como datos válidos.
 *
 * @param {Object} data - Objeto que contiene los IDs del juego y el juez a validar.
 * @returns {Object} Objeto que contiene los IDs del juego y el juez encontrados o null si no existen.
 */
async function validateGameandJudgeIdExists(data) {
  await client.connect();

  const idGame = await GamesService.getGameById(data.game_id);
  const idJudge = await JudgesService.getJudgeById(data.judge_id);

  const validData = { idGame: idGame, idJudge: idJudge };

  return validData;
}

/**
 * Verifica si existe un voto previo de un juez en un juego específico.
 *
 * @param {Object} data - Objeto que contiene el id del juez y el id del juego.
 * @returns {Object} - Objeto que contiene los datos del voto encontrado o null si no existe.
 */
async function checkPreviousJudgeVoteExists(data) {
  await client.connect();

  const idJudge = data.judge_id;
  const idGame = data.game_id;

  const vote = await GamesVotesCollection.findOne({
    "judge._id": new ObjectId(idJudge),
    "game._id": new ObjectId(idGame),
  });

  return vote;
}

export default {
  findVotesByGame,
  findVotesByJudge,
  addVote,
  validateGameandJudgeIdExists,
  checkPreviousJudgeVoteExists,
};
