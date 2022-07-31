const settings = require('../../handlers/readSettings').settings();

if (settings.api.server.enabled == true) {
module.exports.load = async function(app, ejs, db) {
    app.post("/api/setcoins", async (req, res) => {
        if (!req.headers.Authorization || req.headers.Authorization !== `Bearer ${settings.api.server.key}`) return res.send({status: "unauthorized"})

        if (!(await db.get(`user-${req.body.id}`))) return res.send({status: "invalid id"})

        await db.set(`coins-${req.body.id}`, req.body.coins)
		return res.send({status: "sucess"})
    })
}}