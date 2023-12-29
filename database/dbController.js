const db = require("./dbPool");

class databaseController {
    // async findUsers(email){
    //     return (await db.query(`SELECT * FROM person WHERE email = '${email}';`)).rows
    // }
    // async createUser(email, hashPassword, refreshToken){
    //     return (await db.query(
    //         'INSERT INTO person (email, password, refreshToken) VALUES ($1, $2, $3) RETURNING *',
    //         [email, hashPassword, refreshToken]
    //       )).rows[0]
    // }
    // async rewokeToken(refreshToken, email){
    //     return (await db.query(
    //         'UPDATE person SET refreshToken = $1 WHERE email = $2 RETURNING *',
    //         [refreshToken, email]
    //       ).catch(err =>{
    //         throw err
    //       }));
    // }
}
module.exports = new databaseController();
