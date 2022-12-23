import { connection } from "../database/db.js";

export async function getRanking(req, res) {
  try {
    const ranking = await connection.query(
      `SELECT 
            u.id, 
            u.name, 
            COUNT(l."visitCount") AS "linksCount", 
            COALESCE(SUM(l."visitCount"),0) AS "visitCount" 
        FROM users AS u 
        LEFT JOIN urls AS l ON l."userId" = u.id 
        GROUP BY u.id 
        ORDER BY COALESCE(SUM(l."visitCount"),0) DESC 
        LIMIT 10;`
    );
    return res.send(ranking.rows).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
