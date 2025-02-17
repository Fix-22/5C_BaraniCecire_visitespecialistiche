const mysql = require('mysql2');

module.exports = function generateDBConnector(conf) {
    const connection = mysql.createConnection(conf);

    //funzione che permette di eseguire una query sul db prendedo una stringa come input
    const executeQuery = (sql) => {
        return new Promise((resolve, reject) => {      
            connection.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                    reject();
                }
                resolve(result);         
            });
        })
    };

    // crea tabella se non esiste

    return {
        insertURL: async (filename) => { //inserisce nella tabella l'url dell'immagine passata
            const template = "INSERT INTO image (url) VALUES ('$URL');";
            let sql = template.replace("$URL", "./images/" + filename);
            let r = await executeQuery(sql);   
            return r;
        },

        createTable: async()=>{
           return executeQuery(`
                CREATE TABLE IF NOT EXISTS image
                (id INT PRIMARY KEY AUTO_INCREMENT, url varchar(255) NOT NULL);
            `);
        },
        selectAllImages: async () => { //seleziona tutti gl'url dal db
            return executeQuery("SELECT id, url FROM image;");
        },
        deleteImage: async (id) => { //rimuove una riga della tabella dato il suo id
            return executeQuery("DELETE FROM image WHERE id=" + id + ";");
        },
        clear: async () => { //resetta la tabella
            return executeQuery("TRUNCATE TABLE image;");
        }
    };
};