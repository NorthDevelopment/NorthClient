"use strict";

const db = require('better-sqlite3')('./db.sqlite');

db.prepare(`CREATE TABLE IF NOT EXISTS "keyv" ("key" VARCHAR(255) PRIMARY KEY, "value" TEXT)`).run();

module.exports = {
    async get(key) {
      let row = await db.prepare('SELECT * FROM keyv WHERE key = ?').get(`keyv:${key}`);

      return row ? JSON.parse(row.value).value : undefined;
    },

    async set(key, value) {
      await this.delete(key);

      await db.prepare('INSERT INTO keyv (key, value) VALUES (?, ?)').run(`keyv:${key}`, JSON.stringify({
        value: value,
        expires: null
      }));

      return true;
    },

    async delete(key) {
      db.prepare('DELETE FROM keyv WHERE key=?').run(`keyv:${key}`);

      return true;
    },

    async getCoinLeaderboard(limit) {
      let leaderboard = db.prepare(`SELECT * FROM keyv where Name like '%coins' LIMIT ${limit};`);

      leaderboard = leaderboard.map(r => JSON.parse(JSON.stringify(r)))

      return leaderboard;
    }
};