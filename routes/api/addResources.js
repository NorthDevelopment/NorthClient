const settings = require('../../handlers/readSettings').settings();

if (settings.api.server.enabled == true) {
module.exports.load = async function(app, ejs, db) {
    app.post("/api/addresources", async (req, res) => {
        if (!req.headers.Authorization || req.headers.Authorization !== `Bearer ${settings.api.server.key}`) return res.send({status: "unauthorized"})

        if (!(await db.get(`user-${req.body.id}`))) return res.send({status: "invalid id"});

        let extra = await db.get(`extra-${req.body.id}`);
        extra.ram += req.body.ram
        extra.disk += req.body.disk
        extra.cpu += req.body.cpu
        extra.databases += req.body.databases
        extra.allocations += req.body.ports
        extra.backups += req.body.backups
        await db.set(`extra-${req.body.id}`, extra);
        
		return res.send({status: "sucess"});
    });
}};