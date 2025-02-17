const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('conf.json'));
conf.db.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');

const connection = mysql.createConnection(conf.db);

const executeQuery = (sql) => {
   return new Promise((resolve, reject) => {
      connection.query(sql, function (err, result) {
         if (err) {
            console.error(err);
            reject();
         }
         console.log('done');
         resolve(result);
      });
   })
}

const database = {
   createTables: async () => {
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS type (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name varchar(20)
        )
      `);
      return await executeQuery(`
        CREATE TABLE IF NOT EXISTS booking (
        id int PRIMARY KEY AUTO_INCREMENT,
        idType int NOT NULL,
        date DATE NOT NULL,
        hour INT NOT NULL,
        name VARCHAR(50),
        FOREIGN KEY (idType) REFERENCES type(id));`);
   },
   insert: async (booking) => {
      let sql = `
         INSERT INTO booking(idType, date, hour, name)
         VALUES (${booking.idType},STR_TO_DATE('${booking.date}', '%Y-%m-%d'),${booking.hour},'${booking.name}');`;
      const result = await executeQuery(sql);
   },
   delete: (id) => {
      let sql = `
        DELETE FROM booking
        WHERE id=${id}
           `;
      return executeQuery(sql);
   },
   selectBookings: async () => {
      let sql = `
        SELECT b.id, t.name type, b.date, b.hour, b.name
        FROM booking AS b
        JOIN type as t ON b.idType = t.id
           `;
      const result = await executeQuery(sql);
      return result;
   },
   selectTypes: async () => {
      const result = await executeQuery("SELECT name FROM type");
      return result;
   },
   drop: async () => {
      let sql = `
            DROP TABLE IF EXISTS type
           `;
      await executeQuery(sql);
      sql = `
            DROP TABLE IF EXISTS booking
           `;
      await executeQuery(sql);
   }
}

module.exports = database;