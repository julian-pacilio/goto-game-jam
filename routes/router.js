import express from "express";

import GamesController from "../controllers/games.js";
import GameVotesController from "../controllers/gamesVotes.js";
import AccountsController from "../controllers/accounts.js";

import {
  validateVoteCreate,
  validateGameandJudgeIdExists,
  checkPreviousJudgeVoteExists,
} from "../middleware/votes.js";

import {
  validateAccountCreate,
  validateEmailIsNotRegistered,
  validateEmailIsRegistered,
  validateAccountLogin,
} from "../middleware/accounts.js";

import { verifySession } from "../middleware/accounts.js";

const route = express.Router();

route
  .route("/games")
  .get(GamesController.getAllGames)
  .post(GamesController.addGame);

route
  .route("/games/:idGame")
  .get(GamesController.getGameById)
  .patch(GamesController.editGame)
  .delete(GamesController.deleteGame);

route
  .route("/games/:idGame/average")
  .get(GamesController.getGameByIdAndAverageVotes);

route.route("/games/edition/:edition").get(GamesController.getGamesByEdition);

route
  .route("/games/:idGame/votes")
  .get(GameVotesController.getVotesByGame)
  .post(
    [
      validateVoteCreate,
      validateGameandJudgeIdExists,
      checkPreviousJudgeVoteExists,
    ],
    GameVotesController.addVote
  );

route.route("/judges/:idJudge/votes").get(GameVotesController.getVotesByJudge);

// Register
route
  .route("/api/account")
  .post(
    [validateAccountCreate, validateEmailIsNotRegistered],
    AccountsController.createAccount
  );

// Login
route
  .route("/api/session")
  .post(
    [validateAccountLogin, validateEmailIsRegistered],
    AccountsController.login
  )
  .delete([verifySession], AccountsController.logout);

export default route;
