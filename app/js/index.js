let db = require('./js/dbAccess.js');
var bsn = require("bootstrap.native");


class Index {
    constructor(){
        this.mydb=new db.dbAccess();
        
     };

    drawTable(Pelis){
        let self=this;

        // Recorrem el JSON de Pelis, creant una fila per cada component
        for (let Peli in Pelis){
            let tr=document.createElement("tr");

            for (let camp in Pelis[Peli]){
                if (camp=="idPelis") continue;

                let td=document.createElement("td");
                let text=document.createTextNode(Pelis[Peli][camp]);
                td.append(text);

                tr.append(td);
            }
            
            let tablebody=document.querySelector("#tableBody");
            tablebody.append(tr);
        }
        console.log(Pelis);
    }

    getPelis(callback){
        // Obté les pel·lícules de la BD
        this.mydb.getAllMovies(function(Pelis){
            callback(Pelis);    
        });

    }

    saveNewPeli(episodi, titol, any, director){
        let self=this;
        // Guarda la peli introduïda al formulari a la base de dades

        this.mydb.saveNewPeli(episodi, titol, any, director, function(ret){
            if (ret.error!=null) alert("Error, no s'han inserit les dades");
            else if (ret.result.affectedRows==1) {
                alert("S'ha afegit el registre");
                
                document.getElementById("myModal");
                var myModalInstance = new bsn.Modal(myModal);
                self.myModalInstance.toggle();

                // Netegem la taula
                document.querySelector("#tableBody").innerHTML="";

                self.getPelis(function(Pelis){
                    self.drawTable(Pelis);
                });
            }
            
        });
    }

    addEventsListeners(){
        // Funció que enllaça els events de la interfície amb els seus manejadors

        let self=this;
        document.querySelector("#SaveData").addEventListener("click", function(){
            // Clic en el botó de guardar del formulari
            let episodi=document.querySelector("#Episodi").value;
            let titol=document.querySelector("#Titol").value;
            let any=document.querySelector("#Any").value;
            let director=document.querySelector("#Director").value;

            self.saveNewPeli(episodi, titol, any, director);

        })
    }
}


window.onload = function(){
    // Esdeveniment que es dispara en tindre el HTML carregat
    // una vegada carregat, inicialitzem tots els objectes de l'aplicació
    let index=new Index();

    index.getPelis(function(Pelis){
        // Obtenim les pelis de la BD i les mostrem a la taula
        index.drawTable(Pelis);
    });

    // I afegim els gestors dels esdeveniments
    index.addEventsListeners();

}; 
