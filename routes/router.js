import express from "express";

import GamesController from "../controllers/games.js";
import GameVotesController from "../controllers/gamesVotes.js";
import AccountsController from "../controllers/accounts.js";

import {
  validateGameCreate,
  validateGameIdExists
} from "../middleware/games.js";

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
  .post([verifySession, validateGameCreate], GamesController.addGame);

route
  .route("/games/:idGame")
  .get([validateGameIdExists],GamesController.getGameById)
  .patch([verifySession, validateGameIdExists], GamesController.editGame)
  .delete([verifySession, validateGameIdExists], GamesController.deleteGame);

route
  .route("/games/:idGame/average")
  .get(GamesController.getGameByIdAndAverageVotes);

route.route("/games/edition/:edition").get(GamesController.getGamesByEdition);

route
  .route("/games/:idGame/votes")
  .get([validateGameIdExists], GameVotesController.getVotesByGame)
  .post(
    [
      verifySession,
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
