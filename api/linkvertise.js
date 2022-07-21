const settings = require('../handlers/readSettings').settings();
const makeid = require('../handlers/makeid');
const btoa = require('../handlers/btoa')

if (settings.linkvertise.enabled == true) {
 
    module.exports.load = async function(app, ejs, db) {

    app.get("/lv/gen", async (req, res) => {

        if (!req.session.pterodactyl) return res.redirect("/login");

        let referer = req.headers.referer;

        if (!referer) return res.redirect('/lv');
        if (referer.includes('?sucess=true')) referer = referer.split('?sucess=true')[0]

        const code = makeid(8);
        const link = `https://link-to.net/${settings.linkvertise.userid}/${Math.random() * 1000}/dynamic?r=${btoa(encodeURI(`${referer}/redeem?code=${code}`))}`;

        req.session.code = code

        return res.redirect(link);
    })
 
    app.get("/lv/redeem", async (req, res) => {

        if (!req.session.pterodactyl) return res.redirect("/login");

        const referer = req.headers.referer;

        if (!referer) return res.redirect('/lv')

        const code = req.query.code

        if (!code) return res.redirect('/lv')

        if (!req.query.code) return res.redirect('/lv');

        if (code !== req.session.code) return res.redirect('/lv')

        if (!referer.includes('linkvertise.com')) return res.send('<br> Our systems have detected that you are using a Linkvertise bypasser </br>')

        let coins = await db.get(`coins-${req.session.userinfo.id}`);
        coins = coins + settings.linkvertise.coins;

        await db.set(`coins-${req.session.userinfo.id}`, coins);

        req.session.code = null

        return res.redirect('/lv?sucess=true')
    })
}}


