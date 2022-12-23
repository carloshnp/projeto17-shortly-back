import { nanoid } from "nanoid";
import { connection } from "../database/db.js";

export async function shortenUrl(req, res) {
  const token = res.locals.auth;
  const { url } = res.locals.url;
  const shortenedUrl = nanoid(8);
  const visitCount = 0;
  try {
    console.log(token);
    const query = await connection.query(
      `SELECT "userId" FROM sessions WHERE token=$1;`,
      [token]
    );
    const userId = query.rows[0].userId;
    await connection.query(
      `INSERT INTO urls (url, "shortUrl", "visitCount", "userId") VALUES ($1, $2, $3, $4);`,
      [url, shortenedUrl, visitCount, userId]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getShortenedUrl(req, res) {
  const url = res.locals.search;
  res.send(url).status(201);
}

export async function redirectToShortenedUrl(req, res) {
  const { url } = res.locals.shortenedUrl;
  console.log(url);
  res.redirect(url)
}
