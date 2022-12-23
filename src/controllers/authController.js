import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
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
  let token;
  try {
    // verificar se o token existe
    let tokenExists = await connection.query(
      "SELECT * FROM sessions WHERE id=$1;",
      [userId]
    );
    // se não existe, adicionar o token
    if (tokenExists.rows[0]) {
      console.log("if");
      token = tokenExists.rows[0].token;
    } else {
      console.log("else");
      token = uuidV4();
      await connection.query(
        `INSERT INTO sessions ("userId", token) VALUES ($1, $2);`,
        [userId, token]
      );
    }
    // enviar o token + 200
    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
