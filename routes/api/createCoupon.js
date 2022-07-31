const settings = require('../../handlers/readSettings').settings();

if (settings.api.server.enabled == true) {
module.exports.load = async function(app, ejs, db) {
    app.post("/api/createcoupon", async (req, res) => {
		if (!req.headers.Authorization || req.headers.Authorization !== `Bearer ${settings.api.server.key}`) return res.send({status: "unauthorized"})

        await db.set(`coupon-${req.body.name}}`, {
		    coins: req.body.coins,
			ram: req.body.ram,
			disk: req.body.disk,
			cpu: req.body.cpu,
			servers: req.body.servers,
			databases: req.body.databases,
			ports: req.body.ports,
			backups: req.body.backups
		});
		return res.send({status: "sucess"})
    })
}}