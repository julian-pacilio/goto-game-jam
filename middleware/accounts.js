import { AccountSchema, AccountLoginSchema } from "../schemas/accounts.js";
import AccountsService from "../services/accounts.js";

export function validateAccountCreate(req, res, next) {
  AccountSchema.validate(req.body, {
    stripUnknown: true,
    abortEarly: false,
  })
    .then(async function (user) {
      req.body = user;
      next();
    })
    .catch(function (err) {
      res
        .status(400)
        .json({
          message: `Error en el esquema del usuario`,
          error: err.errors,
        });
    });
}

export function validateAccountLogin(req, res, next) {
  AccountLoginSchema.validate(req.body, {
    stripUnknown: true,
    abortEarly: false,
  })
    .then(async function (user) {
      req.body = user;
      next();
    })
    .catch(function (err) {
      res
        .status(400)
        .json({
          message: `Error en el esquema del usuario`,
          error: err.errors,
        });
    });
}

export async function validateEmailIsNotRegistered(req, res, next) {
  const email = req.body.email;

  const email_verification = await AccountsService.validateAccountExistance(email);

  if (email_verification == null) {
    next();
  } else {
    res
      .status(400)
      .json({ message: `El email ${email} ya se encuentra registrado` });
  }
}

export async function validateEmailIsRegistered(req, res, next) {
  const email = req.body.email;

  const email_verification = await AccountsService.validateAccountExistance(email);

  if (email_verification != null) {
    next();
  } else {
    res
      .status(400)
      .json({ message: `El email ${email} no se encuentra registrado` });
  }
}

export function verifySession(req, res, next) {

  const token = req.headers["auth-token"]

  if(!token) {
    return res.status(401).json({ message: "Token no disponible"})
  }

  AccountsService.verifyToken(token)
    .then((payload) => {
      req.token = token
      req.session = payload
      next()
    })
    .catch(() => {
      return res.status(401).json({ message: "El Token no es válido"})
    })
}