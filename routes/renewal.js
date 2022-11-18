const settings = require('../handlers/readSettings').settings();

module.exports.load = async function(app, ejs, db) {
    if (settings.api.client.allow.renewsuspendsystem.enabled == true) {

        let renewalservers = {};
        
        const indexjs = require("../index.js");
        
        const fetch = require('node-fetch');
        const fs = require('fs');

        setInterval(async () => {
            for (let [id, value] of Object.entries(renewalservers)) {
                renewalservers[id]--;
                if (renewalservers[id] < 1) {
                    let canpass = await indexjs.islimited();
                    if (canpass == false) {
                        return renewalservers[id] = 0;
                    };
                    indexjs.ratelimits(1);
                    await fetch(
                        settings.pterodactyl.domain + "/api/application/servers/" + id + "/suspend",
                        {
                          method: "post",
                          headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
                        }
                    );
                    delete renewalservers[id];
                }
            }
        }, 1000);

        app.get("/renew", async (req, res) => {
            if (!req.session.pterodactyl) return res.redirect("/login");
        
            if (!req.query.id) return res.send("Missing id.");
            if (!req.session.pterodactyl.relationships.servers.data.filter(server => server.attributes.id == req.query.id)) return res.send("Could not find server with that ID.");
        
            let theme = indexjs.get(req);


            let newsettings = require('../handlers/readSettings').settings();
            if (newsettings.api.client.allow.overresourcessuspend == true) {
                let userinfo = req.session.pterodactyl;
                let discordid = req.session.userinfo.id;
        
                let packagename = await db.get("package-" + discordid);
                let package = newsettings.api.client.packages.list[packagename || newsettings.api.client.packages.default];
        
                let extra = 
                    await db.get("extra-" + discordid) ?
                    await db.get("extra-" + discordid) :
                    {
                        ram: 0,
                        disk: 0,
                        cpu: 0,
                        servers: 0
                    };
        
                let plan = {
                    ram: package.ram + extra.ram,
                    disk: package.disk + extra.disk,
                    cpu: package.cpu + extra.cpu,
                    servers: package.servers + extra.servers
                }
        
                let current = {
                    ram: 0,
                    disk: 0,
                    cpu: 0,
                    servers: userinfo.relationships.servers.data.length
                }
                for (let i = 0, len = userinfo.relationships.servers.data.length; i < len; i++) {
                    current.ram = current.ram + userinfo.relationships.servers.data[i].attributes.limits.memory;
                    current.disk = current.disk + userinfo.relationships.servers.data[i].attributes.limits.disk;
                    current.cpu = current.cpu + userinfo.relationships.servers.data[i].attributes.limits.cpu;
                };

                if (current.ram > plan.ram || current.disk > plan.disk || current.cpu > plan.cpu || current.servers > plan.servers) {
                    return res.send(theme.settings.redirect.failedrenewserver + "?err=EXCEEDSPLAN");
                };
            };

            let cost = settings.api.client.allow.renewsuspendsystem.cost;

            let usercoins = await db.get("coins-" + req.session.userinfo.id) || 0;

            if (usercoins < cost) return res.redirect(theme.settings.redirect.failedrenewserver + "?err=CANNOTAFFORD");

            let newusercoins = usercoins - cost;

            if (newusercoins == 0) {
                await db.delete("coins-" + req.session.userinfo.id);
            } else {
                await db.set("coins-" + req.session.userinfo.id, newusercoins);
            }

            
            renewalservers[req.query.id] = settings.api.client.allow.renewsuspendsystem.time;
            
            await fetch(
                settings.pterodactyl.domain + "/api/application/servers/" + req.query.id + "/unsuspend",
                {
                  method: "post",
                  headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
                }
            );
        
            return res.redirect(theme.settings.redirect.renewserver || "/");
        });

        module.exports.set = async function(id) {
            renewalservers[id] = settings.api.client.allow.renewsuspendsystem.time;
        }

        module.exports.delete = async function(id) {
            delete renewalservers[id];
        }
    }
};