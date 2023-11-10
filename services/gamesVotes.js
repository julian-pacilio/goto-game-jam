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
    game_id: new ObjectId(idGame),
  }).toArray();

  let requested_data = [];

  for (let vote of votes) {
    const judge = await JudgesService.getJudgeById(vote.judge_id);

    const data = {
      judge_name: judge.name,
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
    judge_id: idJudge,
  }).toArray();

  let requested_data = [];

  for (let vote of votes) {
    const game = await GamesService.getGameById(vote.game_id);

    const data = {
      game_name: game.name,
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

  const newVote = { ...vote, game_id: new ObjectId(idGame) };
  await GamesVotesCollection.insertOne(newVote);

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
    judge_id: idJudge,
    game_id: new ObjectId(idGame),
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
