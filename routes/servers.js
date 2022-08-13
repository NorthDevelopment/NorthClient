const settings = require('../handlers/readSettings').settings();
const fetch = require('node-fetch');
const indexjs = require("../index.js");
const adminjs = require("./admin.js");
const renew = require("./renewal.js");
const fs = require("fs");

if (settings.pterodactyl) if (settings.pterodactyl.domain) {
  if (settings.pterodactyl.domain.slice(-1) == "/") settings.pterodactyl.domain = settings.pterodactyl.domain.slice(0, -1);
};

module.exports.load = async function(app, ejs, db) {
  app.get("/updateinfo", async (req, res) => {
    if (!req.session.pterodactyl) return res.redirect("/login")
    let cacheaccount = await fetch(
      settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
      {
        method: "get",
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
      }
    );
    if (await cacheaccount.statusText == "Not Found") return res.send("An error has occured while attempting to update your account information and server list.");
    let cacheaccountinfo = JSON.parse(await cacheaccount.text());
    req.session.pterodactyl = cacheaccountinfo.attributes;
    if (req.query.redirect) if (typeof req.query.redirect == "string") return res.redirect("/" + req.query.redirect);
    let theme = indexjs.get(req);
    res.redirect(theme.settings.redirect.updateservers || "/");
  });

  app.get("/create", async (req, res) => {
    if (!req.session.pterodactyl) return res.redirect("/login");
    
    let theme = indexjs.get(req);

    let newsettings = require('../handlers/readSettings').settings();
    if (newsettings.api.client.allow.server.create == true) {
      let redirectlink = theme.settings.redirect.failedcreateserver || "/"; // fail redirect link
      
      if (req.query.name && req.query.ram && req.query.disk && req.query.cpu && req.query.databases && req.query.allocations && req.query.backups && req.query.egg && req.query.location) {
        try {
          decodeURIComponent(req.query.name)
        } catch(err) {
          return res.redirect(`${redirectlink}?err=COULDNOTDECODENAME`);
        }

        let packagename = await db.get("package-" + req.session.userinfo.id);
        let package = newsettings.api.client.packages.list[packagename ? packagename : newsettings.api.client.packages.default];

        let extra = 
        await db.get("extra-" + req.session.userinfo.id) ||
          {
            ram: 0,
            disk: 0,
            cpu: 0,
            servers: 0,
            databases: 0,
            allocations: 0,
            backups: 0
          };
          let j4r =
          await db.get("j4r-" + req.session.userinfo.id) ?
            await db.get("j4r-" + req.session.userinfo.id) :
            {
              ram: 0,
            disk: 0,
            cpu: 0,
            servers: 0,
            databases: 0,
            allocations: 0,
            backups: 0
            };

        let ram2 = 0;
        let disk2 = 0;
        let cpu2 = 0;
        let databases2 = 0;
        let allocations2 = 0;
        let backups2 = 0;
        let servers2 = req.session.pterodactyl.relationships.servers.data.length;
        for (let i = 0, len = req.session.pterodactyl.relationships.servers.data.length; i < len; i++) {
          ram2 = ram2 + req.session.pterodactyl.relationships.servers.data[i].attributes.limits.memory;
          disk2 = disk2 + req.session.pterodactyl.relationships.servers.data[i].attributes.limits.disk;
          cpu2 = cpu2 + req.session.pterodactyl.relationships.servers.data[i].attributes.limits.cpu;
          databases2 = databases2 + req.session.pterodactyl.relationships.servers.data[i].attributes.feature_limits.databases;
          allocations2 = allocations2 + req.session.pterodactyl.relationships.servers.data[i].attributes.feature_limits.allocations;
          backups2 = backups2 + req.session.pterodactyl.relationships.servers.data[i].attributes.feature_limits.backups;
        };

        if (servers2 >= package.servers + extra.servers + j4r.servers) return res.redirect(`${redirectlink}?err=TOOMUCHSERVERS`);

        let name = decodeURIComponent(req.query.name);
        if (name.length < 1) return res.redirect(`${redirectlink}?err=LITTLESERVERNAME`);
        if (name.length > 191) return res.redirect(`${redirectlink}?err=BIGSERVERNAME`);
  
        let location = req.query.location;

        if (Object.entries(newsettings.api.client.locations).filter(vname => vname[0] == location).length !== 1) return res.redirect(`${redirectlink}?err=INVALIDLOCATION`);

        let requiredpackage = Object.entries(newsettings.api.client.locations).filter(vname => vname[0] == location)[0][1].package;
        if (requiredpackage) if (!requiredpackage.includes(packagename ? packagename : newsettings.api.client.packages.default)) return res.redirect(`${redirectlink}?err=PREMIUMLOCATION`);


        let egg = req.query.egg;
  
        let egginfo = newsettings.api.client.eggs[egg];
        if (!newsettings.api.client.eggs[egg]) return res.redirect(`${redirectlink}?err=INVALIDEGG`);
        let ram = parseFloat(req.query.ram);
        let disk = parseFloat(req.query.disk);
        let cpu = parseFloat(req.query.cpu);
        let databases = parseFloat(req.query.databases);
        let allocations = parseFloat(req.query.allocations)
        let backups = parseFloat(req.query.backups)
        if (!isNaN(ram) && !isNaN(disk) && !isNaN(cpu) && !isNaN(databases) && !isNaN(allocations) && !isNaN(backups)) {
            if (ram2 + ram > package.ram + extra.ram + j4r.ram) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDRAM&num=${package.ram + extra.ram + j4r.ram - ram2}`);
            if (disk2 + disk > package.disk + extra.disk + j4r.disk) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDDISK&num=${package.disk + extra.disk + j4r.disk - disk2}`);
            if (cpu2 + cpu > package.cpu + extra.cpu + j4r.cpu) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDCPU&num=${package.cpu + extra.cpu + j4r.cpu - cpu2}`);
            if (databases2 + databases > package.databases + extra.databases + j4r.databases) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDDATABASES&num=${package.databases + extra.databases + j4r.databases - databases2}`);
            if (allocations2 + allocations > package.allocations + extra.allocations + j4r.allocations) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDALLOCATIONS&num=${package.allocations + extra.allocations + j4r.allocations - allocations2}`);
            if (backups2 + backups > package.backups + extra.backups + j4r.backups) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDBACKUPS&num=${package.backups + extra.backups + j4r.backups - backups2}`);
            if (egginfo.minimum.ram) if (ram < egginfo.minimum.ram) return res.redirect(`${redirectlink}?err=TOOLITTLERAM&num=${egginfo.minimum.ram}`);
            if (egginfo.minimum.disk) if (disk < egginfo.minimum.disk) return res.redirect(`${redirectlink}?err=TOOLITTLEDISK&num=${egginfo.minimum.disk}`);
            if (egginfo.minimum.cpu) if (cpu < egginfo.minimum.cpu) return res.redirect(`${redirectlink}?err=TOOLITTLECPU&num=${egginfo.minimum.cpu}`);
            if (egginfo.maximum) {
                if (egginfo.maximum.ram) if (ram > egginfo.maximum.ram) return res.redirect(`${redirectlink}?err=TOOMUCHRAM&num=${egginfo.maximum.ram}`);
                if (egginfo.maximum.disk) if (disk > egginfo.maximum.disk) return res.redirect(`${redirectlink}?err=TOOMUCHDISK&num=${egginfo.maximum.disk}`);
                if (egginfo.maximum.cpu) if (cpu > egginfo.maximum.cpu) return res.redirect(`${redirectlink}?err=TOOMUCHCPU&num=${egginfo.maximum.cpu}`);
            }
  
          let specs = egginfo.info;
          specs["user"] = (await db.get("users-" + req.session.userinfo.id));
          if (!specs["limits"]) specs["limits"] = {
            swap: 0,
            io: 500,
            backups: 0
          };
          specs.name = name;
          specs.limits.memory = ram;
          specs.limits.disk = disk;
          specs.limits.cpu = cpu;
          specs.feature_limits.databases = databases;
          specs.feature_limits.allocations = allocations;
          specs.feature_limits.backups = backups;
          if (!specs["deploy"]) specs.deploy = {
            locations: [],
            dedicated_ip: false,
            port_range: []
          }
          specs.deploy.locations = [location];
  
          let serverinfo = await fetch(
            settings.pterodactyl.domain + "/api/application/servers",
            {
              method: "post",
              headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}`, "Accept": "application/json" },
              body: JSON.stringify(await specs)
            }
          );
          if (await serverinfo.statusText !== "Created") {
            console.log(await serverinfo.text());
            return res.redirect(`${redirectlink}?err=ERRORONCREATE`);
          }
          let serverinfotext = JSON.parse(await serverinfo.text());
          let newpterodactylinfo = req.session.pterodactyl;
          newpterodactylinfo.relationships.servers.data.push(serverinfotext);
          req.session.pterodactyl = newpterodactylinfo;
          if (settings.api.client.allow.renewsuspendsystem.enabled == true) {
            renew.set(serverinfotext.attributes.id);
          }
          if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("SERVER")) {
            let params = JSON.stringify({
                embeds: [
                    {
                        title: "Server Created",
                        description: `**__User:__** ${req.session.userinfo.username}#${req.session.userinfo.discriminator} (${req.session.userinfo.id})\n\n**__Configuration:__**\n**Name:** ${name}\n**Ram:** ${ram}MB\n**Disk:** ${disk}MB\n**CPU:** ${cpu}%\n**DATABASES:** ${databases}%\n**PORTS:** ${allocations}%\n**BACKUPS:** ${backups}%\n**Egg:** ${egg}\n**Location:** ${location}`,
                        color: hexToDecimal("#FE0023")
                    }
                ]
            })
            fetch(`${newsettings.api.client.webhook.webhook_url}`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                },
                body: params
            }).catch(e => console.warn(chalk.red("[WEBSITE] There was an error sending to the webhook: " + e)));
        }
          return res.redirect(theme.settings.redirect.createserver || "/");
        } else {
          res.redirect(`${redirectlink}?err=NOTANUMBER`);
        }
      } else {
        res.redirect(`${redirectlink}?err=MISSINGVARIABLE`);
      }
    } else {
      res.redirect(theme.settings.redirect.createserverdisabled || "/");
    }
  });

  app.get("/modify", async (req, res) => {
    if (!req.session.pterodactyl) return res.redirect("/login");

    let theme = indexjs.get(req);

    let newsettings = require('../handlers/readSettings').settings();
    if (newsettings.api.client.allow.server.modify == true) {
      if (!req.query.id) return res.send("Missing server id.");

      let redirectlink = theme.settings.redirect.failedmodifyserver || "/"; // fail redirect link
  
      let checkexist = req.session.pterodactyl.relationships.servers.data.filter(name => name.attributes.id == req.query.id);
      if (checkexist.length !== 1) return res.send("Invalid server id.");
  
      let ram = req.query.ram ? (isNaN(parseFloat(req.query.ram)) ? undefined : parseFloat(req.query.ram)) : undefined;
      let disk = req.query.disk ? (isNaN(parseFloat(req.query.disk)) ? undefined : parseFloat(req.query.disk)) : undefined;
      let cpu = req.query.cpu ? (isNaN(parseFloat(req.query.cpu)) ? undefined : parseFloat(req.query.cpu)) : undefined;
      let databases = req.query.databases ? (isNaN(parseFloat(req.query.databases)) ? undefined : parseFloat(req.query.databases)) : undefined;
      let allocations = req.query.allocations ? (isNaN(parseFloat(req.query.allocations)) ? undefined : parseFloat(req.query.allocations)) : undefined;
      let backups = req.query.backups ? (isNaN(parseFloat(req.query.backups)) ? undefined : parseFloat(req.query.backups)) : undefined;
  
      if (ram || disk || cpu || databases || allocations || backups) {
        let newsettings = require('../handlers/readSettings').settings();
  
        let packagename = await db.get("package-" + req.session.userinfo.id);
        let package = newsettings.api.client.packages.list[packagename ? packagename : newsettings.api.client.packages.default];
  
        let pterorelationshipsserverdata = req.session.pterodactyl.relationships.servers.data.filter(name => name.attributes.id.toString() !== req.query.id);
  
        let ram2 = 0;
        let disk2 = 0;
        let cpu2 = 0;
        let databases2 = 0;
        let allocations2 = 0;
        let backups2 = 0;
        for (let i = 0, len = pterorelationshipsserverdata.length; i < len; i++) {
          ram2 = ram2 + pterorelationshipsserverdata[i].attributes.limits.memory;
          disk2 = disk2 + pterorelationshipsserverdata[i].attributes.limits.disk;
          cpu2 = cpu2 + pterorelationshipsserverdata[i].attributes.limits.cpu;
          databases2 = databases2 + pterorelationshipsserverdata[i].attributes.feature_limits.databases;
          allocations2 = allocations2 + pterorelationshipsserverdata[i].attributes.feature_limits.allocations;
          backups2 = backups2 + pterorelationshipsserverdata[i].attributes.feature_limits.backups;
        }
        let attemptegg = null;
        //let attemptname = null;
        
        for (let [name, value] of Object.entries(newsettings.api.client.eggs)) {
          if (value.info.egg == checkexist[0].attributes.egg) {
            attemptegg = newsettings.api.client.eggs[name];
            //attemptname = name;
          };
        };
        let egginfo = attemptegg ? attemptegg : null;
  
        if (!egginfo) return res.redirect(`${redirectlink}?id=${req.query.id}&err=MISSINGEGG`);

        let extra = await db.get("extra-" + req.session.userinfo.id) ||
          {
            ram: 0,
        disk: 0,
        cpu: 0,
        servers: 0,
        backups: 0,
        databases: 0,
        allocations: 0
          };
          let j4r = await db.get("j4r-" + req.session.userinfo.id) ||
            {
              ram: 0,
        disk: 0,
        cpu: 0,
        servers: 0,
        backups: 0,
        databases: 0,
        allocations: 0
            };
  
            if (ram2 + ram > package.ram + extra.ram + j4r.ram) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDRAM&num=${package.ram + extra.ram + j4r.ram - ram2}`);
            if (disk2 + disk > package.disk + extra.disk + j4r.disk) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDDISK&num=${package.disk + extra.disk + j4r.disk - disk2}`);
            if (cpu2 + cpu > package.cpu + extra.cpu + j4r.cpu) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDCPU&num=${package.cpu + extra.cpu + j4r.cpu - cpu2}`);
            if (databases2 + databases > package.databases + extra.databases + j4r.databases) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDDATABASES&num=${package.databases + extra.databases + j4r.databases - databases2}`);
            if (allocations2 + allocations > package.allocations + extra.allocations + j4r.allocations) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDALLOCATIONS&num=${package.allocations + extra.allocations + j4r.allocations - allocations2}`);
            if (backups2 + backups > package.backups + extra.backups + j4r.backups) return res.redirect(`${redirectlink}?id=${req.query.id}&err=EXCEEDBACKUPS&num=${package.backups + extra.backups + j4r.backups - backups2}`);
        if (egginfo.minimum.ram) if (ram < egginfo.minimum.ram) return res.redirect(`${redirectlink}?id=${req.query.id}&err=TOOLITTLERAM&num=${egginfo.minimum.ram}`);
        if (egginfo.minimum.disk) if (disk < egginfo.minimum.disk) return res.redirect(`${redirectlink}?id=${req.query.id}&err=TOOLITTLEDISK&num=${egginfo.minimum.disk}`);
        if (egginfo.minimum.cpu) if (cpu < egginfo.minimum.cpu) return res.redirect(`${redirectlink}?id=${req.query.id}&err=TOOLITTLECPU&num=${egginfo.minimum.cpu}`);
        if (egginfo.maximum) {
          if (egginfo.maximum.ram) if (ram > egginfo.maximum.ram) return res.redirect(`${redirectlink}?id=${req.query.id}&err=TOOMUCHRAM&num=${egginfo.maximum.ram}`);
          if (egginfo.maximum.disk) if (disk > egginfo.maximum.disk) return res.redirect(`${redirectlink}?id=${req.query.id}&err=TOOMUCHDISK&num=${egginfo.maximum.disk}`);
          if (egginfo.maximum.cpu) if (cpu > egginfo.maximum.cpu) return res.redirect(`${redirectlink}?id=${req.query.id}&err=TOOMUCHCPU&num=${egginfo.maximum.cpu}`);
        };
  
        let feature_limits = {
          databases: databases ? databases : checkexist[0].attributes.feature_limits.databases,
          allocations: allocations ? allocations : checkexist[0].attributes.feature_limits.allocations,
          backups: backups ? backups : checkexist[0].attributes.feature_limits.backups
        };

        let limits = {
          memory: ram ? ram : checkexist[0].attributes.limits.memory,
          disk: disk ? disk : checkexist[0].attributes.limits.disk,
          cpu: cpu ? cpu : checkexist[0].attributes.limits.cpu,
          swap: egginfo ? checkexist[0].attributes.limits.swap : 0,
          io: egginfo ? checkexist[0].attributes.limits.io : 500
        };
  
        let serverinfo = await fetch(
          settings.pterodactyl.domain + "/api/application/servers/" + req.query.id + "/build",
          {
            method: "patch",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}`, "Accept": "application/json" },
            body: JSON.stringify({
              limits: limits,
              feature_limits: feature_limits,
              allocation: checkexist[0].attributes.allocation
            })
          }
        );
        if (await serverinfo.statusText !== "OK") return res.redirect(`${redirectlink}?id=${req.query.id}&err=ERRORONMODIFY`);
        let text = JSON.parse(await serverinfo.text());
        pterorelationshipsserverdata.push(text);
        req.session.pterodactyl.relationships.servers.data = pterorelationshipsserverdata;
        let theme = indexjs.get(req);
        adminjs.suspend(req.session.userinfo.id);
        if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("SERVER")) {
          let params = JSON.stringify({
              embeds: [
                  {
                      title: "Server Modified",
                      description: `**__User:__** ${req.session.userinfo.username}#${req.session.userinfo.discriminator} (${req.session.userinfo.id})\n\n**__New Configuration:__**\n${checkexist[0].attributes.limits.memory}MB Ram\n${checkexist[0].attributes.limits.disk}MB Disk\n${checkexist[0].attributes.limits.cpu}% CPU\n${checkexist[0].attributes.feature_limits.databases} Databases\n${checkexist[0].attributes.feature_limits.allocations} Allocations\n${checkexist[0].attributes.feature_limits.backups} Backup Slots`,
                      color: hexToDecimal("#FE0023")
                  }
              ]
          })
          fetch(`${newsettings.api.client.webhook.webhook_url}`, {
              method: "POST",
              headers: {
                  'Content-type': 'application/json',
              },
              body: params
          }).catch(e => console.warn(chalk.red("[WEBSITE] There was an error sending to the webhook: " + e)));
      }
        res.redirect(theme.settings.redirect.modifyserver || "/");
      } else {
        res.redirect(`${redirectlink}?id=${req.query.id}&err=MISSINGVARIABLE`);
      }
    } else {
      res.redirect(theme.settings.redirect.modifyserverdisabled || "/");
    }
  });

  app.get("/delete", async (req, res) => {
    if (!req.session.pterodactyl) return res.redirect("/login")

    if (!req.query.id) return res.send("Missing id.");

    let theme = indexjs.get(req);

    let newsettings = require('../handlers/readSettings').settings();
    if (newsettings.api.client.allow.server.delete == true) {
      if (req.session.pterodactyl.relationships.servers.data.filter(server => server.attributes.id == req.query.id).length == 0) return res.send("Could not find server with that ID.");

      let deletionresults = await fetch(
        settings.pterodactyl.domain + "/api/application/servers/" + req.query.id,
        {
          method: "delete",
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${settings.pterodactyl.key}`
          }
        }
      );
      let ok = await deletionresults.ok;
      if (ok !== true) return res.send("An error has occur while attempting to delete the server.");
      let pterodactylinfo = req.session.pterodactyl;
      pterodactylinfo.relationships.servers.data = pterodactylinfo.relationships.servers.data.filter(server => server.attributes.id.toString() !== req.query.id);
      req.session.pterodactyl = pterodactylinfo;

      if (settings.api.client.allow.renewsuspendsystem.enabled == true) {
        renew.delete(req.query.id);
      }

      adminjs.suspend(req.session.userinfo.id);

      res.redirect(theme.settings.redirect.deleteserver || "/");

      if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("SERVER")) {
        let params = JSON.stringify({
            embeds: [
                {
                    title: "Server Deleted",
                    description: `**__User:__** ${req.session.userinfo.username}#${req.session.userinfo.discriminator} (${req.session.userinfo.id})\n\n**ID:** ${req.query.id}`,
                    color: hexToDecimal("#ffff00")
                }
            ]
        })
        fetch(`${newsettings.api.client.webhook.webhook_url}`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: params
        }).catch(e => console.warn(chalk.red("[WEBSITE] There was an error sending to the webhook: " + e)));
    }
  
    } else {
      res.redirect(theme.settings.redirect.deleteserverdisabled || "/");
    }
  });
};
function hexToDecimal(hex) {
  return parseInt(hex.replace("#",""), 16)
}
