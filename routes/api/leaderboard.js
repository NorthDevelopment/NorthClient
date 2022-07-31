module.exports.load = async function(app, ejs, db) {
    app.get("/api/leaderboard", async (req, res) => {
        const users = await db.get("userlist");
        let leaders = [];
        for (var i = 0; i < users.length; i++) {
          let userid = users[i];
          let usercoins = await db.get(`coins-${userid}`);
          let username = await db.get(`username-${userid}`);
          username = username ? username : "Unknown User";
          usercoins = usercoins ? usercoins : 0;
          await leaders.push({
            coins: usercoins, 
            username: username
          });
        };
        const sorted = leaders.sort((a, b) => (b.coins > a.coins) ? 1 : -1)
        res.send(sorted.slice(0, 10));
    })
} 
