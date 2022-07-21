"use strict";

// Load packages.
const nodemailer = require("nodemailer");

// Load Settings
const settings = require('../handlers/readSettings').settings();

module.exports = {
  mailer: () => {
    return mailer
  }
}

const mailer = nodemailer.createTransport({
  host: settings.smtp.host,
  port: settings.smtp.port,
  secure: true,
  auth: {
    user: settings.smtp.username,
    pass: settings.smtp.password
  },
});
