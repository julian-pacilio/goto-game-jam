import { MongoClient } from "mongodb";

/**
 * Variable que almacena el string_connection utilizado como parametro para la instancia de MongoCLient()
 */
const connection_string = "mongodb://127.0.0.1:27017/";

/**
 * Crea una nueva instancia del cliente de MongoDB
 */
export const client = new MongoClient(connection_string);

/**
 * Exporta la base de datos "goto_game_jam" utilizando la variable "db".
 */
export const db = client.db("goto_game_jam");
