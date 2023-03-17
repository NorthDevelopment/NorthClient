"use strict";

// Load packages.

const fs = require("fs");
const fetch = require('node-fetch');
const chalk = require("chalk");
const figlet = require('figlet')
const yaml = require('js-yaml');
const glob = require('glob');

// Load settings.

const settings = require('./handlers/readSettings').settings();

const defaultthemesettings = {
  index: "index.ejs",
  notfound: "index.ejs",
  redirect: {},
  pages: {},
  mustbeloggedin: [],
  mustbeadmin: [],
  variables: {}
};

// Load database

const db = require('./handlers/database');
module.exports.db = db;

// Load websites.

const express = require("express");
const app = express();
module.exports.app = app

// Load express addons.

const ejs = require("ejs");
const session = require("express-session");
require('express-ws')(app);
const indexjs = require("./index.js");

// Sets up saving session data.

const sqlite = require("better-sqlite3");
const SqliteStore = require("better-sqlite3-session-store")(session);
const session_db = new sqlite("sessions.db");

// Load the website.

app.use(session({
  secret: settings.website.secret,
  resave: true,
  saveUninitialized: true,
  store: new SqliteStore({
    client: session_db, 
    expired: {
      clear: true,
      intervalMs: 900000
    }
  })
}));

app.use(express.json({
  inflate: true,
  limit: '500kb',
  reviver: null,
  strict: true,
  type: 'application/json',
  verify: undefined
}));

const http = require('http');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

const server = http.createServer((req, res) => {
  if (req.url === '/upload' && req.method === 'POST') {
    upload.single('avatar')(req, res, function(err) {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end();
      } else {
        res.statusCode = 200;
        res.end();
      }
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(5003, () => {
});


app.listen(settings.website.port, (err) => {
  if (err) console.log(chalk.red(err));
}); 

console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
console.log(chalk.cyan(figlet.textSync("NorthClient")));
console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
console.log(chalk.cyan("[Github] https://github.com/NorthDevelopment/NorthClient"));
console.log(chalk.cyan("[Discord] https://discord.gg/c2V7NKKWCT"));
console.log(chalk.cyan("[NorthClient] Copyright 2022-2023 ©️ NorthDevelopment"));
console.log(chalk.cyan("[NorthClient] All Rights Reserved."));
console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
console.log(chalk.cyan(`[NorthClient] Loaded Dashboard on the port ${settings.website.port}`));
console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

// Load the folders.

const folderPaths = ['./routes', './handlers', './themes', './settings.yml'];

folderPaths.forEach(folderPath => {
  if (fs.existsSync(folderPath)) {
    console.log(chalk.green(`[NorthClient] '${folderPath}' loaded 	✅`));
  }
   else {
    console.log(chalk.red(`[NorthClient] '${folderPath}' not found 	❌`));
    console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  }
});

// Überprüfen, ob der Ordner bereits vorhanden ist
if (!fs.existsSync('dbbackup')) {
  // Funktion zum Erstellen des Ordners und Unterordner
  function createFolderWithSubfolders() {
    const folderName = 'dbbackup'; // Hier können Sie den Namen des Ordners ändern
    const subFolderName1 = 'session'; // Hier können Sie den Namen des ersten Unterordners ändern
    const subFolderName2 = 'sqlite'; // Hier können Sie den Namen des zweiten Unterordners ändern

    fs.mkdir(folderName, { recursive: true }, (err) => {
      if (err) throw err;
      console.log(chalk.green(`[NorthClient] The folder ${folderName} was created successfully!`));
    });

    fs.mkdir(`${folderName}/${subFolderName1}`, { recursive: true }, (err) => {
      if (err) throw err;
      console.log(chalk.green(`[NorthClient] The subfolder ${subFolderName1} was successfully created!`));
    });

    fs.mkdir(`${folderName}/${subFolderName2}`, { recursive: true }, (err) => {
      if (err) throw err;
      console.log(chalk.green(`[NorthClient] The subfolder ${subFolderName2} was successfully created!`));
    });

  }

  // Aufruf der Funktion zum Erstellen des Ordners und Unterordner
  createFolderWithSubfolders();
}

// Überprüfen, ob der Ordner und die Unterordner erfolgreich erstellt wurden
fs.access('dbbackup', (err) => {
  if (err) console.log(chalk.red('[NorthClient] The dbbackup folder was not created successfully!'));
  else console.log(chalk.green('[NorthClient] The dbbackup folder was successfully created!'));
});

fs.access('dbbackup/session', (err) => {
  if (err) console.log(chalk.red('[NorthClient] The session folder was not created successfully!'));
  else console.log(chalk.green('[NorthClient] The session folder was successfully created!'));
});

fs.access('dbbackup/sqlite', (err) => {
  if (err) console.log(chalk.red('[NorthClient] The sqlite folder was not created successfully!'));
  else console.log(chalk.green('[NorthClient] The sqlite folder was successfully created!'));
       console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
});

// Backup files.
const path = require('path');
const backupFolderPath1 = './dbbackup/sqlite';
const backupFolderPath2 = './dbbackup/session';
const filePath1 = './db.sqlite';
const filePath2 = './sessions.db';

function backupFiles() {
  if (!fs.existsSync(backupFolderPath1, backupFolderPath2)) {
    fs.mkdirSync(backupFolderPath1)
    fs.mkdirSync(backupFolderPath2)
  }

  const date = new Date();

  const backupFileName1 = `backup_${path.basename(filePath1, path.extname(filePath1))}_${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}${path.extname(filePath1)}`;
  fs.copyFileSync(filePath1, path.join(backupFolderPath1, backupFileName1));
  console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.green(`[NorthClient] File '${filePath1}' backed up to '${backupFolderPath1}/${backupFileName1}'` + " ✅"));

  const backupFileName2 = `backup_${path.basename(filePath2, path.extname(filePath2))}_${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}${path.extname(filePath2)}`;
  fs.copyFileSync(filePath2, path.join(backupFolderPath2, backupFileName2));
  console.log(chalk.green(`[NorthClient] File '${filePath2}' backed up to '${backupFolderPath2}/${backupFileName2}'` + " ✅"));
  console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
}
backupFiles();

process.on('beforeExit', () => {
  backupFiles();
});


var cache = 0;

setInterval(
  async function() {
    if (cache - .1 < 0) return cache = 0;
    cache = cache - .1;
  }, 100
)

app.use(async (req, res, next) => {
  if (req.session.userinfo && req.session.userinfo.id && !(await db.get(`users-${req.session.userinfo.id}`))) {
    let theme = indexjs.get(req);

    req.session.destroy(() => {
      return res.redirect(theme.settings.redirect.logout || "/");
    });

    return;
  }

  let manager = {
    "/callback": 2,
    "/create": 1,
    "/delete": 1,
    "/modify": 1,
    "/updateinfo": 1,
    "/setplan": 2,
    "/admin": 1,
    "/regen": 1,
    "/renew": 1,
    "/api/userinfo": 1,
    "/userinfo": 2,
    "/remove_account": 1,
    "/create_coupon": 1,
    "/revoke_coupon": 1,
    "/getip": 1,
    "/gift/coins": 1,
    "/gift": 2
  };

  if (manager[req._parsedUrl.pathname]) {
    if (cache > 0) {
      setTimeout(async () => {
        let allqueries = Object.entries(req.query);
        let querystring = "";
        for (let query of allqueries) {
          querystring = querystring + "&" + query[0] + "=" + query[1];
        }
        querystring = "?" + querystring.slice(1);
        if (querystring == "?") querystring = "";
        res.redirect((req._parsedUrl.pathname.slice(0, 1) == "/" ? req._parsedUrl.pathname : "/" + req._parsedUrl.pathname) + querystring);
      }, 1000);
      return;
    } else {
      cache = cache + manager[req._parsedUrl.pathname];
    }
  };
  next();
});

// Load Routes.

const routes = glob.sync('./routes/**/*.js');
  for (const file of routes) {
    const routes = require(file);
    if (typeof routes.load === 'function') routes.load(app, ejs, db);
}

app.all("*", async (req, res) => {
  if (req.session.pterodactyl) if (req.session.pterodactyl.id !== await db.get(`users-${req.session.userinfo.id}`)) return res.redirect("/login?prompt=none");
  let theme = indexjs.get(req);
  
  if (theme.settings.mustbeloggedin.includes(req._parsedUrl.pathname)) if (!req.session.userinfo || !req.session.pterodactyl) return res.redirect("/login" + (req._parsedUrl.pathname.slice(0, 1) == "/" ? "?redirect=" + req._parsedUrl.pathname.slice(1) : ""));
  if (theme.settings.mustbeadmin.includes(req._parsedUrl.pathname)) {
    ejs.renderFile(
      `./themes/${theme.name}/${theme.settings.notfound}`, 
      await eval(indexjs.renderdataeval),
      null,
    async function (err, str) {
      delete req.session.newaccount;
      delete req.session.password;
      if (!req.session.userinfo || !req.session.pterodactyl) {
        if (err) {
          console.log(chalk.red(`[WEBSITE] An error has occured on path ${req._parsedUrl.pathname}:`));
          console.log(err);
          return res.send("An error has occured while attempting to load this page. Please contact an administrator to fix this.");
        };
        res.status(404);
        return res.send(str);
      };

      let cacheaccount = await fetch(
        `${settings.pterodactyl.domain}/api/application/users/${await db.get(`users-${req.session.userinfo.id}`)}?include=servers`,
        {
          method: "get",
          headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
        }
      );
      if (await cacheaccount.statusText == "Not Found") {
        if (err) {
          console.log(chalk.red(`[WEBSITE] An error has occured on path ${req._parsedUrl.pathname}:`));
          console.log(err);
          return res.send("An error has occured while attempting to load this page. Please contact an administrator to fix this.");
        };
        return res.send(str);
      };
      let cacheaccountinfo = JSON.parse(await cacheaccount.text());
    
      req.session.pterodactyl = cacheaccountinfo.attributes;
      if (cacheaccountinfo.attributes.root_admin !== true) {
        if (err) {
          console.log(chalk.red(`[WEBSITE] An error has occured on path ${req._parsedUrl.pathname}:`));
          console.log(err);
          return res.send("An error has occured while attempting to load this page. Please contact an administrator to fix this.");
        };
        return res.send(str);
      };

      ejs.renderFile(
        `./themes/${theme.name}/${theme.settings.pages[req._parsedUrl.pathname.slice(1)] ? theme.settings.pages[req._parsedUrl.pathname.slice(1)] : theme.settings.notfound}`, 
        await eval(indexjs.renderdataeval),
        null,
      function (err, str) {
        delete req.session.newaccount;
        delete req.session.password;
        if (err) {
          console.log(`[WEBSITE] An error has occured on path ${req._parsedUrl.pathname}:`);
          console.log(err);
          return res.send("An error has occured while attempting to load this page. Please contact an administrator to fix this.");
        };
        res.status(404);
        res.send(str);
      });
    });
    return;
  };
  ejs.renderFile(
    `./themes/${theme.name}/${theme.settings.pages[req._parsedUrl.pathname.slice(1)] ? theme.settings.pages[req._parsedUrl.pathname.slice(1)] : theme.settings.notfound}`, 
    await eval(indexjs.renderdataeval),
    null,
  function (err, str) {
    delete req.session.newaccount;
    delete req.session.password;
    if (err) {
      console.log(chalk.red(`[WEBSITE] An error has occured on path ${req._parsedUrl.pathname}:`));
      console.log(err);
      return res.send("An error has occured while attempting to load this page. Please contact an administrator to fix this.");
    };
    res.status(404);
    res.send(str);
  });
});

let partymode = ({users: 1, status: false});
if (settings["AFK Party"].enabled == true) {
  setInterval( async function () { 
    fetch(`${settings.api.client.oauth2.link}/api/afkparty`).then(res => Promise.resolve(res.json()).then(afkparty => {
      partymode = (afkparty)
    }))
  }, 5000)
}

module.exports.renderdataeval =
  `(async () => {
    const JavaScriptObfuscator = require('javascript-obfuscator');
    let renderdata = {
      req: req,
      settings: settings,
      userinfo: req.session.userinfo,
      packagename: req.session.userinfo ? await db.get("package-" + req.session.userinfo.id) ? await db.get("package-" + req.session.userinfo.id) : settings.api.client.packages.default : null,
      extraresources: !req.session.userinfo ? null : (await db.get("extra-" + req.session.userinfo.id) ? await db.get("extra-" + req.session.userinfo.id) : {
        ram: 0,
        disk: 0,
        cpu: 0,
        servers: 0,
        databases: 0,
        allocations: 0,
        backups: 0
      }),
      j4r: !req.session.userinfo ? null : (await db.get("j4r-" + req.session.userinfo.id) ? await db.get("j4r-" + req.session.userinfo.id) : {
        ram: 0,
        disk: 0,
        cpu: 0,
        servers: 0,
        databases: 0,
        allocations: 0,
        backups: 0
      }),
      packages: req.session.userinfo ? settings.api.client.packages.list[await db.get("package-" + req.session.userinfo.id) ? await db.get("package-" + req.session.userinfo.id) : settings.api.client.packages.default] : null,
      coins: settings.api.client.coins.enabled == true ? (req.session.userinfo ? (await db.get("coins-" + req.session.userinfo.id) ? await db.get("coins-" + req.session.userinfo.id) : 0) : null) : null,
      pterodactyl: req.session.pterodactyl,
      theme: theme.name,
      extra: theme.settings.variables
    };
    return renderdata;
  })();`;

module.exports.get = function(req) {
  let defaulttheme = settings.defaulttheme;
  let tname = encodeURIComponent(getCookie(req, "theme"));
  let name = (
    tname ?
      fs.existsSync(`./themes/${tname}`) ?
        tname
      : defaulttheme
    : defaulttheme
  )
  return {
    settings: (
      fs.existsSync(`./themes/${name}/pages.yml`) ?
        yaml.load(fs.readFileSync(`./themes/${name}/pages.yml`).toString())
      : defaultthemesettings
    ),
    name: name
  };
};

module.exports.islimited = async function() {
  return cache <= 0 ? true : false;
}

module.exports.ratelimits = async function(length) {
  cache = cache + length
}

// Get a cookie.
const getCookie = require("./handlers/getCookie");
