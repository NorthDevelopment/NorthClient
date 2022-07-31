const settings = require('../handlers/readSettings').settings();

if (settings.api.client.allow.gift == true) {
module.exports.load = async function(app, ejs, db) {
    app.get("/gift/coins", async (req, res) => {
        if (!req.session.pterodactyl) return res.redirect("/login?redirect=gift");
        if (!req.query.id || !req.query.coins) return res.redirect("/gift?error=MISSING_INFO");

        let usercoins = await db.get(`coins-${req.session.userinfo.id}`);
        let usercoins2 = await db.get(`coins-${req.query.id}`)
        if (!usercoins2) return res.redirect("/gift?error=INVALID_USER");
        if (usercoins < coins) return res.redirect("/gift?error=NOT_ENOUGH_COINS");
        usercoins -= coins;
        usercoins2 += coins;
        await db.set(`coins-${req.query.id}`, usercoins2)
        await db.set(`coins-${req.session.userinfo.id}`, usercoins);

        return res.redirect("/gift?success=true")
    })
    app.get("/gift/resources", async (req, res) => {
        if (!req.session.pterodactyl) return res.redirect("/login?redirect=gift");
        if (!req.query.id || !req.query.ram || !req.query.disk || !req.query.cpu || !req.query.databases || !req.query.allocations || !req.query.backups) return res.redirect("/gift?error=INVALID_INFO");

        let userresources = await db.get(`extra-${req.session.userinfo.id}`);
        let userresources2 = await db.get(`extra-${req.query.id}`);
        if (!userresources2) return res.redirect("/gift?error=INVALID_USER");
        if (userresources.ram < req.query.ram) return res.redirect("/gift?error=NOT_ENOUGH_RAM");
        if (userresources.disk < req.query.disk) return res.redirect("/gift?error=NOT_ENOUGH_DISK");
        if (userresources.cpu < req.query.cpu) return res.redirect("/gift?error=NOT_ENOUGH_CPU");
        if (userresources.databases < req.query.databases) return res.redirect("/gift?error=NOT_ENOUGH_DATABASES");
        if (userresources.allocations < req.query.allocations) return res.redirect("/gift?error=NOT_ENOUGH_ALLOCATIONS");
        if (userresources.backups < req.query.backups) return res.redirect("/gift?error=NOT_ENOUGH_BACKUPS");

        userresources.ram -= req.query.ram
        userresources.disk -= req.query.disk
        userresources.cpu -= req.query.cpu
        userresources.databases -= req.query.databases
        userresources.allocations -= req.query.allocations
        userresources.backups -= req.query.backups
        await db.set(`extra-${req.session.userinfo.id}`, userresources)

        userresources2.ram += req.query.ram
        userresources2.disk += req.query.disk
        userresources2.cpu += req.query.cpu
        userresources2.databases += req.query.databases
        userresources2.allocations += req.query.allocations
        userresources2.backups += req.query.backups
        await db.set(`extra-${req.query.id}`, userresources2)
        return res.redirect("/gift?sucess=true");
    })
}}