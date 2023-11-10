import { voteCreateSchema } from "../schemas/votes.js";
import GamesVotesService from "../services/gamesVotes.js";

/**
 * Valida la creación de un voto.
 * 
 * Utiliza un esquema para validar el cuerpo de la solicitud.
 * 
 * Si la validación es exitosa, asigna el voto validado al cuerpo de la solicitud y pasa al siguiente middleware.
 * 
 * Si ocurre un error de validación, devuelve un mensaje de error con los errores específicos encontrados en el esquema del voto.
 */
export function validateVoteCreate(req, res, next) {
  voteCreateSchema
    .validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    })
    .then(async function (vote) {
      req.body = vote;
      next();
    })
    .catch(function (err) {
      res.status(400).json({ message: `Error en el esquema del voto`, error: err.errors });
    });
}

/**
 * Valida la existencia de un juego y un juez mediante sus id.
 * 
 * Si ambos existen, pasa al siguiente middleware.
 * 
 * Si el juego o el juez no existen, devuelve un mensaje de error.
 * 
 */
export async function validateGameandJudgeIdExists(req, res, next) {

    const { idGame } = req.params;
    const idJudge    = req.body.judge_id;

    const data = {
        game_id : idGame,
        judge_id : idJudge
    }

    const validData = await GamesVotesService.validateGameandJudgeIdExists(data)

    if(validData.idGame != null) {

        if(validData.idJudge != null) {
            next()
        } else {
            res.status(400).json({ message: `Error al validar la existencia del juez #${idJudge}`})
        }
    } else {
        res.status(400).json({ message: `Error al validar la existencia del juego #${idGame}`})
    }

}

/**
 * Verifica si un juez ha votado previamente en un juego.
 * 
 * Si no ha votado, pasa al siguiente middleware.
 * 
 * Si ya ha votado, devuelve un mensaje de error.
 */
export async function checkPreviousJudgeVoteExists(req, res, next) {

    const { idGame } = req.params;
    const idJudge    = req.body.judge_id;

    const data = {
        game_id : idGame,
        judge_id : idJudge
    }

    console.log(data)

    const previousVote = await GamesVotesService.checkPreviousJudgeVoteExists(data);

    console.log(previousVote)

    if(previousVote == null) {
        next()
    } else {
        res.status(400).json({ message: `El juez #${idJudge} ya cuenta con un voto registrado para el juego #${idGame}`})
    }
}