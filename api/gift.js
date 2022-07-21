const settings = require('../handlers/readSettings').settings();

if (settings.gift.enabled == true) {
module.exports.load = async function(app, ejs, db) {
    app.get("/gift/coins", async (req, res) => {
        if (!req.session.pterodactyl) return res.redirect("/login");

        const id = req.query.id;
        const coins = req.query.coins;

        if (!id || !coins) return res.redirect("/gift?error=MISSING_INFO");

        let usercoins = await db.get(`coins-${req.session.userinfo.id}`);
        let usercoins2 = await db.get(`coins-${id}`)

        if (!usercoins2) return res.redirect("/gift?error=INVALID_USER");
        if (usercoins < coins) return res.redirect("/gift?error=NOT_ENOUGH_COINS");

        usercoins = usercoins - coins;
        usercoins2 = usercoins2 + coins;
            
        await db.set(`coins-${id}`, usercoins2)
        await db.set(`coins-${req.session.userinfo.id}`, usercoins);

        return res.redirect("/gift?success=true")
    })
}}