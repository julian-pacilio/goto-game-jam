import AccountsService from "../services/accounts.js";

async function createAccount(req, res) {
  return AccountsService.createAccount(req.body)
    .then(function (account) {
      res.status(201).json(account);
    })
    .catch(function (err) {
      res.status(500).json({
        message: `Error al crear la cuenta`,
        error: err,
      });
    });
}

async function login(req, res) {
  return AccountsService.createSession(req.body)
    .then(function (session) {
      res.status(200).json(session);
    })
    .catch(function (err) {
      res.status(500).json({
        message: `Error al iniciar sesión`,
        error: err,
      });
    });
}

async function logout(req, res) {
  return AccountsService.deleteSession(req.token)
    .then(function () {
      res.status(200).json({ message: `Sesión cerrada con éxito`,});
    })
    .catch(function (err) {
      res.status(404).json({
        message: `Error al cerrar sesión`,
        error: err,
      });
    });
}


export default {
  createAccount,
  login,
  logout
};
