import GamesVotesService from "../services/gamesVotes.js";

function getVotesByGame(req, res) {
  const { idGame } = req.params;

  GamesVotesService.findVotesByGame(idGame)
    .then(function (votes) {
      res.status(200).json(votes);
    })
    .catch(function (err) {
      res.status(404).json({ 
        message: `No se encuentran los votos pertenecientes al juego #${idGame}`, 
        error: err 
      });
    });
}

function getVotesByJudge(req, res) {
  const { idJudge } = req.params;

  GamesVotesService.findVotesByJudge(idJudge)
    .then(function (votes) {
      res.status(200).json(votes);
    })
    .catch(function (err) {
      res.status(404).json({ 
        message: `No se encuentran los votos pertenecientes al juez #${idJudge}`, 
        error: err 
      });
    });
}

async function addVote(req, res) {
  const { idGame } = req.params;

  return GamesVotesService.addVote(idGame, req.body)
    .then(function (vote) {
        res.status(201).json(vote);
    })
    .catch(function (err) {
        res.status(500).json({ 
          message: `Error al añadir el voto para el juego #${idGame}`, 
          error: err  
        });
    });
}

export default {
  getVotesByGame,
  getVotesByJudge,
  addVote,
};

