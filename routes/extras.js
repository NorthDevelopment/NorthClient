const settings = require('../handlers/readSettings').settings();
const fs = require('fs');
const makeid = require('../handlers/makeid');

const indexjs = require("../index.js");
const arciotext = (require("./arcio.js")).text;
const fetch = require('node-fetch');

module.exports.load = async function(app, ejs, db) {
  app.get("/panel", async (req, res) => {
    return res.redirect(settings.pterodactyl.domain);
  });

  app.get("/regen", async (req, res) => {
    if (!req.session.pterodactyl) return res.redirect("/login");
    
    let newsettings = require('../handlers/readSettings').settings();

    if (newsettings.api.client.allow.regen !== true) return res.send("You cannot regenerate your password currently.");

    let newpassword = makeid(newsettings.api.client.passwordgenerator["length"]);
    req.session.password = newpassword;

    await fetch(
      `${settings.pterodactyl.domain}/api/application/users/${req.session.pterodactyl.id}`,
      {
        method: "patch",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${settings.pterodactyl.key}`
        },
        body: JSON.stringify({
          username: req.session.pterodactyl.username,
          email: req.session.pterodactyl.email,
          first_name: req.session.pterodactyl.first_name,
          last_name: req.session.pterodactyl.last_name,
          password: newpassword
        })
      }
    );
    res.redirect("/dashboard")
  });
};
