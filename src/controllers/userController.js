import { connection } from "../database/db.js";

export async function getUserData(req, res) {
  const userId = res.locals.userId;
  try {
    const data = await connection.query(
      `SELECT u.id, u.name, SUM(l."visitCount") AS "visitCount", (SELECT json_agg(urls) FROM ( SELECT l.id, l.url, l."shortUrl", l."visitCount" FROM urls AS l WHERE l."userId" = u.id ) urls) AS "shortenedUrls" FROM users AS u JOIN urls AS l ON l."userId" = u.id WHERE "userId"=$1 GROUP BY u.id;`,
      [userId]
    );
    return res.send(data.rows[0]).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
