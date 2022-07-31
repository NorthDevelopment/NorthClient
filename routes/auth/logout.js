const indexjs = require("../../index.js");

module.exports.load = async function(app, ejs, db) {
    app.get("/logout", async (req, res) => {
        let theme = indexjs.get(req);
        if (!req.session.userinfo) return res.send("<br>You are not logged in.</br>");
        req.session.destroy(() => {
            return res.redirect(theme.settings.redirect.logout ? theme.settings.redirect.logout : "/")
        });
    })
}