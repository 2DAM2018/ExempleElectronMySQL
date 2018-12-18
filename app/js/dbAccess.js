var mysql = require('mysql');

class dbAccess{

    constructor(){};
    
    getConnection(){
        // Retorna una connexió a la BD MySQL
        return mysql.createConnection({
            host     : 'localhost',
            //user     : 'root',
            //password : '',
            user     : 'examen',
            password : 'eljust',
            database : 'cine'
          }); 
    }

    getAllMovies(callback){
        // Llista totes les pel·lícules de la BD

        // 1. Obtenim la connexió
        let connection=this.getConnection();
        
        let Pelis=[];

        // 2. Ens connectem a la BD
        connection.connect();

        // 3. Fem la consulta
        connection.query('SELECT idPelis, Episodi, Titol, Any, Director FROM Pelis', function (error, results, fields) {
            if (error) throw error;
                      
            // Recorrem els resultats i creem un JSON
            for (let index_result in results){
                let peli={};
                for (let index_camp in fields)
                {
                    // Anem afegint valors al JSON
                    let indexName=fields[index_camp].name;
                    let attrValue=results[index_result][indexName]
                    peli[indexName]=attrValue;
                }
                // i afegim el JSON al vector
                Pelis.push(peli);
            }
            // 4. Tanquem la connexió
            connection.end();

            // I finalment, invoquem la funció de callback amb els resultats
            callback(Pelis);

          });
        
    }

    saveNewPeli(episodi, titol, any, director, callback){
        // Guarda les dades d'una nova pel·lícula

        // 1. Creem la connexió
        let connection=this.getConnection();

        // 2. Ens connectem
        connection.connect();

        // 3. Fem la consulta, fent correspondre els arguments als placeholders amb un vector
        let query="INSERT INTO `cine`.`Pelis` (`Episodi`, `Titol`, `Any`, `Director`)"+
        " VALUES (?, ?, ?, ?);";
        connection.query(query, [episodi, titol, any, director] ,function (error, results, fields) {
            callback({"error":error, "result":results});
          });
    }

}

// Cal exportar la classe per poder utilitzar-la des de fora
module.exports = {  
    dbAccess: dbAccess
}