const fetch = require("node-fetch");
const settings = require('../../handlers/readSettings').settings();

module.exports.load = async function(app, ejs, db) {
    app.get("/accounts/update", async (req, res) => {
        if (!req.session.pterodactyl) return res.redirect("/");
        if (!req.query.username || !req.query.password) return res.send("<br>Missing information</br>");
        let user = await db.get(`user-${req.session.userinfo.id}`);
        await fetch(
            `${settings.pterodactyl.domain}/api/application/users/${req.session.pterodactyl.id}`,
            {
              method: "patch",
              headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${settings.pterodactyl.key}`
              },
              body: JSON.stringify({
                username: req.query.username,
                email: req.session.userinfo.id,
                first_name: req.session.pterodactyl.first_name,
                last_name: req.session.pterodactyl.last_name,
                password: req.query.password
              })
            }
        );
        let cacheaccount = await fetch(
            `${settings.pterodactyl.domain}/api/application/users/${req.session.pterodactyl.id}?include=servers`,
            {
              method: "get",
              headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${settings.pterodactyl.key}` }
            }
          );
        if (await cacheaccount.statusText == "Not Found") return res.send("An error has occured while attempting to get your user information.");
        cacheaccount = JSON.parse(await cacheaccount.text());

        user.username = req.query.username;
        user.password = req.query.password;
        await db.set(`user-${req.session.userinfo.id}`, user);
        await db.set(`username-${req.session.userinfo.id}`, req.query.username);

        req.session.pterodactyl = cacheaccount.attributes;
        req.session.userinfo = user;
        return res.redirect("/accounts?sucess=true");
    })
}
