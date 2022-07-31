const settings = require('../../handlers/readSettings').settings();

if (settings.api.server.enabled == true) {
module.exports.load = async function(app, ejs, db) {
    app.post("/api/deletecoupon", async (req, res) => {
        if (!req.headers.Authorization || req.headers.Authorization !== `Bearer ${settings.api.server.key}`) return res.send({status: "unauthorized"})

        await db.delete(`coupon-${req.body.name}`)
		return res.send({status: "sucess"})
    })
}}