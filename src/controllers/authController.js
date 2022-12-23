import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { connection } from "../database/db.js";

export async function signUp(req, res) {
  const { name, email, password } = res.locals.auth;
  const passwordHash = bcrypt.hashSync(password, 10);
  try {
    await connection.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email, passwordHash]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  // declarar id do usuário e token
  const userId = res.locals.userId;
  try {
    // verificar se o token existe
    let tokenExists = await connection.query(
      "SELECT token FROM users WHERE id=$1;",
      [userId]
    );
    // se não existe, adicionar o token
    if (!tokenExists) {
      const token = uuid();
      await connection.query("INSERT INTO users (token) VALUES ($1)", [token]);
      tokenExists = token;
    }
    // enviar o token + 200
    res.send(tokenExists).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
