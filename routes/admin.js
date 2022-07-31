let settings = require('../handlers/readSettings').settings();

if (settings.pterodactyl) if (settings.pterodactyl.domain) {
    if (settings.pterodactyl.domain.slice(-1) == "/") settings.pterodactyl.domain = settings.pterodactyl.domain.slice(0, -1);
};

const fetch = require('node-fetch');
const fs = require("fs");
const indexjs = require("../index.js");
const arciotext = (require("./arcio.js")).text;
const adminjs = require("./admin.js");
const ejs = require("ejs");
const chalk = require('chalk');

module.exports.load = async function(app, ejs, db) {
    app.get("/setcoins", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);

        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
            method: "get",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);

        let failredirect = theme.settings.redirect.failedsetcoins || "/";

        let id = req.query.id;
        let coins = req.query.coins;

        if (!id) return res.redirect(failredirect + "?err=MISSINGID");
        if (!(await db.get("users-" + req.query.id))) return res.redirect(`${failredirect}?err=INVALIDID`);
        
        if (!coins) return res.redirect(failredirect + "?err=MISSINGCOINS");

        coins = parseFloat(coins);

        if (isNaN(coins)) return res.redirect(failredirect + "?err=INVALIDCOINNUMBER");

        if (coins < 0 || coins > 999999999999999) return res.redirect(`${failredirect}?err=COINSIZE`);

        if (coins == 0) {
            await db.delete("coins-" + id)
        } else {
            await db.set("coins-" + id, coins);
        }

        let successredirect = theme.settings.redirect.setcoins || "/";
        res.redirect(successredirect + "?err=none");

        let newsettings = require('../handlers/readSettings').settings();

        if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
            let username = cacheaccountinfo.attributes.username;
            let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`
            let params = JSON.stringify({
                embeds: [
                    {
                        title: "Coins Set",
                        description: `**__User:__** ${id} (<@${id}>)\n**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n\n**Coins:** ${coins}`,
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
    });

    app.get("/addcoins", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);

        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
            method: "get",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);

        let failredirect = theme.settings.redirect.failedsetcoins || "/";

        let id = req.query.id;
        let coins = req.query.coins;

        if (!id) return res.redirect(failredirect + "?err=MISSINGID");
        if (!(await db.get("users-" + req.query.id))) return res.redirect(`${failredirect}?err=INVALIDID`);
        
        if (!coins) return res.redirect(failredirect + "?err=MISSINGCOINS");

        let currentcoins = await db.get("coins-" + id) || 0;

        coins = currentcoins + parseFloat(coins);

        if (isNaN(coins)) return res.redirect(failredirect + "?err=INVALIDCOINNUMBER");

        if (coins < 0 || coins > 999999999999999) return res.redirect(`${failredirect}?err=COINSIZE`);

        if (coins == 0) {
            await db.delete("coins-" + id)
        } else {
            await db.set("coins-" + id, coins);
        }

        let successredirect = theme.settings.redirect.setcoins || "/";
        res.redirect(successredirect + "?err=none");

        let newsettings = require('../handlers/readSettings').settings();

        if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
            let username = cacheaccountinfo.attributes.username;
            let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`
            let params = JSON.stringify({
                embeds: [
                    {
                        title: "Coins Add",
                        description: `**__User:__** ${id} (<@${id}>)\n**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n\n**Coins:** ${currentcoins} (new: ${coins})`,
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
    });

    app.get("/setresources", async (req, res) => {
        let theme = indexjs.get(req);
    
        if (!req.session.pterodactyl) return four0four(req, res, theme);
        
        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
              method: "get",
              headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());
    
        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);
    
        let failredirect = theme.settings.redirect.failedsetresources || "/";
    
        if (!req.query.id) return res.redirect(`${failredirect}?err=MISSINGID`);
    
        if (!(await db.get("users-" + req.query.id))) return res.redirect(`${failredirect}?err=INVALIDID`);
    
        let successredirect = theme.settings.redirect.setresources || "/";
    
        if (req.query.ram || req.query.disk || req.query.cpu || req.query.servers) {
            let ramstring = req.query.ram;
            let diskstring = req.query.disk;
            let cpustring = req.query.cpu;
            let serversstring = req.query.servers;
            let id = req.query.id;

            let currentextra = await db.get("extra-" + req.query.id);
            let extra;

            if (typeof currentextra == "object") {
                extra = currentextra;
            } else {
                extra = {
                    ram: 0,
                    disk: 0,
                    cpu: 0,
                    servers: 0
                }
            }

            if (ramstring) {
                let ram = parseFloat(ramstring);
                if (ram < 0 || ram > 999999999999999) {
                    return res.redirect(`${failredirect}?err=RAMSIZE`);
                }
                extra.ram = ram;
            }
            
            if (diskstring) {
                let disk = parseFloat(diskstring);
                if (disk < 0 || disk > 999999999999999) {
                    return res.redirect(`${failredirect}?err=DISKSIZE`);
                }
                extra.disk = disk;
            }
            
            if (cpustring) {
                let cpu = parseFloat(cpustring);
                if (cpu < 0 || cpu > 999999999999999) {
                    return res.redirect(`${failredirect}?err=CPUSIZE`);
                }
                extra.cpu = cpu;
            }

            if (serversstring) {
                let servers = parseFloat(serversstring);
                if (servers < 0 || servers > 999999999999999) {
                    return res.redirect(`${failredirect}?err=SERVERSIZE`);
                }
                extra.servers = servers;
            }
            
            if (extra.ram == 0 && extra.disk == 0 && extra.cpu == 0 && extra.servers == 0) {
                await db.delete("extra-" + req.query.id);
            } else {
                await db.set("extra-" + req.query.id, extra);
            }

            adminjs.suspend(req.query.id);

            // Just copy this and put it in the other endpoints
            let username = cacheaccountinfo.attributes.username;
            let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`

            let newsettings = require('../handlers/readSettings').settings();

            if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
                let params = JSON.stringify({
                    embeds: [
                        {
                            title: "Resources Added",
                            description: `**__User:__** ${id} (<@${id}>)\n**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n\n**Quantity:**\n- ${ramstring}MB RAM\n- ${diskstring}MB Disk\n- ${serversstring} Servers\n- ${cpustring}% CPU`,
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
                }).catch(e => console.warn(chalk.red("[WEBHOOK] There was an error sending a message to the webhook:\n" + e)))
            }
            return res.redirect(successredirect + "?err=none");
        } else {
            res.redirect(`${failredirect}?err=MISSINGVARIABLES`);
        }
    });


    app.get("/setplan", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);
        
        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
            method: "get",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);

        let failredirect = theme.settings.redirect.failedsetplan || "/";

        if (!req.query.id) return res.redirect(`${failredirect}?err=MISSINGID`);

        if (!(await db.get("users-" + req.query.id))) return res.redirect(`${failredirect}?err=INVALIDID`);

        let successredirect = theme.settings.redirect.setplan || "/";

        if (!req.query.package) {
            await db.delete("package-" + req.query.id);
            adminjs.suspend(req.query.id);
            let newsettings = require('../handlers/readSettings').settings();

            if(newsettings.api.client.webhook.auditlogs.enabled === true && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
                let id = req.query.id;
                let username = cacheaccountinfo.attributes.username;
                let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`
                let params = JSON.stringify({
                    embeds: [
                        {
                            title: "Package Changed",
                            description: `**__User:__** ${id} (<@${id}>)\n**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n\n**Package:** ${req.query.package}`,
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
                }).catch(e => console.warn(chalk.red("[WEBHOOK] There was an error sending a message to the webhook:\n" + e)));
            }

            return res.redirect(successredirect + "?err=none");
        } else {
            let newsettings = require('../handlers/readSettings').settings();
            if (!newsettings.api.client.packages.list[req.query.package]) return res.redirect(`${failredirect}?err=INVALIDPACKAGE`);
            await db.set("package-" + req.query.id, req.query.package);
            adminjs.suspend(req.query.id);
            
            if(newsettings.api.client.webhook.auditlogs.enabled === true && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
                let id = req.query.id;
                let username = cacheaccountinfo.attributes.username;
                let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`
                let params = JSON.stringify({
                    embeds: [
                        {
                            title: "Package Changed",
                            description: `**__User:__** ${id} (<@${id}>)\n**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n\n**Package:** ${req.query.package}`,
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
                }).catch(e => console.warn(chalk.red("[WEBHOOK] There was an error sending a message to the webhook:\n" + e)));
            }
            return res.redirect(successredirect + "?err=none");
        }
    });

    app.get("/create_coupon", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);
        
        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
            method: "get",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);

        let code = req.query.code ? req.query.code.slice(0, 200) : Math.random().toString(36).substring(2, 15);

        if (!code.match(/^[a-z0-9]+$/i)) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONINVALIDCHARACTERS");

        let coins = req.query.coins || 0;
        let ram = req.query.ram || 0;
        let disk = req.query.disk || 0;
        let cpu = req.query.cpu || 0;
        let servers = req.query.servers || 0;

        coins = parseFloat(coins);
        ram = parseFloat(ram);
        disk = parseFloat(disk);
        cpu = parseFloat(cpu);
        servers = parseFloat(servers);

        if (coins < 0) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONLESSTHANONE");
        if (ram < 0) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONLESSTHANONE");
        if (disk < 0) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONLESSTHANONE");
        if (cpu < 0) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONLESSTHANONE");
        if (servers < 0) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONLESSTHANONE");

        if (!coins && !ram && !disk && !cpu && !servers) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONEMPTY");

        await db.set("coupon-" + code, {
            coins: coins,
            ram: ram,
            disk: disk,
            cpu: cpu,
            servers: servers
        });

        res.redirect(theme.settings.redirect.couponcreationsuccess + "?code=" + code)

        let newsettings = require('../handlers/readSettings').settings();

        if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
            let username = cacheaccountinfo.attributes.username;
            let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`
            let params = JSON.stringify({
                embeds: [
                    {
                        title: "Created Coupon",
                        description: `**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n__**Code:**__ ${code}\n\n**Coins:** ${coins} coin${coins == 1 ? "": "s"}\n**RAM:** ${ram}MB\n**Disk:** ${disk}MB\n**CPU:** ${cpu}%\n**Servers:** ${servers} server${servers == 1 ? "": "s"}`,
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
    });

    app.get("/revoke_coupon", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);
        
        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
            method: "get",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);

        let code = req.query.code;

        if (!code.match(/^[a-z0-9]+$/i)) return res.redirect(theme.settings.redirect.couponrevokefailed + "?err=REVOKECOUPONCANNOTFINDCODE");

        if (!(await db.get("coupon-" + code))) return res.redirect(theme.settings.redirect.couponrevokefailed + "?err=REVOKECOUPONCANNOTFINDCODE");

        await db.delete("coupon-" + code);

        res.redirect(theme.settings.redirect.couponrevokesuccess + "?revokedcode=true");
        
        let newsettings = require('../handlers/readSettings').settings();

        if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
            let username = cacheaccountinfo.attributes.username;
            let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`
            let params = JSON.stringify({
                embeds: [
                    {
                        title: "Revoked Coupon",
                        description: `**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n__**Code:**__ ${code}`,
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
    });

    app.get("/remove_account", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);
        
        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
                method: "get",
                headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);

        // This doesn't delete the account and doesn't touch the renewal system.

        if (!req.query.id) return res.redirect(theme.settings.redirect.removeaccountfailed + "?err=REMOVEACCOUNTMISSINGID");

        let discordid = req.query.id;
        let pteroid = await db.get("users-" + discordid);

        // Remove IP.

        let selected_ip = await db.get("ip-" + discordid);

        if (selected_ip) {
        let allips = await db.get("ips") || [];
        allips = allips.filter(ip => ip !== selected_ip);

        if (allips.length == 0) {
            await db.delete("ips");
        } else {
            await db.set("ips", allips);
        }

        await db.delete("ip-" + discordid);
        }

        // Remove user.

        let userids = await db.get("users") || [];
        userids = userids.filter(user => user !== pteroid);

        if (userids.length == 0) {
        await db.delete("users");
        } else {
        await db.set("users", userids);
        }

        await db.delete("users-" + discordid);

        // Remove coins/resources.

        await db.delete("coins-" + discordid);
        await db.delete("extra-" + discordid);
        await db.delete("package-" + discordid);

        res.redirect(theme.settings.redirect.removeaccountsuccess + "?success=REMOVEACCOUNT");

        let newsettings = require('../handlers/readSettings').settings();

        if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
            let username = cacheaccountinfo.attributes.username;
            let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`
            let params = JSON.stringify({
                embeds: [
                    {
                        title: "Removed Account",
                        description: `**__User__:** ${discordid} (<@${discordid}>)\n**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n\n**Pterodactyl Panel ID**: ${pteroid}`,
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
    });
    
    app.get("/getip", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);

        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
            method: "get",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);

        let failredirect = theme.settings.redirect.failedgetip || "/";
        let successredirect = theme.settings.redirect.getip || "/";
        if (!req.query.id) return res.redirect(`${failredirect}?err=MISSINGID`);

        if (!(await db.get("users-" + req.query.id))) return res.redirect(`${failredirect}?err=INVALIDID`);

        if (!(await db.get("ip-" + req.query.id))) return res.redirect(`${failredirect}?err=NOIP`);
        let ip = await db.get("ip-" + req.query.id);
        return res.redirect(successredirect + "?err=NONE&ip=" + ip)
    });

    app.get("/create_coupon", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);
        
        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
            method: "get",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);

        let code = req.query.code ? req.query.code.slice(0, 200) : Math.random().toString(36).substring(2, 15);

        if (!code.match(/^[a-z0-9]+$/i)) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONINVALIDCHARACTERS");

        let coins = req.query.coins || 0;
        let ram = req.query.ram || 0;
        let disk = req.query.disk || 0;
        let cpu = req.query.cpu || 0;
        let servers = req.query.servers || 0;

        coins = parseFloat(coins);
        ram = parseFloat(ram);
        disk = parseFloat(disk);
        cpu = parseFloat(cpu);
        servers = parseFloat(servers);

        if (coins < 0) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONLESSTHANONE");
        if (ram < 0) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONLESSTHANONE");
        if (disk < 0) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONLESSTHANONE");
        if (cpu < 0) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONLESSTHANONE");
        if (servers < 0) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONLESSTHANONE");

        if (!coins && !ram && !disk && !cpu && !servers) return res.redirect(theme.settings.redirect.couponcreationfailed + "?err=CREATECOUPONEMPTY");

        await db.set("coupon-" + code, {
            coins: coins,
            ram: ram,
            disk: disk,
            cpu: cpu,
            servers: servers
        });

        res.redirect(theme.settings.redirect.couponcreationsuccess + "?code=" + code)

        let newsettings = require('../handlers/readSettings').settings();

        if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
            let username = cacheaccountinfo.attributes.username;
            let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`
            let params = JSON.stringify({
                embeds: [
                    {
                        title: "Created Coupon",
                        description: `**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n__**Code:**__ ${code}\n\n**Coins:** ${coins} coin${coins == 1 ? "": "s"}\n**RAM:** ${ram}MB\n**Disk:** ${disk}MB\n**CPU:** ${cpu}%\n**Servers:** ${servers} server${servers == 1 ? "": "s"}`,
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
    });

    app.get("/revoke_coupon", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);
        
        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
            method: "get",
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);

        let code = req.query.code;

        if (!code.match(/^[a-z0-9]+$/i)) return res.redirect(theme.settings.redirect.couponrevokefailed + "?err=REVOKECOUPONCANNOTFINDCODE");

        if (!(await db.get("coupon-" + code))) return res.redirect(theme.settings.redirect.couponrevokefailed + "?err=REVOKECOUPONCANNOTFINDCODE");

        await db.delete("coupon-" + code);

        res.redirect(theme.settings.redirect.couponrevokesuccess + "?revokedcode=true");
        
        let newsettings = require('../handlers/readSettings').settings();

        if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
            let username = cacheaccountinfo.attributes.username;
            let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`
            let params = JSON.stringify({
                embeds: [
                    {
                        title: "Revoked Coupon",
                        description: `**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n__**Code:**__ ${code}`,
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
    });

    app.get("/remove_account", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);
        
        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
                method: "get",
                headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);

        // This doesn't delete the account and doesn't touch the renewal system.

        if (!req.query.id) return res.redirect(theme.settings.redirect.removeaccountfailed + "?err=REMOVEACCOUNTMISSINGID");

        let discordid = req.query.id;
        let pteroid = await db.get("users-" + discordid);

        // Remove IP.

        let selected_ip = await db.get("ip-" + discordid);

        if (selected_ip) {
        let allips = await db.get("ips") || [];
        allips = allips.filter(ip => ip !== selected_ip);

        if (allips.length == 0) {
            await db.delete("ips");
        } else {
            await db.set("ips", allips);
        }

        await db.delete("ip-" + discordid);
        }

        // Remove user.

        let userids = await db.get("users") || [];
        userids = userids.filter(user => user !== pteroid);

        if (userids.length == 0) {
        await db.delete("users");
        } else {
        await db.set("users", userids);
        }

        await db.delete("users-" + discordid);

        // Remove coins/resources.

        await db.delete("coins-" + discordid);
        await db.delete("extra-" + discordid);
        await db.delete("package-" + discordid);

        res.redirect(theme.settings.redirect.removeaccountsuccess + "?success=REMOVEACCOUNT");

        let newsettings = require('../handlers/readSettings').settings();

        if(newsettings.api.client.webhook.auditlogs.enabled && !newsettings.api.client.webhook.auditlogs.disabled.includes("ADMIN")) {
            let username = cacheaccountinfo.attributes.username;
            let tag = `${cacheaccountinfo.attributes.first_name}${cacheaccountinfo.attributes.last_name}`
            let params = JSON.stringify({
                embeds: [
                    {
                        title: "Removed Account",
                        description: `**__User__:** ${discordid} (<@${discordid}>)\n**__Admin:__** ${tag} (<@${req.session.userinfo.id}>)\n\n**Pterodactyl Panel ID**: ${pteroid}`,
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
    });

    app.get("/userinfo", async (req, res) => {
        let theme = indexjs.get(req);

        if (!req.session.pterodactyl) return four0four(req, res, theme);
        
        let cacheaccount = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + (await db.get("users-" + req.session.userinfo.id)) + "?include=servers",
            {
                method: "get",
                headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
        );
        if (await cacheaccount.statusText == "Not Found") return four0four(req, res, theme);
        let cacheaccountinfo = JSON.parse(await cacheaccount.text());

        req.session.pterodactyl = cacheaccountinfo.attributes;
        if (cacheaccountinfo.attributes.root_admin !== true) return four0four(req, res, theme);
        
        if (!req.query.id) return res.send({status: "missing id"});

        if (!(await db.get("users-" + req.query.id))) return res.send({status: "invalid id"});
    
        let newsettings = require('../handlers/readSettings').settings();
    
        if (newsettings.api.client.oauth2.link.slice(-1) == "/")
          newsettings.api.client.oauth2.link = newsettings.api.client.oauth2.link.slice(0, -1);
      
        if (newsettings.api.client.oauth2.callbackpath.slice(0, 1) !== "/")
          newsettings.api.client.oauth2.callbackpath = "/" + newsettings.api.client.oauth2.callbackpath;
        
        if (newsettings.pterodactyl.domain.slice(-1) == "/")
          newsettings.pterodactyl.domain = newsettings.pterodactyl.domain.slice(0, -1);
        
        let packagename = await db.get("package-" + req.query.id);
        let package = newsettings.api.client.packages.list[packagename ? packagename : newsettings.api.client.packages.default];
        if (!package) package = {
          ram: 0,
          disk: 0,
          cpu: 0,
          servers: 0
        };
    
        package["name"] = packagename;
    
        let pterodactylid = await db.get("users-" + req.query.id);
        let userinforeq = await fetch(
          newsettings.pterodactyl.domain + "/api/application/users/" + pterodactylid + "?include=servers",
            {
              method: "get",
              headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${newsettings.pterodactyl.key}` }
            }
          );
        if (await userinforeq.statusText == "Not Found") {
            console.log("[WEBSITE] An error has occured while attempting to get a user's information");
            console.log("- Discord ID: " + req.query.id);
            console.log("- Pterodactyl Panel ID: " + pterodactylid);
            return res.send({ status: "could not find user on panel" });
        }
        let userinfo = await userinforeq.json();
    
        res.send({
          status: "success",
          package: package,
          extra: await db.get("extra-" + req.query.id) ? await db.get("extra-" + req.query.id) : {
            ram: 0,
            disk: 0,
            cpu: 0,
            servers: 0
          },
          userinfo: userinfo,
          coins: newsettings.api.client.coins.enabled == true ? (await db.get("coins-" + req.query.id) ? await db.get("coins-" + req.query.id) : 0) : null
        });
    });

    async function four0four(req, res, theme) {
        ejs.renderFile(
            `./themes/${theme.name}/${theme.settings.notfound}`, 
            await eval(indexjs.renderdataeval),
            null,
        function (err, str) {
            delete req.session.newaccount;
            if (err) {
                console.log(`[WEBSITE] An error has occured on path ${req._parsedUrl.pathname}:`);
                console.log(err);
                return res.send("An error has occured while attempting to load this page. Please contact an administrator to fix this.");
            };
            res.status(404);
            res.send(str);
        });
    }

    module.exports.suspend = async function(discordid) {
        let newsettings = require('../handlers/readSettings').settings();
        if (newsettings.api.client.allow.overresourcessuspend !== true) return;

        let canpass = await indexjs.islimited();
        if (canpass == false) {
            setTimeout(
                async function() {
                    adminjs.suspend(discordid);
                }, 1
            )
            return;
        };

        indexjs.ratelimits(1);
        let pterodactylid = await db.get("users-" + discordid);
        let userinforeq = await fetch(
            settings.pterodactyl.domain + "/api/application/users/" + pterodactylid + "?include=servers",
            {
              method: "get",
              headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
          );
        if (await userinforeq.statusText == "Not Found") {
            console.log("[WEBSITE] An error has occured while attempting to check if a user's server should be suspended.");
            console.log("- Discord ID: " + discordid);
            console.log("- Pterodactyl Panel ID: " + pterodactylid);
            return;
        }
        let userinfo = JSON.parse(await userinforeq.text());

        let packagename = await db.get("package-" + discordid);
        let package = newsettings.api.client.packages.list[packagename || newsettings.api.client.packages.default];

        let extra = 
            await db.get("extra-" + discordid) ||
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
            servers: userinfo.attributes.relationships.servers.data.length
        }
        for (let i = 0, len = userinfo.attributes.relationships.servers.data.length; i < len; i++) {
            current.ram = current.ram + userinfo.attributes.relationships.servers.data[i].attributes.limits.memory;
            current.disk = current.disk + userinfo.attributes.relationships.servers.data[i].attributes.limits.disk;
            current.cpu = current.cpu + userinfo.attributes.relationships.servers.data[i].attributes.limits.cpu;
        };

        indexjs.ratelimits(userinfo.attributes.relationships.servers.data.length);
        if (current.ram > plan.ram || current.disk > plan.disk || current.cpu > plan.cpu || current.servers > plan.servers) {
            for (let i = 0, len = userinfo.attributes.relationships.servers.data.length; i < len; i++) {
                let suspendid = userinfo.attributes.relationships.servers.data[i].attributes.id;
                await fetch(
                    settings.pterodactyl.domain + "/api/application/servers/" + suspendid + "/suspend",
                    {
                      method: "post",
                      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
                    }
                  );
            }
        } else {
            if (settings.api.client.allow.renewsuspendsystem.enabled == true) return;
            for (let i = 0, len = userinfo.attributes.relationships.servers.data.length; i < len; i++) {
                let suspendid = userinfo.attributes.relationships.servers.data[i].attributes.id;
                await fetch(
                    settings.pterodactyl.domain + "/api/application/servers/" + suspendid + "/unsuspend",
                    {
                      method: "post",
                      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
                    }
                  );
            }
        };
    }
};

function hexToDecimal(hex) {
    return parseInt(hex.replace("#",""), 16)
  }
