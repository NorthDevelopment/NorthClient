const settings = require('../../handlers/readSettings').settings();

if (settings.api.server.enabled == true) {
module.exports.load = async function(app, ejs, db) {
    app.post("/api/setresources", async (req, res) => {
        if (!req.headers.Authorization || req.headers.Authorization !== `Bearer ${settings.api.server.key}`) return res.send({status: "unauthorized"})

        if (!(await db.get(`user-${req.body.id}`))) return res.send({status: "invalid id"});

        await db.set(`extra-${req.body.id}`, {
            ram: req.body.ram,
            disk: req.body.disk,
            cpu: req.body.cpu,
            databases: req.body.databases,
            ports: req.body.ports,
            backups: req.body.backups
        });
		return res.send({status: "sucess"});
    });
}};