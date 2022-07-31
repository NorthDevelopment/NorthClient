const settings = require('../../handlers/readSettings').settings();
const fetch = require('node-fetch');

if (settings.api.server.enabled == true) {
module.exports.load = async function(app, ejs, db) {
    app.get("/api/userinfo", async (req, res) => {
      if (!req.headers.Authorization || req.headers.Authorization !== `Bearer ${settings.api.server.key}`) return res.send({status: "unauthorized"})

        if (!(await db.get(`user-${req.body.id}`))) return res.send({status: "invalid id"})

        const package = await db.get(`package-${req.body.id}`)

        let userinfo = await fetch(
            `${settings.pterodactyl.domain}/api/application/users/${req.body.id}?include=servers`,
            {
              method: "get",
              headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        userinfo = await userinfo.json();

        return res.send({
            status: "sucess",
            package: package,
            extra: await db.get(`extra-${req.body.id}`) ? await db.get(`extra-${req.body.id}`) : {
              ram: 0,
              disk: 0,
              cpu: 0,
              servers: 0,
              databases: 0,
              allocations: 0,
              backups: 0
            },
            userinfo: userinfo,
            coins: settings.api.client.coins.enabled == true ? (await db.get(`coins-${req.body.id}`) ? await db.get(`coins-${req.body.id}`) : 0) : null
          });
        });
    }
}