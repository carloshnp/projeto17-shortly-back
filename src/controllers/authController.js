import bcrypt from "bcrypt";
import { connection } from "../database/db.js";

export async function signUp(req, res) {
  const { name, email, password } = res.locals.auth;
  const passwordHash = bcrypt.hashSync(password, 10);
  try {
    await connection.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email, passwordHash]
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
