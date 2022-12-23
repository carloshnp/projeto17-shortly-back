import bcrypt from "bcrypt";
import { connection } from "../database/db.js";
import { loginSchema, userSchema } from "../schemas/authSchema.js";

export async function validateSignUp(req, res, next) {
  const { name, email, password, confirmPassword } = req.body;
  const validation = userSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message);
    console.log(error);
    return res.sendStatus(422);
  }
  if (confirmPassword !== password) {
    return res.status(422).send("Passwords don't match!");
  }
  try {
    const userExists = await connection.query(
      "SELECT * FROM users WHERE email=$1;",
      [email]
    );
    if (userExists.rows[0]) {
      return res.sendStatus(409);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
  res.locals.auth = { name, email, password };
  next();
}

export async function validateSignIn(req, res, next) {
  const { email, password } = req.body;
  // os campos estão preenchidos?
  // os campos são email e senha? (usar schema)
  const validation = loginSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message);
    console.log(error);
    return res.sendStatus(422);
  }
  try {
    // o usuário existe?
    const userExists = await connection.query(
      "SELECT * FROM users WHERE email=$1;",
      [email]
    );
    if (!userExists.rows[0]) {
      return res.sendStatus(401);
    }
    // a senha é válida?
    const validatePassword = bcrypt.compareSync(
      password,
      userExists.rows[0].password
    );
    if (!validatePassword) {
      return res.sendStatus(401);
    }
    res.locals.userId = userExists.rows[0].id;
    // o usuário já está logado?
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
