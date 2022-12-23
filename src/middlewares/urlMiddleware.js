// quem está enviando o body é um usuário? (header)

import { connection } from "../database/db.js";
import { urlSchema } from "../schemas/urlSchema.js";

export async function validateToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  const tokenExists = await connection.query(
    "SELECT * FROM sessions WHERE token=$1;",
    [token]
  );
  // existe a token?
  // o header é válido?
  if (!tokenExists.rows[0]) {
    return res.sendStatus(401);
  }
  res.locals.auth = token;
  next();
}

export function validateUrl(req, res, next) {
  // existe a url no body?
  // o body tem o formato certo? (schema)
  const url = req.body;
  const validation = urlSchema.validate(url, { abortEarly: false });
  if (validation.error) {
    const error = validation.error.details.map((detail) => detail.message);
    console.log(error);
    return res.sendStatus(422);
  }
  res.locals.url = url;
  next();
}

// a url já existe de forma encurtada por esse usuário?

export async function shortenedUrlExists(req, res, next) {
  const { id } = req.params;
  try {
    const idExists = await connection.query(
      `SELECT id, url, "shortUrl", "userId" FROM urls WHERE id=$1;`,
      [id]
    );
    if (!idExists.rows[0]) {
      res.sendStatus(404);
    }
    res.locals.search = idExists.rows[0];
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function validateShortenedUrl(req, res, next) {
  const { shortUrl } = req.params;
  try {
    const shortenedUrlExists = await connection.query(
      `SELECT * FROM urls WHERE "shortUrl"=$1;`,
      [shortUrl]
    );
    if (!shortenedUrlExists.rows[0]) {
      return res.sendStatus(404);
    }
    res.locals.shortenedUrl = shortenedUrlExists.rows[0];
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function updateVisitCount(req, res, next) {
  const { id } = res.locals.shortenedUrl;
  try {
    await connection.query(
      `UPDATE urls SET "visitCount"="visitCount"+1 WHERE id=$1;`,
      [id]
    );
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function isShortenedUrlFromUser(req, res, next) {
  const token = res.locals.auth;
  const { userId } = res.locals.search;
  const query = await connection.query(
    `SELECT "userId" FROM sessions WHERE token=$1;`,
    [token]
  );
  if (query.rows[0].userId !== userId) {
    return res.sendStatus(401);
  }
  next();
}
