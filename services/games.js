import { ObjectId } from "mongodb";
import { db, client } from "../services/mongo.js";
const GamesCollection = db.collection("games");

import GamesVotesService from "../services/gamesVotes.js";
import filterQueryToMongo from "../helpers/filterQuery.js";

/**
 * Obtiene todos los documentos pertenecientes a la collección "games" aplicando un filtro
 *
 * @param {{}} [filter={}]  Filter Object
 * @returns { Array }   Games Array
 */
async function getAllGames(filter = {}) {
  await client.connect();
  const filterMongo = filterQueryToMongo(filter);
  return GamesCollection.find(filterMongo).toArray();
}

/**
 * Obtiene los juegos filtrandolos segun año de edición y filtrandolos por otro criterio de ser necesario.
 *
 * @param {string} jam_edition - Edición de la jam.
 * @param {object} filter - Filtro opcional para los juegos.
 * @returns {array} Array de games ordenado por puntuación total.
 */
async function getGamesByEdition(jam_edition, filter = {}) {
  await client.connect();

  filter.edition = jam_edition;

  const filterMongo = filterQueryToMongo(filter);

  const games = await GamesCollection.find(filterMongo).sort({ "totalScore" : -1 }).toArray();

  return games;
}

/**
 * Obtiene un juego por su ID y calcula el promedio de votos.
 *
 * @param {string} id - El ID del juego.
 * @returns {Array} - Array que contiene los datos del juego y los puntajes promedio.
 */
async function getGameByIdAndAverageVotes(id) {
  await client.connect();

  const game = await GamesCollection.findOne({ _id: new ObjectId(id) });

  const votes = await GamesVotesService.findVotesByGame(id);

  let requested_data = [];

  let averageScores = {
    gameplay: 0,
    art: 0,
    sound: 0,
    thematic_affinity: 0,
  };

  const totalVotes = votes.length;

  if (totalVotes > 0) {
    for (let vote of votes) {
      averageScores.gameplay += vote.gameplay;
      averageScores.art += vote.art;
      averageScores.sound += vote.sound;
      averageScores.thematic_affinity += vote.thematic_affinity;
    }

    averageScores.gameplay /= totalVotes;
    averageScores.art /= totalVotes;
    averageScores.sound /= totalVotes;
    averageScores.thematic_affinity /= totalVotes;
  }

  const data = {
    ...game,
    averageScores,
  };

  requested_data.push(data);

  return requested_data;
}

/**
 * Obtiene un juego por su ID
 *
 * Conecta al cliente con la base de datos y devuelve el juego correspondiente al ID proporcionado
 *
 * @param {string} id           ID del juego a buscar
 * @returns {Promise<object>}   Objeto del juego correspondiente al ID proporcionado
 */
async function getGameById(id) {
  await client.connect();
  return GamesCollection.findOne({ _id: new ObjectId(id) });
}

/**
 * Agrega un nuevo juego
 *
 * Conecta al cliente con la base de datos y luego inserta un nuevo juego en la collección "games"
 *
 * @returns { newGame } Nuevo juego
 */
async function addGame(game) {
  await client.connect();
  const newGame = { ...game, totalScore: 0 };
  await GamesCollection.insertOne(newGame);
  return newGame;
}

/**
 * Edita un juego
 *
 * Conecta al cliente con la base de datos y luego actualiza un nuevo juego existente en la collección "games"
 *
 * @param {string} id      ID del juego a editar
 * @param {object} game    Objeto que contiene los datos actualizados del juego
 * @returns {object}       Juego editado
 */
async function editGame(id, game) {
  await client.connect();
  await GamesCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...game } }
  );
  const editedGame = await getGameById(id);
  return editedGame;
}

/**
 * Elimina un juego
 *
 * Conecta al cliente con la base de datos y luego elimina el juego correspondiente al ID proporcionado
 *
 * @param {string} id      ID del juego a eliminar.
 * @returns {object}       Juego eliminado
 */
async function deleteGame(id) {
  await client.connect();
  const deletedGame = await getGameById(id);
  await GamesCollection.deleteOne({ _id: new ObjectId(id) });
  return deletedGame;
}

export default {
  getAllGames,
  getGamesByEdition,
  getGameByIdAndAverageVotes,
  getGameById,
  addGame,
  editGame,
  deleteGame,
};
