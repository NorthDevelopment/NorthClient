const settings = require('../../handlers/readSettings').settings();

if (settings.api.server.enabled == true) {
module.exports.load = async function(app, ejs, db) {
    app.post("/api/setpackage", async (req, res) => {
        if (!req.headers.Authorization || req.headers.Authorization !== `Bearer ${settings.api.server.key}`) return res.send({status: "unauthorized"})

        if (!(await db.get(`user-${req.body.id}`))) return res.send({status: "invalid id"})

        if (!settings.api.client.packages.list[req.body.package]) return res.send({status: "invalid package"})
        
        await db.set(`package-${req.body.id}`, settings.api.client.packages.list[req.body.package]);
        
		return res.send({status: "sucess"})
    })
}}