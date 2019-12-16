# Exemple d'aplicació gràfica d'accés a base de dades amb nodejs

En aquest document anem a veure com crear una aplicació gràfica en HTML5 que ataque a una base de dades MySQL. Per a això farem ús del projecte  *electron* i la llibrería de node per al connector de MySQL.


## Passos inicials

### Creació del paquet

En primer lloc, en la nostra carpeta del projecte anem a crear l'estructura del `package.json` (la carpeta on estem s'anomena `bd`):

```
$ npm init 
```
Se'ns preguntarà per alguns detalls de l'aplicació, i ens crearà el fitxer package.json amb una estructura mínima, que anirem ampliant.

### Paquets necessaris

Per a la nostra aplicació, necessitarem principalment dos llibreríes: electron i el driver de mysql:

```
$ npm install --save electron
$ npm install --save mysql
```
Amb l'opció --save, el que fem és afegir aquestes llibreríes com a dependències del projecte dins el fitxer `package.json`.

A més d'aquestes, anem a incloure el framework bootstrap (i bootstrap native, per no dependre de jquery):

```
npm install --save bootstrap
npm install --save bootstrap.native
```

Amb tot açò, al `package.json` se'ns haurà generat una secció "dependencies" amb el següent contingut:

```json
  "dependencies": {
    "bootstrap": "^4.1.3",
    "bootstrap.native": "^2.0.24",
    "electron": "^3.0.12",
    "mysql": "^2.16.0"
  }
```

### Distribució i instal·lació

Totes les dependències s'han instal·lat al directori `node_modules`, de la nostra aplicació. Aquesta carpeta no serà necessari distribuïr-la quan distribuim el codi font de l'aplicació, ja que disposem de la informació per a la seua generació dins el `package.json`. La majoria dels projectes nodejs que podem trobar a github ho fan d'aquesta manera.

Amb la informació que el fitxer `package.json` ens proporciona, podem regenerar totes les dependències amb:

```
$ npm install
```

Amb açò, a més, descarregarem les versions més actualitzades de les dependències cada vegada.

### Actualització de les dependències

Per actualitzar les dependències a les seues versions actuals s'ha utilitzat el paquet `npm-check-updates`. Per a això, primerament l'instal·lem:

```
sudo npm install -g npm-check-updates
```
L'executem des del mateix repositori:

```
ncu -u
Upgrading /srv/cvs/ExempleElectronMySQL/package.json
[====================] 5/5 100%

 @fortawesome/fontawesome-free   ^5.6.1  →  ^5.12.0 
 bootstrap                       ^4.1.3  →   ^4.4.1 
 bootstrap.native               ^2.0.24  →  ^2.0.27 
 electron                       ^3.0.12  →   ^7.1.5 
 mysql                          ^2.16.0  →  ^2.17.1 

Run npm install to install new versions.
```

I ja podrem veure com s'ha modificat el fitxer `package.json` amb les dependències actualitzades:

```json
  "dependencies": {
    "@fortawesome/fontawesome-free": "^5.12.0",
    "bootstrap": "^4.4.1",
    "bootstrap.native": "^2.0.27",
    "electron": "^7.1.5",
    "mysql": "^2.17.1"
}
```

## Desenvolupament de l'aplicació

### Execució

Per tal d'executar l'aplicació amb electron, haurem d'incloure a la secció d'scripts el següent:

```json
"scripts": {
    "start": "electron ."
    }
```

Amb el que indiquem a npm que l'script `start` executarà l'ordre `electron .`. Amb açò, per executar l'aplicació, haurem d'invocar `npm` de la següent forma:

```
$ npm start
```

### Estructura del projecte
```
.
├── app
      ├── css
      │   └── bootstrap-material-design.css
      ├── index.html
      └── js
          ├── dbAccess.js
          └── index.js
├── index.js
├── node_modules
├── package.json
└── README.md
```

### L'script d'inici de l'aplicació

Al fitxer `package.json`, tenim la línia:

```
"main": "index.js"
```

que indica quin és l'script que arranca l'aplicació. Aquest fitxer té el següent contingut:

* En primer lloc, carreguem la llibrería d'electron, de la que utilitzem dos classes:  `app` per controlar el cicle de vida de l'aplicació, i BrowserWindow, per tal de controlar les finestres webkit de l'aplicació. A més, es crea una referència global a la finestra principal de l'aplicació, per tal que no es tanque quan passe el recol·lector de fem de nodejs.

```js
const {app, BrowserWindow} = require('electron')
let mainWindow;
```

* El codi que s'executa en arrancar l'aplicació detecta l'event d'inicialització d'electron, de manera que estiguen disponibles les APIs i poguem crear la finestra principal:

```js
app.on('ready', function(){
  createWindow();
});
```

* I la funció createWindow, que crea la finestra del navegador, si volem també les devtools, així com gestionar alguns events relacionats amb la finestra.

```js
function createWindow () {
  // Crea la finestra del navegador
  mainWindow.setMenu(null);
  
  //I carreguem en ella l'índex de la pàgina
  mainWindow.loadFile('app/index.html')

  devtools = new BrowserWindow()
  mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
  mainWindow.webContents.openDevTools({ mode: 'detach' });

  /* Gestió d'events de la finestra */

  // Detectem l'event de tancar la finestra principal
    mainWindow.on('closed', function () {
      mainWindow = null
    })

}


// Ajustos per a mac

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})








// https://medium.com/developers-writing/building-a-desktop-application-with-electron-204203eeb658
// https://www.w3schools.com/nodejs/nodejs_mysql.asp