import GamesService from "../services/games.js";

function getAllGames(req, res) {
  GamesService.getAllGames(req.query)
    .then(function (games) {
      res.status(200).json(games);
    })
    .catch(function (err) {
      res.status(404).json({ 
        message: `No se encuentran los juegos`, error: err 
      });
    });
}

function getGamesByEdition(req, res) {
  const { edition } = req.params;

  GamesService.getGamesByEdition(edition, req.query)
    .then(function (games) {
      res.status(200).json(games);
    })
    .catch(function (err) {
      res.status(404).json({
        message: `No se encuentran los juegos de la Jam Edición #${edition}`,
        error: err,
      });
    });
}

function getGameById(req, res) {
  const { idGame } = req.params;

  GamesService.getGameById(idGame)
    .then(function (game) {
      return res.status(200).json(game);
    })
    .catch(function (err) {
      res.status(404).json({ 
        message: `No se encuentra el juego #${idGame}`, 
        error: err 
      });
    });
}

function getGameByIdAndAverageVotes(req, res) {
  const { idGame } = req.params;

  GamesService.getGameByIdAndAverageVotes(idGame)
    .then(function (game) {
      return res.status(200).json(game);
    })
    .catch(function (err) {
      res.status(404).json({ 
        message: `No se encuentra el juego #${idGame}`, 
        error: err 
      });
    });
}

async function addGame(req, res) {
  return GamesService.addGame(req.body)
    .then(function (game) {
      res.status(201).json(game);
    })
    .catch(function (err) {
      res.status(500).json({ 
        message: `Error al añadir el juego `, 
        error: err 
      });
    });
}

async function editGame(req, res) {
  const { idGame } = req.params;

  GamesService.editGame(idGame, req.body)
    .then(function (game) {
      return res.status(200).json(game);
    })
    .catch(function (err) {
      res.status(500).json({ 
        message: `Error al editar el juego #${idGame}`, 
        error: err 
      });
    });
}

async function deleteGame(req, res) {
  const { idGame } = req.params;

  GamesService.deleteGame(idGame)
    .then(function (game) {
      return res.status(200).json(game);
    })
    .catch(function (err) {
      res.status(404).json({
        message: `No se encuenta el juego #${idGame}`,
        error: err,
      });
    });
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
