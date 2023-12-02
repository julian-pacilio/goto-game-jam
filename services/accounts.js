import { db, client } from "./mongo.js";
const AccountsCollection = db.collection("accounts");
const TokensCollection = db.collection("tokens");
const JudgesCollection = db.collection("judges");

import { passwordHash, verifyPassword } from "../helpers/password.js";
import Jwt from "jsonwebtoken";

/**
 * Crea una nueva cuenta en la colección de cuentas.
 * Conecta al cliente a la base de datos, crea un nuevo objeto de cuenta con los datos proporcionados y la contraseña cifrada,
 * y luego inserta la nueva cuenta en la colección. Finalmente, devuelve la nueva cuenta creada.
 *
 * @param {Object} account - Objeto que contiene los datos de la cuenta a crear.
 * @returns {Object} Objeto de la nueva cuenta creada.
 */
async function createAccount(account) {
  await client.connect();

  const newAccount = {
    name: account.name,
    surname: account.surname,
    email: account.email,
    password: await passwordHash(account.password),
    rol: "user",
  };

  await AccountsCollection.insertOne(newAccount);
  return newAccount;
}

/**
 * Crea una sesión.
 * @param {Object} account - Objeto que representa una cuenta.
 * @returns {Object} - Objeto que contiene la cuenta verificada y un token de sesión.
 */
async function createSession(account) {
  return {
    account: await verifyAccount(account),
    token: await createToken({ ...account, password: undefined }),
  };
}

/**
 * Elimina una sesión de un token.
 * Conecta al cliente y elimina un documento de la colección TokensCollection
 * que coincida con el token proporcionado.
 */
async function deleteSession(token) {
  await client.connect();
  TokensCollection.deleteOne({ token });
}

/**
 * Función asincrónica para crear un token utilizando la biblioteca Jwt y guardarlo en la colección TokensCollection.
 * @param {Object} payload - Datos utilizados para generar el token.
 * @returns {string} Token generado.
 */
async function createToken(payload) {
  const token = Jwt.sign(payload, "secret_key");
  TokensCollection.insertOne({ token, email: payload.email });
  return token;
}

/**
 * Verifica una cuenta de usuario.
 *
 * @param {object} account - La cuenta de usuario a verificar.
 * @returns {object} La cuenta verificada sin la contraseña.
 * @throws {object} Error si el email no está registrado o la contraseña es incorrecta.
 */
async function verifyAccount(account) {
  await client.connect();

  let accountData = await validateAccountExistance(account.email);

  let passwords = {
    hashedPassword: accountData.password,
    password: account.password,
  };

  if (!accountData) {
    throw { message: `El email ${account.email} no se encuentra registrado` };
  }

  if (!(await verifyPassword(passwords))) {
    throw { message: `El password es incorrecto` };
  }

  return { account: { ...accountData, password: undefined } };
}

/**
 * Verifica un token y devuelve el payload del token.
 * @param {string} token - El token a verificar.
 * @returns {object} Payload del token.
 * @throws {object} Un objeto con un mensaje si el token no existe en la base de datos.
 */
async function verifyToken(token) {
  await client.connect();

  const payload = Jwt.verify(token, "secret_key");

  if (!(await TokensCollection.findOne({ token }))) {
    throw { message: "El Token no existe en la Base de Datos" };
  }

  return payload;
}

/**
 * Valida la existencia de una cuenta en función de una dirección de correo electrónico.
 * @param {string} email - La dirección de correo electrónico a buscar.
 * @returns {Promise} Una promesa que se resuelve con la cuenta encontrada, o undefined si no se encuentra ninguna cuenta.
 */
async function validateAccountExistance(email) {
  await client.connect();
  if (email.includes("judge")) {
    return JudgesCollection.findOne({ email: email });
  } else {
    return AccountsCollection.findOne({ email: email });
  }
}

export default {
  createAccount,
  createSession,
  deleteSession,
  validateAccountExistance,
  verifyToken,
};
