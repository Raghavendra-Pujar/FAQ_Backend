const express = require('express');
const router = express.Router();
const appConfig = require('../config/appConfig');
const faqController = require('../controllers/faqController');
const loginController = require('../controllers/loginController')

module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;

    app.post(`${baseUrl}/users/login`,loginController.login);
}