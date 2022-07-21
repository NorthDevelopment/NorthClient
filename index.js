"use strict";

// Load packages.

const fs = require("fs");
const fetch = require('node-fetch');
const chalk = require("chalk");
const yaml = require('js-yaml');
const arciotext = (require("./api/arcio.js")).text;

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
        servers: 0
      }),
      j4r: !req.session.userinfo ? null : (await db.get("j4r-" + req.session.userinfo.id) ? await db.get("j4r-" + req.session.userinfo.id) : {
        ram: 0,
        disk: 0,
        cpu: 0,
        servers: 0
      }),
      packages: req.session.userinfo ? settings.api.client.packages.list[await db.get("package-" + req.session.userinfo.id) ? await db.get("package-" + req.session.userinfo.id) : settings.api.client.packages.default] : null,
      coins: settings.api.client.coins.enabled == true ? (req.session.userinfo ? (await db.get("coins-" + req.session.userinfo.id) ? await db.get("coins-" + req.session.userinfo.id) : 0) : null) : null,
      pterodactyl: req.session.pterodactyl,
      theme: theme.name,
      extra: theme.settings.variables
    };
    if (settings.api.arcio.enabled == true && req.session.arcsessiontoken) {
      renderdata.arcioafktext = JavaScriptObfuscator.obfuscate(\`
        let token = "\${req.session.arcsessiontoken}";
        let everywhat = \${settings.api.arcio["afk page"].every};
        let gaincoins = \${settings.api.arcio["afk page"].coins};
        let arciopath = "\${settings.api.arcio["afk page"].path.replace(/\\\\/g, "\\\\\\\\").replace(/"/g, "\\\\\\"")}";
        \${arciotext}
      \`);
    };
    return renderdata;
  })();`;

// Load database

const db = require('./handlers/database')
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

console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
console.log(chalk.red("Please report any bugs to our discord server or open a issue in github."));
console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
console.log(chalk.yellow("[NorthClient] Copyright 2022 ©️ NORTHDEVELOPMENT"));
console.log(chalk.yellow("[Github] https://github.com/NorthDevelopment/NorthClient"));
console.log(chalk.yellow("[Discord] https://discord.gg/c2V7NKKWCT"));
console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

app.listen(settings.website.port, (err) => {
  console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.yellow(`[NorthClient] Loaded Dashboard on the port ${settings.website.port}`));
  console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  if (err) console.log(chalk.red(err));
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
    "/getip": 1
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

// Load the API files.

const apifiles = fs.readdirSync('./api').filter(file => file.endsWith('.js'))
apifiles.push('pages.js') 
apifiles.forEach(file => { 
  const apifile = require(`./api/${file}`) 
  if (typeof apifile.load === 'function') apifile.load(app, ejs, db) 
})

app.all("*", async (req, res) => {
  if (req.session.pterodactyl) if (req.session.pterodactyl.id !== await db.get("users-" + req.session.userinfo.id)) return res.redirect("/login?prompt=none");
  let theme = indexjs.get(req);

  let newsettings = require('./handlers/readSettings').settings();
  if (newsettings.api.arcio.enabled == true) if (theme.settings.generateafktoken.includes(req._parsedUrl.pathname)) req.session.arcsessiontoken = Math.random().toString(36).substring(2, 15);
  
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
        settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
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
function getCookie(req, cname) {
  let cookies = req.headers.cookie;
  if (!cookies) return null;
  let name = cname + "=";
  let ca = cookies.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return decodeURIComponent(c.substring(name.length, c.length));
    }
  }
  return "";
}
