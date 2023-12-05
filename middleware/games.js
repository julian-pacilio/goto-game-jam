import { gameSchema } from "../schemas/games.js";
import GamesService from "../services/games.js";

/**
 * Valida la creación de un juego.
 * 
 * Utiliza un esquema para validar el cuerpo de la solicitud.
 * 
 * Si la validación es exitosa, asigna el juego validado al cuerpo de la solicitud y pasa al siguiente middleware.
 * 
 * Si ocurre un error de validación, devuelve un mensaje de error con los errores específicos encontrados en el esquema del juego.
 */
export function validateGameCreate(req, res, next) {
    gameSchema
    .validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    })
    .then(async function (vote) {
      req.body = vote;
      next();
    })
    .catch(function (err) {
      res.status(400).json({ message: `Error en el esquema del juego`, error: err.errors });
    });
}

/**
 * Valida la existencia de un juego mediante su id.
 * 
 * Si existe, pasa al siguiente middleware.
 * 
 * Si el juego no existe, devuelve un mensaje de error.
 * 
 */
export async function validateGameIdExists(req, res, next) {

    const { idGame } = req.params;

    const validData = await GamesService.getGameById(idGame)

    console.log(validData)
    if(validData._id) {
        next()
    } else {
        res.status(400).json({ message: `Error al validar la existencia del juego #${idGame}`})
    }
}
